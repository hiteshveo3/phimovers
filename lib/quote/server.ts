// Server only. Saves a website quote request as a lead through Firebase Admin, in the same shape
// lib/leads/service.ts createLead writes (so the dashboard, the portal and the Android app read it as
// before), plus optional fields the form now asks for. Then emails the office and the customer.

import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb, isAdminSdkConfigured } from '../firebase/admin';
import { makeTrackCode } from '../leads/types';
import { DEPOSIT_TEXT, PHONE_DISPLAY, PHONE_TEL, RESPONSE_PROMISE } from '../../kit/site-facts';
import { SITE_URL, buttons, esc, frame, note, officeEmail, reference, rows, send, steps, textRows, type Row } from '../email/layout';
import { formatPostcode, guidePrice, normalisePhone, priorityOf, requestRows, sizeLabel, type QuoteRequest } from './model';

export const leadStoreReady = () => isAdminSdkConfigured();

export type SavedLead = { id: string; trackCode: string; emailed: boolean };

async function freeTrackCode(): Promise<string> {
  const db = getAdminDb();
  for (let i = 0; i < 5; i += 1) {
    const code = makeTrackCode();
    const hit = await db.collection('leads').where('trackCode', '==', code).limit(1).get();
    if (hit.empty) return code;
  }
  return makeTrackCode();
}

export async function saveQuoteLead(q: QuoteRequest, ownerUid: string | null): Promise<SavedLead> {
  const db = getAdminDb();
  const now = new Date().toISOString();
  const trackCode = await freeTrackCode();
  const phone = normalisePhone(q.phone) ?? q.phone;
  const detail = requestRows(q).map((r) => `${r.label}: ${r.value}`).join('\n');
  const ref = await db.collection('leads').add({
    name: q.name,
    phone,
    email: q.email || null,
    from: formatPostcode(q.from),
    to: formatPostcode(q.to),
    date: q.date || null,
    propertySize: sizeLabel(q.size),
    service: q.service,
    source: q.source,
    status: 'new',
    priority: priorityOf(q.date),
    trackCode,
    ownerUid: ownerUid || null,
    tags: q.packing ? ['packing'] : [],
    notes: [{ id: `n_${Date.now()}`, text: `From the website quote form:\n${detail}`, createdAt: now }],
    activity: [{ id: `a_${Date.now()}`, at: now, type: 'created', text: 'Lead created from website quote' }],
    assignedTo: null,
    quoteAmount: null,
    lostReason: null,
    createdAt: now,
    updatedAt: now,
    createdAtServer: FieldValue.serverTimestamp(),
    // ---- optional fields (older readers ignore them) ----
    fromFloor: q.fromFloor,
    fromLift: q.fromLift,
    toFloor: q.toFloor,
    toLift: q.toLift,
    packing: q.packing,
    guidePrice: guidePrice(q.size) || null,
    callback: q.callback,
    customerNotes: q.notes || null,
    phoneNorm: phone.replace(/\D/g, '').replace(/^0/, '44'),
  });
  let emailed = false;
  try {
    await emailOfficeLead(q, trackCode, ref.id);
    emailed = await emailCustomerLead(q, trackCode);
  } catch (err) {
    console.error('lead email failed', err);
  }
  return { id: ref.id, trackCode, emailed };
}

export const trackQuoteLink = (code: string) => `${SITE_URL}/track?ref=${encodeURIComponent(code)}`;

const NEXT = [
  `${RESPONSE_PROMISE}, by phone or email.`,
  'We confirm the van, the crew and a fixed price before moving day.',
  `Happy with it? We book your date. ${DEPOSIT_TEXT}`,
];

async function emailCustomerLead(q: QuoteRequest, code: string): Promise<boolean> {
  if (!q.email) return false;
  const list: Row[] = requestRows(q);
  const html = frame(
    `Thanks ${esc(q.name.split(' ')[0])}. We have your quote request.`,
    'This is a quote request, not a booking. We will be in touch with your fixed price.',
    `${reference(code)}${rows(list)}${steps('What happens next', NEXT)}${buttons([['Track my quote', trackQuoteLink(code)], [`Or call ${PHONE_DISPLAY}`, PHONE_TEL]])}${note(`Need to change something? Reply to this email with your reference, ${esc(code)}.`)}`,
    `Reference ${code}. We will be in touch with your price.`,
  );
  const text = `Thanks ${q.name}. We have your quote request ${code}.\n\n${textRows(list)}\n\nWhat happens next:\n${NEXT.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nTrack it: ${trackQuoteLink(code)}`;
  return send(q.email, `Quote request received – ${code}`, html, text);
}

async function emailOfficeLead(q: QuoteRequest, code: string, id: string): Promise<boolean> {
  const tel = `tel:${q.phone.replace(/[^\d+]/g, '')}`;
  const list: Row[] = [
    { label: 'Reference', value: code },
    { label: 'Name', value: q.name },
    { label: 'Phone', value: q.phone, href: tel },
    ...(q.email ? [{ label: 'Email', value: q.email, href: `mailto:${q.email}` }] : []),
    ...requestRows(q),
    { label: 'Sent from', value: q.source },
  ];
  const urgent = priorityOf(q.date) === 'urgent';
  const html = frame(
    `${urgent ? 'Urgent: ' : ''}New quote request ${esc(code)}`,
    'From the website quote form. It is saved as a new lead in the dashboard.',
    `${buttons([[`Call ${q.name.split(' ')[0]}`, tel], ...(q.email ? [['Email customer', `mailto:${q.email}?subject=${encodeURIComponent(`Your Phi Movers quote ${code}`)}`] as [string, string]] : []), ['Open the lead', `${SITE_URL}/admin/leads/${id}`]], '0 0 20px')}${rows(list)}`,
    `${q.name} · ${q.phone}`,
  );
  return send(officeEmail(), `${urgent ? 'URGENT: ' : ''}New quote request ${code} – ${q.name}`, html, textRows(list), { replyTo: q.email || undefined });
}
