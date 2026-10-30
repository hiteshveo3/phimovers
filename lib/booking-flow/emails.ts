// Server only. The two emails every new booking sends: the request to the customer (reference, rows,
// what happens next, one button) and the new booking to the office (Call / Email buttons, every detail).
// Laid out after Alpha's emailCustomer and emailOffice, in the shared layout (lib/email/layout.ts).

import { DEPOSIT_TEXT, PHONE_DISPLAY, PHONE_TEL } from '../../kit/site-facts';
import { SITE_URL, buttons, code, esc, frame, note, officeEmail, reference, rows, send, steps, textRows, type Row } from '../email/layout';
import { formatDate, oneAddress, quote, slotLabel, summaryRows, type Draft } from './model';

function bookingRows(d: Draft): Row[] {
  const q = quote(d);
  return [...summaryRows(d), { label: q.kind === 'estimate' ? 'Estimated total' : 'Price', value: q.totalText || 'Priced on a short call' }];
}

const NEXT = [
  'We call you to confirm the van, the crew, the time and the price.',
  DEPOSIT_TEXT,
  'The crew arrives on the day and does the job.',
];

export const trackLink = (number: string) => `${SITE_URL}/track?ref=${encodeURIComponent(number)}`;

export async function emailCustomer(d: Draft, number: string): Promise<boolean> {
  if (!d.email) return false;
  const when = d.date ? `${formatDate(d.date)}${d.time ? ` at ${slotLabel(d.time)}` : ''}` : '';
  const list = bookingRows(d);
  const html = frame(
    `Thanks ${esc(d.name.split(' ')[0])}. We have your request.`,
    `This is not a confirmed booking yet. We will call you to confirm the van, the crew and the time${when ? ` for ${esc(when)}` : ''}.`,
    `${reference(number)}${rows(list)}${steps('What happens next', NEXT)}${buttons([['Track my booking', trackLink(number)], [`Or call ${PHONE_DISPLAY}`, PHONE_TEL]])}${note(`Need to change something? Reply to this email with your reference, ${esc(number)}.`)}`,
    `Reference ${number}. We will call you to confirm.`,
  );
  const text = `Thanks ${d.name}. We have your booking request ${number}. It is not confirmed yet.\n\n${textRows(list)}\n\nWhat happens next:\n${NEXT.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nTrack your booking: ${trackLink(number)}`;
  return send(d.email, `Booking request received – ${number}`, html, text);
}

export async function emailOffice(d: Draft, number: string, source: string): Promise<boolean> {
  const tel = `tel:${d.phone.replace(/[^\d+]/g, '')}`;
  const q = quote(d);
  const list: Row[] = [
    { label: 'Reference', value: number },
    ...bookingRows(d),
    ...(source === 'chat' ? [{ label: 'Sent from', value: 'Ask Phi chat' }] : source === 'portal' ? [{ label: 'Sent from', value: 'Client portal' }] : []),
    { label: 'Name', value: d.name },
    { label: 'Phone', value: d.phone, href: tel },
    { label: 'Email', value: d.email, href: `mailto:${d.email}` },
    ...(d.extras.length ? [{ label: 'Extras', value: d.extras.join(', ') }] : []),
    ...(d.description ? [{ label: 'Job', value: d.description }] : []),
    { label: oneAddress(d) ? 'Address access' : 'From access', value: [d.from.floor && `${d.from.floor} floor`, d.from.lift && `lift: ${d.from.lift}`, d.from.parking].filter(Boolean).join(' · ') || '—' },
    ...(oneAddress(d) ? [] : [{ label: 'To access', value: [d.to.floor && `${d.to.floor} floor`, d.to.lift && `lift: ${d.to.lift}`, d.to.parking].filter(Boolean).join(' · ') || '—' }]),
    ...(d.access ? [{ label: 'Access notes', value: d.access }] : []),
    ...(d.noteChips.length || d.notes ? [{ label: 'Notes', value: [...d.noteChips, d.notes].filter(Boolean).join(' · ') }] : []),
  ];
  const html = frame(
    `New booking request ${esc(number)}`,
    'Call the customer to confirm the slot, van, crew and price. It is in the dashboard under Bookings.',
    `${buttons([[`Call ${d.name.split(' ')[0]}`, tel], ['Email customer', `mailto:${d.email}?subject=${encodeURIComponent(`Your Phi Movers booking ${number}`)}`], ['Open bookings', `${SITE_URL}/admin/bookings`]], '0 0 20px')}${rows(list)}`,
    `${d.name} · ${d.phone}`,
  );
  return send(officeEmail(), `New booking ${number} – ${d.name}${q.total ? ` – £${q.total}` : ''}`, html, textRows(list), { replyTo: d.email });
}

/** The six-digit code a guest types at the review step (or on /track). */
export async function emailCode(to: string, value: string, minutes: number): Promise<boolean> {
  const html = frame(
    'Your booking code',
    `Type this code on the Phi Movers website to carry on. It works for ${minutes} minutes.`,
    `${code(value)}${note('If you did not ask for this, you can ignore this email. Nobody can use your address without the code.')}`,
    `Your code is ${value}. It works for ${minutes} minutes.`,
  );
  return send(to, `${value} is your Phi Movers code`, html, `Your Phi Movers code is ${value}. It works for ${minutes} minutes.`);
}
