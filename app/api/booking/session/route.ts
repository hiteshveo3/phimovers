// GET: the verified address on this device and what the booking backend can do right now.
// DELETE: sign this device out.
//   store: bookings can be saved (Firebase Admin). codes: guests verify their email before sending.
//   mailer: confirmations go out by email.

import { jsonReply, storeReady } from '../../../../lib/booking-flow/server';
import { clearSessionCookie, hasSecret, sessionEmail } from '../../../../lib/booking-flow/verify';
import { isMailConfigured } from '../../../../lib/email/send';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const mailer = isMailConfigured();
  return jsonReply({ email: sessionEmail(req), store: storeReady(), codes: mailer && hasSecret(), mailer });
}

export async function DELETE() {
  return jsonReply({ email: null }, 200, { 'Set-Cookie': clearSessionCookie() });
}
