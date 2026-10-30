// Online booking: the shared model for /book, /client/bookings/new, the /api/booking routes, the emails,
// /track and the chat checkout. Prices come only from the published rate card (kit/site-facts.ts through
// ./price.ts), and the server works every total out again from the draft, so a figure typed into the
// browser is never trusted. Dates are London dates ("YYYY-MM-DD") and times London clock ("HH:mm").
// Laid out after Alpha's src/booking/model.ts; every fact is Phi's.

import { findBoroughs } from '../../kit/areas-list';
import { SIZES, EXTRAS as ESTIMATE_EXTRAS } from '../../kit/estimate';
import { BOOK_AHEAD_DAYS, SLOTS, addDays, formatDate, londonNow, slotLabel } from '../../kit/assistant/dates';
import { BOOKING_POLICIES, HELPER_RATE, MIN_HOURS, RATES } from '../../kit/site-facts';
import { MILEAGE_NOTE, isEvening, rateFor, timePrice, type VanId } from './price';

export { BOOK_AHEAD_DAYS, addDays, formatDate, londonNow, slotLabel };

export const STEPS = ['service', 'property', 'details', 'datetime', 'address', 'review'] as const;
export type StepId = (typeof STEPS)[number];
export const STEP_LABEL: Record<StepId, string> = {
  service: 'Service',
  property: 'Property',
  details: 'Details',
  datetime: 'Date & time',
  address: 'Address',
  review: 'Review',
};

/* ---------- services ---------- */

export type TabId = 'moves' | 'items' | 'more';
export const TABS: { id: TabId; label: string }[] = [
  { id: 'moves', label: 'Moves' },
  { id: 'items', label: 'Single items' },
  { id: 'more', label: 'Packing & more' },
];

/** hourly: van + crew + hours, priced live. quote: priced on a call (office, packing, storage, assembly). */
export type Mode = 'hourly' | 'quote';
export type TeamId = VanId;
export type ServiceId = 'house' | 'flat' | 'studio' | 'manvan' | 'student' | 'office' | 'single' | 'sofa' | 'assembly' | 'packing' | 'storage';
/** popular: shown with a "Most booked" tag. Left unset until the office confirms which services those are. */
export type Service = { id: ServiceId; tab: TabId; name: string; mode: Mode; property: boolean; team?: TeamId; from: string; lead: string; href: string; popular?: boolean };

const fromText = (van: TeamId, helpers: number) => `From £${timePrice(van, helpers, MIN_HOURS).total} · first ${MIN_HOURS} hours`;
export const QUOTED = 'Quoted on the call';

// Service pages are the real slugs from lib/data.ts (the same list as kit/assistant/config.ts SERVICES).
export const SERVICES: Service[] = [
  { id: 'house', tab: 'moves', name: 'House removal', mode: 'hourly', property: true, from: fromText('small', 0), lead: 'Homes of one to five bedrooms.', href: '/services/house-removals' },
  { id: 'flat', tab: 'moves', name: 'Flat removal', mode: 'hourly', property: true, from: fromText('small', 0), lead: 'Walk-ups, lifts and tight landings.', href: '/services/flat-removals' },
  { id: 'studio', tab: 'moves', name: 'Studio move', mode: 'hourly', property: true, from: fromText('small', 0), lead: 'Studios and single rooms.', href: '/services/studio-moves' },
  { id: 'manvan', tab: 'moves', name: 'Man and van', mode: 'hourly', property: true, from: fromText('small', 0), lead: 'Hourly help for smaller loads.', href: '/services/man-and-van' },
  { id: 'student', tab: 'moves', name: 'Student move', mode: 'hourly', property: true, from: fromText('small', 0), lead: 'Halls, shared houses and studios.', href: '/services/student-moves' },
  { id: 'office', tab: 'moves', name: 'Office removal', mode: 'quote', property: false, from: QUOTED, lead: 'Desks, IT and stock.', href: '/services/office-removals' },
  { id: 'single', tab: 'items', name: 'Single item', mode: 'hourly', property: false, team: 'small', from: fromText('small', 0), lead: 'One bed, fridge, desk or wardrobe.', href: '/services/single-item-delivery' },
  { id: 'sofa', tab: 'items', name: 'Sofa delivery', mode: 'hourly', property: false, team: 'transit', from: fromText('transit', 1), lead: 'Shop or Marketplace collections.', href: '/services/sofa-delivery' },
  { id: 'assembly', tab: 'items', name: 'Furniture assembly', mode: 'quote', property: false, from: QUOTED, lead: 'Dismantle and rebuild.', href: '/services/furniture-assembly' },
  { id: 'packing', tab: 'more', name: 'Packing service', mode: 'quote', property: false, from: QUOTED, lead: 'Full or part packing.', href: '/services/full-packing-service' },
  { id: 'storage', tab: 'more', name: 'Storage', mode: 'quote', property: false, from: QUOTED, lead: 'Between dates, with an inventory.', href: '/services/secure-storage' },
];

