import nodemailer from 'nodemailer';
import type { QuoteRequestItem } from '../types';
import { extractAttachmentLinks, type AttachmentLink } from '../quote-attachments';

export type EmailDeliveryResult =
  | { ok: true; messageId?: string; attempts: number }
  | { ok: false; error: string; attempts: number; skipped?: boolean };

export { extractAttachmentLinks };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function quoteInbox(): string {
  return (process.env.QUOTE_NOTIFICATION_TO || 'save@desisigns.com').trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function siteBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function absoluteFileUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const base = siteBaseUrl();
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

function buildTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.SMTP_FROM?.trim(),
  );
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #EEF0F3;color:#596579;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #EEF0F3;color:#111111;font-size:13px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>
  `;
}

function buildHtml(quote: QuoteRequestItem, attachments: AttachmentLink[]): string {
  const submitted = new Date(quote.createdAt).toLocaleString('en-CA', {
    timeZone: 'America/Edmonton',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const attachmentHtml =
    attachments.length === 0
      ? '<p style="margin:0;color:#596579;font-size:13px;">No files attached.</p>'
      : `<ul style="margin:0;padding-left:18px;">${attachments
          .map(
            (a) =>
              `<li style="margin:4px 0;"><a href="${escapeHtml(absoluteFileUrl(a.url))}" style="color:#D71920;font-weight:600;">${escapeHtml(a.name)}</a></li>`,
          )
          .join('')}</ul>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>New Quote Request</title></head>
<body style="margin:0;padding:0;background:#F5F6F8;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:640px;margin:24px auto;background:#ffffff;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
    <div style="background:#D71920;padding:20px 24px;">
      <p style="margin:0;color:rgba(255,255,255,0.85);font-size:11px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;">Desi Signs</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;">New Quote Request</h1>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 16px;color:#596579;font-size:14px;line-height:1.5;">
        A customer submitted a quote request. Reply directly to this email to contact them.
      </p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #EEF0F3;border-radius:8px;">
        ${row('Customer name', escapeHtml(quote.fullName))}
        ${row('Business name', escapeHtml(quote.businessName))}
        ${row('Email', `<a href="mailto:${escapeHtml(quote.email)}" style="color:#D71920;">${escapeHtml(quote.email)}</a>`)}
        ${row('Phone', `<a href="tel:${escapeHtml(quote.phone)}" style="color:#111111;">${escapeHtml(quote.phone)}</a>`)}
        ${row('Installation location', escapeHtml(quote.location))}
        ${row('Sign type', escapeHtml(quote.signType))}
        ${row('Dimensions', escapeHtml(quote.estimatedDimensions || 'Not specified'))}
        ${row('Lighting preference', escapeHtml(quote.illuminationType || 'Not specified'))}
        ${row('Installation', escapeHtml(quote.installationRequired ? 'Requested' : 'Not requested'))}
        ${row('Permit assistance', escapeHtml(quote.permitAssistanceRequired ? 'Requested' : 'Not requested'))}
        ${row('Preferred timeline', escapeHtml(quote.targetTimeline || 'Not specified'))}
        ${row('Estimated price', escapeHtml(quote.budgetRange || 'Not provided'))}
        ${row('Source', escapeHtml(quote.source || 'website'))}
        ${row('Submission date', escapeHtml(submitted))}
        ${row('Reference ID', escapeHtml(quote.id))}
      </table>
      <h2 style="margin:22px 0 8px;font-size:15px;color:#111111;">Project description</h2>
      <div style="padding:14px 16px;background:#F8F9FA;border:1px solid #EEF0F3;border-radius:8px;color:#111111;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(quote.projectDetails)}</div>
      <h2 style="margin:22px 0 8px;font-size:15px;color:#111111;">Uploaded artwork / drawings</h2>
      ${attachmentHtml}
    </div>
    <div style="padding:14px 24px;background:#FAFBFC;border-top:1px solid #EEF0F3;color:#98A2B3;font-size:11px;">
      Automated notification from the Desi Signs website. Contact the customer directly by email or phone.
    </div>
  </div>
</body>
</html>`;
}

function buildText(quote: QuoteRequestItem, attachments: AttachmentLink[]): string {
  const submitted = new Date(quote.createdAt).toLocaleString('en-CA', {
    timeZone: 'America/Edmonton',
  });
  return [
    'NEW DESI SIGNS QUOTE REQUEST',
    '',
    `Customer name: ${quote.fullName}`,
    `Business name: ${quote.businessName}`,
    `Email: ${quote.email}`,
    `Phone: ${quote.phone}`,
    `Installation location: ${quote.location}`,
    `Sign type: ${quote.signType}`,
    `Dimensions: ${quote.estimatedDimensions || 'Not specified'}`,
    `Lighting preference: ${quote.illuminationType || 'Not specified'}`,
    `Installation: ${quote.installationRequired ? 'Requested' : 'Not requested'}`,
    `Permit assistance: ${quote.permitAssistanceRequired ? 'Requested' : 'Not requested'}`,
    `Preferred timeline: ${quote.targetTimeline || 'Not specified'}`,
    `Estimated price: ${quote.budgetRange || 'Not provided'}`,
    `Source: ${quote.source || 'website'}`,
    `Submission date: ${submitted}`,
    `Reference ID: ${quote.id}`,
    '',
    'Project description:',
    quote.projectDetails,
    '',
    'Uploaded files:',
    attachments.length === 0
      ? '- None'
      : attachments.map((a) => `- ${a.name}: ${absoluteFileUrl(a.url)}`).join('\n'),
  ].join('\n');
}

async function sendOnce(quote: QuoteRequestItem): Promise<EmailDeliveryResult> {
  if (!isEmailConfigured()) {
    return {
      ok: false,
      skipped: true,
      attempts: 0,
      error:
        'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.',
    };
  }

  const from = process.env.SMTP_FROM!.trim();
  const to = quoteInbox();
  const replyTo = isValidEmail(quote.email) ? quote.email : undefined;
  const transporter = buildTransporter();
  if (!transporter) {
    return {
      ok: false,
      skipped: true,
      attempts: 0,
      error: 'SMTP transporter could not be created.',
    };
  }

  const attachments = extractAttachmentLinks(quote.projectDetails);
  const subject = `New DESI SIGNS Quote Request — ${quote.fullName}`;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      text: buildText(quote, attachments),
      html: buildHtml(quote, attachments),
    });
    return { ok: true, messageId: info.messageId, attempts: 1 };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email delivery error';
    return { ok: false, error: message, attempts: 1 };
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends the business email notification with one automatic retry on transient failure.
 */
export async function sendQuoteNotificationEmail(
  quote: QuoteRequestItem,
): Promise<EmailDeliveryResult> {
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
