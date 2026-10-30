'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Clock as ClockIcon,
  ArrowDown as ArrowDownIcon, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon, ArrowUp as ArrowUpIcon, Category as CategoryIcon, CloseCircle as CloseCircleIcon, Copy as CopyIcon,
  Dislike as DislikeIcon, Edit2 as Edit2Icon, Gallery as GalleryIcon, GalleryAdd as GalleryAddIcon,
  Like1 as Like1Icon, MagicStar as MagicStarIcon, MessageQuestion as MessageQuestionIcon, Microphone2 as Microphone2Icon,
  ReceiptText as ReceiptTextIcon, Setting2 as Setting2Icon, Sound as SoundIcon,
  Stop as StopIcon, TickCircle as TickCircleIcon, Trash as TrashIcon, VolumeHigh as VolumeHighIcon,
} from 'iconsax-reactjs';
import { Ico } from '../Ico';
import { trackEvent } from '../../analytics';
import { api, preparePhoto, streamChat, type Account, type StoredMessage, type Table } from '../../assistant/client';
import { AI_NAME, JOBS, LIMITS, QUOTE_HREF, SERVICES, T, tf, type Settings } from '../../assistant/config';
import { quoteHref, quoteSummary, type Quote } from '../../assistant/quote';
import { PHONE_DISPLAY, PHONE_TEL } from '../../site-facts';
import { canRecord, LiveSession, micError, openMic, playSpeech, wavBase64, type LiveCall, type LiveState, type Mic } from './audio';
import { AccountSheet, sampleKey } from './AccountSheet';
import { QuoteCard } from './QuoteCard';
import { Markdown, plainText, TableView } from './Rich';
import { PANEL_CSS } from './styles';

// The "Ask Phi" chat panel: streamed answers with guide-price cards, photos, voice messages,
// read-aloud, Live Voice, memory and saved conversations. No sign-in: each browser gets its own
// private chat session from the server.

export type Msg = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  photos?: string[];
  photoCount?: number;
  voice?: boolean;
  quote?: Quote;
  booked?: string;
  table?: Table;
  replies?: string[];
  error?: string;
  pending?: boolean;
  vote?: 1 | -1;
  note?: boolean;
  live?: boolean;
};

type Photo = { data: string; mime: 'image/jpeg'; preview: string };
type Status = 'loading' | 'ready' | 'offline' | 'unavailable';
type Rec = { phase: 'idle' | 'asking' | 'recording' | 'sending'; seconds: number };

const KEYS = { msgs: 'phi-chat-msgs', conv: 'phi-chat-conv' };

const store = {
  get(key: string) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string | null) {
    try {
      if (value === null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, value);
    } catch {
      // storage blocked: the chat still works for this page
    }
  },
};

const desktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
const phoneVars = { phone: PHONE_DISPLAY };

function fromStored(m: StoredMessage, id: number): Msg {
  return { id, role: m.role, content: m.content, voice: m.voice, photoCount: m.photos, quote: m.quote, table: m.table, replies: m.replies };
}

function errorText(code: string): string {
  const e = T.errors as Record<string, string>;
  return tf(e[code] ?? e.unavailable, phoneVars);
}

function Avatar({ size = 28 }: { size?: 28 | 44 | 64 }) {
  const icon = { 28: 16, 44: 26, 64: 38 }[size];
  return (
    <span aria-hidden="true" className="amc-avatar" style={{ width: size, height: size, borderRadius: 999 }}>
      <Ico icon={MagicStarIcon} size={icon} variant="Bold" />
    </span>
  );
}

