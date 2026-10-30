// Tiny key-value store for chat sessions and conversations, plus the rate limiter.
// Production: Firestore through Firebase Admin. Collection "assistant_chat", one document per key
// ({ v: JSON text, expireAt }); collection "assistant_limits" holds the rate-limit counters.
// Add a Firestore TTL policy on expireAt for both collections to clear old rows; reads ignore
// expired ones until then.
// Development without Firebase: an in-memory map that lives as long as the dev server.

import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../firebase/admin';
import { firestoreReady } from './env';

type Entry = { v: string; exp: number };
const g = globalThis as typeof globalThis & { __phiChatMem?: Map<string, Entry>; __phiChatLimits?: Map<string, { n: number; exp: number }> };
const mem = (g.__phiChatMem ??= new Map<string, Entry>());
const hits = (g.__phiChatLimits ??= new Map<string, { n: number; exp: number }>());

const COLLECTION = 'assistant_chat';
const LIMITS = 'assistant_limits';
// Firestore ids cannot contain "/"; chat keys never do, but stay safe.
const docId = (key: string) => key.replace(/\//g, '_');
const db = () => (firestoreReady() ? getAdminDb() : null);

function memGet(key: string): string | null {
  const e = mem.get(key);
  if (!e) return null;
  if (e.exp && e.exp < Date.now()) {
    mem.delete(key);
    return null;
  }
  return e.v;
}

async function rawGet(key: string): Promise<string | null> {
  const store = db();
  if (!store) return memGet(key);
  const data = (await store.collection(COLLECTION).doc(docId(key)).get()).data() as { v?: string; expireAt?: { toMillis(): number } | null } | undefined;
  if (!data?.v) return null;
  if (data.expireAt && data.expireAt.toMillis() < Date.now()) return null;
  return data.v;
}

export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await rawGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Every live value whose key starts with `prefix` (for the staff dashboard's chat export). */
export async function listJSON<T>(prefix: string, limit = 5000): Promise<T[]> {
  const now = Date.now();
  const raws: string[] = [];
  const store = db();
  if (store) {
    const snap = await store.collection(COLLECTION).orderBy('__name__').startAt(docId(prefix)).endAt(`${docId(prefix)}`).limit(limit).get();
    snap.forEach((d) => {
      const data = d.data() as { v?: string; expireAt?: { toMillis(): number } | null };
      if (data.v && !(data.expireAt && data.expireAt.toMillis() < now)) raws.push(data.v);
    });
  } else {
    for (const [key, e] of mem) if (key.startsWith(prefix) && !(e.exp && e.exp < now)) raws.push(e.v);
  }
  return raws.flatMap((raw) => {
    try {
      return [JSON.parse(raw) as T];
    } catch {
      return [];
    }
  });
}

export async function setJSON(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  const v = JSON.stringify(value);
  const exp = ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0;
  const store = db();
  if (store) {
    await store.collection(COLLECTION).doc(docId(key)).set({ v, expireAt: exp ? new Date(exp) : null, updatedAt: FieldValue.serverTimestamp() });
    return;
  }
  mem.set(key, { v, exp });
}

export async function del(...keys: string[]): Promise<void> {
  if (!keys.length) return;
  const store = db();
  if (store) {
    const batch = store.batch();
    keys.forEach((k) => batch.delete(store.collection(COLLECTION).doc(docId(k))));
    await batch.commit();
    return;
  }
  keys.forEach((k) => mem.delete(k));
}

/** Counts a hit in a fixed window. Returns false once the limit is passed. */
export async function allow(bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const slot = Math.floor(now / windowMs);
  const store = db();
  if (!store) {
    const key = `${bucket}:${slot}`;
    const cur = hits.get(key);
    if (!cur || cur.exp < now) hits.set(key, { n: 1, exp: (slot + 1) * windowMs });
    else cur.n += 1;
    if (hits.size > 5000) for (const [k, v] of hits) if (v.exp < now) hits.delete(k);
    return (hits.get(key)?.n ?? 1) <= limit;
  }
  const ref = store.collection(LIMITS).doc(`${createHash('sha256').update(bucket).digest('hex').slice(0, 40)}_${slot}`);
  const count = await store.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const n = ((snap.data() as { n?: number } | undefined)?.n ?? 0) + 1;
    tx.set(ref, { n, expireAt: new Date((slot + 2) * windowMs) });
    return n;
  });
  return count <= limit;
}
