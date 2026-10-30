// GET ?date=YYYY-MM-DD -> { taken: ["1000", "1030", ...], capacity }: the half hours already full that day
// (London clock), so the time pickers on /book, in the portal and in the chat grey out starts that would
// overlap. Only the times, never which booking holds them. The submit route checks again.

import { jsonReply, takenCells } from '../../../../lib/booking-flow/server';
import { SLOT_CAPACITY } from '../../../../lib/booking-flow/slots';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get('date') ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return jsonReply({ error: 'invalid' }, 400);
  try {
    return jsonReply({ taken: await takenCells(date), capacity: SLOT_CAPACITY });
  } catch (err) {
    console.error('taken times not read', err);
    // The page still works; the booking itself is refused if the time is taken.
    return jsonReply({ taken: [], unknown: true });
  }
}
