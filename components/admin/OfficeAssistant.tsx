'use client';

import { Fragment, createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUp as SendIcon, Clock as ClockIcon, CloseCircle as CloseIcon, Copy as CopyIcon, MagicStar as SparkIcon, Notification as BellIcon, TickCircle as TickIcon, WalletMoney as MoneyIcon, Warning2 as WarnIcon } from 'iconsax-reactjs';
import { Ico, type IconType } from '@/kit/components/Ico';
import { staffFetch } from '@/lib/admin/staff-fetch';

// "Ask AI" for the office (as on Alpha Movers): a small chat with Gemini about the live leads, bookings
// and invoices. One conversation is shared by the Home card and the floating button on every other
// screen (OfficeAIProvider in AdminShell), so a question asked on Home can be followed up from Invoices.

const ASSIST = '/api/admin/assistant';
const KEEP = 12;

export type Turn = { q: string; a: string; error?: boolean };
export type OfficeAI = { turns: Turn[]; busy: boolean; ask: (q: string) => void; clear: () => void };

const SUGGESTIONS: { label: string; q: string; icon: IconType }[] = [
  { label: 'Who hasn’t paid?', q: 'Who has not paid yet, and how much does each of them owe?', icon: MoneyIcon },
  { label: 'Jobs this week', q: 'Which jobs are coming up this week? Give the day, time and customer.', icon: ClockIcon },
  { label: 'What’s overdue?', q: 'Which invoices are overdue, and by how much?', icon: WarnIcon },
  { label: 'New leads', q: 'Which new leads and booking requests still need a reply or a confirmation?', icon: BellIcon },
];

export function useOfficeAssistant(): OfficeAI {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const turnsRef = useRef<Turn[]>([]);
  turnsRef.current = turns;

  const ask = useCallback(async (question: string) => {
    const text = question.trim().slice(0, 500);
    if (!text || busy) return;
    const history = turnsRef.current.filter((t) => t.a && !t.error).slice(-4).map((t) => ({ q: t.q, a: t.a }));
    setTurns((t) => [...t, { q: text, a: '' }].slice(-KEEP));
    setBusy(true);
    let answer = '';
    let error = false;
    try {
      const r = await staffFetch(ASSIST, { method: 'POST', body: JSON.stringify({ question: text, history }) });
      const data = (await r.json().catch(() => ({}))) as { answer?: string };
      if (r.ok) answer = data.answer || 'I do not have an answer for that.';
      else {
        error = true;
        answer = r.status === 503 ? 'The assistant is not available right now. It needs GEMINI_API_KEY and the Firebase service account on the server.' : r.status === 401 || r.status === 403 ? 'The server did not accept your staff sign-in. Sign in again.' : 'Something went wrong. Please try again.';
      }
    } catch {
      error = true;
      answer = 'No connection. Check the internet and try again.';
    }
    setTurns((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, a: answer, error } : x)));
    setBusy(false);
  }, [busy]);

  const clear = useCallback(() => setTurns([]), []);
  return { turns, busy, ask: (q) => void ask(q), clear };
}

