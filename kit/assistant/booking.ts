// The few details the price card's "Get a quote" form collects, and their checks. The same checks run
// in the browser (to show errors early) and in /api/chat/book (which decides).

import { isEmail } from './config';
import { dateBookable, SLOTS } from './dates';
import { type Quote } from './quote';

export type Stop = { postcode: string; line: string };
export const emptyStop = (): Stop => ({ postcode: '', line: '' });

export type Details = {
  date: string;
  time: string;
  from: Stop;
  to: Stop;
  name: string;
  phone: string;
  email: string;
  notes: string;
  consent: boolean;
};

export type Errors = Record<string, string>;

export const emptyDetails = (q: Quote): Details => ({
  date: q.day ?? '',
  time: q.time ?? '',
  from: { ...emptyStop(), postcode: q.from ?? '' },
  to: { ...emptyStop(), postcode: q.to ?? '' },
  name: '',
  phone: '',
  email: '',
  notes: '',
  consent: false,
});

const POSTCODE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/;

export function normalisePhone(raw: string): string | null {
  let d = raw.replace(/[\s\-().]/g, '');
  if (d.startsWith('+44')) d = `0${d.slice(3)}`;
  else if (d.startsWith('0044')) d = `0${d.slice(4)}`;
  if (!/^0\d{9,10}$/.test(d)) return null;
  return d.startsWith('07') && d.length === 11 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000b-\u001f<>]/g, ' ').trim().slice(0, max) : '');
const stop = (v: unknown): Stop => {
  const r = (v ?? {}) as Partial<Stop>;
  return { postcode: text(r.postcode, 10), line: text(r.line, 120) };
};

/** Cleans what the browser sent into the shape this module expects. */
export function cleanDetails(raw: unknown): Details {
  const r = (raw ?? {}) as Partial<Details>;
  return {
    date: text(r.date, 10),
    time: text(r.time, 5),
    from: stop(r.from),
    to: stop(r.to),
    name: text(r.name, 80),
    phone: text(r.phone, 24),
    email: text(r.email, 120),
    notes: text(r.notes, 1000),
    consent: r.consent === true,
  };
}

/** What the form needs: a name, a phone we can call, a pick-up postcode, and a valid drop-off postcode if one is given. */
export function validateDetails(q: Quote, d: Details): Errors {
  const e: Errors = {};
  if (d.name.length < 2) e.name = 'required';
  if (!normalisePhone(d.phone)) e.phone = 'phone';
  if (d.email && !isEmail(d.email)) e.email = 'email';
  if (!POSTCODE.test(d.from.postcode.trim())) e['from.postcode'] = 'postcode';
  if (q.job !== 'single' && d.to.postcode.trim() && !POSTCODE.test(d.to.postcode.trim())) e['to.postcode'] = 'postcode';
  if (d.date && !dateBookable(d.date)) e.date = 'required';
  if (d.time && !SLOTS.includes(d.time)) e.time = 'required';
  if (!d.consent) e.consent = 'consent';
  return e;
}
