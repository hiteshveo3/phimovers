// Server only. The scheduled jobs under /api/cron/*: Vercel Cron calls them with
// "Authorization: Bearer $CRON_SECRET". Without CRON_SECRET they refuse to run.
//   reminders  daily: the day-before reminder for confirmed bookings (once each)
//   reviews    daily: the thank-you and review request a day after completion (once each)
//   followups  daily: one follow-up email for Ask Phi quote requests that were not answered or booked

import { timingSafeEqual } from 'node:crypto';
import { Timestamp } from 'firebase-admin/firestore';
import { getAdminDb, isAdminSdkConfigured } from '../firebase/admin';
import { emailBookingEvent } from '../email/booking-status';
import { SITE_URL, buttons, esc, frame, send } from '../email/layout';
import { PHONE_DISPLAY, PHONE_TEL } from '../../kit/site-facts';
import { addDays, londonNow } from '../../kit/assistant/dates';
import { londonMidnight } from './slots';
import { jsonReply } from './server';

export function cronGuard(req: Request): Response | null {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return jsonReply({ error: 'CRON_SECRET not set' }, 503);
  const given = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const ok = given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return jsonReply({ error: 'unauthorised' }, 401);
  if (!isAdminSdkConfigured()) return jsonReply({ error: 'Admin SDK not configured' }, 503);
  return null;
}

const LIVE = ['confirmed', 'accepted'];

/** Tomorrow's confirmed bookings get one reminder. */
export async function sendReminders(): Promise<{ checked: number; sent: number }> {
  const db = getAdminDb();
  const tomorrow = addDays(londonNow().date, 1);
  const snap = await db.collection('bookings')
    .where('scheduledDate', '>=', Timestamp.fromMillis(londonMidnight(tomorrow)))
    .where('scheduledDate', '<', Timestamp.fromMillis(londonMidnight(addDays(tomorrow, 1))))
    .get();
  let sent = 0;
  for (const d of snap.docs) {
    const b = d.data();
    if (!LIVE.includes(String(b.status)) || b.reminderSentAt) continue;
    try {
      if (await emailBookingEvent(b, 'reminder')) {
        await d.ref.update({ reminderSentAt: Timestamp.now() });
        sent += 1;
      }
    } catch (err) {
      console.error('reminder failed', d.id, err);
    }
  }
  return { checked: snap.size, sent };
}

/** Bookings completed one to three days ago get one thank-you with the review link. */
export async function sendReviewRequests(): Promise<{ checked: number; sent: number }> {
  const db = getAdminDb();
  const now = Date.now();
  const snap = await db.collection('bookings')
    .where('completedAt', '>=', Timestamp.fromMillis(now - 72 * 3_600_000))
    .where('completedAt', '<=', Timestamp.fromMillis(now - 24 * 3_600_000))
    .get();
  let sent = 0;
  for (const d of snap.docs) {
    const b = d.data();
    if (b.status !== 'completed' || b.reviewRequestSentAt) continue;
    try {
      if (await emailBookingEvent(b, 'completed')) {
        await d.ref.update({ reviewRequestSentAt: Timestamp.now() });
        sent += 1;
      }
    } catch (err) {
      console.error('review request failed', d.id, err);
    }
  }
  return { checked: snap.size, sent };
}

/** Ask Phi quote requests 3–48 hours old, still "new", with an email: one follow-up each. */
export async function sendChatFollowUps(): Promise<{ checked: number; sent: number }> {
  const db = getAdminDb();
  const now = Date.now();
  const snap = await db.collection('leads').where('createdAt', '>=', new Date(now - 48 * 3_600_000).toISOString()).get();
  let sent = 0;
  for (const d of snap.docs) {
    const l = d.data();
    if (l.source !== 'assistant' || l.status !== 'new' || !l.email || l.followUpSentAt) continue;
    if (Date.parse(String(l.createdAt)) > now - 3 * 3_600_000) continue;
    const first = String(l.name ?? '').split(' ')[0];
    const html = frame(
      `Still planning your move${first ? `, ${esc(first)}` : ''}?`,
      `You asked Ask Phi about ${esc(String(l.service || 'a move'))}. Your reference is ${esc(String(l.trackCode))}. Pick a day online, or call us and we will finish it with you.`,
      buttons([['Book online', `${SITE_URL}/book`], [`Or call ${PHONE_DISPLAY}`, PHONE_TEL]]),
      `Your reference ${l.trackCode}`,
    );
    try {
      if (await send(String(l.email), `Your Phi Movers quote ${l.trackCode}`, html, `You asked about ${l.service}. Reference ${l.trackCode}. Book online: ${SITE_URL}/book or call ${PHONE_DISPLAY}.`)) {
        await d.ref.update({ followUpSentAt: new Date().toISOString() });
        sent += 1;
      }
    } catch (err) {
      console.error('follow-up failed', d.id, err);
    }
  }
  return { checked: snap.size, sent };
}