export const OA_CSS = `
.oa{position:relative;display:grid;gap:14px;padding:18px;border-radius:24px;background:linear-gradient(160deg,#eaf8dc 0%,#fff 58%);border:1px solid rgba(15,26,9,.08);box-shadow:var(--card-shadow)}
.oa-head{display:flex;align-items:center;gap:12px}
.oa-spark{display:grid;place-items:center;flex:none;width:46px;height:46px;border-radius:15px;background:var(--lime);color:#0f1a09}
.oa-head h2{margin:0;font-weight:600;font-size:21px;letter-spacing:-.01em}
.oa-head p{margin:2px 0 0;font-size:13.5px;color:var(--ink-68)}
.oa-clear{margin-left:auto;flex:none;min-height:40px;padding:0 14px;border-radius:999px;border:1px solid rgba(15,26,9,.14);background:#fff;font:inherit;font-size:14px;font-weight:600;color:var(--ink);cursor:pointer}
.oa-suggest{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.oa-chip{display:flex;align-items:center;gap:10px;min-height:58px;padding:10px 14px;border:1px solid rgba(15,26,9,.1);border-radius:16px;background:#fff;font:inherit;font-size:15px;font-weight:600;line-height:1.25;text-align:left;color:var(--ink);cursor:pointer;transition:transform .15s,box-shadow .2s,border-color .2s}
.oa-chip:hover{border-color:#9fe870;box-shadow:0 8px 20px -12px rgba(22,51,0,.4)}
.oa-chip:active{transform:scale(.98)}
.oa-chip svg{flex:none;color:var(--link)}
.oa-more{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}
.oa-more::-webkit-scrollbar{display:none}
.oa-more button{flex:none;min-height:38px;padding:0 13px;border:1px solid rgba(15,26,9,.12);border-radius:999px;background:#fff;font:inherit;font-size:14px;font-weight:600;color:var(--ink);cursor:pointer}
.oa-log{display:flex;flex-direction:column;gap:10px;max-height:min(56vh,480px);overflow-y:auto;padding:2px 2px 4px;scrollbar-width:thin;scrollbar-color:rgba(15,26,9,.18) transparent}
.oa-log::-webkit-scrollbar{width:6px}
.oa-log::-webkit-scrollbar-thumb{background:rgba(15,26,9,.18);border-radius:999px}
.oa-me{align-self:flex-end;max-width:85%;padding:12px 16px;border-radius:20px 20px 6px 20px;background:#0f1a09;color:#fff;font-size:15.5px;line-height:1.45;overflow-wrap:anywhere}
.oa-ai{align-self:flex-start;max-width:94%;padding:14px 16px 12px;border-radius:20px 20px 20px 6px;background:#fff;border:1px solid rgba(15,26,9,.08);font-size:15.5px;line-height:1.6;color:var(--ink);overflow-wrap:anywhere;animation:oa-in .25s ease-out}
.oa-ai.is-err{background:#fdf0f0;color:#8c1f1f;border-color:#f3cccc}
.oa-ai p{margin:0 0 6px}
.oa-ai p:last-child{margin-bottom:0}
.oa-ai ul{margin:2px 0 8px;padding-left:20px}
.oa-ai li{margin:2px 0}
.oa-copy{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:6px 11px;border:0;border-radius:999px;background:var(--grey);font:inherit;font-size:13px;font-weight:600;color:var(--ink-68);cursor:pointer}
.oa-typing{display:flex;gap:6px;padding:18px}
.oa-typing span{width:8px;height:8px;border-radius:50%;background:rgba(15,26,9,.4);animation:oa-dot 1.2s infinite ease-in-out}
.oa-typing span:nth-child(2){animation-delay:.15s}
.oa-typing span:nth-child(3){animation-delay:.3s}
@keyframes oa-dot{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
@keyframes oa-in{from{opacity:0;transform:translateY(6px)}}
.oa-compose{display:flex;align-items:center;gap:8px;padding:6px 6px 6px 18px;border-radius:999px;background:#fff;border:1.5px solid rgba(15,26,9,.14);transition:border-color .2s,box-shadow .2s}
.oa-compose:focus-within{border-color:#0f1a09;box-shadow:0 0 0 4px rgba(159,232,112,.45)}
.oa-compose input{flex:1;min-width:0;height:48px;border:0;outline:0;background:none;font:inherit;font-size:16.5px;color:var(--ink)}
.oa-compose input::placeholder{color:rgba(15,26,9,.45)}
.oa-send{display:grid;place-items:center;flex:none;width:48px;height:48px;border:0;border-radius:999px;background:var(--lime);color:#0f1a09;cursor:pointer;transition:transform .15s,opacity .2s}
.oa-send:disabled{opacity:.4;cursor:default}
.oa-send:not(:disabled):active{transform:scale(.94)}
.oa-note{margin:0;font-size:12.5px;color:var(--ink-60);text-align:center}
.oa-fab{position:fixed;right:16px;bottom:calc(92px + env(safe-area-inset-bottom));z-index:45;display:grid;place-items:center;width:58px;height:58px;padding:0;border:0;border-radius:999px;background:#0f1a09;color:#fff;font:inherit;font-weight:600;box-shadow:0 14px 30px -12px rgba(15,26,9,.6);cursor:pointer;transition:transform .15s}
.oa-fab:active{transform:scale(.95)}
.oa-fab i{display:grid;place-items:center;width:36px;height:36px;border-radius:999px;background:var(--lime);color:#0f1a09}
.oa-fab span{display:none}
@media (min-width:1024px){
  .oa-fab{right:28px;bottom:28px;display:inline-flex;gap:10px;width:auto;height:56px;padding:0 20px 0 10px;font-size:15.5px}
  .oa-fab span{display:inline}
}
.oa-sheet{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center}
.oa-scrim{position:absolute;inset:0;width:100%;border:0;background:rgba(15,26,9,.4);animation:oa-fade .2s ease-out}
.oa-panel{position:relative;width:100%;max-width:560px;max-height:90dvh;overflow-y:auto;border-radius:26px 26px 0 0;background:var(--band-a);padding:14px 12px calc(14px + env(safe-area-inset-bottom));animation:oa-up .3s cubic-bezier(.2,.7,.2,1)}
.oa-panel-top{position:relative;display:flex;justify-content:flex-end;align-items:center;min-height:44px;padding:0 0 8px}
.oa-panel-top::before{content:"";position:absolute;left:50%;top:6px;margin-left:-21px;width:42px;height:5px;border-radius:999px;background:rgba(15,26,9,.18)}
.oa-x{display:grid;place-items:center;width:42px;height:42px;border:0;border-radius:999px;background:#fff;color:var(--ink);cursor:pointer}
@keyframes oa-up{from{transform:translateY(28px);opacity:0}}
@keyframes oa-fade{from{opacity:0}}
@media (min-width:1024px){
  .oa-sheet{justify-content:flex-end;align-items:stretch}
  .oa-panel{max-width:460px;max-height:none;height:100%;border-radius:26px 0 0 26px;padding:18px}
  .oa-panel-top::before{display:none}
}
@media (prefers-reduced-motion:reduce){.oa-typing span,.oa-panel,.oa-ai,.oa-scrim{animation:none}}
`;

