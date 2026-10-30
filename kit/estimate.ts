// The one price model. The calculator (homepage and /pricing), the service price cards, the booking page
// and the chat all price through quotePrice() below, built only from Phi's published rates in
// kit/site-facts.ts: van hourly rate plus £20/hr per helper, two-hour minimum then 30-minute steps, first
// FREE_MILES journey miles included then PER_MILE, and the published surcharges and add-ons.
// The size guide further down turns a home size into hours on the same rates. 4–5 bedroom homes have no
// guide price, so they are quoted individually.

import { DEPOSIT, FREE_MILES, HELPER_RATE, MIN_HOURS, PER_MILE, RATES, type Rate } from './site-facts';

export type VanId = Rate['id'];

/** Phi's published surcharges and labour add-ons (pricing page). */
export const EVENING_PER_HOUR = 10; // after 7pm, per hour
export const BANK_HOLIDAY_PCT = 0.2; // +20% on labour
export const ASSEMBLY_RATE = 25; // per hour, per mover
export const PACKING_RATE = 20; // per hour, per mover
export const MAX_HELPERS = 3;

/** Flat-priced access, timing and item extras, as published on the pricing page. */
export const ADD_ONS: { key: string; label: string; price: number }[] = [
  { key: 'sameday', label: 'Same-day urgent booking', price: 20 },
  { key: 'heavy', label: 'Heavy item (80kg+)', price: 25 },
  { key: 'fridge', label: 'American fridge / freezer', price: 30 },
  { key: 'carry', label: 'Carry distance over 30m', price: 15 },
  { key: 'nolift', label: 'No lift above 2nd floor', price: 15 },
  { key: 'extrastop', label: 'Extra collection / drop-off', price: 15 },
];

export type PriceInput = {
  van: VanId | string;
  hours: number;
  helpers?: number;
  miles?: number;
  evening?: boolean;
  bankHoliday?: boolean;
  assemblyHours?: number;
  packingHours?: number;
  /** ADD_ONS keys. */
  addOns?: string[];
};

export type PriceQuote = {
  rate: Rate;
  /** Billed hours: at least MIN_HOURS, then rounded up to the next 30 minutes. */
  hours: number;
  helpers: number;
  movers: number;
  /** Van + helpers (+ evening) per hour. */
  hourly: number;
  labour: number;
  bankHoliday: number;
  mileage: number;
  assembly: number;
  packing: number;
  addOns: number;
  total: number;
  /** Taken once the office confirms the date; comes off the final balance (DEPOSIT_TEXT). */
  deposit: number;
};

const money = (n: number) => Math.round(n * 100) / 100;
export const billedHours = (h: number) => Math.max(MIN_HOURS, Math.ceil((Number.isFinite(h) ? h : MIN_HOURS) * 2) / 2);
export const rateById = (id: string | null | undefined): Rate | undefined => RATES.find((r) => r.id === id);

/** The one price function: every figure the site shows for a van, crew and hours comes from here. */
export function quotePrice(input: PriceInput): PriceQuote {
  const rate = rateById(input.van) ?? RATES[1];
  const hours = billedHours(input.hours);
  const helpers = Math.max(0, Math.min(MAX_HELPERS, Math.round(input.helpers ?? 0)));
  const movers = 1 + helpers;
  const hourly = rate.hourly + helpers * HELPER_RATE + (input.evening ? EVENING_PER_HOUR : 0);
  const labour = hourly * hours;
  const bankHoliday = input.bankHoliday ? labour * BANK_HOLIDAY_PCT : 0;
  const mileage = Math.max(0, (input.miles ?? 0) - FREE_MILES) * PER_MILE;
  const assembly = Math.max(0, input.assemblyHours ?? 0) * ASSEMBLY_RATE * movers;
  const packing = Math.max(0, input.packingHours ?? 0) * PACKING_RATE * movers;
  const addOns = ADD_ONS.filter((a) => input.addOns?.includes(a.key)).reduce((t, a) => t + a.price, 0);
  const total = money(labour + bankHoliday + mileage + assembly + packing + addOns);
  return { rate, hours, helpers, movers, hourly, labour: money(labour), bankHoliday: money(bankHoliday), mileage: money(mileage), assembly, packing, addOns, total, deposit: DEPOSIT };
}

/** Van + helpers for the hours given, no extras: the rate-card figure. */
export const rateCardPrice = (van: VanId | string, hours: number, helpers = 0) => quotePrice({ van, hours, helpers }).total;

/** Hand-off to the public booking page, carrying the calculator's choice. */
/** Services the online booking flow can book. Every other service is quoted by the office, so its buttons open the quote form on /contact with the service filled in. */
const BOOKABLE = new Set([
  'house-removals', 'flat-removals', 'studio-moves', 'man-and-van', 'student-moves', 'office-removals',
  'single-item-delivery', 'sofa-delivery', 'furniture-assembly', 'full-packing-service', 'secure-storage',
]);