export default function AssistantPanel({ open, onClose, prompt }: { open: boolean; onClose: () => void; prompt?: { text: string; n: number } }) {
  const [status, setStatus] = useState<Status>('loading');
  const [account, setAccount] = useState<Account | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [conv, setConv] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const [draft, setDraft] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pick, setPick] = useState<null | 'quote' | 'services'>(null);
  const [sheet, setSheet] = useState(false);
  const [notice, setNotice] = useState('');
  const [rec, setRec] = useState<Rec>({ phase: 'idle', seconds: 0 });
  const [live, setLive] = useState<LiveState | null>(null);
  const [speaking, setSpeaking] = useState<{ id: number; loading: boolean } | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [dragging, setDragging] = useState(false);

  const panelRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const levelRef = useRef<HTMLElement | null>(null);
  const setLevelEl = useCallback((el: HTMLElement | null) => { levelRef.current = el; }, []);
  const nextId = useRef(1);
  const msgsRef = useRef<Msg[]>([]);
  const convRef = useRef<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const lastAsk = useRef<{ text: string; photos: Photo[]; voice: boolean } | null>(null);
  const recRef = useRef<{ mic: Mic; chunks: Int16Array[]; started: number; timer: number } | null>(null);
  const liveRef = useRef<LiveSession | null>(null);
  const liveTurn = useRef<{ user?: number; bot?: number }>({});
  const liveIds = useRef<number[]>([]);
  const speakStop = useRef<(() => void) | null>(null);
  const audioCache = useRef(new Map<string, { audio: string; mime: string }>());
  const restored = useRef(false);

  msgsRef.current = msgs;
  convRef.current = conv;
  const nid = () => nextId.current++;

  const signedIn = Boolean(account?.signedIn);
  const settings = account?.settings;

  /* ---------------------------------------------------------------- session */

  const loadSession = useCallback(async () => {
    setStatus('loading');
    // Short wait: a slow session check shows the retry state instead of a long "One moment".
    const res = await api<Account>('/api/chat/session', undefined, 8_000);
    if (!res.ok) {
      setStatus(res.error === 'offline' ? 'offline' : 'unavailable');
      return;
    }
    setAccount(res.data);
    setStatus(res.data.ready ? 'ready' : 'unavailable');
  }, []);

  useEffect(() => {
    // Restore this tab's chat so it survives moving between pages.
    try {
      const saved = JSON.parse(store.get(KEYS.msgs) ?? '[]') as Msg[];
      if (Array.isArray(saved) && saved.length) {
        const list = saved.filter((m) => m && typeof m.content === 'string').map((m) => ({ ...m, id: nid(), pending: false, photos: undefined }));
        setMsgs(list);
      }
    } catch {
      // ignore a broken cache
    }
    setConv(store.get(KEYS.conv) ?? undefined);
    restored.current = true;
    loadSession();
    const onOnline = () => loadSession();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSession]);

  useEffect(() => {
    if (!restored.current) return;
    const keep = msgs.filter((m) => !m.pending).slice(-LIMITS.savedMessages).map(({ photos: _p, pending: _x, ...m }) => m);
    store.set(KEYS.msgs, keep.length ? JSON.stringify(keep) : null);
  }, [msgs]);

  useEffect(() => {
    if (restored.current) store.set(KEYS.conv, conv ?? null);
  }, [conv]);

  /* ---------------------------------------------------------------- open / close */

  useEffect(() => {
    if (!open) return;
    trackEvent({ action: 'assistant_open', category: 'assistant', label: window.location.pathname });
    const t = window.setTimeout(() => {
      if (desktop()) inputRef.current?.focus({ preventScroll: true });
      else panelRef.current?.focus({ preventScroll: true });
    }, 60);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sheet) setSheet(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, sheet]);

  // Phones: lock the page behind the sheet and follow the on-screen keyboard.
  useEffect(() => {
    if (!open || desktop()) return;
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = 'hidden';
    const vv = window.visualViewport;
    const fit = () => {
      if (vv && panelRef.current) panelRef.current.style.setProperty('--amc-vh', `${Math.round(vv.height)}px`);
    };
    fit();
    vv?.addEventListener('resize', fit);
    return () => {
      style.overflow = prev;
      vv?.removeEventListener('resize', fit);
    };
  }, [open]);

  // Closing the panel hangs up Live Voice and stops reading aloud.
  useEffect(() => {
    if (open) return;
    liveRef.current?.end();
    speakStop.current?.();
  }, [open]);

  /* ---------------------------------------------------------------- scrolling */

  const toBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    if (atBottom) toBottom(false);
  }, [msgs, atBottom, toBottom]);

  useEffect(() => {
    if (open) toBottom(false);
  }, [open, toBottom]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (el) setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  /* ---------------------------------------------------------------- messages */

  const patch = useCallback((id: number, change: Partial<Msg> | ((m: Msg) => Partial<Msg>)) => {
    setMsgs((list) => list.map((m) => (m.id === id ? { ...m, ...(typeof change === 'function' ? change(m) : change) } : m)));
  }, []);

  const ask = useCallback(async (text: string, withPhotos: Photo[] = [], voice = false) => {
    const message = text.trim().slice(0, LIMITS.messageChars);
    if ((!message && !withPhotos.length) || abortRef.current) return;
    setPick(null);
    setNotice('');
    lastAsk.current = { text: message, photos: withPhotos, voice };
    const userId = nid();
    const botId = nid();
    setMsgs((list) => [
      ...list.map((m) => (m.replies ? { ...m, replies: undefined } : m)),
      { id: userId, role: 'user', content: message, voice, photos: withPhotos.map((p) => p.preview), photoCount: withPhotos.length || undefined },
      { id: botId, role: 'assistant', content: '', pending: true },
    ]);
    setAtBottom(true);
    setBusy(true);
    setSlow(false);
    const slowTimer = window.setTimeout(() => setSlow(true), 12_000);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    trackEvent({ action: 'assistant_message', category: 'assistant', label: withPhotos.length ? 'photo' : voice ? 'voice' : 'text' });

    let gotText = false;
    const error = await streamChat(
      { message, photos: withPhotos.map((p) => ({ data: p.data, mime: p.mime })), conversation: convRef.current, voice },
      (e) => {
        if (e.t === 'text') {
          if (!gotText) window.clearTimeout(slowTimer);
          gotText = true;
          setSlow(false);
          patch(botId, (m) => ({ content: m.content + e.d }));
        } else if (e.t === 'quote') {
          patch(botId, { quote: e.quote });
          trackEvent({ action: 'assistant_quote', category: 'assistant', label: e.quote.title, value: e.quote.total });
        } else if (e.t === 'table') patch(botId, { table: e.table });
        else if (e.t === 'replies') patch(botId, { replies: e.replies.length ? e.replies : undefined });
        else if (e.t === 'done') setConv(e.conversation);
      },
      ctrl.signal,
    );
    window.clearTimeout(slowTimer);
    abortRef.current = null;
    setBusy(false);
    setSlow(false);
    if (error === 'aborted') {
      patch(botId, { pending: false });
      return;
    }
    if (error) {
      if (error === 'signIn') loadSession();
      if (error === 'notConfigured') setStatus('unavailable');
      patch(botId, { pending: false, error });
    } else {
      patch(botId, { pending: false });
    }
  }, [patch]);

  // A prompt handed in from the page (e.g. an "Ask Phi" button with a question).
  useEffect(() => {
    if (prompt?.text && signedIn) ask(prompt.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt?.n, signedIn]);

  const retry = (botId: number) => {
    const last = lastAsk.current;
    if (!last) return;
    setMsgs((list) => {
      const i = list.findIndex((m) => m.id === botId);
      return i > 0 ? list.slice(0, i - 1) : list;
    });
    window.setTimeout(() => ask(last.text, last.photos, last.voice), 0);
  };

  const restart = () => {
    abortRef.current?.abort();
    liveRef.current?.end();
    speakStop.current?.();
    setMsgs([]);
    setConv(undefined);
    setPick(null);
    setNotice('');
    setSheet(false);
    inputRef.current?.focus();
  };

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    const text = draft.trim() || (photos.length ? (photos.length > 1 ? tf(T.photosQuestion, { count: photos.length }) : T.photoQuestion) : '');
    if (!text && !photos.length) return;
    ask(text, photos);
    setDraft('');
    setPhotos([]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  // Grow the box with its text, up to six lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = '40px';
    el.style.height = `${Math.min(144, el.scrollHeight)}px`;
    el.style.overflowY = el.scrollHeight > 144 ? 'auto' : 'hidden';
  }, [draft]);

  /* ---------------------------------------------------------------- photos */

  const addFiles = async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (!images.length) return;
    const room = LIMITS.photos - photos.length;
    if (images.length > room) setNotice(tf(T.photoLimit, { count: LIMITS.photos }));
    const ready: Photo[] = [];
    for (const f of images.slice(0, Math.max(0, room))) {
      try {
        ready.push(await preparePhoto(f));
      } catch {
        setNotice(T.photoFailed);
      }
    }
    if (ready.length) setPhotos((p) => [...p, ...ready].slice(0, LIMITS.photos));
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!open || !signedIn) return;
    let depth = 0;
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');
    const enter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth += 1;
      setDragging(true);
    };
    const leave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth = Math.max(0, depth - 1);
      if (!depth) setDragging(false);
    };
    const over = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const drop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth = 0;
      setDragging(false);
      if (!panelRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      addFiles(Array.from(e.dataTransfer?.files ?? []));
    };
    const el = panelRef.current;
    el?.addEventListener('dragenter', enter);
    el?.addEventListener('dragleave', leave);
    el?.addEventListener('dragover', over);
    el?.addEventListener('drop', drop);
    return () => {
      el?.removeEventListener('dragenter', enter);
      el?.removeEventListener('dragleave', leave);
      el?.removeEventListener('dragover', over);
      el?.removeEventListener('drop', drop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, signedIn, photos.length]);

  /* ---------------------------------------------------------------- voice message */

  const stopRec = () => {
    const r = recRef.current;
    recRef.current = null;
    if (!r) return null;
    window.clearInterval(r.timer);
    r.mic.stop();
    return r;
  };

  const startRec = async () => {
    if (!account?.voice) return setNotice(T.voice.errors.notConfigured);
    if (!canRecord()) return setNotice(T.voice.errors.unsupported);
    speakStop.current?.();
    setNotice('');
    setRec({ phase: 'asking', seconds: 0 });
    const chunks: Int16Array[] = [];
    try {
      const mic = await openMic((pcm) => chunks.push(pcm), (lv) => levelRef.current?.style.setProperty('--lv', lv.toFixed(3)));
      const started = Date.now();
      const timer = window.setInterval(() => {
        const seconds = Math.floor((Date.now() - started) / 1000);
        setRec((r) => (r.phase === 'recording' ? { ...r, seconds } : r));
        if (seconds >= LIMITS.voiceSeconds) sendRec();
      }, 250);
      recRef.current = { mic, chunks, started, timer };
      setRec({ phase: 'recording', seconds: 0 });
    } catch (err) {
      setRec({ phase: 'idle', seconds: 0 });
      setNotice(T.voice.errors[micError(err)]);
    }
  };

  const cancelRec = () => {
    stopRec();
    setRec({ phase: 'idle', seconds: 0 });
  };

  const sendRec = async () => {
    const r = stopRec();
    if (!r) return;
    const wav = wavBase64(r.chunks);
    if (wav.seconds < 0.6) {
      setRec({ phase: 'idle', seconds: 0 });
      return setNotice(T.voice.errors.tooShort);
    }
    if (wav.peak < 0.01) {
      setRec({ phase: 'idle', seconds: 0 });
      return setNotice(T.voice.quiet);
    }
    setRec({ phase: 'sending', seconds: 0 });
    const res = await api<{ text: string }>('/api/chat/voice', { audio: wav.data }, 60_000);
    setRec({ phase: 'idle', seconds: 0 });
    if (!res.ok) {
      const errs = T.voice.errors as Record<string, string>;
      if (res.error === 'signIn') loadSession();
      return setNotice(errs[res.error] ?? (res.error === 'offline' ? T.errors.offline : T.voice.errors.unavailable));
    }
    trackEvent({ action: 'assistant_voice', category: 'assistant' });
    ask(res.data.text, [], true);
  };

  useEffect(() => () => {
    stopRec();
    liveRef.current?.end();
  }, []);

  /* ---------------------------------------------------------------- read aloud */

  const speakText = async (key: number, text: string, voice?: Settings['voice']) => {
    if (speaking?.id === key) {
      speakStop.current?.();
      return;
    }
    speakStop.current?.();
    setSpeaking({ id: key, loading: true });
    const cacheKey = `${voice ?? settings?.voice}:${text}`;
    let audio = audioCache.current.get(cacheKey);
    if (!audio) {
      const res = await api<{ audio: string; mime: string }>('/api/chat/speak', { text: plainText(text), voice }, 60_000);
      if (!res.ok) {
        setSpeaking(null);
        setNotice(res.error === 'notConfigured' ? T.voice.errors.notConfigured : T.speak.failed);
        return;
      }
      audio = res.data;
      audioCache.current.set(cacheKey, audio);
    }
    try {
      speakStop.current = await playSpeech(audio.audio, audio.mime, () => {
        speakStop.current = null;
        setSpeaking((s) => (s?.id === key ? null : s));
      });
      setSpeaking({ id: key, loading: false });
    } catch {
      setSpeaking(null);
      setNotice(T.speak.failed);
    }
  };

  /* ---------------------------------------------------------------- Live Voice */

  const liveMsg = (role: 'user' | 'assistant'): number => {
    const slot = role === 'user' ? 'user' : 'bot';
    const existing = liveTurn.current[slot];
    if (existing !== undefined) return existing;
    const id = nid();
    liveTurn.current[slot] = id;
    liveIds.current.push(id);
    setMsgs((list) => [...list, { id, role, content: '', voice: true, live: true }]);
    return id;
  };

  const startLive = async () => {
    if (live) {
      liveRef.current?.end();
      return;
    }
    if (!account?.voice) return setNotice(T.voice.errors.notConfigured);
    if (!canRecord()) return setNotice(T.voice.errors.unsupported);
    speakStop.current?.();
    setNotice('');
    setLive('connecting');
    const res = await api<{ token: string; url: string; model: string; maxSeconds: number }>('/api/chat/live', {});
    if (!res.ok) {
      setLive(null);
      return setNotice(res.error === 'notConfigured' ? T.voice.errors.notConfigured : res.error === 'busy' ? T.errors.busy.replace('questions', 'calls') : T.live.unavailable);
    }
    liveTurn.current = {};
    liveIds.current = [];
    trackEvent({ action: 'assistant_live', category: 'assistant' });
    const context = msgsRef.current
      .filter((m) => m.content && !m.error && !m.note)
      .slice(-10)
      .map((m) => ({ role: m.role === 'user' ? ('user' as const) : ('model' as const), text: m.quote ? `${m.content}\n[Price card: ${quoteSummary(m.quote)}]` : m.content }));
    const session = new LiveSession({
      onState: (s) => setLive(s),
      onLevel: (lv) => levelRef.current?.style.setProperty('--lv', lv.toFixed(3)),
      onUserText: (t) => {
        const id = liveMsg('user');
        patch(id, (m) => ({ content: m.content + t }));
      },
      onModelText: (t) => {
        liveTurn.current.user = undefined;
        const id = liveMsg('assistant');
        patch(id, (m) => ({ content: m.content + t }));
      },
      onTurnEnd: () => {
        liveTurn.current = {};
      },
      onToolCall: async (call: LiveCall) => {
        if (call.name !== 'price_quote') return { error: 'Unknown tool' };
        const r = await api<{ quote: Quote }>('/api/chat/quote', { input: call.args });
        if (!r.ok) return { error: 'The price could not be worked out just now. Offer the pricing page or the phone number.' };
        const q = r.data.quote;
        const id = liveMsg('assistant');
        patch(id, { quote: q });
        trackEvent({ action: 'assistant_quote', category: 'assistant', label: q.title, value: q.total });
        return q.onCall ? { shown: true, priced_on_call: true } : { shown: true, summary: quoteSummary(q), total_gbp: q.total, total_high_gbp: q.totalHigh, hours: q.hours };
      },
      onEnd: async (reason) => {
        liveRef.current = null;
        setLive(null);
        levelRef.current?.style.setProperty('--lv', '0');
        if (reason !== 'ended') {
          const errs = T.voice.errors as Record<string, string>;
          setNotice(reason === 'timeout' ? T.live.ended : errs[reason] ?? T.live.unavailable);
        }
        // Save what was said, so the conversation can be reopened later.
        const said = msgsRef.current.filter((m) => liveIds.current.includes(m.id) && (m.content.trim() || m.quote));
        if (!said.length) return;
        const saved = await api<{ conversation: string }>('/api/chat/history', {
          conversation: convRef.current,
          turns: said.map((m) => ({ role: m.role, content: m.content.trim(), quote: m.quote })),
        });
        if (saved.ok) setConv(saved.data.conversation);
      },
    });
    liveRef.current = session;
    await session.start(res.data, context);
  };

  /* ---------------------------------------------------------------- account */

  // Refresh the list of earlier conversations each time the sheet opens.
  useEffect(() => {
    if (!sheet) return;
    api<{ conversations: Account['conversations'] }>('/api/chat/history').then((res) => {
      if (res.ok) setAccount((a) => (a ? { ...a, conversations: res.data.conversations } : a));
    });
  }, [sheet]);


  const saveSettings = async (change: Partial<Settings>) => {
    if (!account?.settings) return;
    const prev = account;
    setAccount({ ...account, settings: { ...account.settings, ...change } });
    const res = await api<Account>('/api/chat/session', { action: 'settings', settings: change });
    if (res.ok) setAccount((a) => ({ ...res.data, voice: a?.voice ?? res.data.voice }));
    else {
      setAccount(prev);
      setNotice(T.account.failed);
    }
  };

  const eraseData = async () => {
    const res = await api<Account>('/api/chat/session', { action: 'erase' });
    if (!res.ok) return setNotice(T.account.failed);
    restart();
    store.set(KEYS.msgs, null);
    store.set(KEYS.conv, null);
    loadSession();
  };

  const openConversation = async (id: string, note: string = T.account.opened) => {
    const res = await api<{ id: string; messages: StoredMessage[] }>(`/api/chat/history?id=${encodeURIComponent(id)}`);
    if (!res.ok) return setNotice(T.account.failed);
    abortRef.current?.abort();
    const list = res.data.messages.map((m) => fromStored(m, nid()));
    setMsgs([...list, { id: nid(), role: 'assistant', content: note, note: true }]);
    setConv(res.data.id);
    setSheet(false);
    setAtBottom(true);
  };

  const download = () => {
    const lines = [T.account.transcriptHeading, new Date().toLocaleString('en-GB'), ''];
    for (const m of msgs) {
      if (m.note || m.pending) continue;
      const who = m.role === 'user' ? T.account.you : AI_NAME;
      lines.push(`${who}${m.voice ? ` (${T.account.spoken})` : ''}: ${plainText(m.content)}`);
      if (m.quote) lines.push(`  ${quoteSummary(m.quote)}`);
      lines.push('');
    }
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phi-movers-chat.txt';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* ---------------------------------------------------------------- render */

  const statusInfo = (() => {
    if (status === 'loading') return { text: T.status.connecting, cls: 'is-wait' };
    if (status === 'offline') return { text: T.status.offline, cls: 'is-off' };
    if (status === 'unavailable') return { text: T.status.unavailable, cls: 'is-off' };
    return { text: T.status.online, cls: '' };
  })();

  const lastBot = useMemo(() => [...msgs].reverse().find((m) => m.role === 'assistant' && !m.note), [msgs]);
  const empty = !msgs.some((m) => !m.note);
  const memoryLast = account?.memory?.on ? account.memory.last : undefined;

  return (
    <section
      ref={panelRef}
      id="phi-assistant"
      className={`amc${open ? ' is-open' : ''}`}
      role="dialog"
      aria-labelledby="amc-title"
      aria-hidden={!open}
      {...(!open ? { inert: '' as unknown as boolean } : {})}
      tabIndex={-1}
    >
      <style dangerouslySetInnerHTML={{ __html: PANEL_CSS }} />
      <header className="amc-head">
        <span className="amc-handle" aria-hidden="true" />
        <div className="amc-head-row">
          <Avatar size={44} />
          <div className="amc-head-txt">
            <h2 id="amc-title" className="amc-title">
              {AI_NAME} <span className="amc-badge">{T.badge}</span>
              <span className={`amc-status ${statusInfo.cls}`} aria-hidden="true"><i />{statusInfo.text}</span>
              <span role="status" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{statusInfo.text}</span>
            </h2>
            <p className="amc-sub">{T.subtitle}</p>
          </div>
          {signedIn && (
            <>
              <button type="button" className="amc-icon-btn" aria-label={T.restart} title={T.restart} onClick={restart} disabled={empty && !sheet}><Ico icon={Edit2Icon} size={20} /></button>
              <button type="button" className="amc-icon-btn" aria-label={T.settings} title={T.settings} aria-pressed={sheet} onClick={() => setSheet((s) => !s)}><Ico icon={Setting2Icon} size={21} /></button>
            </>
          )}
          <button type="button" className="amc-icon-btn" aria-label={T.close} title={T.close} onClick={onClose}><Ico icon={CloseCircleIcon} size={22} /></button>
        </div>
      </header>

      <div className="amc-body">
        {status !== 'ready' || !signedIn ? (
          <div className="amc-scroll" style={{ display: 'flex', flexDirection: 'column' }}>
            <Unavailable status={status} onRetry={loadSession} />
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="amc-scroll" role="log" aria-live="polite" aria-busy={busy} onScroll={onScroll}>
              {empty ? (
                <Welcome
                  pick={pick}
                  setPick={setPick}
                  memoryLast={memoryLast}
                  onAsk={(t) => ask(t)}
                  onPhoto={() => fileRef.current?.click()}
                  onResume={() => account?.conversations?.[0] && openConversation(account.conversations[0].id, T.account.resumed)}
                />
              ) : (
                <div className="amc-log">
                  {msgs.map((m) => (
                    <Message
                      key={m.id}
                      m={m}
                      last={m.id === lastBot?.id}
                      busy={busy}
                      slow={slow}
                      speaking={speaking?.id === m.id ? speaking : null}
                      copied={copied === m.id}
                      onReply={(t) => ask(t)}
                      onRetry={() => retry(m.id)}
                      onSpeak={() => speakText(m.id, m.content)}
                      onCopy={async () => {
                        try {
                          await navigator.clipboard.writeText(plainText(m.content) + (m.quote ? `\n${quoteSummary(m.quote)}` : ''));
                          setCopied(m.id);
                          window.setTimeout(() => setCopied((c) => (c === m.id ? null : c)), 1800);
                        } catch {
                          // clipboard blocked
                        }
                      }}
                      onVote={(v) => {
                        patch(m.id, { vote: v });
                        trackEvent({ action: 'assistant_vote', category: 'assistant', label: v > 0 ? 'helpful' : 'not_helpful' });
                      }}
                      onQuote={(q) => patch(m.id, { quote: q })}
                      onBooked={(ref, q) => patch(m.id, { booked: ref, quote: q })}
                    />
                  ))}
                </div>
              )}
            </div>
            {!atBottom && !empty && (
              <button type="button" className="amc-latest" onClick={() => { setAtBottom(true); toBottom(); }}><Ico icon={ArrowDownIcon} size={15} /> {T.latest}</button>
            )}
            {dragging && <div className="amc-drop">{T.dropHere}</div>}
            {sheet && account && (
              <AccountSheet
                account={account}
                speakingKey={speaking?.id}
                onClose={() => setSheet(false)}
                onSettings={saveSettings}
                onSample={(voice) => speakText(sampleKey(voice), T.account.voiceSample, voice)}
                onOpen={(id) => openConversation(id)}
                onDownload={download}
                canDownload={!empty}
                onErase={eraseData}
              />
            )}
          </>
        )}
      </div>

      {status === 'ready' && signedIn && (
        <div className="amc-foot">
          {notice && (
            <p className="amc-notice" role="alert">
              <span>{notice}</span>
              <button type="button" className="amc-link" onClick={() => setNotice('')} aria-label="Dismiss"><Ico icon={CloseCircleIcon} size={17} /></button>
            </p>
          )}
          {photos.length > 0 && (
            <div className="amc-chips-photos">
              {photos.map((p, i) => (
                <span key={p.preview}>
                  <img src={p.preview} alt={`${T.addPhoto} ${i + 1}`} />
                  <button type="button" aria-label={T.removePhoto} onClick={() => setPhotos((list) => list.filter((x) => x !== p))}><Ico icon={CloseCircleIcon} size={14} /></button>
                </span>
              ))}
            </div>
          )}
          {live ? (
            <div className="amc-live" role="status">
              <span ref={setLevelEl} className={`amc-orb${live === 'speaking' ? ' is-speaking' : ''}`} aria-hidden="true"><Ico icon={SoundIcon} size={20} /></span>
              <span className="amc-live-txt">
                <b>{T.live.title}</b>
                <span>{T.live[live]}</span>
              </span>
              <button type="button" className="amc-btn" onClick={() => liveRef.current?.end()}><Ico icon={StopIcon} size={16} variant="Bold" /> {T.live.stop}</button>
            </div>
          ) : rec.phase !== 'idle' ? (
            <div className="amc-composer">
              <button type="button" className="amc-icon-btn" aria-label={T.voice.cancel} title={T.voice.cancel} onClick={cancelRec} disabled={rec.phase === 'sending'}><Ico icon={TrashIcon} size={20} /></button>
              <div className="amc-rec" role="status">
                {rec.phase === 'recording' ? (
                  <>
                    <span className="amc-rec-dot" aria-hidden="true" />
                    <span>{T.voice.listening} {Math.floor(rec.seconds / 60)}:{String(rec.seconds % 60).padStart(2, '0')}</span>
                    <span className="amc-meter" aria-hidden="true"><i ref={setLevelEl} /></span>
                  </>
                ) : (
                  <span>{rec.phase === 'asking' ? T.voice.asking : T.voice.sending}</span>
                )}
              </div>
              <button type="button" className="amc-send" aria-label={T.voice.send} title={T.voice.send} onClick={sendRec} disabled={rec.phase !== 'recording'}><Ico icon={ArrowUpIcon} size={20} /></button>
            </div>
          ) : (
            <form className="amc-composer" onSubmit={send}>
              <button type="button" className="amc-icon-btn" aria-label={T.addPhoto} title={T.addPhoto} onClick={() => fileRef.current?.click()} disabled={photos.length >= LIMITS.photos}><Ico icon={GalleryAddIcon} size={21} /></button>
              <label htmlFor="amc-message" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Message</label>
              <textarea
                id="amc-message"
                ref={inputRef}
                dir="auto"
                rows={1}
                maxLength={LIMITS.messageChars}
                enterKeyHint="send"
                placeholder={photos.length ? T.photoPlaceholder : tf(T.placeholder, {})}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onPaste={(e) => {
                  const files = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith('image/'));
                  if (files.length) {
                    e.preventDefault();
                    addFiles(files);
                  }
                }}
              />
              {account?.voice && (
                <>
                  <button type="button" className="amc-icon-btn" aria-label={T.voice.start} title={T.voice.start} onClick={startRec} disabled={busy}><Ico icon={Microphone2Icon} size={21} /></button>
                  <button type="button" className="amc-icon-btn" aria-label={T.live.start} title={T.live.title} onClick={startLive} disabled={busy}><Ico icon={SoundIcon} size={21} /></button>
                </>
              )}
              <button type="submit" className="amc-send" aria-label={T.send} title={T.send} disabled={busy || (!draft.trim() && !photos.length)}><Ico icon={ArrowUpIcon} size={20} /></button>
            </form>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              addFiles(Array.from(e.target.files ?? []));
              e.target.value = '';
            }}
          />
          <p className="amc-foot-note">{T.footnote} <a href={quoteHref()}>{T.footnoteLink}</a></p>
        </div>
      )}
    </section>
  );
}

