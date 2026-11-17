import nodemailer from 'nodemailer';
import type { CustomerQuotationItem, QuoteRequestItem, WebsiteSettings } from '../types';
import { isEmailConfigured } from './quote-notification';
import { moneyCad } from '../quote-management-types';

export type QuotationEmailResult =
  | { ok: true; messageId?: string }
  | { ok: false; error: string; skipped?: boolean };

function buildTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass },
  });
}

export async function sendQuotationEmail(opts: {
  to: string;
  subject: string;
  messageBody: string;
  quotation: CustomerQuotationItem;
  request: QuoteRequestItem;
  settings: WebsiteSettings;
  pdfBuffer: Buffer;
}): Promise<QuotationEmailResult> {
  if (!isEmailConfigured()) {
    return {
      ok: false,
      skipped: true,
      error:
        'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in .env.local.',
    };
  }

  const transporter = buildTransporter();
  const from = process.env.SMTP_FROM?.trim();
  if (!transporter || !from) {
    return { ok: false, skipped: true, error: 'SMTP transporter could not be created.' };
  }

  const company = opts.settings.companyName || 'Desi Signs';
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111111;line-height:1.5;">
      <p>${opts.messageBody.replace(/\n/g, '<br/>')}</p>
      <hr style="border:none;border-top:1px solid #E5E7EB;margin:20px 0;" />
      <p style="font-size:13px;color:#596579;">
        Quotation <strong>${opts.quotation.quotationNumber}</strong><br/>
        Total: <strong style="color:#D71920;">${moneyCad(opts.quotation.totalCad)}</strong><br/>
        Valid until: ${opts.quotation.expiryDate || '—'}
      </p>
      <p style="font-size:12px;color:#98A2B3;">${company} · ${opts.settings.phone || ''} · ${opts.settings.email || 'save@desisigns.com'}</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to: opts.to,
      replyTo: opts.settings.email || 'save@desisigns.com',
      subject: opts.subject,
      text: `${opts.messageBody}\n\nQuotation ${opts.quotation.quotationNumber}\nTotal: ${moneyCad(opts.quotation.totalCad)}\nValid until: ${opts.quotation.expiryDate || '—'}`,
      html,
      attachments: [
        {
          filename: `${opts.quotation.quotationNumber}.pdf`,
          content: opts.pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
    return { ok: true, messageId: info.messageId };
  } catch (err: unknown) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown email delivery error',
    };
  }
}

export { isEmailConfigured };
