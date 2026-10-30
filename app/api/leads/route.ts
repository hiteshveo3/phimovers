// POST { request, company } -> saves a website quote request as a lead and emails both sides.
// Rate-limited by connection and by phone; a filled "company" field (the honeypot) is answered like a
// success but nothing is stored. 400 { errors }, 429 too many, 503 unavailable: the form then shows the
// call / WhatsApp / email fallback with the request typed in, never a silent success.

import { firebaseCaller } from '../../../lib/booking-flow/auth';
import { clientIp, jsonReply, readBody, tooMany } from '../../../lib/booking-flow/server';
import { cleanRequest, validateRequest } from '../../../lib/quote/model';
import { leadStoreReady, saveQuoteLead } from '../../../lib/quote/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await readBody<{ request?: unknown; company?: string }>(req, 16_000);
  if (!body) return jsonReply({ error: 'invalid' }, 400);
  if (typeof body.company === 'string' && body.company.trim()) return jsonReply({ id: 'ok', reference: '', emailed: false });
  if (!leadStoreReady()) return jsonReply({ error: 'unavailable' }, 503);
  if (await tooMany(`lead:ip:${clientIp(req)}`, 5, 900)) return jsonReply({ error: 'limited' }, 429);

  const request = cleanRequest(body.request);
  const errors = validateRequest(request);
  if (Object.keys(errors).length) return jsonReply({ error: 'invalid', errors }, 400);
  if (await tooMany(`lead:phone:${request.phone.replace(/\D/g, '')}`, 3, 3600)) return jsonReply({ error: 'limited' }, 429);

  const caller = await firebaseCaller(req);
  try {
    const saved = await saveQuoteLead(request, caller?.uid ?? null);
    return jsonReply({ id: saved.id, reference: saved.trackCode, emailed: saved.emailed });
  } catch (err) {
    console.error('lead save failed', err);
    return jsonReply({ error: 'unavailable' }, 503);
  }
}
