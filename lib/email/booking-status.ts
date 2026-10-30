// Server only. Emails about a stored booking (the `bookings` shape the dashboard and the app share):
// confirmed, re-priced, moved, cancelled, crew assigned, completed (with the review request), and the
// reminder the day before. Each one goes next to the in-app notice the dashboard already writes
// (lib/bookings/service.ts notifyUser), through /api/booking/notify and the /api/cron jobs.

import { CANCELLATION_TEXT, DEPOSIT_TEXT, GOOGLE_REVIEW_URL, PHONE_DISPLAY, PHONE_TEL } from '../../kit/site-facts';
import { formatDate } from '../../kit/assistant/dates';
import { dayOf } from '../booking-flow/slots';
import { SITE_URL, buttons, esc, frame, note, rows, send, textRows, type Row } from './layout';

type Raw = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

export type StatusEvent = 'confirmed' | 'repriced' | 'moved' | 'cancelled' | 'crew' | 'completed' | 'reminder';
export const STATUS_EVENTS: StatusEvent[] = ['confirmed', 'repriced', 'moved', 'cancelled', 'crew', 'completed', 'reminder'];

function bookingRows(b: Raw): Row[] {
  const day = dayOf(b.scheduledDate, b.scheduledDay);
  const total = typeof b.totalPrice === 'number' && b.totalPrice > 0 ? b.totalPrice : 0;
  return [
    { label: 'Reference', value: str(b.bookingNumber) },
    { label: 'Service', value: str(b.serviceName) || 'Move' },
    ...(day ? [{ label: 'Date', value: `${formatDate(day)}${str(b.scheduledTime) ? `, ${str(b.scheduledTime)}` : ''}` }] : []),
    ...(str(b.addressLine) ? [{ label: str(b.toAddressLine) ? 'From' : 'Address', value: str(b.addressLine) }] : []),
    ...(str(b.toAddressLine) ? [{ label: 'To', value: str(b.toAddressLine) }] : []),
    ...(total ? [{ label: b.priceEstimate === true ? 'Estimated total' : 'Price', value: `£${total.toLocaleString('en-GB')}` }] : []),
    ...(str(b.moverName) ? [{ label: 'Crew lead', value: str(b.moverName) }] : []),
  ];
}

const reviewLink = () => GOOGLE_REVIEW_URL || `${SITE_URL}/client/bookings`;

const COPY: Record<StatusEvent, (b: Raw) => { subject: string; heading: string; lead: string; extra?: string; button?: [string, string] }> = {
  confirmed: () => ({ subject: 'Your booking is confirmed', heading: 'Your move is confirmed', lead: `We have your van, crew and time booked. ${DEPOSIT_TEXT}`, extra: CANCELLATION_TEXT }),
  repriced: (b) => ({ subject: 'Your booking price', heading: 'Your price is updated', lead: `The total for your booking is now £${Number(b.totalPrice ?? 0).toLocaleString('en-GB')}. Questions? Reply to this email or call us.` }),
  moved: () => ({ subject: 'Your new moving date', heading: 'Your move has a new date', lead: 'We have moved your booking to the date below.' }),
  cancelled: (b) => ({ subject: 'Your booking is cancelled', heading: 'Your booking is cancelled', lead: `${str(b.cancelReason) ? `${esc(str(b.cancelReason))}. ` : ''}If this is a surprise, call us straight away.` }),
  crew: (b) => ({ subject: 'Your crew is assigned', heading: 'Your crew is assigned', lead: `${esc(str(b.moverName) || 'Your crew')} will handle your move.` }),
  completed: () => ({ subject: 'Thanks for moving with Phi Movers', heading: 'All done. How did we do?', lead: 'Thank you for moving with us. A short review helps other Londoners choose, and helps us get better.', button: ['Leave a review', reviewLink()] }),
  reminder: () => ({ subject: 'Your move is tomorrow', heading: 'See you tomorrow', lead: 'A reminder that your move is tomorrow. Please make sure there is somewhere for the van to stop, and call us if anything has changed.' }),
};

/** Emails the customer about [event]. False when there is no address or no mail provider. */
export async function emailBookingEvent(b: Raw, event: StatusEvent): Promise<boolean> {
  const to = str(b.customerEmail).trim();
  if (!to || to === 'deleted') return false;
  const c = COPY[event](b);
  const ref = str(b.bookingNumber);
  const list = bookingRows(b);
  const first = str(b.customerName).split(' ')[0];
  const html = frame(
    `${esc(c.heading)}${first ? `, ${esc(first)}` : ''}`,
    c.lead,
    `${rows(list)}${c.extra ? note(esc(c.extra)) : ''}${buttons([c.button ?? ['Track my booking', `${SITE_URL}/track?ref=${encodeURIComponent(ref)}`], [`Or call ${PHONE_DISPLAY}`, PHONE_TEL]])}`,
    `${c.heading} · ${ref}`,
  );
  const text = `${c.heading}\n${c.lead.replace(/<[^>]+>/g, '')}\n\n${textRows(list)}${c.extra ? `\n\n${c.extra}` : ''}${c.button ? `\n\n${c.button[0]}: ${c.button[1]}` : ''}`;
  return send(to, `${c.subject} – ${ref}`, html, text);
}
