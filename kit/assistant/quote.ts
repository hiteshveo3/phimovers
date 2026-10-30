// The guide price the assistant shows. Built only from Phi's published hourly rates (site-facts.ts)
// and the guide-price maths (estimate.ts, the same figures as the pricing calculator), so the chat can
// never quote a number the website does not. The server signs every quote it makes; the quote request
// route re-prices from the inputs and trusts nothing from the browser.

import { ACCESS, DIST, SIZES } from '../estimate';
import { HELPER_RATE, MIN_HOURS as RATE_MIN_HOURS, RATES } from '../site-facts';
import { JOBS, QUOTE_HREF } from './config';
import { dateBookable, SLOTS, slotLabel } from './dates';

export type VanId = 'small' | 'transit' | 'luton';
export type JobId = (typeof JOBS)[number]['id'];
export type SizeId = (typeof SIZES)[number]['id'];
export type AccessId = (typeof ACCESS)[number]['id'];
export type DistId = (typeof DIST)[number]['id'];
export type KindId = 'flat' | 'house';

export { SLOTS };
export const timeLabel = (t?: string) => (t ? slotLabel(t) : '');

/** Crew that goes with each van, as in the size guide: small van alone, Transit + 1 helper, Luton + 2 helpers. */
export const CREWS: Record<VanId, { helpers: number; label: string; short: string }> = {
  small: { helpers: 0, label: 'Small van, driver only', short: 'Small van' },
  transit: { helpers: 1, label: 'Transit van + 1 helper', short: 'Transit + 1' },
  luton: { helpers: 2, label: 'Luton van + 2 helpers', short: 'Luton + 2' },
};
export const VAN_IDS = Object.keys(CREWS) as VanId[];

export type QuoteInput = {
  job: JobId;
  size?: SizeId;
  kind?: KindId;
  van?: VanId;
  hours?: number;
  access?: AccessId;
  distance?: DistId;
  from?: string;
  to?: string;
  day?: string;
  time?: string;
  items?: string;
};

export type QuoteLine = { label: string; amount: number };

/**
 * hourly: van + crew + hours, adjustable on the card.
 * call: office moves and 4-5 bedroom homes, quoted individually by the team.
 */
export type QuoteMode = 'hourly' | 'call';

export type Quote = Required<Pick<QuoteInput, 'job' | 'van' | 'hours'>> & Omit<QuoteInput, 'job' | 'van' | 'hours'> & {
  mode: QuoteMode;
  title: string;
  vanLabel: string;
  sizeLabel?: string;
  /** Quoted individually: no total. */
  onCall: boolean;
  total: number;
  /** Kept for the card; always equal to total. */
  totalHigh: number;
  /** Price of the first two hours, and the hourly rate for the crew. */
  base: number;
  hourly: number;
  lines: QuoteLine[];
  sig?: string;
};

export const MIN_HOURS = RATE_MIN_HOURS;
export const MAX_HOURS = 10;

const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*(\d[A-Z]{2})?$/i;

const vanFor = (size: SizeId | undefined, small: boolean): VanId => {
  if (size === 'item') return 'small';
  if (size === 'studio' || size === '1bed') return 'transit';
  if (size === '2bed' || size === '3bed' || size === '45bed') return 'luton';
  return small ? 'small' : 'transit';
};

export const roundHalf = (n: number) => Math.ceil(n * 2) / 2;

const clean = (v: unknown, max = 80) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, max) : undefined);
const pick = <T extends string>(v: unknown, list: readonly T[]): T | undefined => (list.includes(v as T) ? (v as T) : undefined);

