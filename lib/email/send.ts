/** Send transactional email via Resend (preferred) or Zoho/SMTP. */

import { EMAIL } from "../contact";

export function isMailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() ||
      (process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim()),
  );
}

function fromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "Phi Movers <info@phimovers.co.uk>"
  );
}

/** Where office copies go: OFFICE_EMAIL, then LEADS_NOTIFY_EMAIL, then the public site email. */
export function officeEmail() {
  return (
    process.env.OFFICE_EMAIL?.trim() ||
    process.env.LEADS_NOTIFY_EMAIL?.trim() ||
    EMAIL
  );
}

/**
 * text: plain-text part (recommended; some clients and spam filters read it).
 * replyTo: where a reply goes; customer emails reply to the office.
 */
export async function sendMail(input: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Resend failed: ${res.status} ${text}`);
    }
    return;
  }

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) {
    throw new Error(
      "Email not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS.",
    );
  }

  const mod = await import("nodemailer");
  const nodemailer = (mod as { default?: typeof import("nodemailer") }).default ??
    (mod as typeof import("nodemailer"));
  const port = Number(process.env.SMTP_PORT || "465");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });

  await transporter.sendMail({
    from: fromAddress(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    ...(input.text ? { text: input.text } : {}),
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
  });
}
