// The chat session: GET starts (or resumes) this browser's anonymous session and reports whether the
// assistant is switched on; POST saves settings or deletes this session's data. No sign-in.

import type { Settings } from '../../../../kit/assistant/config';
import { chatReady, voiceReady } from '../../../../lib/assistant/env';
import { clearCookie, existingSessionId, fail, json, readJson, requireUser } from '../../../../lib/assistant/http';
import { cleanSettings, eraseUser, getUser, publicAccount, saveUser } from '../../../../lib/assistant/users';

export const dynamic = 'force-dynamic';

function base() {
  const ready = chatReady();
  return { ready, voice: ready && voiceReady() };
}

export async function GET(req: Request) {
  const info = base();
  // Not switched on (no AI key or storage): the panel shows the call and quote links instead.
  if (!info.ready) return json({ ...info, signedIn: false });
  const auth = await requireUser(req);
  if ('response' in auth) return auth.response;
  return json({ ...info, ...publicAccount(auth.user) }, 200, auth.headers);
}

type Body = { action?: string; settings?: Partial<Settings> };

export async function POST(req: Request) {
  if (!chatReady()) return fail('notConfigured', 503);
  const body = await readJson<Body>(req);
  if (!body?.action) return fail('invalid');
  try {
    const id = existingSessionId(req);
    if (!id) return fail('signIn', 401);
    const user = await getUser(id);
    if (!user) return json({ signedIn: false }, 200, { 'Set-Cookie': clearCookie() });

    if (body.action === 'settings') {
      user.settings = cleanSettings(body.settings ?? {}, user.settings);
      if (!user.settings.memory) {
        user.notes = [];
        user.last = undefined;
      }
      await saveUser(user);
      return json({ ...base(), ...publicAccount(user) });
    }

    if (body.action === 'erase') {
      // Deletes this session's conversations and notes. Quote requests already sent stay: the team needs them.
      await eraseUser(user);
      return json({ signedIn: false }, 200, { 'Set-Cookie': clearCookie() });
    }

    return fail('invalid');
  } catch {
    return fail('unavailable', 503);
  }
}
