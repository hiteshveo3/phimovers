// Anonymous chat sessions: one per browser (a signed cookie), with its settings, memory notes and saved
// conversations. There is no sign-in and no email address: nothing here identifies a person.

import { createHash, randomBytes } from 'node:crypto';
import { DEFAULT_SETTINGS, LIMITS, VOICES, type Settings } from '../../kit/assistant/config';
import type { Quote } from '../../kit/assistant/quote';
import { del, getJSON, setJSON } from './store';

export type Table = { title: string; columns?: string[]; rows: string[][] };

export type StoredMessage = {
  role: 'user' | 'assistant';
  content: string;
  at: number;
  voice?: boolean;
  photos?: number;
  quote?: Quote;
  table?: Table;
  replies?: string[];
};

export type Conversation = { id: string; createdAt: number; updatedAt: number; title: string; messages: StoredMessage[] };
export type ConvSummary = { id: string; title: string; updatedAt: number; count: number };

export type UserRecord = {
  /** Random id from the session cookie. */
  id: string;
  /** First name, as the customer gave it in the chat. */
  name?: string;
  createdAt: number;
  settings: Settings;
  /** Short notes the assistant reads back when memory is on. */
  notes: string[];
  last?: { topic: string; at: number };
  conversations: ConvSummary[];
};

const YEAR = 60 * 60 * 24 * 365;
const MAX_CONVERSATIONS = 30;
const MAX_MESSAGES = 120;

/** A stable, non-reversible handle for rate limits. */
export const hashId = (id: string) => createHash('sha256').update(id).digest('hex').slice(0, 32);
const userKey = (id: string) => `phi:u:${hashId(id)}`;
const convKey = (id: string) => `phi:c:${id}`;
export const newId = (bytes = 12) => randomBytes(bytes).toString('base64url');

export async function getUser(id: string): Promise<UserRecord | null> {
  return getJSON<UserRecord>(userKey(id));
}

export async function ensureUser(id: string): Promise<UserRecord> {
  const found = await getUser(id);
  if (found) return found;
  const user: UserRecord = { id, createdAt: Date.now(), settings: { ...DEFAULT_SETTINGS }, notes: [], conversations: [] };
  await saveUser(user);
  return user;
}

/** A name typed by a customer: letters, spaces, hyphens and apostrophes, up to 40 characters. */
export const cleanName = (raw: unknown) => (typeof raw === 'string' ? raw.replace(/[^\p{L}\p{M}' -]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 40) : '');

export const saveUser = (user: UserRecord) => setJSON(userKey(user.id), user, YEAR);

export function cleanSettings(raw: Partial<Settings>, current: Settings): Settings {
  return {
    voice: VOICES.some((v) => v.id === raw.voice) ? (raw.voice as Settings['voice']) : current.voice,
    patient: typeof raw.patient === 'boolean' ? raw.patient : current.patient,
    memory: typeof raw.memory === 'boolean' ? raw.memory : current.memory,
  };
}

export async function getConversation(user: UserRecord, id: string): Promise<Conversation | null> {
  // Only conversations listed on the session can be opened, so ids cannot be guessed across sessions.
  if (!user.conversations.some((c) => c.id === id)) return null;
  return getJSON<Conversation>(convKey(id));
}

/** Appends messages to a conversation (creating it when id is missing) and updates the session's list. */
export async function appendMessages(user: UserRecord, id: string | undefined, add: StoredMessage[]): Promise<Conversation> {
  const now = Date.now();
  let conv = id ? await getConversation(user, id) : null;
  if (!conv) {
    const firstUser = add.find((m) => m.role === 'user')?.content ?? 'Conversation';
    conv = { id: newId(), createdAt: now, updatedAt: now, title: firstUser.slice(0, 80), messages: [] };
  }
  conv.messages = [...conv.messages, ...add].slice(-MAX_MESSAGES);
  conv.updatedAt = now;
  await setJSON(convKey(conv.id), conv, YEAR);
  const count = conv.messages.filter((m) => m.role === 'user').length;
  const summary: ConvSummary = { id: conv.id, title: conv.title, updatedAt: now, count };
  user.conversations = [summary, ...user.conversations.filter((c) => c.id !== conv!.id)].slice(0, MAX_CONVERSATIONS);
  if (user.settings.memory) user.last = { topic: conv.title, at: now };
  await saveUser(user);
  return conv;
}

export async function eraseUser(user: UserRecord): Promise<void> {
  await del(userKey(user.id), ...user.conversations.map((c) => convKey(c.id)));
}

/** What the panel needs about this session. */
export function publicAccount(user: UserRecord) {
  return {
    signedIn: true,
    settings: user.settings,
    memory: { on: user.settings.memory, last: user.settings.memory ? user.last : undefined },
    conversations: user.conversations,
  };
}

/** Messages trimmed for the browser's session cache. */
export const recentMessages = (conv: Conversation) => conv.messages.slice(-LIMITS.savedMessages);