export const serviceById = (id?: string | null) => SERVICES.find((s) => s.id === id);

/** A service page slug or a free-text service name ("House Removals") to a booking service. */
export function serviceFromText(text?: string | null): ServiceId | '' {
  const t = (text ?? '').toLowerCase();
  if (!t) return '';
  const bySlug = SERVICES.find((s) => s.id === t || s.href.endsWith(`/${t}`));
  if (bySlug) return bySlug.id;
  if (t.includes('office') || t.includes('commercial')) return 'office';
  if (t.includes('pack')) return 'packing';
  if (t.includes('storage')) return 'storage';
  if (t.includes('assembl') || t.includes('dismantl')) return 'assembly';
  if (t.includes('sofa')) return 'sofa';
  if (t.includes('single') || t.includes('item')) return 'single';
  if (t.includes('student')) return 'student';
  if (t.includes('studio')) return 'studio';
  if (t.includes('flat')) return 'flat';
  if (t.includes('man and van') || t.includes('man-and-van') || t.includes('man & van')) return 'manvan';
  if (t.includes('house') || t.includes('home') || t.includes('removal')) return 'house';
  return '';
}

/* ---------- property ---------- */

export type KindId = 'flat' | 'house';
export const KINDS: { id: KindId; label: string }[] = [
  { id: 'flat', label: 'Flat' },
  { id: 'house', label: 'House' },
];

// Sizes reuse the guide-price table in kit/estimate.ts so the suggestion matches the calculator.
export type SizeId = 'item' | 'studio' | '1bed' | '2bed' | '3bed' | '45bed';
const SIZE_TEAM: Record<SizeId, TeamId | null> = { item: 'small', studio: 'transit', '1bed': 'transit', '2bed': 'luton', '3bed': 'luton', '45bed': null };
export const PROPERTY_SIZES = SIZES.map((s) => ({ id: s.id as SizeId, label: s.id === 'item' ? 'A few items' : s.label, extra: s.hours, quoted: Boolean(s.quoted) }));

/** The crew that goes with each van, as in the size guide: small van alone, Transit + 1 helper, Luton + 2 helpers. */
export const TEAM_HELPERS: Record<TeamId, number> = { small: 0, transit: 1, luton: 2 };
export const TEAMS = RATES.map((r) => ({ ...r, helpers: TEAM_HELPERS[r.id] }));
export const teamById = (id?: string | null) => TEAMS.find((r) => r.id === id);
export const HELPERS_MAX = 3;
export const teamLabel = (team: TeamId, helpers: number) => `${rateFor(team)?.short ?? 'Van'}${helpers ? ` + ${helpers} helper${helpers > 1 ? 's' : ''}` : ', driver only'}`;

/** The van, crew and hours we would suggest for a service and home size. Null means two vans, priced on a call. */
export function suggestion(d: Pick<Draft, 'service' | 'size'>): { team: TeamId; helpers: number; hours: number } | null {
  const svc = serviceById(d.service);
  if (!svc || svc.mode !== 'hourly') return null;
  if (!svc.property) {
    const team = svc.team ?? 'small';
    return { team, helpers: TEAM_HELPERS[team], hours: MIN_HOURS };
  }
  const size = PROPERTY_SIZES.find((s) => s.id === d.size);
  if (!size) return null;
  const team = SIZE_TEAM[size.id];
  if (!team) return null;
  return { team, helpers: TEAM_HELPERS[team], hours: Math.max(MIN_HOURS, Math.round((MIN_HOURS + size.extra) * 2) / 2) };
}

