// Rate limit and daily cap for paid staff routes (Alpha app AUDIT S6): the office AI assistant and the AI
// invoice reminder. Server only.
//   per person: `perMinute` requests a minute (kept in memory per server instance: a burst guard only)
//   whole office: `perDay` requests a London day, counted in Firestore ops_limits/{name}-{YYYY-MM-DD}
//                 with a transaction (Admin SDK; the rules give browsers no access), so it holds across
//                 Vercel instances. Without the Admin SDK only the in-memory guard runs.

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminSdkConfigured } from "../firebase/admin";

const hits = new Map<string, number[]>();

const londonDay = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export type Limit = { ok: true } | { ok: false; error: "slowDown" | "dailyCap"; retryAfter: number };

export async function takeToken(
  name: string,
  who: string,
  { perMinute = 10, perDay = 300 }: { perMinute?: number; perDay?: number } = {},
): Promise<Limit> {
  const now = Date.now();
  const key = `${name}|${who}`;
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= perMinute) return { ok: false, error: "slowDown", retryAfter: 60 };
  recent.push(now);
  hits.set(key, recent);

  if (!isAdminSdkConfigured()) return { ok: true };
  const ref = getAdminDb().collection("ops_limits").doc(`${name}-${londonDay()}`);
  const allowed = await getAdminDb().runTransaction(async (tx) => {
    const n = Number((await tx.get(ref)).data()?.count ?? 0);
    if (n >= perDay) return false;
    tx.set(ref, { count: FieldValue.increment(1), updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  });
  return allowed ? { ok: true } : { ok: false, error: "dailyCap", retryAfter: 3600 };
}

/** The cap from an env variable (a positive whole number), else the default. */
export const capFromEnv = (name: string, fallback: number) => {
  const n = Number(process.env[name]);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};
