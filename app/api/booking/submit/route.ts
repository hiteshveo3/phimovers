// POST { draft, source?, bookingId?, photos?, paymentMethod? } -> validates every step again, prices it from
// the rate card, claims a number and the time in one transaction, stores it and emails both sides.
// 400 { errors } (the step with the problem), 401 signin (verify the email first), 409 slotTaken,
// 429 too many, 503 unavailable (the page falls back to email / WhatsApp, never a silent success).

import { firebaseCaller } from '../../../../lib/booking-flow/auth';
import { cleanDraft, validateAll } from '../../../../lib/booking-flow/model';
import { clientIp, createBooking, jsonReply, readBody, storeReady, tooMany } from '../../../../lib/booking-flow/server';
import { hasSecret, sessionEmail } from '../../../../lib/booking-flow/verify';
import { isMailConfigured } from '../../../../lib/email/send';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  draft?: unknown;
  source?: string;
  bookingId?: string;
  photos?: { urls?: unknown; paths?: unknown };
  paymentMethod?: string;
};

export async function POST(req: Request) {
  if (!storeReady()) return jsonReply({ error: 'unavailable' }, 503);
  const body = await readBody<Body>(req);
  if (!body) return jsonReply({ error: 'invalid' }, 400);
  if (await tooMany(`submit:ip:${clientIp(req)}`, 6, 900)) return jsonReply({ error: 'limited' }, 429);

  const draft = cleanDraft(body.draft);
  const caller = await firebaseCaller(req);
  if (caller) {
    // A signed-in customer books under their account; a verified address replaces what was typed.
    if (caller.verifiedEmail) draft.email = caller.verifiedEmail;
    else if (!draft.email && caller.email) draft.email = caller.email;
  } else {
    const verified = sessionEmail(req);
    // Codes need a mail provider; without one the request still goes through, rate-limited by connection.
    const codes = isMailConfigured() && hasSecret();
    if (codes && !verified) return jsonReply({ error: 'signin' }, 401);
    if (verified) draft.email = verified;
  }
  if (draft.email && (await tooMany(`submit:email:${draft.email}`, 5, 3600))) return jsonReply({ error: 'limited' }, 429);

  const errors = validateAll(draft);
  if (Object.keys(errors).length) return jsonReply({ error: 'invalid', errors }, 400);

  // Photos only from a signed-in customer, and only from their own folder for this booking id.
  let photos: { urls: string[]; paths: string[] } | undefined;
  const bookingId = typeof body.bookingId === 'string' ? body.bookingId : undefined;
  if (caller && bookingId && Array.isArray(body.photos?.paths) && Array.isArray(body.photos?.urls)) {
    const prefix = `request_photos/${caller.uid}/${bookingId}/`;
    const paths = (body.photos.paths as unknown[]).filter((p): p is string => typeof p === 'string' && p.startsWith(prefix)).slice(0, 6);
    const urls = (body.photos.urls as unknown[]).filter((u): u is string => typeof u === 'string' && u.startsWith('https://firebasestorage.googleapis.com/')).slice(0, paths.length);
    if (paths.length && urls.length === paths.length) photos = { urls, paths };
  }
  const paymentMethod = body.paymentMethod === 'cash' || body.paymentMethod === 'card' ? body.paymentMethod : 'bank_transfer';

  const made = await createBooking(draft, { customerId: caller?.uid ?? '', bookingId: caller ? bookingId : undefined, photos, paymentMethod }, caller && body.source === 'portal' ? 'portal' : 'web');
  if (!made.ok) return jsonReply({ error: made.error }, made.status);
  return jsonReply({ reference: made.bookingNumber, id: made.id, emailed: made.emailed, email: draft.email, signedIn: Boolean(caller) });
}
