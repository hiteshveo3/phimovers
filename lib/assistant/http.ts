// Shared request helpers for the /api/chat routes: JSON replies, the anonymous session cookie, rate limits.

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { chatReady, env } from './env';
import { allow } from './store';
import { ensureUser, hashId, type UserRecord } from './users';

export type ErrorCode =
  | 'notConfigured' | 'signIn' | 'busy' | 'invalid' | 'slow' | 'unavailable' | 'empty'
  | 'noSpeech' | 'tooLong' | 'tooShort' | 'refused';

export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers } });

export const fail = (error: ErrorCode, status = 400, headers: Record<string, string> = {}) => json({ error }, status, headers);

/** Signs a chat price. The "chat|" prefix keeps these apart from the session cookie signature. */
export const sign = (value: string) => createHmac('sha256', env.secret).update(`chat|${value}`).digest('base64url');

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local';
}

/* ---------------------------------------------------------------- session cookie */

const COOKIE = 'phi_chat';
const MAX_AGE = 60 * 60 * 24 * 365;
const mac = (id: string) => createHmac('sha256', env.secret).update(`session|${id}`).digest('base64url').slice(0, 24);

function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get('cookie') ?? '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

const cookieHeader = (id: string) => `${COOKIE}=${id}.${mac(id)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; SameSite=Lax${env.prod ? '; Secure' : ''}`;
export const clearCookie = () => `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${env.prod ? '; Secure' : ''}`;

/** The session id in the cookie when its signature is valid. */
function sessionId(req: Request): string | null {
  const value = readCookie(req, COOKIE);
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot < 8) return null;
  const id = value.slice(0, dot);
  return /^[A-Za-z0-9_-]{16,64}$/.test(id) && safeEqual(value.slice(dot + 1), mac(id)) ? id : null;
}

export type Auth = { user: UserRecord; headers: Record<string, string> };

/** The visitor's chat session, created on first use. Or a ready-made error response. */
export async function requireUser(req: Request): Promise<Auth | { response: Response }> {
  if (!chatReady()) return { response: fail('notConfigured', 503) };
  let id = sessionId(req);
  const headers: Record<string, string> = {};
  if (!id) {
    id = randomBytes(18).toString('base64url');
    headers['Set-Cookie'] = cookieHeader(id);
  }
  try {
    return { user: await ensureUser(id), headers };
  } catch {
    return { response: fail('unavailable', 503) };
  }
}

/** The existing session without creating one (for "delete my data"). */
export const existingSessionId = sessionId;

/** Rate limit by session and by IP. */
export async function limited(req: Request, kind: string, who: string, perWho: number, perIp: number, windowSeconds: number): Promise<boolean> {
  try {
    const [a, b] = await Promise.all([
      allow(`${kind}:${who}`, perWho, windowSeconds),
      allow(`${kind}:ip:${hashId(clientIp(req))}`, perIp, windowSeconds),
    ]);
    return !(a && b);
  } catch {
    return false;
  }
}

export async function readJson<T>(req: Request, maxBytes = 64_000): Promise<T | null> {
  const len = Number(req.headers.get('content-length') ?? 0);
  if (len > maxBytes) return null;
  try {
    const text = await req.text();
    if (text.length > maxBytes) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
