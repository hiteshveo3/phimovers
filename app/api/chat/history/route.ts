// Saved conversations: GET ?id= opens one, GET lists them, POST appends Live Voice transcripts.

import { LIMITS } from '../../../../kit/assistant/config';
import { normaliseInput, priceQuote, quoteKey, type Quote } from '../../../../kit/assistant/quote';
import { fail, json, readJson, requireUser, safeEqual, sign } from '../../../../lib/assistant/http';
import { appendMessages, getConversation, recentMessages, type StoredMessage } from '../../../../lib/assistant/users';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return json({ signedIn: true, conversations: auth.user.conversations }, 200, auth.headers);
  const conv = await getConversation(auth.user, id).catch(() => null);
  if (!conv) return fail('invalid', 404, auth.headers);
  return json({ id: conv.id, title: conv.title, messages: recentMessages(conv) }, 200, auth.headers);
}

type Turn = { role?: unknown; content?: unknown; quote?: unknown };

/** A quote coming back from the browser is only kept if its signature still matches. */
function trustedQuote(raw: unknown): Quote | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const q = raw as Quote;
  const fresh = priceQuote(normaliseInput(q as unknown as Record<string, unknown>));
  return typeof q.sig === 'string' && safeEqual(q.sig, sign(quoteKey(fresh))) ? { ...fresh, sig: q.sig } : undefined;
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  const body = await readJson<{ conversation?: unknown; turns?: unknown }>(req, 200_000);
  if (!body || !Array.isArray(body.turns) || !body.turns.length) return fail('invalid', 400, auth.headers);
  const now = Date.now();
  const turns: StoredMessage[] = (body.turns as Turn[])
    .slice(0, 80)
    .filter((t) => (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string')
    .map((t) => {
      const quote = t.role === 'assistant' ? trustedQuote(t.quote) : undefined;
      return { role: t.role as StoredMessage['role'], content: (t.content as string).slice(0, LIMITS.messageChars), at: now, voice: true, ...(quote ? { quote } : {}) };
    })
    .filter((t) => t.content.trim() || t.quote);
  if (!turns.length) return fail('invalid', 400, auth.headers);
  try {
    const conv = await appendMessages(auth.user, typeof body.conversation === 'string' ? body.conversation : undefined, turns);
    return json({ conversation: conv.id }, 200, auth.headers);
  } catch {
    return fail('unavailable', 503, auth.headers);
  }
}
