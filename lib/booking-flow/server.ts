// Server only. Stores a booking made on /book, in the client portal or in the chat, through Firebase Admin,
// in the same `bookings` shape the Android app and the admin dashboard read (lib/bookings/types.ts). Fields
// the website adds are optional extras (source, priceEstimate, scheduledDay, startTime, the postcodes…),
// so nothing the app reads changes.
//
// One transaction does three things, so two people can never get the same number or the same time:
//   1. claims a booking number at bookingNumbers/{PHI-XXXXXX} (and checks no older booking has it);
//   2. reads the day's bookings and refuses the start when its 30-minute cells are full (409 slotTaken),
//      then records the claim at slotCells/{YYYY-MM-DD};
//   3. writes the booking.
// The day's bookings, not only slotCells, decide: bookings the app writes itself and bookings the office
// moves or cancels are counted as they are now. slotCells is the lock both transactions touch, and a
// quick read for the slots API.

import { FieldValue, Timestamp, type DocumentReference, type Firestore } from 'firebase-admin/firestore';
import { getAdminDb, isAdminSdkConfigured } from '../firebase/admin';
import { makeBookingNumber } from '../bookings/types';
import { allow } from '../assistant/store';
import { hashId } from '../assistant/users';
import { MIN_HOURS } from '../../kit/site-facts';
import {
  accessText, addressText, appTimeLabel, formatPostcode, isTwoVans, jobHours, oneAddress, phoneDigits, normalisePhone, quote, serviceById, teamById, type Draft,
} from './model';
import { SLOT_CAPACITY, cellLoad, cellsFrom, labelMinute, londonMidnight } from './slots';
import { emailCustomer, emailOffice } from './emails';

export const storeReady = () => isAdminSdkConfigured();

export class SlotTakenError extends Error {
  constructor() {
    super('slotTaken');
  }
}
class NumberTakenError extends Error {}

/** The day's bookings: everything whose scheduledDate falls on this London day. */
export async function bookingsOnDay(db: Firestore, date: string, tx?: FirebaseFirestore.Transaction) {
  const start = Timestamp.fromMillis(londonMidnight(date));
  const end = Timestamp.fromMillis(londonMidnight(addDay(date)));
  const q = db.collection('bookings').where('scheduledDate', '>=', start).where('scheduledDate', '<', end);
  const snap = tx ? await tx.get(q) : await q.get();
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as Record<string, unknown> }));
}

const addDay = (date: string) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

/** Full 30-minute cells on a day ("1030"), for the time pickers. Only the times, never whose job. */
export async function takenCells(date: string): Promise<string[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !storeReady()) return [];
  const load = cellLoad(await bookingsOnDay(getAdminDb(), date), date);
  return [...load.entries()].filter(([, n]) => n >= SLOT_CAPACITY).map(([c]) => c).sort();
}

export type Source = 'web' | 'portal' | 'chat';

export type BookingOwner = {
  /** Firebase uid when the customer is signed in; '' for a guest (claimed later by /api/client/claim-leads). */
  customerId: string;
  /** Photos already uploaded under request_photos/{uid}/{bookingId}/ by the portal. */
  photos?: { urls: string[]; paths: string[] };
  /** The id the portal uploaded photos under; a fresh id otherwise. */
  bookingId?: string;
  paymentMethod?: 'bank_transfer' | 'cash' | 'card';
};

/** The stored row: Phi's booking shape, plus optional website fields. */
export function bookingRow(d: Draft, number: string, owner: BookingOwner, source: Source) {
  const svc = serviceById(d.service);
  const q = quote(d);
  const team = teamById(d.team);
  const hourly = svc?.mode === 'hourly' && !isTwoVans(d);
  const now = Timestamp.now();
  const [y, m, day] = d.date.split('-').map(Number);
  const notes = [
    d.description && `Job: ${d.description}`,
    d.extras.length && `Extras (priced on the call): ${d.extras.join(', ')}`,
    d.noteChips.length && d.noteChips.join(' · '),
    d.access && `Access: ${d.access}`,
    d.notes,
  ].filter(Boolean).join('\n');
  const parking = oneAddress(d)
    ? d.from.parking
    : [d.from.parking && `Pickup: ${d.from.parking}`, d.to.parking && `Delivery: ${d.to.parking}`].filter(Boolean).join(' · ');
  return {
    bookingNumber: number,
    customerId: owner.customerId,
    customerName: d.name.trim(),
    customerPhone: normalisePhone(d.phone) ?? d.phone.trim(),
    customerEmail: d.email.trim().toLowerCase(),
    serviceId: svc?.id ?? '',
    serviceName: svc?.name ?? 'Move',
    serviceCategory: svc?.tab === 'moves' ? 'Home & Flat Moves' : svc?.tab === 'items' ? 'Single items' : 'Packing & more',
    hours: hourly ? d.hours : MIN_HOURS,
    moversCount: hourly && team ? d.helpers + 1 : 0,
    basePrice: q.total ?? 0,
    addonsPrice: 0,
    selectedAddons: [],
    totalPrice: q.total ?? 0,
    // Noon UTC on the day: the same calendar day in London and in every browser time zone.
    scheduledDate: Timestamp.fromMillis(Date.UTC(y, m - 1, day, 12)),
    scheduledTime: d.time ? appTimeLabel(d.time) : '',
    addressLine: addressText(d.from),
    toAddressLine: oneAddress(d) ? '' : addressText(d.to),
    fromFloor: d.from.floor,
    toFloor: oneAddress(d) ? '' : d.to.floor,
    fromLift: d.from.lift === 'yes',
    toLift: d.to.lift === 'yes',
    parking,
    heavyItems: d.items,
    specialInstructions: notes,
    requestPhotos: owner.photos?.urls ?? [],
    requestPhotoPaths: owner.photos?.paths ?? [],
    jobPhotos: [],
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: owner.paymentMethod ?? 'bank_transfer',
    moverId: null,
    moverName: null,
    acceptedAt: null,
    enRouteAt: null,
    startedAt: null,
    completedAt: null,
    cancelledAt: null,
    cancelReason: null,
    moveRequestedAt: null,
    moveRequestedFrom: null,
    adminNote: null,
    createdAt: now,
    updatedAt: now,
    createdAtServer: FieldValue.serverTimestamp(),
    // ---- optional website fields (the app ignores them) ----
    source,
    /** True until the office confirms the price (the total is the rate-card estimate, or 0 when quoted on a call). */
    priceEstimate: true,
    quoteKind: q.kind,
    scheduledDay: d.date,
    startTime: d.time,
    helpers: hourly ? d.helpers : 0,
    vanId: hourly ? d.team : '',
    propertyKind: d.kind,
    propertySize: d.size,
    jobDescription: d.description,
    extras: d.extras,
    noteChips: d.noteChips,
    accessNotes: d.access,
    customerNotes: d.notes,
    fromPostcode: d.from.postcode ? formatPostcode(d.from.postcode) : '',
    toPostcode: !oneAddress(d) && d.to.postcode ? formatPostcode(d.to.postcode) : '',
    fromAccess: accessText(d.from),
    toAccess: oneAddress(d) ? '' : accessText(d.to),
    customerPhoneNorm: phoneDigits(d.phone),
  };
}

