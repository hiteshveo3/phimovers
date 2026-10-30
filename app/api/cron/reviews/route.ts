// Scheduled job (Vercel Cron, "Authorization: Bearer $CRON_SECRET"). See lib/booking-flow/cron.ts.

import { cronGuard, sendReviewRequests } from '../../../../lib/booking-flow/cron';
import { jsonReply } from '../../../../lib/booking-flow/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const refused = cronGuard(req);
  if (refused) return refused;
  try {
    return jsonReply({ ok: true, ...(await sendReviewRequests()) });
  } catch (err) {
    console.error('cron reviews failed', err);
    return jsonReply({ error: 'failed' }, 500);
  }
}
