// One chat turn: the customer's message (and photos) in, a stream of newline-delimited JSON out:
// {t:"text"} pieces, {t:"quote"} price cards, {t:"table"}, {t:"replies"}, then {t:"done"} or {t:"error"}.

import { LIMITS } from '../../../kit/assistant/config';
import { quoteSummary } from '../../../kit/assistant/quote';
import { runChat, type ChatEvent, type Photo } from '../../../lib/assistant/brain';
import { GeminiError } from '../../../lib/assistant/gemini';
import { fail, limited, readJson, requireUser } from '../../../lib/assistant/http';
import { appendMessages, getConversation, hashId, type StoredMessage } from '../../../lib/assistant/users';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Body = { message?: unknown; photos?: unknown; conversation?: unknown; voice?: unknown };

const MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

function cleanPhotos(raw: unknown): Photo[] | null {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > LIMITS.photos) return null;
  const out: Photo[] = [];
  for (const p of raw as { data?: unknown; mime?: unknown }[]) {
    if (typeof p?.data !== 'string' || p.data.length > 1_600_000 || !BASE64.test(p.data)) return null;
    if (!MIMES.includes(p.mime as Photo['mime'])) return null;
    out.push({ data: p.data, mime: p.mime as Photo['mime'] });
  }
  return out;
}

function errorCode(err: unknown) {
  if (err instanceof GeminiError && (err.status === 429 || err.status === 503)) return 'busy';
  if ((err as { name?: string } | null)?.name === 'TimeoutError') return 'slow';
  return 'unavailable';
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  const { user, headers } = auth;

  const body = await readJson<Body>(req, 4_400_000);
  const photos = cleanPhotos(body?.photos);
  if (!body || !photos) return fail('invalid', 400, headers);
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, LIMITS.messageChars) : '';
  if (!message && !photos.length) return fail('invalid', 400, headers);
  const who = hashId(user.id);
  if (await limited(req, 'chat', who, 40, 80, 600)) return fail('busy', 429, headers);

  const conv = typeof body.conversation === 'string' ? await getConversation(user, body.conversation).catch(() => null) : null;
  const voice = body.voice === true;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: ChatEvent | { t: 'done'; conversation: string } | { t: 'error'; error: string }) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(e)}\n`));
        } catch {
          // The browser went away; keep going so the turn is still saved.
        }
      };
      try {
        const result = await runChat({
          history: conv?.messages ?? [],
          message,
          photos,
          voice,
          settings: user.settings,
          notes: user.settings.memory ? user.notes : [],
          name: user.name,
          userId: who,
          emit: send,
        });
        if (result.name) user.name = result.name;
        if (result.refused) {
          send({ t: 'error', error: 'refused' });
          return;
        }
        if (!result.text && !result.quotes.length && !result.tables.length) {
          send({ t: 'error', error: 'empty' });
          return;
        }
        const now = Date.now();
        const quote = result.quotes[result.quotes.length - 1];
        const turn: StoredMessage[] = [
          { role: 'user', content: message, at: now, ...(voice ? { voice: true } : {}), ...(photos.length ? { photos: photos.length } : {}) },
          { role: 'assistant', content: result.text, at: now, ...(quote ? { quote } : {}), ...(result.tables[0] ? { table: result.tables[0] } : {}), ...(result.replies.length ? { replies: result.replies } : {}) },
        ];
        if (quote && user.settings.memory) user.notes = [...user.notes, `Asked for a price: ${quoteSummary(quote)}`].slice(-8);
        const saved = await appendMessages(user, conv?.id, turn);
        send({ t: 'done', conversation: saved.id });
      } catch (err) {
        send({ t: 'error', error: errorCode(err) });
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no', ...headers },
  });
}
