import type { QuoteRequestItem } from '../types';
import { extractAttachmentLinks } from '../quote-attachments';

export type WhatsAppDeliveryResult =
  | { ok: true; messageId?: string; attempts: number }
  | { ok: false; error: string; attempts: number; skipped?: boolean };

function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function absoluteFileUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const base = siteBaseUrl();
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_TOKEN?.trim() &&
      process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() &&
      process.env.WHATSAPP_TO?.trim(),
  );
}

function buildTextBody(quote: QuoteRequestItem): string {
  const attachments = extractAttachmentLinks(quote.projectDetails);
  const submitted = new Date(quote.createdAt).toLocaleString('en-CA', {
    timeZone: 'America/Edmonton',
  });
  const lines = [
    'NEW DESI SIGNS QUOTE REQUEST',
    '',
    `Customer: ${quote.fullName}`,
    `Business: ${quote.businessName}`,
    `Phone: ${quote.phone}`,
    `Email: ${quote.email}`,
    `Sign Type: ${quote.signType}`,
    `Location: ${quote.location}`,
    `Dimensions: ${quote.estimatedDimensions || 'Not specified'}`,
    `Lighting: ${quote.illuminationType || 'Not specified'}`,
    `Installation: ${quote.installationRequired ? 'Requested' : 'Not requested'}`,
    `Permit assistance: ${quote.permitAssistanceRequired ? 'Requested' : 'Not requested'}`,
    `Estimated Price: ${quote.budgetRange || 'Not provided'}`,
    `Timeline: ${quote.targetTimeline || 'Not specified'}`,
    `Source: ${quote.source || 'website'}`,
    `Submitted: ${submitted}`,
    `Reference: ${quote.id}`,
    '',
    'Project Details:',
    quote.projectDetails,
  ];

  if (attachments.length > 0) {
    lines.push('', 'Attachments:');
    for (const file of attachments) {
      lines.push(`- ${file.name}: ${absoluteFileUrl(file.url)}`);
    }
  }

  return lines.join('\n').slice(0, 4000);
}

async function sendOnce(quote: QuoteRequestItem): Promise<WhatsAppDeliveryResult> {
  const token = process.env.WHATSAPP_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const toRaw = process.env.WHATSAPP_TO?.trim();
  const apiVersion = (process.env.WHATSAPP_API_VERSION || 'v21.0').trim();

  if (!token || !phoneNumberId || !toRaw) {
    return {
      ok: false,
      skipped: true,
      attempts: 0,
      error:
        'WhatsApp is not configured. Set WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_TO.',
    };
  }

  const to = digitsOnly(toRaw);
  if (to.length < 10) {
    return {
      ok: false,
      skipped: true,
      attempts: 0,
      error: 'WHATSAPP_TO must be a valid E.164 phone number (digits only or +countrycode).',
    };
  }

  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();
  const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || 'en_US';
  const bodyText = buildTextBody(quote);

  const payload = templateName
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: quote.fullName.slice(0, 60) },
                { type: 'text', text: quote.businessName.slice(0, 60) },
                { type: 'text', text: quote.phone.slice(0, 40) },
                { type: 'text', text: quote.signType.slice(0, 60) },
                { type: 'text', text: (quote.location || '').slice(0, 60) },
                { type: 'text', text: (quote.budgetRange || 'N/A').slice(0, 40) },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          preview_url: true,
          body: bodyText,
        },
      };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as {
      messages?: { id?: string }[];
      error?: { message?: string; error_user_msg?: string };
    };

    if (!res.ok) {
      return {
        ok: false,
        attempts: 1,
        error:
          data.error?.error_user_msg ||
          data.error?.message ||
          `WhatsApp API returned HTTP ${res.status}`,
      };
    }

    return {
      ok: true,
      attempts: 1,
      messageId: data.messages?.[0]?.id,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      attempts: 1,
      error: err instanceof Error ? err.message : 'Unknown WhatsApp delivery error',
    };
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends a WhatsApp Cloud API notification with one retry.
 * Never invents a destination number — WHATSAPP_TO must be set.
 */
export async function sendQuoteNotificationWhatsApp(
  quote: QuoteRequestItem,
): Promise<WhatsAppDeliveryResult> {
  const first = await sendOnce(quote);
  if (first.ok || first.skipped) return first;

  await delay(1200);
  const second = await sendOnce(quote);
  if (second.ok) {
    return { ok: true, messageId: second.messageId, attempts: 2 };
  }

  return {
    ok: false,
    attempts: 2,
    error: `Initial: ${first.error}; Retry: ${second.error}`,
  };
}
