// Server only. The email code a guest types at the review step, and the 30-day device session it opens.
// After Alpha's booking/server.ts: the code is never stored, the signed challenge proves it; the session
// is a signed, HttpOnly cookie that carries only the verified address. Signed with BOOKING_SECRET, or a key
// derived from a secret the server already has (as lib/assistant/env.ts does), so no extra setup is needed.

import { createHash, createHmac, randomInt, timingSafeEqual } from 'node:crypto';

const prod = process.env.NODE_ENV === 'production';

function secret(): string {
  const explicit = process.env.BOOKING_SECRET?.trim();
  if (explicit) return explicit;
  const base = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() || process.env.ASSISTANT_SECRET?.trim();
  if (base) return createHash('sha256').update(`phi-movers-booking|${base}`).digest('hex');
  return prod ? '' : 'phi-movers-booking-dev-only-secret';
}

export const hasSecret = () => Boolean(secret());

const b64 = (s: string) => Buffer.from(s).toString('base64url');
const unb64 = (s: string) => Buffer.from(s, 'base64url').toString();
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export const CODE_MINUTES = 10;

/** A six-digit code plus a signed challenge that proves it for ten minutes. */
export function newCode(email: string) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const exp = Date.now() + CODE_MINUTES * 60_000;
  const body = b64(JSON.stringify({ e: email, exp }));
  return { code, challenge: `${body}.${sign(`code|${body}|${code}`)}` };
}

export function checkCode(challenge: string, email: string, code: string) {
  if (!secret()) return false;
  const [body, mac] = String(challenge).split('.');
  if (!body || !mac || !/^\d{6}$/.test(code)) return false;
  try {
    const { e, exp } = JSON.parse(unb64(body)) as { e: string; exp: number };
    return e === email && Date.now() < exp && same(mac, sign(`code|${body}|${code}`));
  } catch {
    return false;
  }
}

/* ---------- session cookie ---------- */

export const SESSION_COOKIE = 'phi_booking';
const SESSION_DAYS = 30;

export function sessionCookie(email: string) {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const body = b64(JSON.stringify({ e: email, exp }));
  return `${SESSION_COOKIE}=${body}.${sign(`session|${body}`)}; Path=/; Max-Age=${SESSION_DAYS * 86_400}; HttpOnly; SameSite=Lax${prod ? '; Secure' : ''}`;
}
export const clearSessionCookie = () => `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${prod ? '; Secure' : ''}`;

function readCookie(req: Request, name: string): string | null {
  for (const part of (req.headers.get('cookie') ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

/** The verified address in the session cookie, or null when it is missing, forged or expired. */
export function sessionEmail(req: Request): string | null {
  const raw = readCookie(req, SESSION_COOKIE);
  if (!secret() || !raw) return null;
  const [body, mac] = raw.split('.');
  if (!body || !mac || !same(mac, sign(`session|${body}`))) return null;
  try {
    const { e, exp } = JSON.parse(unb64(body)) as { e: string; exp: number };
    return Date.now() < exp && typeof e === 'string' ? e : null;
  } catch {
    return null;
  }
}

/* ---------- signed links (resume a draft, track a booking) ---------- */

/** A short signed token for [value], so a link can carry an id without it being guessable. */
export const linkToken = (value: string) => sign(`link|${value}`).slice(0, 22);
export const checkLinkToken = (value: string, token: string) => Boolean(secret()) && same(linkToken(value), String(token));