export function bookHref(o: { van?: string; hours?: number; helpers?: number; service?: string } = {}) {
  if (o.service && !BOOKABLE.has(o.service)) return `/contact?service=${encodeURIComponent(o.service)}#quote`;
  const q = new URLSearchParams();
  if (o.van) q.set('van', o.van);
  if (o.hours) q.set('hours', String(o.hours));
  if (o.helpers) q.set('helpers', String(o.helpers));
  if (o.service) q.set('service', o.service);
  const s = q.toString();
  return s ? `/book?${s}` : '/book';
}

export const gbp = (n: number) => `£${Number.isInteger(n) ? n : n.toFixed(2)}`;

const small = RATES[0];
const transit = RATES[1];
const luton = RATES[2];

export type SizeOption = { id: string; label: string; crew: string; base: number; hr: number; hours: number; quoted?: boolean; load: number };

const rateFor = (van: Rate, helpers: number) => quotePrice({ van: van.id, hours: MIN_HOURS, helpers }).hourly;

// hours = typical time beyond the two-hour minimum before access and distance are added.
// load = rough share of a Luton's load space, used for the capacity bar.
export const SIZES: SizeOption[] = [
  { id: 'item', label: 'Single item', crew: 'Small van, driver only', base: rateFor(small, 0) * MIN_HOURS, hr: rateFor(small, 0), hours: 0, load: 0.1 },
  { id: 'studio', label: 'Studio / room', crew: 'Transit van + 1 helper', base: rateFor(transit, 1) * MIN_HOURS, hr: rateFor(transit, 1), hours: 0.5, load: 0.3 },
  { id: '1bed', label: '1 bedroom', crew: 'Transit van + 1 helper', base: rateFor(transit, 1) * MIN_HOURS, hr: rateFor(transit, 1), hours: 1.5, load: 0.5 },
  { id: '2bed', label: '2 bedrooms', crew: 'Luton + 2 helpers', base: rateFor(luton, 2) * MIN_HOURS, hr: rateFor(luton, 2), hours: 2.5, load: 0.75 },
  { id: '3bed', label: '3 bedrooms', crew: 'Luton + 2 helpers', base: rateFor(luton, 2) * MIN_HOURS, hr: rateFor(luton, 2), hours: 4, load: 1 },
  { id: '45bed', label: '4–5 bedrooms', crew: 'Two Lutons', base: 0, hr: 0, hours: 0, quoted: true, load: 1 },
];

export const ACCESS = [
  { id: 'ground', label: 'Ground floor both ends', add: 0 },
  { id: 'lift', label: 'Lift at one end', add: 0.5 },
  { id: 'stairs', label: 'Stairs, 1–2 floors', add: 1 },
  { id: 'stairs3', label: 'Stairs, 3+ floors', add: 2 },
];

export const DIST = [
  { id: 'same', label: 'Same borough', add: 0 },
  { id: 'london', label: 'Across London', add: 1 },
  { id: 'm25', label: 'Outside the M25', add: 2 },
];

export const EXTRAS = [
  { id: 'packing', label: 'Packing service', price: 'Quoted separately', lo: 0, hi: 0 },
  { id: 'boxes', label: 'Boxes & materials', price: 'Quoted separately', lo: 0, hi: 0 },
  { id: 'dismantle', label: 'Dismantle & rebuild furniture', price: 'Quoted separately', lo: 0, hi: 0 },
];

export const round10 = (n: number) => Math.round(n / 10) * 10;

export type Estimate = {
  size: SizeOption;
  quoted: boolean;
  lo: number;
  hi: number;
  extraHours: number;
  totalHours: number;
  timeCost: number;
  range: string;
};

export function estimate(sizeIndex: number, accessIndex = 1, distIndex = 0, extras: number[] = []): Estimate {
  const size = SIZES[sizeIndex] ?? SIZES[2];
  const extraHours = size.hours + (ACCESS[accessIndex]?.add ?? 0) + (DIST[distIndex]?.add ?? 0);
  const mid = size.base + extraHours * size.hr;
  const extraLo = extras.reduce((t, i) => t + (EXTRAS[i]?.lo ?? 0), 0);
  const extraHi = extras.reduce((t, i) => t + (EXTRAS[i]?.hi ?? 0), 0);
  const lo = Math.max(size.base, round10(mid * 0.9)) + extraLo;
  const hi = round10(mid * 1.15) + extraHi;
  return {
    size,
    quoted: Boolean(size.quoted),
    lo,
    hi,
    extraHours,
    totalHours: MIN_HOURS + extraHours,
    timeCost: round10(extraHours * size.hr),
    range: size.quoted ? 'Quoted individually' : `£${lo}–£${hi}`,
  };
}

export const sizeIndexById = (id: string | undefined | null) => {
  const i = SIZES.findIndex((s) => s.id === id);
  return i >= 0 ? i : -1;
};