/* ================================================================ pieces */

function Unavailable({ status, onRetry }: { status: Status; onRetry: () => void }) {
  if (status === 'loading') {
    return (
      <div className="amc-gate">
        <Avatar size={64} />
        <p style={{ marginTop: 18 }}>{T.gate.checking}</p>
      </div>
    );
  }
  // The assistant is not switched on (no AI key or storage on this server), or the visitor is offline:
  // every way to reach the team still works from here.
  return (
    <div className="amc-gate amc-in">
      <Avatar size={64} />
      <h3>{T.gate.invite}</h3>
      <p>{status === 'offline' ? T.errors.offline : tf(T.errors.notConfigured, phoneVars)}</p>
      <div className="amc-form" style={{ alignItems: 'stretch' }}>
        <a className="amc-btn amc-btn-primary" href={QUOTE_HREF}>{T.footnoteLink} <Ico icon={ArrowRightIcon} size={17} /></a>
        <a className="amc-btn" href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
        {(status === 'offline' || status === 'unavailable') && <button type="button" className="amc-link" onClick={onRetry}>{T.retry}</button>}
      </div>
    </div>
  );
}

function Welcome({ pick, setPick, memoryLast, onAsk, onPhoto, onResume }: {
  pick: null | 'quote' | 'services';
  setPick: (p: null | 'quote' | 'services') => void;
  memoryLast?: { topic: string; at: number };
  onAsk: (text: string) => void;
  onPhoto: () => void;
  onResume: () => void;
}) {
  if (pick) {
    const list = pick === 'quote' ? JOBS.map((j) => j.label) : SERVICES.map((s) => s.label);
    return (
      <div className="amc-in">
        <button type="button" className="amc-link amc-back" onClick={() => setPick(null)}><Ico icon={ArrowLeftIcon} size={15} /> {T.actions.back}</button>
        <p className="amc-pick-title">{pick === 'quote' ? T.actions.quoteTitle : T.actions.servicesTitle}</p>
        <ul className="amc-pick">
          {list.map((label) => (
            <li key={label}>
              <button type="button" onClick={() => onAsk(tf(pick === 'quote' ? T.actions.quoteAsk : T.actions.aboutAsk, { service: label }))}>{label} <Ico icon={ArrowRightIcon} size={16} /></button>
            </li>
          ))}
        </ul>
        {pick === 'services' && <p style={{ margin: '12px 0 0' }}><a className="amc-link" href="/services">{T.actions.allServices}</a></p>}
      </div>
    );
  }
  const tiles = [
    { icon: ReceiptTextIcon, title: T.actions.quote, hint: T.actions.quoteHint, onClick: () => setPick('quote') },
    { icon: ClockIcon, title: T.actions.book, hint: T.actions.bookHint, href: QUOTE_HREF },
    { icon: CategoryIcon, title: T.actions.services, hint: T.actions.servicesHint, onClick: () => setPick('services') },
    { icon: GalleryIcon, title: T.actions.photo, hint: T.actions.photoHint, onClick: onPhoto },
  ];
  return (
    <div>
      <div className="amc-hello amc-in">
        <Avatar size={64} />
        <p className="amc-hello-1">{T.hello}</p>
        <p className="amc-hello-2">{T.welcome}</p>
      </div>
      {memoryLast && (
        <div className="amc-memory amc-in">
          <p><b>{T.memory.back}</b> {tf(T.memory.lastTime, { topic: memoryLast.topic })}</p>
          <button type="button" className="amc-link" onClick={onResume}>{T.memory.resume} <Ico icon={ArrowRightIcon} size={14} /></button>
        </div>
      )}
      <ul className="amc-tiles">
        {tiles.map((t, i) => (
          <li key={t.title} className="amc-in" style={{ animationDelay: `${150 + i * 60}ms` }}>
            {t.href ? (
              <a className="amc-tile" href={t.href}><span className="amc-tile-ico"><Ico icon={t.icon} size={20} /></span><span><b>{t.title}</b><small>{t.hint}</small></span></a>
            ) : (
              <button type="button" className="amc-tile" onClick={t.onClick}><span className="amc-tile-ico"><Ico icon={t.icon} size={20} /></span><span><b>{t.title}</b><small>{t.hint}</small></span></button>
            )}
          </li>
        ))}
      </ul>
      <p className="amc-try">{T.tryAsking}</p>
      <div className="amc-starters">
        {T.starters.map((s, i) => (
          <button key={s} type="button" className="amc-starter amc-in" style={{ animationDelay: `${420 + i * 60}ms` }} onClick={() => onAsk(s)}><Ico icon={MessageQuestionIcon} size={16} /> {s}</button>
        ))}
      </div>
    </div>
  );
}

