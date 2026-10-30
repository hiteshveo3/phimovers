// "Get a quote" on a price card: saves the request as a Phi lead (source "assistant", status "new") with a
// track code, and emails the office when email is configured. Nothing is paid; the team confirms the quote.

import { cleanDetails, validateDetails } from '../../../../kit/assistant/booking';
import { normaliseInput, priceQuote } from '../../../../kit/assistant/quote';
import { makeQuote } from '../../../../lib/assistant/brain';
import { chatReady } from '../../../../lib/assistant/env';
import { fail, json, limited, readJson } from '../../../../lib/assistant/http';
import { saveChatLead } from '../../../../lib/assistant/leads';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // A quote request does not need the AI to be on, only storage; but it is only offered from the chat.
  if (!chatReady()) return fail('notConfigured', 503);
  const body = await readJson<{ quote?: Record<string, unknown>; details?: unknown }>(req, 16_000);
  if (!body?.quote || typeof body.quote !== 'object') return fail('invalid');

  // Everything is worked out again here from the inputs; no figure from the browser is trusted.
  const details = cleanDetails(body.details);
  const quote = priceQuote(normaliseInput({ ...body.quote, day: details.date || undefined, time: details.time || undefined, from: details.from.postcode || body.quote.from, to: details.to.postcode || body.quote.to }));
  const errors = validateDetails(quote, details);
  if (Object.keys(errors).length) return json({ error: 'invalid', errors }, 400);
  // A few requests per connection every 15 minutes, so the chat cannot be used to flood the dashboard.
  if (await limited(req, 'book', 'all', 100_000, 6, 900)) return fail('busy', 429);

  try {
    const saved = await saveChatLead(quote, details);
    return json({ reference: saved.trackCode, emailed: saved.emailed, quote: makeQuote({ ...quote }) });
  } catch (err) {
    console.error('assistant quote request failed', err);
    return fail('unavailable', 503);
  }
}