/** Bold (**x**) inside a line, as React nodes. */
function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => (part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>));
}

/** Plain text with "- " lists and **bold**, rendered without any HTML from the model. */
function Answer({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) blocks.push(<ul key={`u${blocks.length}`}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>);
    list = [];
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const item = /^(?:[-*•]|\d+[.)])\s+(.*)$/.exec(line);
    if (item) { list.push(item[1]); continue; }
    flush();
    if (line) blocks.push(<p key={`p${blocks.length}`}>{inline(line.replace(/^#+\s*/, ''))}</p>);
  }
  flush();
  return <>{blocks}</>;
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="oa-copy" onClick={() => { void navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1800); }).catch(() => undefined); }}>
      <Ico icon={done ? TickIcon : CopyIcon} size={15} />{done ? 'Copied' : 'Copy'}
    </button>
  );
}

export function OfficeAssistant({ ai, autoFocus = false }: { ai: OfficeAI; autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ai.turns]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim() || ai.busy) return;
    ai.ask(q);
    setQ('');
  };

  return (
    <section className="oa" aria-labelledby="oa-title">
      <div className="oa-head">
        <span className="oa-spark" aria-hidden="true"><Ico icon={SparkIcon} size={22} variant="Bold" /></span>
        <div style={{ minWidth: 0 }}>
          <h2 id="oa-title">Ask AI</h2>
          <p>Knows your live leads, bookings and invoices. English or Roman Urdu.</p>
        </div>
        {ai.turns.length > 0 && <button type="button" className="oa-clear" onClick={ai.clear}>New chat</button>}
      </div>

      {ai.turns.length === 0 ? (
        <div className="oa-suggest">
          {SUGGESTIONS.map((s) => (
            <button key={s.label} type="button" className="oa-chip" onClick={() => ai.ask(s.q)} disabled={ai.busy}>
              <Ico icon={s.icon} size={22} />{s.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="oa-log" ref={logRef} aria-live="polite">
          {ai.turns.map((t, i) => (
            <Fragment key={i}>
              <div className="oa-me">{t.q}</div>
              {t.a
                ? <div className={`oa-ai${t.error ? ' is-err' : ''}`}><Answer text={t.a} />{!t.error && <CopyButton text={t.a} />}</div>
                : <div className="oa-ai oa-typing" aria-label="Thinking"><span /><span /><span /></div>}
            </Fragment>
          ))}
        </div>
      )}

      {ai.turns.length > 0 && !ai.busy && (
        <div className="oa-more" role="group" aria-label="More questions">
          {SUGGESTIONS.map((s) => <button key={s.label} type="button" onClick={() => ai.ask(s.q)}>{s.label}</button>)}
        </div>
      )}

      <form className="oa-compose" onSubmit={send}>
        <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything…" aria-label="Ask AI a question" maxLength={500} enterKeyHint="send" />
        <button type="submit" className="oa-send" aria-label="Send" disabled={ai.busy || !q.trim()}><Ico icon={SendIcon} size={22} /></button>
      </form>
      <p className="oa-note">AI can make mistakes. Check money and dates before you act.</p>
    </section>
  );
}

const OfficeAICtx = createContext<OfficeAI | null>(null);

/** One shared conversation for the whole dashboard, plus the styles. Mounted once in AdminShell. */
export function OfficeAIProvider({ children }: { children: ReactNode }) {
  const ai = useOfficeAssistant();
  return (
    <OfficeAICtx.Provider value={ai}>
      <style dangerouslySetInnerHTML={{ __html: OA_CSS }} />
      {children}
    </OfficeAICtx.Provider>
  );
}

export function useOfficeAI(): OfficeAI {
  const ctx = useContext(OfficeAICtx);
  if (!ctx) throw new Error('useOfficeAI must be used within OfficeAIProvider');
  return ctx;
}

/** The floating "Ask AI" button for every screen except Home, opening the same chat in a sheet. */
export function OfficeAssistantFab({ ai }: { ai: OfficeAI }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {!open && (
        <button type="button" className="oa-fab" aria-label="Ask AI" onClick={() => setOpen(true)}>
          <i aria-hidden="true"><Ico icon={SparkIcon} size={20} variant="Bold" /></i><span>Ask AI</span>
        </button>
      )}
      {open && (
        <div className="oa-sheet" role="dialog" aria-modal="true" aria-label="Ask AI">
          <button type="button" className="oa-scrim" aria-label="Close" onClick={() => setOpen(false)} />
          <div className="oa-panel">
            <div className="oa-panel-top">
              <button type="button" className="oa-x" aria-label="Close" onClick={() => setOpen(false)}><Ico icon={CloseIcon} size={22} /></button>
            </div>
            <OfficeAssistant ai={ai} autoFocus />
          </div>
        </div>
      )}
    </>
  );
}
