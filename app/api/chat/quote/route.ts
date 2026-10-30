// Re-prices a quote when the customer changes the van or the hours on the price card,
// and prices Live Voice tool calls. Always computed and signed on the server.

import { makeQuote } from '../../../../lib/assistant/brain';
import { fail, json, limited, readJson, requireUser } from '../../../../lib/assistant/http';
import { hashId } from '../../../../lib/assistant/users';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  const body = await readJson<{ input?: Record<string, unknown> }>(req, 8_000);
  if (!body?.input || typeof body.input !== 'object') return fail('invalid', 400, auth.headers);
  if (await limited(req, 'quote', hashId(auth.user.id), 120, 240, 600)) return fail('busy', 429, auth.headers);
  return json({ quote: makeQuote(body.input) }, 200, auth.headers);
}
