// POST { email } -> emails a six-digit code and returns the signed challenge that proves it.
// Development without a mail provider shows the code on the page so the flow can be tested.

import { EMAIL_RE } from '../../../../lib/booking-flow/model';
import { clientIp, jsonReply, readBody, tooMany } from '../../../../lib/booking-flow/server';
import { emailCode } from '../../../../lib/booking-flow/emails';
import { CODE_MINUTES, hasSecret, newCode } from '../../../../lib/booking-flow/verify';
import { isMailConfigured } from '../../../../lib/email/send';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const dev = process.env.NODE_ENV !== 'production';

export async function POST(req: Request) {
  if (!hasSecret() || !(isMailConfigured() || dev)) return jsonReply({ error: 'unavailable' }, 503);
  const body = await readBody<{ email?: string }>(req, 2_000);
  const email = String(body?.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 120) return jsonReply({ error: 'email' }, 400);
  if ((await tooMany(`code:ip:${clientIp(req)}`, 8, 900)) || (await tooMany(`code:${email}`, 5, 900))) return jsonReply({ error: 'limited' }, 429);
  const { code, challenge } = newCode(email);
  try {
    const sent = await emailCode(email, code, CODE_MINUTES);
    return jsonReply({ challenge, ...(dev && !sent ? { devCode: code } : {}) });
  } catch (err) {
    console.error('booking code not sent', err);
    return jsonReply({ error: 'send' }, 502);
  }
}
