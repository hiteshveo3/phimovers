// Reads an answer aloud in the customer's chosen voice.

import { VOICES, type VoiceId } from '../../../../kit/assistant/config';
import { voiceReady } from '../../../../lib/assistant/env';
import { speak } from '../../../../lib/assistant/gemini';
import { fail, json, limited, readJson, requireUser } from '../../../../lib/assistant/http';
import { hashId } from '../../../../lib/assistant/users';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  if (!voiceReady()) return fail('notConfigured', 503, auth.headers);
  const body = await readJson<{ text?: unknown; voice?: unknown }>(req, 12_000);
  if (!body || typeof body.text !== 'string' || !body.text.trim()) return fail('invalid', 400, auth.headers);
  if (await limited(req, 'speak', hashId(auth.user.id), 60, 120, 600)) return fail('busy', 429, auth.headers);
  const voice = VOICES.some((v) => v.id === body.voice) ? (body.voice as VoiceId) : auth.user.settings.voice;
  try {
    return json(await speak(body.text, voice), 200, auth.headers);
  } catch {
    return fail('unavailable', 503, auth.headers);
  }
}
