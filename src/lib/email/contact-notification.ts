import nodemailer from 'nodemailer';
import type { ContactInquiryItem } from '../types';
import { isEmailConfigured, type EmailDeliveryResult } from './quote-notification';

export type { EmailDeliveryResult };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function contactInbox(): string {
  return (
    process.env.CONTACT_NOTIFICATION_TO ||
    process.env.QUOTE_NOTIFICATION_TO ||
    'save@desisigns.com'
  )
    .trim()
    .toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #EEF0F3;color:#596579;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #EEF0F3;color:#111111;font-size:13px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>
  `;
}

function buildHtml(inquiry: ContactInquiryItem): string {
  const submitted = new Date(inquiry.createdAt).toLocaleString('en-CA', {
    timeZone: 'America/Edmonton',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>New Contact Enquiry</title></head>
<body style="margin:0;padding:0;background:#F5F6F8;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:640px;margin:24px auto;background:#ffffff;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden;">
    <div style="background:#DC1421;padding:20px 24px;">
      <p style="margin:0;color:rgba(255,255,255,0.85);font-size:11px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;">Desi Signs</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;">New Contact Enquiry</h1>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 16px;color:#596579;font-size:14px;line-height:1.5;">
        A visitor submitted the Contact Us form. Reply directly to this email to respond.
      </p>
      <table style="width:100%;border-collapse:collapse;border:1px solid #EEF0F3;border-radius:8px;">
        ${row('Customer name', escapeHtml(inquiry.fullName))}
        ${row('Email', `<a href="mailto:${escapeHtml(inquiry.email)}" style="color:#DC1421;">${escapeHtml(inquiry.email)}</a>`)}
        ${row('Phone', inquiry.phone ? `<a href="tel:${escapeHtml(inquiry.phone)}" style="color:#111111;">${escapeHtml(inquiry.phone)}</a>` : 'Not provided')}
        ${row('Subject', escapeHtml(inquiry.subject))}
        ${row('Submission date', escapeHtml(submitted))}
        ${row('Reference ID', escapeHtml(inquiry.id))}
      </table>
      <h2 style="margin:22px 0 8px;font-size:15px;color:#111111;">Message</h2>
      <div style="padding:14px 16px;background:#F8F9FA;border:1px solid #EEF0F3;border-radius:8px;color:#111111;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(inquiry.message)}</div>
    </div>
    <div style="padding:14px 24px;background:#FAFBFC;border-top:1px solid #EEF0F3;color:#98A2B3;font-size:11px;">
      Automated notification from the Desi Signs website contact form.
    </div>
  </div>
</body>
</html>`;
}

function buildText(inquiry: ContactInquiryItem): string {
  const submitted = new Date(inquiry.createdAt).toLocaleString('en-CA', {
    timeZone: 'America/Edmonton',
  });
  return [
    'NEW DESI SIGNS CONTACT ENQUIRY',
    '',
    `Customer name: ${inquiry.fullName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || 'Not provided'}`,
    `Subject: ${inquiry.subject}`,
    `Submission date: ${submitted}`,
    `Reference ID: ${inquiry.id}`,
    '',
    'Message:',
    inquiry.message,
  ].join('\n');
}

async function sendOnce(inquiry: ContactInquiryItem): Promise<EmailDeliveryResult> {
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
  const to = contactInbox();
  const replyTo = isValidEmail(inquiry.email) ? inquiry.email : undefined;
  const transporter = buildTransporter();
  if (!transporter) {
    return {
      ok: false,
      skipped: true,
      attempts: 0,
      error: 'SMTP transporter could not be created.',
    };
  }

  const subject = `New Contact Enquiry — DESI SIGNS — ${inquiry.fullName}`;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      replyTo,
      subject,
      text: buildText(inquiry),
      html: buildHtml(inquiry),
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
 * Sends the business contact-enquiry email with one automatic retry on transient failure.
 */
export async function sendContactNotificationEmail(
  inquiry: ContactInquiryItem,
): Promise<EmailDeliveryResult> {
  const first = await sendOnce(inquiry);
  if (first.ok || first.skipped) return first;

  await delay(1200);
  const second = await sendOnce(inquiry);
  if (second.ok) {
    return { ok: true, messageId: second.messageId, attempts: 2 };
  }

  return {
    ok: false,
    attempts: 2,
    error: `Initial: ${first.error}; Retry: ${second.error}`,
  };
}
