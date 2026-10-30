// A job holds its window of the day: [start, start + hours) in 30-minute cells of the London clock, at
// least the two-hour minimum. Pure logic, shared by the time picker (to grey out starts that would
// overlap), the slots API and the submit transaction (which refuses a start when the cells are full).
// After Alpha's src/booking/slot-cells.ts. Phi runs more than one crew, so a cell is full when it holds
// SLOT_CAPACITY live jobs; the default of one keeps Alpha's "one job at a time" until the office says more.

import { MIN_HOURS } from '../../kit/site-facts';

export const CELL_MINUTES = 30;
const DAY_MINUTES = 24 * 60;

/** Jobs that may run at the same time. BOOKING_SLOT_CAPACITY on the server; the browser only greys out. */
export const SLOT_CAPACITY = Math.max(1, Number(process.env.BOOKING_SLOT_CAPACITY ?? process.env.NEXT_PUBLIC_BOOKING_SLOT_CAPACITY ?? 1) || 1);

/** '1030' for 10:30. */
export const cellKey = (minute: number): string => `${String(Math.floor(minute / 60)).padStart(2, '0')}${String(minute % 60).padStart(2, '0')}`;

/** The hours a job holds: what it is booked for, at least the minimum. */
export function windowHours(hours: unknown): number {
  const h = typeof hours === 'number' ? hours : typeof hours === 'string' ? Number(hours) : NaN;
  return Number.isFinite(h) && h > MIN_HOURS ? h : MIN_HOURS;
}

/** The cells of a job starting at [startMinute] for [hours]. A window stops at midnight. */
export function cellsFrom(startMinute: number, hours: unknown): string[] {
  if (!Number.isFinite(startMinute) || startMinute < 0 || startMinute >= DAY_MINUTES) return [];
  const first = Math.floor(startMinute / CELL_MINUTES) * CELL_MINUTES;
  const end = Math.min(DAY_MINUTES, startMinute + Math.ceil((windowHours(hours) * 60) / CELL_MINUTES) * CELL_MINUTES);
  const out: string[] = [];
  for (let t = first; t < end; t += CELL_MINUTES) out.push(cellKey(t));
  return out;
}

/** '10:30 AM', '2 PM' or '14:30' as minutes past midnight; null otherwise. */
export function labelMinute(label: unknown): number | null {
  const m = /^\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*$/i.exec(typeof label === 'string' ? label : '');
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (m[3]) {
    if (h < 1 || h > 12) return null;
    h = (h % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  } else if (m[2] === undefined) return null;
  return h < 24 && min < 60 ? h * 60 + min : null;
}

const LONDON = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });

/** London calendar day ("YYYY-MM-DD") and minute of an instant. */
export function londonParts(ms: number): { date: string; minute: number } {
  const p = Object.fromEntries(LONDON.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minute: (Number(p.hour) % 24) * 60 + Number(p.minute) };
}

/** The UTC instant of 00:00 London time on [date]. */
export function londonMidnight(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, 0);
  // London is UTC or UTC+1: the offset at the guess is right except within an hour of a change, which a
  // move never starts in.
  const p = londonParts(guess);
  const shown = Date.UTC(Number(p.date.slice(0, 4)), Number(p.date.slice(5, 7)) - 1, Number(p.date.slice(8, 10)), Math.floor(p.minute / 60), p.minute % 60);
  return guess - (shown - guess);
}

/** A stored booking's scheduledDate (Timestamp, Date, ISO string or millis) as a London day. */
export function dayOf(scheduledDate: unknown, scheduledDay?: unknown): string | null {
  if (typeof scheduledDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(scheduledDay)) return scheduledDay;
  let ms = NaN;
  if (typeof scheduledDate === 'number') ms = scheduledDate;
  else if (typeof scheduledDate === 'string') ms = /^\d{4}-\d{2}-\d{2}$/.test(scheduledDate) ? Date.parse(`${scheduledDate}T12:00:00Z`) : Date.parse(scheduledDate);
  else if (scheduledDate instanceof Date) ms = scheduledDate.getTime();
  else if (scheduledDate && typeof scheduledDate === 'object' && 'toMillis' in scheduledDate) ms = (scheduledDate as { toMillis(): number }).toMillis();
  return Number.isFinite(ms) ? londonParts(ms).date : null;
}

/** A booking still holds its time unless it is cancelled. */
export const holdsTime = (status: unknown) => status !== 'cancelled';

/** The day and cells a stored booking holds now, or null when it holds none (cancelled, or no start time). */
export function windowOf(row: Record<string, unknown> | null | undefined): { date: string; cells: string[] } | null {
  if (!row || !holdsTime(row.status)) return null;
  const date = dayOf(row.scheduledDate, row.scheduledDay);
  const minute = typeof row.startTime === 'string' ? labelMinute(row.startTime) : labelMinute(row.scheduledTime);
  if (!date || minute === null) return null;
  const cells = cellsFrom(minute, row.hours);
  return cells.length ? { date, cells } : null;
}

/** How many live jobs hold each cell of a day, from the day's bookings. */
export function cellLoad(rows: { id: string; data: Record<string, unknown> }[], date: string, skipId = ''): Map<string, number> {
  const load = new Map<string, number>();
  for (const r of rows) {
    if (r.id === skipId) continue;
    const w = windowOf(r.data);
    if (!w || w.date !== date) continue;
    for (const c of w.cells) load.set(c, (load.get(c) ?? 0) + 1);
  }
  return load;
}

/** The cells that are full: no other job may start over them. */
export const fullCells = (load: Map<string, number>, capacity = SLOT_CAPACITY) => [...load.entries()].filter(([, n]) => n >= capacity).map(([c]) => c).sort();

/** True when a job starting at [time] for [hours] fits around the full cells. */
export function timeFits(time: string, hours: number, full: string[]): boolean {
  const minute = labelMinute(time);
  if (minute === null) return false;
  return !cellsFrom(minute, hours).some((c) => full.includes(c));
}
