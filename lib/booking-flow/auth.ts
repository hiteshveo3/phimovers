// Server only. Who is asking: a Firebase ID token in "Authorization: Bearer …" (the client portal,
// /book when signed in, the chat), checked with the Admin SDK. Never trusts a uid sent in a body.

import { getAdminAuth, isAdminSdkConfigured } from '../firebase/admin';

export type Caller = {
  uid: string;
  /** Lower-cased, and only when Firebase says it is verified (Google sign-in, or a verified address). */
  verifiedEmail: string | null;
  /** E.164, only when the account signed in with its phone (so it is verified). */
  verifiedPhone: string | null;
  email: string | null;
  name: string | null;
  staff: boolean;
};

export async function firebaseCaller(req: Request): Promise<Caller | null> {
  const header = req.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token || !isAdminSdkConfigured()) return null;
  try {
    const d = await getAdminAuth().verifyIdToken(token);
    const email = typeof d.email === 'string' ? d.email.trim().toLowerCase() : null;
    return {
      uid: d.uid,
      email,
      verifiedEmail: email && d.email_verified === true ? email : null,
      verifiedPhone: typeof d.phone_number === 'string' && d.phone_number ? d.phone_number : null,
      name: typeof d.name === 'string' ? d.name : null,
      staff: d.staff === true,
    };
  } catch {
    return null;
  }
}
