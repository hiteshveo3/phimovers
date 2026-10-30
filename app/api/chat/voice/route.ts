// Writes out a recorded voice message (16 kHz mono WAV, base64) so it can be sent as a question.

import { LIMITS } from '../../../../kit/assistant/config';
import { voiceReady } from '../../../../lib/assistant/env';
import { transcribe } from '../../../../lib/assistant/gemini';
import { fail, json, limited, readJson, requireUser } from '../../../../lib/assistant/http';
import { hashId } from '../../../../lib/assistant/users';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// 16 kHz × 16-bit mono = 32 000 bytes a second, base64 adds a third.
const MAX_B64 = Math.ceil(((LIMITS.voiceSeconds + 2) * 32_000 + 44) * 4 / 3);
const MIN_B64 = Math.ceil((0.6 * 32_000) * 4 / 3);

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  if (!voiceReady()) return fail('notConfigured', 503, auth.headers);
  const body = await readJson<{ audio?: unknown }>(req, MAX_B64 + 1_000);
  if (!body) return fail('tooLong', 413, auth.headers);
  if (typeof body.audio !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.audio)) return fail('invalid', 400, auth.headers);
  if (body.audio.length < MIN_B64) return fail('tooShort', 400, auth.headers);
  if (await limited(req, 'voice', hashId(auth.user.id), 20, 40, 600)) return fail('busy', 429, auth.headers);
  try {
    const text = await transcribe(body.audio);
    if (!text) return fail('noSpeech', 400, auth.headers);
    return json({ text }, 200, auth.headers);
  } catch {
    return fail('unavailable', 503, auth.headers);
  }
}