export type Created =
  | { ok: true; id: string; bookingNumber: string; emailed: boolean }
  | { ok: false; status: number; error: 'slotTaken' | 'unavailable' | 'reference' | 'save' };

/**
 * Stores a validated draft and emails the customer and the office. Used by /api/booking/submit and the
 * chat, so both produce the same PHI-XXXXXX number, the same emails and the same portal entry.
 */
export async function createBooking(d: Draft, owner: BookingOwner, source: Source): Promise<Created> {
  if (!storeReady()) return { ok: false, status: 503, error: 'unavailable' };
  const db = getAdminDb();
  const ref: DocumentReference = owner.bookingId && /^[A-Za-z0-9]{12,40}$/.test(owner.bookingId) ? db.collection('bookings').doc(owner.bookingId) : db.collection('bookings').doc();
  const minute = labelMinute(d.time);
  const wanted = minute === null ? [] : cellsFrom(minute, jobHours(d));

  let number = '';
  for (let attempt = 0; attempt < 6 && !number; attempt += 1) {
    const candidate = makeBookingNumber();
    try {
      await db.runTransaction(async (tx) => {
        const numberRef = db.collection('bookingNumbers').doc(candidate);
        const cellRef = db.collection('slotCells').doc(d.date);
        const [claimed, older, existing] = await Promise.all([
          tx.get(numberRef),
          tx.get(db.collection('bookings').where('bookingNumber', '==', candidate).limit(1)),
          tx.get(ref),
        ]);
        if (claimed.exists || !older.empty) throw new NumberTakenError();
        if (existing.exists) throw new Error('booking id already used');
        if (wanted.length) {
          await tx.get(cellRef);
          const load = cellLoad(await bookingsOnDay(db, d.date, tx), d.date, ref.id);
          if (wanted.some((c) => (load.get(c) ?? 0) >= SLOT_CAPACITY)) throw new SlotTakenError();
          tx.set(cellRef, { claims: { [ref.id]: wanted }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        }
        tx.create(numberRef, { bookingId: ref.id, createdAt: FieldValue.serverTimestamp() });
        tx.create(ref, bookingRow(d, candidate, owner, source));
      });
      number = candidate;
    } catch (err) {
      if (err instanceof SlotTakenError) return { ok: false, status: 409, error: 'slotTaken' };
      if (err instanceof NumberTakenError) continue;
      console.error('booking save failed', err);
      return { ok: false, status: 500, error: 'save' };
    }
  }
  if (!number) return { ok: false, status: 500, error: 'reference' };

  // The dashboard's bell (the same alert the portal used to write itself).
  await db.collection('adminAlerts').add({
    type: 'new_booking',
    bookingId: ref.id,
    bookingNumber: number,
    title: source === 'chat' ? 'New booking from Ask Phi' : 'New booking request',
    body: `${d.name.trim()} · ${number}`,
    read: false,
    createdAt: new Date().toISOString(),
  }).catch((e) => console.error('booking alert skipped', e));
  if (owner.customerId) {
    const now = new Date().toISOString();
    await db.collection('notifications').add({
      userId: owner.customerId,
      title: 'Booking request received',
      body: `We have your request ${number}. We will call you to confirm the van, the crew and the time.`,
      type: 'booking',
      bookingId: ref.id,
      isRead: false,
      createdAt: now,
      updatedAt: now,
    }).catch(() => undefined);
  }

  let emailed = false;
  try {
    await emailOffice(d, number, source);
    emailed = await emailCustomer(d, number);
  } catch (err) {
    console.error('booking email failed', err);
  }
  return { ok: true, id: ref.id, bookingNumber: number, emailed };
}

/* ---------- rate limits ---------- */

/** Fixed-window limit shared with the chat (Firestore when connected, memory in development). */
export async function tooMany(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  try {
    return !(await allow(`booking:${hashId(key)}`, limit, windowSeconds));
  } catch {
    return false;
  }
}

export function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
}

export const jsonReply = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

export async function readBody<T>(req: Request, maxBytes = 32_000): Promise<T | null> {
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
