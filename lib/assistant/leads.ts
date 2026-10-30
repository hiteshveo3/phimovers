// Saves a quote request from the chat as a Phi lead (the same "leads" collection and fields the website
// quote form and the admin dashboard use, written with Firebase Admin), then emails the office.

import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../firebase/admin';
import { isMailConfigured, sendMail } from '../email/send';
import { EMAIL } from '../contact';
import { makeTrackCode, type LeadPriority } from '../leads/types';
import { normalisePhone, type Details } from '../../kit/assistant/booking';
import { addDays, formatDate, londonNow } from '../../kit/assistant/dates';
import { money, priceText, quoteSummary, timeLabel, type Quote } from '../../kit/assistant/quote';
import { BRAND } from '../../kit/site-facts';
import { firestoreReady } from './env';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c);
const address = (s: { line: string; postcode: string }) => [s.line, s.postcode.toUpperCase()].filter(Boolean).join(', ');

export type SavedLead = { id: string; trackCode: string; emailed: boolean };

/** Writes the lead. Throws when Firebase Admin is not configured, so the route can answer "unavailable". */
export async function saveChatLead(quote: Quote, d: Details): Promise<SavedLead> {
  if (!firestoreReady()) throw new Error('Firebase Admin is not configured');
  const db = getAdminDb();
  const now = new Date().toISOString();
  const trackCode = makeTrackCode();
  const phone = normalisePhone(d.phone) ?? d.phone;
  const today = londonNow().date;
  const urgent = d.date === today || d.date === addDays(today, 1);
  const priority: LeadPriority = urgent ? 'urgent' : 'normal';
  const notes = [
    `Guide price from the website assistant: ${quoteSummary(quote)}.`,
    quote.items ? `Items: ${quote.items}.` : '',
    d.time ? `Preferred start: ${timeLabel(d.time)}.` : '',
    d.email ? `Email: ${d.email}.` : '',
    d.notes ? `Customer notes: ${d.notes}` : '',
  ].filter(Boolean).join('\n');
  const ref = await db.collection('leads').add({
    name: d.name,
    phone,
    email: d.email || null,
    from: address(d.from),
    to: address(d.to),
    date: d.date || null,
    propertySize: quote.sizeLabel || quote.title,
    service: quote.title,
    source: 'assistant',
    status: 'new',
    priority,
    trackCode,
    ownerUid: null,
    tags: ['assistant'],
    notes: [{ id: `n_${Date.now()}`, text: notes, createdAt: now }],
    activity: [{ id: `a_${Date.now()}`, at: now, type: 'created', text: 'Lead created from the website assistant (Ask Phi)' }],
    assignedTo: null,
    quoteAmount: null,
    lostReason: null,
    createdAt: now,
    updatedAt: now,
    createdAtServer: FieldValue.serverTimestamp(),
  });
  const emailed = await notify(quote, d, phone, trackCode, priority).catch(() => false);
  return { id: ref.id, trackCode, emailed };
}

const row = (k: string, v: string) => `<tr><td style="padding:6px 12px 6px 0;color:#5b6656">${esc(k)}</td><td style="padding:6px 0"><b>${esc(v)}</b></td></tr>`;

/** Emails the office (and the customer, if they gave an address). Silent when email is not configured. */
async function notify(quote: Quote, d: Details, phone: string, trackCode: string, priority: LeadPriority): Promise<boolean> {
  if (!isMailConfigured()) return false;
  const rows = [
    row('Reference', trackCode),
    row('Name', d.name),
    row('Phone', phone),
    d.email ? row('Email', d.email) : '',
    row('Move', quote.title),
    quote.sizeLabel ? row('Size', quote.sizeLabel) : '',
    quote.mode === 'hourly' ? row('Van and crew', `${quote.vanLabel}, ${quote.hours} hours`) : '',
    row('Guide price', quote.onCall ? priceText(quote) : money(quote.total)),
    row('From', address(d.from)),
    d.to.postcode || d.to.line ? row('To', address(d.to)) : '',
    d.date ? row('Day', `${formatDate(d.date)}${d.time ? `, ${timeLabel(d.time)}` : ''}`) : '',
    d.notes ? row('Notes', d.notes) : '',
  ].join('');
  const wrap = (heading: string, intro: string) =>
    `<div style="font-family:Arial,sans-serif;color:#0f1a09;max-width:520px"><h2 style="margin:0 0 8px">${esc(heading)}</h2><p style="margin:0 0 14px">${esc(intro)}</p><table style="border-collapse:collapse;font-size:14px">${rows}</table></div>`;

  await sendMail({
    to: process.env.LEADS_NOTIFY_EMAIL?.trim() || EMAIL,
    subject: `${priority === 'urgent' ? 'URGENT: ' : ''}New quote request from the assistant (${trackCode})`,
    html: wrap('New quote request', 'Sent through the Ask Phi chat on the website. It is saved as a new lead in the dashboard.'),
  });
  if (d.email) {
    await sendMail({
      to: d.email,
      subject: `Your ${BRAND} quote request (${trackCode})`,
      html: wrap('We have your quote request', `Thanks ${d.name.split(' ')[0]}. The ${BRAND} team will contact you to confirm your fixed quote. Your reference is ${trackCode}.`),
    }).catch(() => undefined);
  }
  return true;
}
