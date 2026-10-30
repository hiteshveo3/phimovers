// Browser side of the /api/chat routes: typed calls and the streamed-answer reader.

import type { Settings } from './config';
import type { Quote } from './quote';

export type Table = { title: string; columns?: string[]; rows: string[][] };
export type ConvSummary = { id: string; title: string; updatedAt: number; count: number };

export type Account = {
  ready: boolean;
  voice: boolean;
  signedIn: boolean;
  settings?: Settings;
  memory?: { on: boolean; last?: { topic: string; at: number } };
  conversations?: ConvSummary[];
};

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

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; status: number };

const offline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

export async function api<T>(path: string, body?: unknown, timeoutMs = 30_000): Promise<ApiResult<T>> {
  if (offline()) return { ok: false, error: 'offline', status: 0 };
  try {
    const res = await fetch(path, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      credentials: 'same-origin',
      signal: AbortSignal.timeout(timeoutMs),
    });
    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok || data.error) return { ok: false, error: data.error ?? 'unavailable', status: res.status };
    return { ok: true, data };
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'TimeoutError';
    return { ok: false, error: offline() ? 'offline' : timedOut ? 'slow' : 'unavailable', status: 0 };
  }
}

export type StreamEvent =
  | { t: 'text'; d: string }
  | { t: 'quote'; quote: Quote }
  | { t: 'table'; table: Table }
  | { t: 'replies'; replies: string[] }
  | { t: 'done'; conversation: string }
  | { t: 'error'; error: string };

/** Posts a chat turn and calls onEvent for each streamed line. Resolves with an error code or null. */
export async function streamChat(body: unknown, onEvent: (e: StreamEvent) => void, signal: AbortSignal): Promise<string | null> {
  if (offline()) return 'offline';
  let res: Response;
  try {
    res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin', signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'aborted';
    return offline() ? 'offline' : 'unavailable';
  }
  if (!res.ok || !res.body || !(res.headers.get('content-type') ?? '').includes('ndjson')) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return data.error ?? 'unavailable';
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let error: string | null = 'empty';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let nl = buf.indexOf('\n');
      while (nl >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        nl = buf.indexOf('\n');
        if (!line) continue;
        let e: StreamEvent;
        try {
          e = JSON.parse(line) as StreamEvent;
        } catch {
          continue;
        }
        if (e.t === 'done') error = null;
        else if (e.t === 'error') error = e.error;
        onEvent(e);
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'aborted';
    return offline() ? 'offline' : 'unavailable';
  }
  return error;
}

/** Shrinks a photo to at most 1280 px and returns JPEG base64 plus a preview URL. */
export async function preparePhoto(file: File): Promise<{ data: string; mime: 'image/jpeg'; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no canvas');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
  if (!blob) throw new Error('no blob');
  const data = await blobToBase64(blob);
  return { data, mime: 'image/jpeg', preview: URL.createObjectURL(blob) };
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return bytesToBase64(new Uint8Array(await blob.arrayBuffer()));
}

export function bytesToBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return btoa(s);
}

export function base64ToBytes(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i += 1) out[i] = s.charCodeAt(i);
  return out;
}