/* ---------- details ---------- */

export const HOURS_MIN = MIN_HOURS;
export const HOURS_MAX = 10;
/** Add-ons the office prices on the call (kit/estimate.ts EXTRAS). */
export const EXTRAS = ESTIMATE_EXTRAS.map((x) => x.label);
export const HEAVY_ITEMS = ['Sofa', 'Wardrobe', 'Fridge-freezer', 'Washing machine', 'Piano', 'Bed & mattress', 'Desk', 'Gym equipment', 'Motorbike'] as const;

/* ---------- date and time ---------- */

/**
 * Same-day starts. Null keeps the first bookable day as tomorrow (Phi's booking form has always worked so).
 * Set a number of minutes (for example 120) once the office decides to take same-day jobs.
 */
export const SAME_DAY_NOTICE_MINUTES: number | null = null;

/** Start times from the office hours (kit/assistant/dates.ts SLOTS, the same list the chat uses). */
export const ALL_SLOTS = SLOTS;
export const SLOT_GROUPS = [
  { id: 'morning', label: 'Morning', from: '00:00', to: '12:00' },
  { id: 'afternoon', label: 'Afternoon', from: '12:00', to: '17:00' },
  { id: 'evening', label: 'Evening', from: '17:00', to: '24:00' },
] as const;
export const slotsFor = (g: (typeof SLOT_GROUPS)[number]) => ALL_SLOTS.filter((t) => t >= g.from && t < g.to);

const minutesOf = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export function slotOpen(date: string, time: string, now = new Date()) {
  const ln = londonNow(now);
  if (!ALL_SLOTS.includes(time)) return false;
  if (date < ln.date || date > addDays(ln.date, BOOK_AHEAD_DAYS)) return false;
  if (date > ln.date) return true;
  return SAME_DAY_NOTICE_MINUTES !== null && minutesOf(time) >= ln.minutes + SAME_DAY_NOTICE_MINUTES;
}

export function dateBookable(date: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return ALL_SLOTS.some((t) => slotOpen(date, t, now));
}

/** The next bookable day and its first open start, for a draft that has no date yet. */
export function firstOpening(now = new Date()): { date: string; time: string } | null {
  const today = londonNow(now).date;
  for (let i = 0; i <= BOOK_AHEAD_DAYS; i += 1) {
    const date = addDays(today, i);
    const time = ALL_SLOTS.find((t) => slotOpen(date, t, now));
    if (time) return { date, time };
  }
  return null;
}

