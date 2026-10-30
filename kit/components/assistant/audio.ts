// Audio for the chat: microphone capture at 16 kHz, voice-message WAV recording, reading answers
// aloud, and the Live Voice session that talks to Gemini Live over a WebSocket.

import { base64ToBytes, bytesToBase64 } from '../../assistant/client';

export const MIC_KEY = 'phi-chat-mic';
const RATE = 16_000;

type AudioCtor = typeof AudioContext;
const Ctx = (): AudioCtor | undefined =>
  typeof window === 'undefined' ? undefined : window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;

export const canRecord = () => Boolean(typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function' && Ctx() && typeof AudioWorkletNode !== 'undefined');

export type MicError = 'denied' | 'noMicrophone' | 'unsupported' | 'unavailable';

export function micError(err: unknown): MicError {
  const name = err instanceof DOMException ? err.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'noMicrophone';
  if (name === 'NotSupportedError') return 'unsupported';
  return 'unavailable';
}

export async function listMicrophones(): Promise<{ id: string; label: string }[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === 'audioinput' && d.deviceId && d.label).map((d) => ({ id: d.deviceId, label: d.label }));
  } catch {
    return [];
  }
}

const savedMic = () => {
  try {
    return localStorage.getItem(MIC_KEY) || undefined;
  } catch {
    return undefined;
  }
};

/** Linear resampler that keeps its position across blocks. */
function resampler(inRate: number) {
  const step = inRate / RATE;
  let pos = 0;
  return (input: Float32Array): Int16Array => {
    const out: number[] = [];
    while (pos < input.length) {
      const i = Math.floor(pos);
      const a = input[i];
      const b = i + 1 < input.length ? input[i + 1] : a;
      const v = Math.max(-1, Math.min(1, a + (b - a) * (pos - i)));
      out.push(v < 0 ? v * 0x8000 : v * 0x7fff);
      pos += step;
    }
    pos -= input.length;
    return Int16Array.from(out);
  };
}

export type Mic = { stop: () => void; label: () => string };

/** Opens the microphone and calls onPcm with 16 kHz 16-bit mono blocks and onLevel with 0–1. */
export async function openMic(onPcm: (pcm: Int16Array) => void, onLevel?: (level: number) => void): Promise<Mic> {
  const AC = Ctx();
  if (!AC || !navigator.mediaDevices?.getUserMedia) throw new DOMException('no audio', 'NotSupportedError');
  const deviceId = savedMic();
  const audio: MediaTrackConstraints = { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 };
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? { ...audio, deviceId: { exact: deviceId } } : audio });
  } catch (err) {
    // A saved microphone that was unplugged: fall back to the default one.
    if (!deviceId || micError(err) !== 'noMicrophone') throw err;
    stream = await navigator.mediaDevices.getUserMedia({ audio });
  }
  const ctx = new AC();
  if (ctx.state === 'suspended') await ctx.resume().catch(() => undefined);
  await ctx.audioWorklet.addModule('/assistant/pcm-worklet.js');
  const source = ctx.createMediaStreamSource(stream);
  const node = new AudioWorkletNode(ctx, 'phi-pcm');
  const mute = ctx.createGain();
  mute.gain.value = 0;
  source.connect(node);
  node.connect(mute);
  mute.connect(ctx.destination);
  const resample = resampler(ctx.sampleRate);
  node.port.onmessage = (e: MessageEvent<Float32Array>) => {
    const block = e.data;
    if (onLevel) {
      let sum = 0;
      for (let i = 0; i < block.length; i += 1) sum += block[i] * block[i];
      onLevel(Math.min(1, Math.sqrt(sum / block.length) * 6));
    }
    onPcm(resample(block));
  };
  let stopped = false;
  return {
    stop() {
      if (stopped) return;
      stopped = true;
      node.port.onmessage = null;
      try {
        source.disconnect();
        node.disconnect();
        mute.disconnect();
      } catch {
        // already disconnected
      }
      stream.getTracks().forEach((t) => t.stop());
      ctx.close().catch(() => undefined);
    },
    label: () => stream.getAudioTracks()[0]?.label ?? '',
  };
}

