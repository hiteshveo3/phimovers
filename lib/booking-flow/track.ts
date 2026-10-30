// Server only. What /track shows about one booking or quote request: the reference, its stage and the
// details the customer gave, never staff notes, crew contact details or anyone else's data. Found by
// reference + the phone number it was made with, or listed for a verified email / signed-in account.

import type { Firestore } from 'firebase-admin/firestore';
import { BOOKING_STATUSES, type BookingStatus } from '../bookings/types';
import { LEAD_STATUSES, type LeadStatus } from '../leads/types';
import { dayOf } from './slots';
import { phoneDigits } from './model';

export type TrackView = {
  kind: 'booking' | 'quote';
  reference: string;
  status: string;
  statusLabel: string;
  service: string;
  date: string | null;
  time: string;
  from: string;
  to: string;
  total: number | null;
  priceEstimate: boolean;
  quoteAmount: string | null;
  paymentStatus: string | null;
  firstName: string;
  createdAt: string;
};

type Raw = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
const iso = (v: unknown) => (typeof v === 'string' ? v : v && typeof v === 'object' && 'toDate' in v ? (v as { toDate(): Date }).toDate().toISOString() : '');

export function bookingView(d: Raw): TrackView {
  const status = str(d.status) || 'pending';
  return {
    kind: 'booking',
    reference: str(d.bookingNumber),
    status,
    statusLabel: BOOKING_STATUSES.find((s) => s.value === (status as BookingStatus))?.label ?? status,
    service: str(d.serviceName),
    date: dayOf(d.scheduledDate, d.scheduledDay),
    time: str(d.scheduledTime),
    from: str(d.addressLine),
    to: str(d.toAddressLine),
    total: typeof d.totalPrice === 'number' && d.totalPrice > 0 ? d.totalPrice : null,
    priceEstimate: d.priceEstimate === true,
    quoteAmount: null,
    paymentStatus: str(d.paymentStatus) || 'unpaid',
    firstName: str(d.customerName).split(' ')[0] ?? '',
    createdAt: iso(d.createdAt),
  };
}

export function leadView(d: Raw): TrackView {
  const status = str(d.status) || 'new';
  return {
    kind: 'quote',
    reference: str(d.trackCode),
    status,
    statusLabel: LEAD_STATUSES.find((s) => s.value === (status as LeadStatus))?.label ?? status,
    service: str(d.service),
    date: str(d.date) || null,
    time: '',
    from: str(d.from),
    to: str(d.to),
    total: null,
    priceEstimate: true,
    quoteAmount: str(d.quoteAmount) || null,
    paymentStatus: null,
    firstName: str(d.name).split(' ')[0] ?? '',
    createdAt: iso(d.createdAt),
  };
}

const samePhone = (a: unknown, b: string) => {
  const x = phoneDigits(str(a));
  const y = phoneDigits(b);
  return x.length >= 10 && x === y;
};

/** A booking (PHI-XXXXXX) or a quote request (six-character track code) by its reference and phone. */
export async function findByReference(db: Firestore, reference: string, phone: string): Promise<TrackView | null> {
  const ref = reference.trim().toUpperCase().replace(/^PHI(?=[A-Z0-9]{6}$)/, 'PHI-');
  if (/^PHI-[A-Z0-9]{6}$/.test(ref)) {
    const snap = await db.collection('bookings').where('bookingNumber', '==', ref).limit(3).get();
    const hit = snap.docs.find((d) => samePhone(d.get('customerPhone'), phone));
    return hit ? bookingView(hit.data()) : null;
  }
  if (/^[A-Z0-9]{6}$/.test(ref)) {
    const snap = await db.collection('leads').where('trackCode', '==', ref).limit(3).get();
    const hit = snap.docs.find((d) => samePhone(d.get('phone'), phone));
    return hit ? leadView(hit.data()) : null;
  }
  return null;
}

/** Bookings and quote requests made with a verified email address, newest first. */
export async function findByEmail(db: Firestore, email: string): Promise<TrackView[]> {
  const e = email.trim().toLowerCase();
  const [b, l] = await Promise.all([
    db.collection('bookings').where('customerEmail', '==', e).limit(50).get(),
    db.collection('leads').where('email', '==', e).limit(50).get(),
  ]);
  return [...b.docs.map((d) => bookingView(d.data())), ...l.docs.map((d) => leadView(d.data()))].sort((x, y) => y.createdAt.localeCompare(x.createdAt));
}
