// Every setting the assistant reads from the environment, in one place (names are listed in .env.example).
// Server only. The assistant needs two things: GEMINI_API_KEY for the answers and voice, and
// FIREBASE_SERVICE_ACCOUNT_JSON (Firebase Admin) to keep chats and save quote requests as leads.
// Without them the panel shows "unavailable" with the phone and quote-form links instead of failing.

import { createHash } from 'node:crypto';
import { isAdminSdkConfigured } from '../firebase/admin';

const prod = process.env.NODE_ENV === 'production';

const secret = () => {
  const explicit = process.env.ASSISTANT_SECRET?.trim();
  if (explicit) return explicit;
  // No extra setup needed: derive the signing key from a secret the server already has.
  const base = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (base) return createHash('sha256').update(`phi-movers-assistant|${base}`).digest('hex');
  return prod ? '' : 'phi-movers-dev-only-secret';
};

export const env = {
  prod,
  get geminiKey() {
    return process.env.GEMINI_API_KEY?.trim() ?? '';
  },
  geminiChatModel: process.env.GEMINI_CHAT_MODEL || 'gemini-3.8-flash',
  geminiTextModel: process.env.GEMINI_TEXT_MODEL || 'gemini-3.5-flash-lite',
  geminiTtsModel: process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-tts',
  geminiLiveModel: process.env.GEMINI_LIVE_MODEL || 'gemini-3.8-live',
  /** Signs prices, so the quote request route only accepts a price the server made. */
  get secret() {
    return secret();
  },
};

/** Firestore through Firebase Admin; an in-memory store while developing without it. */
export const firestoreReady = () => isAdminSdkConfigured();
export const storeReady = () => firestoreReady() || !prod;
/** Chat can run at all: an AI key, a signing key and somewhere to keep conversations. */
export const chatReady = () => Boolean(env.geminiKey && env.secret && storeReady());
/** Voice messages, read-aloud and Live Voice. */
export const voiceReady = () => Boolean(env.geminiKey);