/** 16 kHz mono 16-bit WAV, base64. */
export function wavBase64(chunks: Int16Array[]): { data: string; seconds: number; peak: number } {
  const samples = chunks.reduce((n, c) => n + c.length, 0);
  const buf = new ArrayBuffer(44 + samples * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + samples * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, samples * 2, true);
  let o = 44;
  let peak = 0;
  for (const c of chunks) {
    for (let i = 0; i < c.length; i += 1) {
      v.setInt16(o, c[i], true);
      o += 2;
      const a = Math.abs(c[i]);
      if (a > peak) peak = a;
    }
  }
  return { data: bytesToBase64(new Uint8Array(buf)), seconds: samples / RATE, peak: peak / 0x8000 };
}

/** Turns raw little-endian 16-bit PCM into an AudioBuffer. */
function pcmBuffer(ctx: BaseAudioContext, bytes: Uint8Array, rate: number): AudioBuffer {
  const n = Math.floor(bytes.length / 2);
  const view = new DataView(bytes.buffer, bytes.byteOffset, n * 2);
  const buffer = ctx.createBuffer(1, Math.max(1, n), rate);
  const ch = buffer.getChannelData(0);
  for (let i = 0; i < n; i += 1) ch[i] = view.getInt16(i * 2, true) / 0x8000;
  return buffer;
}

const rateFrom = (mime: string, fallback = 24_000) => Number(/rate=(\d+)/i.exec(mime)?.[1] ?? fallback);

let playCtx: AudioContext | null = null;
const player = () => {
  const AC = Ctx();
  if (!AC) return null;
  playCtx ??= new AC();
  if (playCtx.state === 'suspended') playCtx.resume().catch(() => undefined);
  return playCtx;
};

/** Plays a read-aloud answer. Returns a stop function; onEnd runs when it finishes or stops. */
export async function playSpeech(audio: string, mime: string, onEnd: () => void): Promise<() => void> {
  const ctx = player();
  if (!ctx) throw new Error('no audio');
  const bytes = base64ToBytes(audio);
  const buffer = /wav/i.test(mime)
    ? await ctx.decodeAudioData(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer)
    : pcmBuffer(ctx, bytes, rateFrom(mime));
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.connect(ctx.destination);
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    onEnd();
  };
  src.onended = finish;
  src.start();
  return () => {
    try {
      src.stop();
    } catch {
      // not started
    }
    finish();
  };
}

/* ------------------------------------------------------------------ Live Voice */

export type LiveState = 'connecting' | 'listening' | 'hearing' | 'thinking' | 'speaking';
export type LiveCall = { id: string; name: string; args: Record<string, unknown> };

export type LiveHandlers = {
  onState: (s: LiveState) => void;
  onLevel: (level: number) => void;
  onUserText: (text: string) => void;
  onModelText: (text: string) => void;
  onTurnEnd: () => void;
  onToolCall: (call: LiveCall) => Promise<Record<string, unknown>>;
  onEnd: (reason: 'ended' | 'error' | 'timeout' | MicError) => void;
};

type ServerMsg = {
  setupComplete?: unknown;
  serverContent?: {
    modelTurn?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] };
    inputTranscription?: { text?: string };
    outputTranscription?: { text?: string };
    turnComplete?: boolean;
    generationComplete?: boolean;
    interrupted?: boolean;
  };
  toolCall?: { functionCalls?: { id: string; name: string; args?: Record<string, unknown> }[] };
  goAway?: unknown;
};

export type LiveContext = { role: 'user' | 'model'; text: string }[];

/** One Live Voice call. Call start(), then end() to hang up. */
export class LiveSession {
  private ws: WebSocket | null = null;
  private mic: Mic | null = null;
  private out: AudioContext | null = null;
  private playing = new Set<AudioBufferSourceNode>();
  private at = 0;
  private timer = 0;
  private closed = false;
  private state: LiveState = 'connecting';

  constructor(private h: LiveHandlers) {}

  private set(s: LiveState) {
    if (s !== this.state) {
      this.state = s;
      this.h.onState(s);
    }
  }

