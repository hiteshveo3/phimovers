// London dates and start times for the assistant's price card and quote request.
// Phi's office is open 7am to 9pm every day (HOURS in site-facts.ts), so starts run from 7am to 7:30pm.

import { HOURS } from '../site-facts';

const LAST_START = HOURS.close - 1.5;

/** Half-hour start times, 07:00 to 19:30. */
export const SLOTS: string[] = (() => {
  const out: string[] = [];
  for (let t = HOURS.open; t <= LAST_START; t += 0.5) out.push(`${String(Math.floor(t)).padStart(2, '0')}:${t % 1 ? '30' : '00'}`);
  return out;
})();

export const SLOT_GROUPS = [
  { label: 'Morning', from: '07:00', to: '12:00' },
  { label: 'Afternoon', from: '12:00', to: '17:00' },
  { label: 'Evening', from: '17:00', to: '20:00' },
] as const;

export const slotLabel = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${m ? `:${String(m).padStart(2, '0')}` : ''}${h < 12 ? 'am' : 'pm'}`;
};

/** London date (YYYY-MM-DD) and minutes past midnight, whatever the visitor's clock zone. */
export function londonNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const formatDate = (date: string, style: 'short' | 'long' = 'long') =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString(
    'en-GB',
    style === 'long' ? { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' } : { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' },
  );

export const BOOK_AHEAD_DAYS = 90;

/** Today up to 90 days ahead. */
export function dateBookable(date: string, now = new Date()) {
  const today = londonNow(now).date;
  return date >= today && date <= addDays(today, BOOK_AHEAD_DAYS);
}