/** Turns untrusted input (model tool call, browser) into a valid QuoteInput. */
export function normaliseInput(raw: Record<string, unknown>): QuoteInput {
  const job = pick(raw.job, JOBS.map((j) => j.id)) ?? 'home';
  const size = pick(raw.size, SIZES.map((s) => s.id));
  const kind = pick(raw.kind, ['flat', 'house'] as const);
  const van = pick(raw.van, VAN_IDS);
  const access = pick(raw.access, ACCESS.map((a) => a.id));
  const distance = pick(raw.distance, DIST.map((d) => d.id));
  const hours = typeof raw.hours === 'number' && Number.isFinite(raw.hours) ? Math.min(MAX_HOURS, Math.max(MIN_HOURS, roundHalf(raw.hours))) : undefined;
  const from = clean(raw.from, 10)?.toUpperCase();
  const to = clean(raw.to, 10)?.toUpperCase();
  const day = typeof raw.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.day) && dateBookable(raw.day) ? raw.day : undefined;
  const time = pick(raw.time, SLOTS);
  return {
    job,
    size,
    kind,
    van,
    hours,
    access,
    distance,
    from: from && POSTCODE.test(from) ? from : undefined,
    to: to && POSTCODE.test(to) ? to : undefined,
    day,
    time,
    items: clean(raw.items, 160),
  };
}

/** Works out a quote. Hours default to the typical time for the size, access and distance. */
export function priceQuote(input: QuoteInput): Quote {
  const size = SIZES.find((s) => s.id === input.size);
  const job = JOBS.find((j) => j.id === input.job) ?? JOBS[0];
  const small = job.id === 'single' || job.id === 'man-van' || job.id === 'student';
  const van = input.van ?? vanFor(input.size, small);
  const rate = RATES.find((r) => r.id === van) ?? RATES[1];
  const crew = CREWS[van];
  const hourly = rate.hourly + crew.helpers * HELPER_RATE;
  const base = hourly * MIN_HOURS;
  const mode: QuoteMode = job.id === 'office' || (job.id !== 'single' && size?.quoted) ? 'call' : 'hourly';
  const extra = (size?.hours ?? 0) + (ACCESS.find((a) => a.id === input.access)?.add ?? 0) + (DIST.find((d) => d.id === input.distance)?.add ?? 0);
  const hours = Math.min(MAX_HOURS, Math.max(MIN_HOURS, input.hours ?? roundHalf(MIN_HOURS + extra)));
  const shared = { ...input, job: job.id, van, hours, mode, title: job.label, vanLabel: crew.label, sizeLabel: size?.label, base, hourly };

  if (mode === 'call') return { ...shared, onCall: true, total: 0, totalHigh: 0, lines: [] };
  const time = Math.max(0, hours - MIN_HOURS) * hourly;
  const lines: QuoteLine[] = [{ label: `${crew.short}, first ${MIN_HOURS} hours`, amount: base }];
  if (time > 0) lines.push({ label: `${hours - MIN_HOURS} more ${hours - MIN_HOURS === 1 ? 'hour' : 'hours'} at £${hourly}/hr`, amount: time });
  const total = base + time;
  return { ...shared, onCall: false, total, totalHigh: total, lines };
}

/** The fields that decide the price, in a fixed order, so the signature is stable. */
export function quoteKey(q: Quote): string {
  return JSON.stringify([q.job, q.size ?? '', q.kind ?? '', q.van, q.hours, q.access ?? '', q.distance ?? '', q.from ?? '', q.to ?? '', q.day ?? '', q.time ?? '', q.mode, q.total]);
}

export const money = (n: number) => `£${n.toLocaleString('en-GB', Number.isInteger(n) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const priceText = (q: Quote) => (q.onCall ? 'Quoted individually' : money(q.total));

/** One line the model can read back. */
export function quoteSummary(q: Quote): string {
  const bits = [q.title, q.sizeLabel, q.mode === 'hourly' ? q.vanLabel : '', q.mode === 'hourly' ? `${q.hours} hours` : '', q.from && q.to ? `${q.from} to ${q.to}` : '', q.day ?? '', timeLabel(q.time)].filter(Boolean);
  return `${bits.join(', ')}: ${priceText(q)}`;
}

/** The quote form on the contact page (the assistant's own request form sits on the price card). */
export const quoteHref = (_q?: Quote) => QUOTE_HREF;
