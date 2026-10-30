// POST { email, code, challenge } -> signs this device in for 30 days (an HttpOnly cookie with the
// verified address), for booking on /book and finding bookings on /track.

import { clientIp, jsonReply, readBody, tooMany } from '../../../../lib/booking-flow/server';
import { checkCode, sessionCookie } from '../../../../lib/booking-flow/verify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await readBody<{ email?: string; code?: string; challenge?: string }>(req, 4_000);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const code = String(body?.code ?? '').replace(/\D/g, '');
  const challenge = String(body?.challenge ?? '');
  if ((await tooMany(`verify:ip:${clientIp(req)}`, 12, 900)) || (await tooMany(`verify:${email}`, 8, 900))) return jsonReply({ error: 'limited' }, 429);
  if (!checkCode(challenge, email, code)) return jsonReply({ error: 'code' }, 400);
  return jsonReply({ email }, 200, { 'Set-Cookie': sessionCookie(email) });
}
