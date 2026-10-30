// /track lookups.
// POST { reference, phone } -> one booking (PHI-XXXXXX) or quote request (track code), no sign-in needed.
// GET -> every booking and quote request made with the verified email on this device (code session).

import { getAdminDb } from '../../../../lib/firebase/admin';
import { clientIp, jsonReply, readBody, storeReady, tooMany } from '../../../../lib/booking-flow/server';
import { findByEmail, findByReference } from '../../../../lib/booking-flow/track';
import { sessionEmail } from '../../../../lib/booking-flow/verify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!storeReady()) return jsonReply({ error: 'unavailable' }, 503);
  const email = sessionEmail(req);
  if (!email) return jsonReply({ error: 'signin' }, 401);
  return jsonReply({ email, items: await findByEmail(getAdminDb(), email) });
}

export async function POST(req: Request) {
  if (!storeReady()) return jsonReply({ error: 'unavailable' }, 503);
  if (await tooMany(`find:ip:${clientIp(req)}`, 10, 900)) return jsonReply({ error: 'limited' }, 429);
  const body = await readBody<{ reference?: string; phone?: string }>(req, 2_000);
  const reference = String(body?.reference ?? '');
  const phone = String(body?.phone ?? '');
  if (!reference.trim() || phone.replace(/\D/g, '').length < 10) return jsonReply({ error: 'invalid' }, 400);
  const item = await findByReference(getAdminDb(), reference, phone);
  return item ? jsonReply({ items: [item] }) : jsonReply({ error: 'notfound' }, 404);
}
