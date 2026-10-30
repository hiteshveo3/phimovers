// The website quote request: its fields, checks and summary, shared by the form (kit/components/QuoteForm.tsx)
// and the server route (/api/leads), so both check the same things. A quote request is a lead, never a
// booking. The guide price comes from kit/estimate.ts, the same maths as the calculator.

import { SIZES, estimate } from '../../kit/estimate';
import { HOURS } from '../../kit/site-facts';
import { FLOORS, POSTCODE, EMAIL_RE, addDays, formatDate, formatPostcode, londonNow, normalisePhone } from '../booking-flow/model';

export { FLOORS, POSTCODE, EMAIL_RE, formatPostcode, normalisePhone };

export const QUOTE_SIZES = [...SIZES.map((s) => ({ id: s.id, label: s.label })), { id: 'unsure', label: 'Not sure yet' }];
export const sizeLabel = (id: string) => QUOTE_SIZES.find((s) => s.id === id)?.label ?? 'Not sure yet';

const hourText = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;
/** Callback windows inside office hours (HOURS in site-facts). */
export const CALLBACKS = [
  { id: 'asap', label: 'As soon as possible' },
  { id: 'morning', label: `Morning, ${hourText(HOURS.open)}–12pm` },
  { id: 'afternoon', label: 'Afternoon, 12pm–5pm' },
  { id: 'evening', label: `Evening, 5pm–${hourText(HOURS.close)}` },
] as const;
export type CallbackId = (typeof CALLBACKS)[number]['id'];

export type QuoteRequest = {
  service: string;
  size: string;
  from: string;
  to: string;
  fromFloor: string;
  fromLift: boolean;
  toFloor: string;
  toLift: boolean;
  packing: boolean;
  /** '' = flexible, otherwise a London date. */
  date: string;
  notes: string;
  name: string;
  phone: string;
  email: string;
  callback: CallbackId;
  /** Page the form was sent from. */
  source: string;
};

export const emptyRequest = (service = 'House Removals'): QuoteRequest => ({
  service, size: '1bed', from: '', to: '', fromFloor: 'Ground', fromLift: false, toFloor: 'Ground', toLift: false, packing: false,
  date: '', notes: '', name: '', phone: '', email: '', callback: 'asap', source: '/',
});

/** Day chips: Flexible, Today, Tomorrow, then the next 14 days. */
export function dayChips(now = new Date()): { value: string; label: string }[] {
  const today = londonNow(now).date;
  return [
    { value: '', label: 'Flexible' },
    { value: today, label: 'Today' },
    { value: addDays(today, 1), label: 'Tomorrow' },
    ...Array.from({ length: 14 }, (_, i) => {
      const day = addDays(today, i + 2);
      return { value: day, label: formatDate(day, 'short') };
    }),
  ];
}

/** The guide price for the size, or '' when it is quoted individually or unknown. */
export function guidePrice(size: string): string {
  const i = SIZES.findIndex((s) => s.id === size);
  if (i < 0) return '';
  const e = estimate(i);
  return e.quoted ? 'Quoted individually' : e.range;
}

export type Errors = Partial<Record<keyof QuoteRequest, string>>;

export function validateMove(q: QuoteRequest): Errors {
  const e: Errors = {};
  if (!POSTCODE.test(q.from.trim())) e.from = 'Enter the full postcode you are moving from, for example RM8 2UT.';
  if (!POSTCODE.test(q.to.trim())) e.to = 'Enter the full postcode you are moving to.';
  if (q.date && q.date < londonNow().date) e.date = 'Choose today or a later day.';
  return e;
}

export function validateContact(q: QuoteRequest): Errors {
  const e: Errors = {};
  if (q.name.trim().length < 2) e.name = 'Add your name so we know who to ask for.';
  if (!normalisePhone(q.phone)) e.phone = 'Enter a UK phone number, for example 07123 456789.';
  if (q.email.trim() && !EMAIL_RE.test(q.email.trim())) e.email = 'That email address looks incomplete.';
  return e;
}

export const validateRequest = (q: QuoteRequest): Errors => ({ ...validateMove(q), ...validateContact(q) });

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b-\u001f<>]/g, ' ').trim().slice(0, max) : '');

export function cleanRequest(raw: unknown): QuoteRequest {
  const r = (raw ?? {}) as Partial<QuoteRequest>;
  const floor = (v: unknown) => ((FLOORS as readonly string[]).includes(text(v, 20)) ? text(v, 20) : 'Ground');
  return {
    service: text(r.service, 80) || 'House Removals',
    size: QUOTE_SIZES.some((s) => s.id === r.size) ? String(r.size) : 'unsure',
    from: text(r.from, 10).toUpperCase(),
    to: text(r.to, 10).toUpperCase(),
    fromFloor: floor(r.fromFloor),
    fromLift: r.fromLift === true,
    toFloor: floor(r.toFloor),
    toLift: r.toLift === true,
    packing: r.packing === true,
    date: /^\d{4}-\d{2}-\d{2}$/.test(text(r.date, 10)) ? text(r.date, 10) : '',
    notes: text(r.notes, 1000),
    name: text(r.name, 80),
    phone: text(r.phone, 24),
    email: text(r.email, 120).toLowerCase(),
    callback: CALLBACKS.some((c) => c.id === r.callback) ? (r.callback as CallbackId) : 'asap',
    source: text(r.source, 200) || '/',
  };
}

const accessOf = (floor: string, lift: boolean) => (floor === 'Ground' ? 'Ground floor' : `${floor} floor${lift ? ', lift' : ', no lift'}`);

/** Rows for the done screen, "Copy summary", the emails and the office note. */
export function requestRows(q: QuoteRequest): { label: string; value: string }[] {
  const guide = guidePrice(q.size);
  return [
    { label: 'Service', value: q.service },
    { label: 'Size', value: sizeLabel(q.size) },
    { label: 'From', value: `${formatPostcode(q.from)} · ${accessOf(q.fromFloor, q.fromLift)}` },
    { label: 'To', value: `${formatPostcode(q.to)} · ${accessOf(q.toFloor, q.toLift)}` },
    { label: 'Day', value: q.date ? formatDate(q.date) : 'Flexible' },
    ...(q.packing ? [{ label: 'Packing', value: 'Wants packing help' }] : []),
    ...(guide ? [{ label: 'Guide price', value: guide }] : []),
    { label: 'Call back', value: CALLBACKS.find((c) => c.id === q.callback)?.label ?? 'As soon as possible' },
    ...(q.notes ? [{ label: 'Notes', value: q.notes }] : []),
  ];
}

export const summaryText = (q: QuoteRequest, reference?: string) =>
  [`Quote request${reference ? ` ${reference}` : ''}`, ...requestRows(q).map((r) => `${r.label}: ${r.value}`), q.name && `Name: ${q.name}`, q.phone && `Phone: ${q.phone}`, q.email && `Email: ${q.email}`].filter(Boolean).join('\n');

/** Moves within two days are flagged urgent for the office. */
export function priorityOf(date: string): 'normal' | 'urgent' {
  if (!date) return 'normal';
  const today = londonNow().date;
  return date >= today && date <= addDays(today, 2) ? 'urgent' : 'normal';
}