  private send(msg: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  async start(conn: { token: string; url: string; model: string; maxSeconds: number }, context: LiveContext) {
    const AC = Ctx();
    if (!AC) return this.finish('unsupported');
    this.out = new AC();
    if (this.out.state === 'suspended') await this.out.resume().catch(() => undefined);
    const ws = new WebSocket(`${conn.url}?access_token=${encodeURIComponent(conn.token)}`);
    this.ws = ws;
    ws.onopen = () => this.send({ setup: { model: conn.model } });
    ws.onerror = () => this.finish('error');
    ws.onclose = () => this.finish(this.closed ? 'ended' : 'error');
    ws.onmessage = async (e: MessageEvent<string | Blob>) => {
      let msg: ServerMsg;
      try {
        msg = JSON.parse(typeof e.data === 'string' ? e.data : await e.data.text()) as ServerMsg;
      } catch {
        return;
      }
      await this.handle(msg, context);
    };
    this.timer = window.setTimeout(() => this.finish('timeout'), conn.maxSeconds * 1000);
  }

  private async handle(msg: ServerMsg, context: LiveContext) {
    if (msg.setupComplete !== undefined) {
      // Earlier text chat as context, without asking for an answer.
      if (context.length) this.send({ clientContent: { turns: context.map((t) => ({ role: t.role, parts: [{ text: t.text }] })), turnComplete: false } });
      try {
        this.mic = await openMic(
          (pcm) => this.send({ realtimeInput: { audio: { data: bytesToBase64(new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength)), mimeType: 'audio/pcm;rate=16000' } } }),
          (level) => this.h.onLevel(level),
        );
      } catch (err) {
        this.finish(micError(err));
        return;
      }
      this.set('listening');
      return;
    }
    const sc = msg.serverContent;
    if (sc) {
      if (sc.interrupted) this.stopPlayback();
      if (sc.inputTranscription?.text) {
        this.h.onUserText(sc.inputTranscription.text);
        if (this.state === 'listening') this.set('hearing');
      }
      if (sc.outputTranscription?.text) this.h.onModelText(sc.outputTranscription.text);
      for (const part of sc.modelTurn?.parts ?? []) {
        if (part.inlineData?.data) this.play(part.inlineData.data, part.inlineData.mimeType ?? 'audio/pcm;rate=24000');
      }
      if (sc.turnComplete) {
        this.h.onTurnEnd();
        if (!this.playing.size) this.set('listening');
      } else if (this.state === 'hearing' && !sc.inputTranscription) {
        this.set('thinking');
      }
    }
    if (msg.toolCall?.functionCalls?.length) {
      this.set('thinking');
      const responses = await Promise.all(
        msg.toolCall.functionCalls.map(async (fc) => ({ id: fc.id, name: fc.name, response: await this.h.onToolCall({ id: fc.id, name: fc.name, args: fc.args ?? {} }).catch(() => ({ error: 'The price could not be worked out just now. Offer the pricing page or the phone number instead.' })) })),
      );
      this.send({ toolResponse: { functionResponses: responses } });
    }
    if (msg.goAway !== undefined) this.finish('timeout');
  }

  private play(b64: string, mime: string) {
    const ctx = this.out;
    if (!ctx) return;
    const buffer = pcmBuffer(ctx, base64ToBytes(b64), rateFrom(mime));
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    this.at = Math.max(this.at, ctx.currentTime + 0.03);
    src.start(this.at);
    this.at += buffer.duration;
    this.playing.add(src);
    this.set('speaking');
    src.onended = () => {
      this.playing.delete(src);
      if (!this.playing.size && !this.closed) this.set('listening');
    };
  }

  private stopPlayback() {
    this.playing.forEach((s) => {
      try {
        s.stop();
      } catch {
        // not started
      }
    });
    this.playing.clear();
    this.at = 0;
  }

  end() {
    this.finish('ended');
  }

  private finish(reason: Parameters<LiveHandlers['onEnd']>[0]) {
    if (this.closed) return;
    this.closed = true;
    window.clearTimeout(this.timer);
    this.mic?.stop();
    this.stopPlayback();
    if (this.ws && this.ws.readyState <= WebSocket.OPEN) this.ws.close();
    this.out?.close().catch(() => undefined);
    this.h.onEnd(reason);
  }
}
