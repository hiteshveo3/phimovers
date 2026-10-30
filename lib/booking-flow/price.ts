// Price adapter for the booking flow, the quote form and the chat checkout: a thin layer over the one
// price model, quotePrice() in kit/estimate.ts, so /book, /api/booking and the calculator never disagree.

import { quotePrice } from '../../kit/estimate';
import { FREE_MILES, MIN_HOURS, PER_MILE, RATES, type Rate } from '../../kit/site-facts';

export type VanId = Rate['id'];

export const rateFor = (van: VanId | string | undefined | null): Rate | undefined => RATES.find((r) => r.id === van);

/** Starts at or after 7pm carry the published evening rate. */
export const isEvening = (time?: string) => Boolean(time && time >= '19:00');

/** Van and driver plus each extra helper (plus the evening rate), per hour. */
export const crewHourly = (van: VanId, helpers: number, time?: string) => quotePrice({ van, hours: MIN_HOURS, helpers, evening: isEvening(time) }).hourly;

/** The first MIN_HOURS hours, then the hourly crew rate in 30-minute steps. */
export function timePrice(van: VanId, helpers: number, hours: number, time?: string): { base: number; extraHours: number; extra: number; hourly: number; total: number } {
  const p = quotePrice({ van, hours, helpers, evening: isEvening(time) });
  const base = p.hourly * MIN_HOURS;
  return { base, extraHours: p.hours - MIN_HOURS, extra: Math.round((p.total - base) * 100) / 100, hourly: p.hourly, total: p.total };
}

export const MILEAGE_NOTE = `First ${FREE_MILES} miles free, then £${PER_MILE.toFixed(2)} a mile`;