export function finishesBy(time: string, hours: number) {
  const end = minutesOf(time) + Math.round(hours * 60);
  return `${String(Math.floor(end / 60) % 24).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
}

/** "09:30" → "09:30 AM", the form the Android app and the admin dashboard keep in scheduledTime. */
export function appTimeLabel(time: string) {
  const [h, m] = time.split(':').map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/* ---------- address ---------- */

export const FLOORS = ['Ground', '1st', '2nd', '3rd', '4th', '5th or higher'] as const;
/** Answers to "Is there space for a van outside?". */
export const PARKING = ['Yes, outside or on a driveway', 'No, it needs a permit or bay', 'Not sure'] as const;
export type Stop = { postcode: string; line: string; town: string; floor: string; lift: '' | 'yes' | 'no'; parking: string };
export const emptyStop = (): Stop => ({ postcode: '', line: '', town: '', floor: '', lift: '', parking: '' });

/** Full UK postcode, with or without the space. */
export const POSTCODE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/;
export const formatPostcode = (p: string) => {
  const c = p.replace(/\s+/g, '').toUpperCase();
  return c.length > 3 ? `${c.slice(0, -3)} ${c.slice(-3)}` : c;
};
/** London borough for a full or outward postcode, or null when it is outside the boroughs Phi lists. */
export const boroughFor = (postcode: string) => findBoroughs(postcode.trim().split(/\s+/)[0] || '')[0] ?? null;

/* ---------- contact ---------- */

export const NOTE_CHIPS = ['Parking permit needed', 'No lift', 'Narrow stairs', 'Items to dismantle', 'Fragile items'] as const;

/** A UK number as "07XXX XXXXXX" (mobiles) or "0XXXXXXXXXX", or null when it is not a UK number. */
export function normalisePhone(raw: string): string | null {
  let d = raw.replace(/[\s\-().]/g, '');
  if (d.startsWith('+44')) d = `0${d.slice(3)}`;
  else if (d.startsWith('0044')) d = `0${d.slice(4)}`;
  if (!/^0\d{9,10}$/.test(d)) return null;
  return d.startsWith('07') && d.length === 11 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}
/** Digits in the 44… form the leads and user profiles match on (lib/users/types.ts normalizePhone). */
export const phoneDigits = (raw: string) => raw.replace(/\D/g, '').replace(/^0/, '44');
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Types a UK mobile as "07XXX XXXXXX" while the person types; "+44 7..." is folded to "07...". */
export function maskMobile(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (raw.trim().startsWith('+') && digits.startsWith('44')) digits = `0${digits.slice(2)}`;
  digits = digits.slice(0, 11);
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

/* ---------- the draft ---------- */

export type Draft = {
  service: ServiceId | '';
  kind: KindId | '';
  size: SizeId | '';
  team: TeamId | '';
  /** Helpers with the driver. */
  helpers: number;
  hours: number;
  extras: string[];
  items: string[];
  description: string;
  date: string;
  time: string;
  from: Stop;
  to: Stop;
  access: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  noteChips: string[];
  consent: boolean;
};

export const emptyDraft = (): Draft => ({
  service: '', kind: '', size: '', team: '', helpers: 0, hours: MIN_HOURS, extras: [], items: [], description: '',
  date: '', time: '', from: emptyStop(), to: emptyStop(), access: '', name: '', phone: '', email: '', notes: '', noteChips: [], consent: false,
});

/** Steps this service goes through; services without a home size skip "property". */
export function stepsFor(d: Pick<Draft, 'service'>): StepId[] {
  const svc = serviceById(d.service);
  return svc && !svc.property ? STEPS.filter((s) => s !== 'property') : [...STEPS];
}

/** An hourly move that needs two vans, so it is priced on a call (4–5 bedrooms). */
export const isTwoVans = (d: Pick<Draft, 'service' | 'size'>) => serviceById(d.service)?.mode === 'hourly' && d.size === '45bed';
/** Services that only have one address (packing, storage, assembly). */
export const oneAddress = (d: Pick<Draft, 'service'>) => ['storage', 'packing', 'assembly'].includes(d.service);

/** The hours a job holds the crew for (an hourly job's hours; a quoted job the minimum). */
export const jobHours = (d: Pick<Draft, 'service' | 'size' | 'hours'>) => (serviceById(d.service)?.mode === 'hourly' && !isTwoVans(d) ? d.hours : MIN_HOURS);

/* ---------- price ---------- */

export type Line = { label: string; amount?: number; note?: string };
/** estimate: hourly guide the office confirms. call: priced on a short call. */
export type Quote = { kind: 'estimate' | 'call' | 'none'; lines: Line[]; total?: number; totalText: string };

export const money = (n: number) => `£${Number.isInteger(n) ? n.toLocaleString('en-GB') : n.toFixed(2)}`;
export const hoursText = (h: number) => (h === 1 ? '1 hour' : `${String(h).replace('.5', '½')} hours`);

export function quote(d: Draft): Quote {
  const svc = serviceById(d.service);
  if (!svc) return { kind: 'none', lines: [], totalText: '' };
  if (svc.mode === 'quote' || isTwoVans(d)) {
    return { kind: 'call', lines: [{ label: svc.name, note: isTwoVans(d) ? 'Two Lutons for a 4–5 bedroom home' : 'Priced on a short call' }], totalText: 'Priced on a short call' };
  }
  const team = teamById(d.team);
  if (!team) return { kind: 'none', lines: [], totalText: '' };
  const p = timePrice(team.id, d.helpers, d.hours, d.time);
  const lines: Line[] = [{ label: `First ${MIN_HOURS} hours · ${teamLabel(team.id, d.helpers)}`, amount: p.base }];
  if (p.extraHours > 0) lines.push({ label: `${hoursText(p.extraHours)} × ${money(p.hourly)}/hr`, amount: p.extra });
  if (isEvening(d.time)) lines.push({ label: 'Evening start', note: 'Evening rate included' });
  if (d.extras.length) lines.push({ label: d.extras.join(', '), note: 'Priced on the call' });
  lines.push({ label: 'Mileage', note: MILEAGE_NOTE });
  return { kind: 'estimate', lines, total: p.total, totalText: money(p.total) };
}

/* ---------- validation ---------- */

export type Errors = Partial<Record<string, string>>;

export function validateStep(step: StepId, d: Draft, now = new Date()): Errors {
  const e: Errors = {};
  const svc = serviceById(d.service);
  switch (step) {
    case 'service':
      if (!svc) e.service = 'Please choose a service.';
      break;
    case 'property':
      if (!d.kind) e.kind = 'Please choose a flat or a house.';
      if (!d.size) e.size = 'Please choose the size.';
      break;
    case 'details':
      if (!svc) {
        e.service = 'Please choose a service.';
        break;
      }
      if (svc.mode === 'hourly' && !isTwoVans(d)) {
        if (!teamById(d.team)) e.team = 'Please choose a van and crew.';
        if (!(d.hours >= HOURS_MIN && d.hours <= HOURS_MAX && (d.hours * 2) % 1 === 0)) e.hours = 'Please choose the hours.';
        if (!(d.helpers >= 0 && d.helpers <= HELPERS_MAX)) e.helpers = 'Please choose the helpers.';
      }
      if ((svc.mode === 'quote' || isTwoVans(d)) && d.description.trim().length < 10) e.description = 'Please describe the job in a little more detail.';
      break;
    case 'datetime':
      if (!d.date || !dateBookable(d.date, now)) e.date = 'Please choose a date.';
      else if (!d.time || !slotOpen(d.date, d.time, now)) e.time = 'Please choose a start time.';
      break;
    case 'address':
      if (!POSTCODE.test(d.from.postcode.trim())) e['from.postcode'] = 'Please add the full collection postcode.';
      if (d.from.line.trim().length < 3) e['from.line'] = 'Please add the house or flat number and street.';
      if (!d.from.floor) e['from.floor'] = 'Please choose the floor.';
      if (!oneAddress(d)) {
        if (!POSTCODE.test(d.to.postcode.trim())) e['to.postcode'] = 'Please add the full delivery postcode.';
        if (d.to.line.trim().length < 3) e['to.line'] = 'Please add the house or flat number and street.';
        if (!d.to.floor) e['to.floor'] = 'Please choose the floor.';
      }
      break;
    case 'review':
      if (d.name.trim().length < 2) e.name = 'Please add your name.';
      if (!normalisePhone(d.phone)) e.phone = 'Enter a UK phone number, for example 07123 456789.';
      if (!EMAIL_RE.test(d.email.trim())) e.email = 'Please check this email address.';
      if (!d.consent) e.consent = 'Please agree to the booking terms to continue.';
      break;
  }
  return e;
}

export function validateAll(d: Draft, now = new Date()): Errors {
  return stepsFor(d).reduce<Errors>((acc, s) => ({ ...acc, ...validateStep(s, d, now) }), {});
}

/** The step a server error key belongs to ("from.postcode" → address), for mapping a 400 back to the flow. */
export function stepOfError(key: string): StepId {
  if (key === 'service') return 'service';
  if (key === 'kind' || key === 'size') return 'property';
  if (key === 'date' || key === 'time') return 'datetime';
  if (key.startsWith('from.') || key.startsWith('to.')) return 'address';
  if (['name', 'phone', 'email', 'consent'].includes(key)) return 'review';
  return 'details';
}

/** Keeps only known fields with sane lengths, so the server stores exactly what the flow can produce. */
export function cleanDraft(raw: unknown): Draft {
  const r = (raw ?? {}) as Partial<Draft>;
  const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b-\u001f]/g, ' ').slice(0, max) : '');
  const list = (v: unknown, allowed: readonly string[]) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)) : []);
  const stop = (s: unknown): Stop => {
    const o = (s ?? {}) as Partial<Stop>;
    return {
      postcode: str(o.postcode, 10),
      line: str(o.line, 160),
      town: str(o.town, 80),
      floor: (FLOORS as readonly string[]).includes(str(o.floor)) ? str(o.floor) : '',
      lift: o.lift === 'yes' || o.lift === 'no' ? o.lift : '',
      parking: (PARKING as readonly string[]).includes(str(o.parking)) ? str(o.parking) : '',
    };
  };
  const svc = serviceById(str(r.service));
  const team = teamById(str(r.team));
  const helpers = typeof r.helpers === 'number' && Number.isFinite(r.helpers) ? Math.min(HELPERS_MAX, Math.max(0, Math.round(r.helpers))) : team ? TEAM_HELPERS[team.id] : 0;
  return {
    service: svc?.id ?? '',
    kind: KINDS.some((k) => k.id === r.kind) ? (r.kind as KindId) : '',
    size: PROPERTY_SIZES.some((s) => s.id === r.size) ? (r.size as SizeId) : '',
    team: team?.id ?? '',
    helpers,
    hours: typeof r.hours === 'number' && Number.isFinite(r.hours) ? Math.min(HOURS_MAX, Math.max(HOURS_MIN, Math.round(r.hours * 2) / 2)) : HOURS_MIN,
    extras: list(r.extras, EXTRAS),
    items: list(r.items, HEAVY_ITEMS),
    description: str(r.description, 1200),
    date: /^\d{4}-\d{2}-\d{2}$/.test(str(r.date)) ? str(r.date) : '',
    time: /^\d{2}:\d{2}$/.test(str(r.time)) ? str(r.time) : '',
    from: stop(r.from),
    to: stop(r.to),
    access: str(r.access, 600),
    name: str(r.name, 80).trim(),
    phone: str(r.phone, 24),
    email: str(r.email, 120).trim().toLowerCase(),
    notes: str(r.notes, 1200),
    noteChips: list(r.noteChips, NOTE_CHIPS),
    consent: r.consent === true,
  };
}

/* ---------- summaries ---------- */

/** The rows used by the summary card, the review step, emails and /track. */
export function summaryRows(d: Draft): { label: string; value: string }[] {
  const svc = serviceById(d.service);
  const rows: { label: string; value: string }[] = [];
  if (svc) rows.push({ label: 'Service', value: svc.name });
  const size = PROPERTY_SIZES.find((s) => s.id === d.size);
  if (svc?.property && d.kind && size) rows.push({ label: 'Property', value: `${KINDS.find((k) => k.id === d.kind)?.label} · ${size.label}` });
  const team = teamById(d.team);
  if (svc?.mode === 'hourly' && !isTwoVans(d) && team) rows.push({ label: 'Van & crew', value: `${teamLabel(team.id, d.helpers)} × ${hoursText(d.hours)}` });
  if (d.items.length) rows.push({ label: 'Heavy items', value: d.items.join(', ') });
  if (d.date) rows.push({ label: 'Date & time', value: `${formatDate(d.date)}${d.time ? `, ${slotLabel(d.time)}` : ''}` });
  if (d.from.postcode) rows.push({ label: oneAddress(d) ? 'Address' : 'From', value: addressText(d.from) });
  if (!oneAddress(d) && d.to.postcode) rows.push({ label: 'To', value: addressText(d.to) });
  return rows;
}

export const addressText = (s: Stop) => [s.line, s.town, s.postcode ? formatPostcode(s.postcode) : ''].filter(Boolean).join(', ');

/** Floor, lift and parking for one address, in one line. */
export const accessText = (s: Stop) => [s.floor && `${s.floor === 'Ground' ? 'Ground' : s.floor} floor`, s.lift && `lift: ${s.lift}`, s.parking && `parking: ${s.parking}`].filter(Boolean).join(' · ');

/** Policies shown at the review step and in the emails (kit/site-facts.ts BOOKING_POLICIES). */
export { BOOKING_POLICIES };

/** Booking FAQ for /book. Every answer is built from site-facts. */
export const helperRateText = `£${HELPER_RATE}/hr for each extra helper`;
