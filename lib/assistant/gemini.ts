// Everything on the Gemini API: the streamed chat turn (driven by brain.ts), writing out voice messages,
// reading answers aloud, and the short-lived token the browser uses to open a Live Voice session.
// The token carries the whole session setup (model, voice, instructions, tool), so the browser
// cannot change what the assistant is told.

import { LIMITS, VOICES, type Settings } from '../../kit/assistant/config';
import { env } from './env';
import { dynamicContext, PRICE_QUOTE_DESCRIPTION, PRICE_QUOTE_SCHEMA, stableSystemPrompt } from './knowledge';

const BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const LIVE_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained';

export class GeminiError extends Error {
  constructor(readonly status: number) {
    super(`gemini ${status}`);
  }
}

async function generate(model: string, body: unknown, timeoutMs = 45_000): Promise<{ parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] }> {
  const res = await fetch(`${BASE}/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': env.geminiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new GeminiError(res.status);
  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string; inlineData?: { mimeType: string; data: string } }[] } }[] };
  return { parts: data.candidates?.[0]?.content?.parts ?? [] };
}

/** One plain-text answer (the staff dashboard's office assistant and payment reminders). */
export async function answerText(system: string, prompt: string): Promise<string> {
  const { parts } = await generate(env.geminiTextModel, {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
  }, 40_000);
  return parts.map((p) => p.text ?? '').join('').trim();
}

export type GeminiPart = {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
  inlineData?: { mimeType: string; data: string };
  functionCall?: { id?: string; name: string; args?: Record<string, unknown> };
  functionResponse?: { id?: string; name: string; response: Record<string, unknown> };
};
export type GeminiContent = { role: 'user' | 'model'; parts: GeminiPart[] };
export type GeminiChunk = {
  candidates?: { content?: { parts?: GeminiPart[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

/** One streamed turn (server-sent events), yielding each response chunk as it arrives. */
export async function* streamGenerate(model: string, body: unknown, signal: AbortSignal): AsyncGenerator<GeminiChunk> {
  const res = await fetch(`${BASE}/models/${model}:streamGenerateContent?alt=sse`, {
    method: 'POST',
    headers: { 'x-goog-api-key': env.geminiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) throw new GeminiError(res.status);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = done ? '' : lines.pop() ?? '';
    for (const line of lines) {
      if (line.startsWith('data:')) yield JSON.parse(line.slice(5)) as GeminiChunk;
    }
    if (done) return;
  }
}

const NO_SPEECH = '[[no speech]]';

/** Writes out a voice message (16 kHz mono WAV) word for word. Returns '' when nothing was said. */
export async function transcribe(wavBase64: string): Promise<string> {
  const { parts } = await generate(env.geminiTextModel, {
    contents: [{
      role: 'user',
      parts: [
        { inlineData: { mimeType: 'audio/wav', data: wavBase64 } },
        { text: `Write out exactly what is said in this voice message, with normal punctuation. It is a customer asking a removals company about a move, so expect words like postcodes, Luton van, sofa, flat. Output only the words. If there is no clear speech, output exactly ${NO_SPEECH}` },
      ],
    }],
    generationConfig: { temperature: 0 },
  });
  const text = parts.map((p) => p.text ?? '').join('').trim();
  return text.includes(NO_SPEECH) ? '' : text.slice(0, 2000);
}

/** Speech for an answer. Returns base64 audio and its mime type (raw 24 kHz PCM or WAV). */
export async function speak(text: string, voice: Settings['voice']): Promise<{ audio: string; mime: string }> {
  const voiceName = (VOICES.find((v) => v.id === voice) ?? VOICES[0]).gemini;
  const plain = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_#`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1500);
  // The text is spoken as-is, so it must be only the reply. Tone comes from the chosen voice, never from words in the prompt.
  const { parts } = await generate(env.geminiTtsModel, {
    contents: [{ role: 'user', parts: [{ text: plain }] }],
    generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } },
  }, 60_000);
  const audio = parts.find((p) => p.inlineData?.data)?.inlineData;
  if (!audio) throw new Error('no audio');
  return { audio: audio.data, mime: audio.mimeType || 'audio/L16;rate=24000' };
}

/** A one-use token for a Live Voice session, locked to our model, voice, instructions and tool. */
export async function liveToken(settings: Settings, notes: string[]): Promise<{ token: string; url: string; model: string; maxSeconds: number }> {
  const voiceName = (VOICES.find((v) => v.id === settings.voice) ?? VOICES[0]).gemini;
  const now = Date.now();
  const model = `models/${env.geminiLiveModel}`;
  const setup = {
    model,
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
    },
    systemInstruction: { parts: [{ text: `${stableSystemPrompt('voice')}\n\n${dynamicContext(settings, notes, 'voice')}` }] },
    tools: [{ functionDeclarations: [{ name: 'price_quote', description: PRICE_QUOTE_DESCRIPTION, parameters: PRICE_QUOTE_SCHEMA }] }],
    inputAudioTranscription: {},
    outputAudioTranscription: {},
    realtimeInputConfig: {
      automaticActivityDetection: { silenceDurationMs: settings.patient ? 1600 : 700, endOfSpeechSensitivity: settings.patient ? 'END_SENSITIVITY_LOW' : 'END_SENSITIVITY_HIGH' },
    },
  };
  const res = await fetch(`${BASE}/auth_tokens`, {
    method: 'POST',
    headers: { 'x-goog-api-key': env.geminiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uses: 1,
      expireTime: new Date(now + (LIMITS.liveSeconds + 120) * 1000).toISOString(),
      newSessionExpireTime: new Date(now + 2 * 60 * 1000).toISOString(),
      // With no fieldMask, the session runs entirely on this setup and ignores the browser's.
      bidiGenerateContentSetup: setup,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`gemini token ${res.status}`);
  const data = (await res.json()) as { name?: string };
  if (!data.name) throw new Error('no token');
  return { token: data.name, url: LIVE_URL, model, maxSeconds: LIMITS.liveSeconds };
}
