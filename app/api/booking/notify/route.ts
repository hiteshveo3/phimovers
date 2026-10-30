// POST { bookingId, event } (staff only) -> emails the customer about a change the office just made:
// confirmed, repriced, moved, cancelled, crew, completed. The dashboard calls it next to each notifyUser
// in lib/bookings/service.ts. Each event is sent at most once per booking per value (an emailLog on the
// booking), so a double click or a retry never sends twice.

import type { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../../../../lib/firebase/admin';
import { requireStaff } from '../../../../lib/admin/require-staff';
import { jsonReply, readBody } from '../../../../lib/booking-flow/server';
import { STATUS_EVENTS, emailBookingEvent, type StatusEvent } from '../../../../lib/email/booking-status';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const staff = await requireStaff(req);
  if (!staff.ok) return jsonReply({ error: staff.error }, staff.status);
  const body = await readBody<{ bookingId?: string; event?: string }>(req, 2_000);
  const id = String(body?.bookingId ?? '');
  const event = String(body?.event ?? '') as StatusEvent;
  if (!/^[A-Za-z0-9]{8,40}$/.test(id) || !STATUS_EVENTS.includes(event) || event === 'reminder') return jsonReply({ error: 'invalid' }, 400);

  const ref = getAdminDb().collection('bookings').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return jsonReply({ error: 'notfound' }, 404);
  const b = snap.data() as Record<string, unknown>;
  // One email per event and value: a re-price to the same total, or the same crew twice, is not resent.
  const key = `${event}:${event === 'repriced' ? b.totalPrice : event === 'crew' ? b.moverId : event === 'moved' ? String((b.scheduledDate as { toMillis?: () => number })?.toMillis?.() ?? '') : ''}`;
  const safeKey = key.replace(/[^A-Za-z0-9_:-]/g, '_');
  const log = (b.emailLog ?? {}) as Record<string, unknown>;
  if (log[safeKey]) return jsonReply({ ok: true, sent: false, reason: 'already' });
  try {
    const sent = await emailBookingEvent(b, event);
    if (sent) await ref.update({ [`emailLog.${safeKey}`]: FieldValue.serverTimestamp() });
    return jsonReply({ ok: true, sent });
  } catch (err) {
    console.error('booking event email failed', err);
    return jsonReply({ error: 'send' }, 502);
  }
}
