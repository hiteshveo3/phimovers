// One email layout for every customer and office email: wordmark, heading, lead, body, contact footer,
// a hidden preheader and a plain-text part. After Alpha's emailFrame; every fact is Phi's (site-facts).
// Pass ready-made HTML to frame(); rows(), buttons(), steps() and reference() build the common parts.

import { ADDRESS, BRAND, COMPANY_NAME, HOURS_LONG, PHONE_DISPLAY, PHONE_TEL, SITE } from '../../kit/site-facts';
import { isMailConfigured, officeEmail, sendMail } from './send';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE).replace(/\/+$/, '');

const FONT = "'Instrument Sans',Arial,Helvetica,sans-serif";
const INK = '#0f1a09';
const INK_68 = '#4a5444';
const INK_60 = '#5b6656';
const LIME = '#9fe870';
const BAND = '#f2f8e9';
const LINE = '#e3eadb';

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

/** The whole email. heading and lead are escaped by the caller when they carry customer text. */
export function frame(heading: string, lead: string, body: string, preheader = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${BAND};font-family:${FONT};color:${INK}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:${BAND}">
<tr><td align="center" style="padding:24px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:20px">
<tr><td style="padding:24px 28px 0;font-size:17px;font-weight:600;letter-spacing:-.01em">${esc(BRAND)}</td></tr>
<tr><td style="padding:24px 28px 8px"><h1 style="margin:0 0 10px;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:600;letter-spacing:-.02em">${heading}</h1><p style="margin:0 0 22px;font-size:16px;line-height:1.55;color:${INK_68}">${lead}</p>${body}</td></tr>
<tr><td style="padding:20px 28px 26px;border-top:1px solid ${LINE};font-size:14px;line-height:1.6;color:${INK_68}">Questions? Call <a href="${PHONE_TEL}" style="color:${INK};font-weight:600">${esc(PHONE_DISPLAY)}</a> or reply to this email. We are open ${esc(HOURS_LONG)}.<br><span style="font-size:12.5px;color:${INK_60}">${esc(COMPANY_NAME)} · ${esc(ADDRESS)}</span></td></tr>
</table></td></tr></table></body></html>`;
}

export type Row = { label: string; value: string; href?: string };

export const rows = (list: Row[]) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;font-size:15px;border-top:1px solid ${LINE}">${list
    .map((r) => `<tr><td style="padding:12px 12px 12px 0;color:${INK_60};border-bottom:1px solid ${LINE};width:34%;vertical-align:top">${esc(r.label)}</td><td style="padding:12px 0;border-bottom:1px solid ${LINE};font-weight:600;vertical-align:top">${r.href ? `<a href="${esc(r.href)}" style="color:${INK}">${esc(r.value)}</a>` : esc(r.value)}</td></tr>`)
    .join('')}</table>`;

export const textRows = (list: Row[]) => list.map((r) => `${r.label}: ${r.value}`).join('\n');

/** The reference in large type, as on the done screen. */
export const reference = (ref: string) =>
  `<p style="margin:0 0 6px;font-size:12.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${INK_60}">Your reference</p><p style="margin:0 0 22px;font-size:36px;line-height:1.1;font-weight:600;letter-spacing:.02em">${esc(ref)}</p>`;

/** The first is a lime pill, the rest are text links, so each email has one button. */
export const buttons = (list: [label: string, href: string][], margin = '24px 0 0') =>
  `<p style="margin:${margin}">${list
    .map(([label, href], i) => (i === 0
      ? `<a href="${esc(href)}" style="display:inline-block;margin:0 0 10px;padding:14px 26px;border-radius:999px;font-size:16px;font-weight:600;text-decoration:none;color:${INK};background:${LIME}">${esc(label)}</a>`
      : `<br><a href="${esc(href)}" style="display:inline-block;margin:0 0 6px;font-size:15px;font-weight:600;color:${INK};text-decoration:underline">${esc(label)}</a>`))
    .join('')}</p>`;

export const steps = (title: string, list: string[]) =>
  `<h2 style="margin:26px 0 8px;font-family:${FONT};font-size:17px;font-weight:600">${esc(title)}</h2><ol style="margin:0;padding-left:22px;font-size:15px;line-height:1.6;color:${INK_68}">${list.map((s) => `<li style="margin:0 0 4px">${esc(s)}</li>`).join('')}</ol>`;

export const note = (text: string) => `<p style="margin:16px 0 0;font-size:14px;color:${INK_60}">${text}</p>`;

export const code = (value: string) =>
  `<p style="margin:0;padding:18px 20px;background:${BAND};border-radius:12px;font-size:38px;letter-spacing:10px;font-weight:600;text-align:center">${esc(value)}</p>`;

/** Plain-text footer that matches frame(). */
export const TEXT_FOOTER = `\n\nQuestions? Call ${PHONE_DISPLAY} or reply to this email. ${COMPANY_NAME} · ${ADDRESS}`;

/**
 * Sends one email in the shared layout. Replies go to the office unless replyTo says otherwise. Returns false (and sends
 * nothing) when no mail provider is configured, so callers can say "not emailed" instead of failing.
 */
export async function send(to: string, subject: string, html: string, text: string, opts: { replyTo?: string } = {}): Promise<boolean> {
  if (!isMailConfigured()) return false;
  await sendMail({ to, subject, html, text: `${text}${TEXT_FOOTER}`, replyTo: opts.replyTo || officeEmail() });
  return true;
}

export { officeEmail, isMailConfigured };