function Message({ m, last, busy, slow, speaking, copied, onReply, onRetry, onSpeak, onCopy, onVote, onQuote, onBooked }: {
  m: Msg;
  last: boolean;
  busy: boolean;
  slow: boolean;
  speaking: { id: number; loading: boolean } | null;
  copied: boolean;
  onReply: (t: string) => void;
  onRetry: () => void;
  onSpeak: () => void;
  onCopy: () => void;
  onVote: (v: 1 | -1) => void;
  onQuote: (q: Quote) => void;
  onBooked: (ref: string, q: Quote) => void;
}) {
  if (m.note) return <p className="amc-note amc-in">{m.content}</p>;
  if (m.role === 'user') {
    return (
      <div className="amc-msg is-user amc-in">
        {m.photos?.length ? (
          <div className="amc-photos">{m.photos.map((src, i) => <img key={src} src={src} alt={`Photo ${i + 1}`} />)}</div>
        ) : m.photoCount ? (
          <p className="amc-photo-count"><Ico icon={GalleryIcon} size={14} /> {m.photoCount} photo{m.photoCount > 1 ? 's' : ''}</p>
        ) : null}
        {(m.content || m.voice) && (
          <div className="amc-bubble">
            {m.voice && <p className="amc-bubble-meta"><Ico icon={Microphone2Icon} size={13} /> {T.voice.note}</p>}
            {m.content}
          </div>
        )}
      </div>
    );
  }
  const done = !m.pending && !m.error && Boolean(m.content);
  return (
    <div className="amc-bot amc-in">
      <Avatar size={28} />
      <div className="amc-bot-body">
        {m.pending && !m.content && !m.quote && (
          <p className="amc-typing" aria-label={T.typing}><span className="amc-dots" aria-hidden="true"><i /><i /><i /></span>{slow ? T.slow : null}</p>
        )}
        {m.content && <div className="amc-text"><Markdown text={m.content} /></div>}
        {m.table && <TableView table={m.table} />}
        {m.quote && <QuoteCard quote={m.quote} booked={m.booked} onQuote={onQuote} onBooked={onBooked} />}
        {m.error && (
          <p className="amc-msg-err" role="alert">
            {errorText(m.error)}
            {m.error !== 'signIn' && m.error !== 'refused' && <button type="button" className="amc-link" onClick={onRetry}>{T.retry}</button>}
          </p>
        )}
        {done && !m.live && (
          <div className="amc-actions">
            <button type="button" className="amc-icon-btn" aria-label={speaking && !speaking.loading ? T.speak.stop : speaking ? T.speak.loading : T.speak.play} title={speaking && !speaking.loading ? T.speak.stop : T.speak.play} aria-pressed={Boolean(speaking)} onClick={onSpeak}>
              <Ico icon={speaking && !speaking.loading ? StopIcon : VolumeHighIcon} size={17} />
            </button>
            <button type="button" className="amc-icon-btn" aria-label={copied ? T.copied : T.copy} title={copied ? T.copied : T.copy} onClick={onCopy}><Ico icon={copied ? TickCircleIcon : CopyIcon} size={17} /></button>
            {m.vote ? (
              <span className="amc-thanks">{T.thanks}</span>
            ) : (
              <>
                <button type="button" className="amc-icon-btn" aria-label={T.helpful} title={T.helpful} onClick={() => onVote(1)}><Ico icon={Like1Icon} size={17} /></button>
                <button type="button" className="amc-icon-btn" aria-label={T.notHelpful} title={T.notHelpful} onClick={() => onVote(-1)}><Ico icon={DislikeIcon} size={17} /></button>
              </>
            )}
          </div>
        )}
        {last && !busy && m.replies?.length ? (
          <div className="amc-replies" role="group" aria-label={T.repliesLabel}>
            {m.replies.map((r) => <button key={r} type="button" className="amc-reply" onClick={() => onReply(r)}>{r}</button>)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
