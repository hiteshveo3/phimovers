// Hands the browser a one-use Gemini Live token. The browser then talks to Gemini directly
// (serverless functions cannot hold a WebSocket open); the token locks the session setup.

import { voiceReady } from '../../../../lib/assistant/env';
import { liveToken } from '../../../../lib/assistant/gemini';
import { fail, json, limited, requireUser } from '../../../../lib/assistant/http';
import { hashId } from '../../../../lib/assistant/users';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  if (!voiceReady()) return fail('notConfigured', 503, auth.headers);
  if (await limited(req, 'live', hashId(auth.user.id), 8, 16, 3600)) return fail('busy', 429, auth.headers);
  try {
    const { user } = auth;
    return json(await liveToken(user.settings, user.settings.memory ? user.notes : []), 200, auth.headers);
  } catch {
    return fail('unavailable', 503, auth.headers);
  }
}
