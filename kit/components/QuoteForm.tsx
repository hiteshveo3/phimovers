import { useEffect, useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, RESPONSE_PROMISE, whatsappLink } from '../site-facts';
import { isFirebaseConfigured } from '../../lib/firebase/config';
import { getFirebaseAuth } from '../../lib/firebase/client';
import { trackEvent } from '../analytics';
import Select from './ui/Select';
import {
  CALLBACKS, FLOORS, QUOTE_SIZES, cleanRequest, dayChips, emptyRequest, formatPostcode, guidePrice, requestRows, summaryText,
  validateContact, validateMove, type Errors, type QuoteRequest,
} from '../../lib/quote/model';
import { maskMobile } from '../../lib/booking-flow/model';

// Quote request form: step 1 = the move, step 2 = contact details. Posts to /api/leads, which saves the lead
// on the server (rate-limited, honeypot) and emails the office and the customer. If the server cannot take
// it, the form says so and offers call, WhatsApp and a ready-written email: never a silent success.
// A quote request, never a booking (that is /book).

// One error style across the site: plain red-brown text, no box, no icon.
const ERR: React.CSSProperties = { margin: 0, fontSize: 14, lineHeight: 1.45, fontWeight: 500, color: '#8c1f1f' };

function Chips({ label, options, value, onChange, id }: { label: string; options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; id: string }) {
  const values = options.map((o) => o.value);
  return (
    <div className="qf-group">
      <p className="qf-label" id={id}>{label}</p>
      <div className="pb-chips" role="radiogroup" aria-labelledby={id}
        onKeyDown={(e) => {
          if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
          e.preventDefault();
          const i = Math.max(0, values.indexOf(value));
          const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
          const next = (i + (forward ? 1 : values.length - 1)) % values.length;
          onChange(values[next]);
          (e.currentTarget.children[next] as HTMLElement | undefined)?.focus();
        }}
      >
        {options.map((o, i) => (
          <button key={o.value || 'flex'} type="button" role="radio" aria-checked={o.value === value} tabIndex={o.value === value || (!values.includes(value) && i === 0) ? 0 : -1} className="dc-pick pb-chip" onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

/** Copies text; the hidden-textarea route covers browsers without the async clipboard. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = text;
    t.style.position = 'fixed';
    t.style.opacity = '0';
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  }
}

type Done = { reference: string; emailed: boolean } | { offline: true };

export default function QuoteForm({ serviceTitle = 'House Removals' }: { serviceTitle?: string } = {}) {
  const uid = useId();
  const pathname = usePathname();
  const [step, setStep] = useState<1 | 2>(1);
  const [q, setQ] = useState<QuoteRequest>(() => emptyRequest(serviceTitle));
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<Done | null>(null);
  const [copied, setCopied] = useState(false);
  const days = dayChips();

  // Prefill from links such as /contact?service=sofa-delivery&size=2bed&from=RM8%202UT#quote.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const size = p.get('size');
    const from = p.get('from');
    const to = p.get('to');
    const service = p.get('service');
    setQ((x) => ({
      ...x,
      ...(size && QUOTE_SIZES.some((s) => s.id === size) ? { size } : {}),
      ...(from ? { from: formatPostcode(from).slice(0, 10) } : {}),
      ...(to ? { to: formatPostcode(to).slice(0, 10) } : {}),
      ...(service && serviceTitle === 'House Removals' ? { service: service.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 80) } : {}),
    }));
  }, [serviceTitle]);

  const set = (p: Partial<QuoteRequest>) => {
    setQ((x) => ({ ...x, ...p }));
    setErrors((e) => {
      const keys = Object.keys(e).filter((k) => !(k in p));
      return keys.length === Object.keys(e).length ? e : Object.fromEntries(keys.map((k) => [k, e[k as keyof QuoteRequest]]));
    });
  };

  const focusFirst = (err: Errors) => {
    const first = Object.keys(err)[0];
    if (first) requestAnimationFrame(() => document.getElementById(`${uid}-${first}`)?.focus());
  };

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateMove(q);
    setErrors(err);
    if (Object.keys(err).length) return focusFirst(err);
    setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const request = cleanRequest({ ...q, source: pathname || '/' });
    const err = validateContact(request);
    setErrors(err);
    if (Object.keys(err).length) return focusFirst(err);
    setBusy(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const user = isFirebaseConfigured() ? getFirebaseAuth().currentUser : null;
      if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;
      const r = await fetch('/api/leads', { method: 'POST', headers, body: JSON.stringify({ request, company: honeypot }) });
      const j = (await r.json().catch(() => ({}))) as { id?: string; reference?: string; emailed?: boolean; errors?: Errors };
      if (r.ok) {
        // Measured only once the server has saved it, with the lead id and no personal data.
        if (j.id) trackEvent({ action: 'generate_lead', category: 'quote', label: request.service, params: { submission_id: j.id, form: 'quote' } });
        setDone({ reference: j.reference ?? '', emailed: Boolean(j.emailed) });
      } else if (r.status === 400 && j.errors) {
        setErrors(j.errors);
        if (j.errors.from || j.errors.to || j.errors.date) setStep(1);
        focusFirst(j.errors);
      } else if (r.status === 429) {
        setError(`Too many requests from this connection. Please call ${PHONE_DISPLAY} or WhatsApp us and we will quote straight away.`);
      } else {
        setDone({ offline: true });
      }
    } catch {
      setDone({ offline: true });
    } finally {
      setBusy(false);
    }
  };

  const field = (key: keyof QuoteRequest, label: string, props: { type?: string; autoComplete?: string; placeholder?: string; inputMode?: 'tel' | 'email' | 'text'; optional?: boolean; mask?: (v: string) => string; onBlur?: () => void }) => (
    <div className="qf-field">
      <label htmlFor={`${uid}-${key}`} className="qf-label">{label}{props.optional ? ' (optional)' : ''}</label>
      <input
        id={`${uid}-${key}`}
        className="qf-input"
        type={props.type ?? 'text'}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        value={String(q[key] ?? '')}
        onChange={(e) => set({ [key]: props.mask ? props.mask(e.target.value) : e.target.value } as Partial<QuoteRequest>)}
        onBlur={props.onBlur}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${uid}-${key}-err` : undefined}
      />
      {errors[key] && <p className="qf-err" style={ERR} id={`${uid}-${key}-err`} role="alert">{errors[key]}</p>}
    </div>
  );

  const floorBox = (which: 'from' | 'to') => {
    const floorKey = which === 'from' ? 'fromFloor' : 'toFloor';
    const liftKey = which === 'from' ? 'fromLift' : 'toLift';
    return (
      <div className="qf-field">
        <label className="qf-label" htmlFor={`${uid}-${floorKey}`}>{which === 'from' ? 'Floor you move from' : 'Floor you move to'}</label>
        <Select id={`${uid}-${floorKey}`} value={q[floorKey]} onChange={(v) => set({ [floorKey]: v, ...(v === 'Ground' ? { [liftKey]: false } : {}) } as Partial<QuoteRequest>)} options={FLOORS.map((f) => ({ value: f, label: f === 'Ground' ? 'Ground floor' : `${f} floor` }))} />
        {q[floorKey] !== 'Ground' && (
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
            <input type="checkbox" checked={q[liftKey]} onChange={(e) => set({ [liftKey]: e.target.checked } as Partial<QuoteRequest>)} style={{ width: 18, height: 18, accentColor: 'var(--ink)' }} />
            There is a lift
          </label>
        )}
      </div>
    );
  };

  const summary = summaryText(q, done && 'reference' in done ? done.reference : undefined);

  if (done) {
    const offline = 'offline' in done;
    const ref = offline ? '' : done.reference;
    const wa = whatsappLink(ref ? `Hi Phi Movers, a question about my quote request ${ref}.` : summary);
    return (
      <div className="qf qf-done" role="status">
        <h3>{offline ? 'We could not send this online' : 'Request sent'}</h3>
        {offline ? (
          <p>Our system did not take your request just now, so nothing has been sent yet. Please call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>, send it on WhatsApp, or email it to us: your answers are typed in for you.</p>
        ) : (
          <>
            {ref && <p><span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>Your reference</span><strong style={{ fontFamily: 'var(--display, "Bricolage Grotesque"), sans-serif', fontSize: 30, fontWeight: 500, letterSpacing: '.02em' }}>{ref}</strong></p>}
            <p>{RESPONSE_PROMISE}, by phone or email.{done.emailed ? ' A copy is on its way to your inbox.' : ''}</p>
            {ref && <p><a href={`/track?ref=${encodeURIComponent(ref)}`}>Track this request</a> · <a href="/client">Open My Phi</a></p>}
          </>
        )}
        <div className="pb-cta">
          <a className="dc-btn dc-btn-white" style={{ fontSize: 15, padding: '12px 18px' }} href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
          <a className="dc-btn dc-btn-white" style={{ fontSize: 15, padding: '12px 18px' }} href={wa} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          {offline && <a className="dc-btn dc-btn-white" style={{ fontSize: 15, padding: '12px 18px' }} href={`mailto:${EMAIL}?subject=${encodeURIComponent('Quote request')}&body=${encodeURIComponent(summary)}`}>Email it</a>}
        </div>
        <div className="qf-actions">
          <button type="button" className="dc-btn dc-btn-white" style={{ fontSize: 14, padding: '10px 16px' }} onClick={async () => setCopied(await copyText(summary))}>Copy summary</button>
          <span className="qf-copied" aria-live="polite">{copied ? 'Copied' : ''}</span>
          {offline && <button type="button" className="dc-btn dc-btn-white" style={{ fontSize: 14, padding: '10px 16px' }} onClick={() => { setDone(null); setStep(2); }}>Try again</button>}
          {!offline && <button type="button" className="dc-btn dc-btn-white" style={{ fontSize: 14, padding: '10px 16px' }} onClick={() => { setDone(null); setStep(1); setCopied(false); }}>Change my answers</button>}
        </div>
      </div>
    );
  }

  const guide = guidePrice(q.size);

  return (
    <div className="qf">
      <h3>Get my free fixed quote</h3>
      <p className="qf-why" style={{ marginTop: -6 }}>Start in under a minute. {RESPONSE_PROMISE}. No obligation, no card required.</p>
      {step === 1 ? (
        <form onSubmit={next} noValidate>
          <div className="qf-two">
            {field('from', 'Moving from (postcode)', { autoComplete: 'postal-code', placeholder: 'e.g. RM8 2UT', mask: (v) => v.toUpperCase().slice(0, 10), onBlur: () => q.from && set({ from: formatPostcode(q.from) }) })}
            {field('to', 'Moving to (postcode)', { placeholder: 'e.g. SW11 1AA', mask: (v) => v.toUpperCase().slice(0, 10), onBlur: () => q.to && set({ to: formatPostcode(q.to) }) })}
          </div>
          <div className="qf-two">
            {floorBox('from')}
            {floorBox('to')}
          </div>
          <Chips id={`${uid}-size`} label="Property size" options={QUOTE_SIZES.map((s) => ({ value: s.id, label: s.label }))} value={q.size} onChange={(v) => set({ size: v })} />
          {guide && <p className="qf-next">Guide price for this size: <b>{guide}</b>. Your fixed quote follows.</p>}
          <Chips id={`${uid}-date`} label="Moving day" options={days} value={q.date} onChange={(v) => set({ date: v })} />
          {errors.date && <p className="qf-err" style={ERR} role="alert">{errors.date}</p>}
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14.5 }}>
            <input type="checkbox" checked={q.packing} onChange={(e) => set({ packing: e.target.checked })} style={{ width: 20, height: 20, accentColor: 'var(--ink)' }} />
            I would like help with packing
          </label>
          <div className="qf-field">
            <label htmlFor={`${uid}-notes`} className="qf-label">Anything awkward? (optional)</label>
            <textarea id={`${uid}-notes`} className="qf-input" rows={3} style={{ overflow: 'auto', resize: 'vertical' }} placeholder="A piano, narrow stairs, no parking, a sofa that has to be dismantled…" value={q.notes} onChange={(e) => set({ notes: e.target.value.slice(0, 1000) })} />
          </div>
          <div className="qf-actions">
            <button type="submit" className="dc-btn dc-btn-lime" style={{ fontSize: 16, padding: '14px 24px' }}>Continue</button>
          </div>
        </form>
      ) : (
        <form onSubmit={submit} noValidate>
          {field('name', 'Your name', { autoComplete: 'name' })}
          <div className="qf-two">
            {field('phone', 'Phone', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '07XXX XXXXXX', mask: maskMobile })}
            {field('email', 'Email', { type: 'email', inputMode: 'email', autoComplete: 'email', optional: true })}
          </div>
          <Chips id={`${uid}-callback`} label="When should we call you back?" options={CALLBACKS.map((c) => ({ value: c.id, label: c.label }))} value={q.callback} onChange={(v) => set({ callback: v as QuoteRequest['callback'] })} />
          {/* Honeypot: bots fill this, humans never see it */}
          <label style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
            Company
            <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </label>
          <dl style={{ margin: 0, display: 'grid', gap: 4, fontSize: 14 }}>
            {requestRows(q).filter((r) => r.label !== 'Call back').map((r) => <div key={r.label} style={{ display: 'flex', gap: 8 }}><dt style={{ color: 'var(--ink-60)', minWidth: 92 }}>{r.label}</dt><dd style={{ margin: 0 }}>{r.value}</dd></div>)}
          </dl>
          {error && <p className="qf-err" style={ERR} role="alert">{error}</p>}
          <div className="qf-actions">
            <button type="button" className="dc-btn dc-btn-white" style={{ fontSize: 16, padding: '14px 24px' }} onClick={() => setStep(1)}>Back</button>
            <button type="submit" disabled={busy} className="dc-btn dc-btn-lime" style={{ fontSize: 16, padding: '14px 24px' }}>{busy ? 'Sending…' : 'Send quote request'}</button>
          </div>
          <p className="qf-next">Or call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>. Your details stay private and there is no card required to enquire. Ready to pick a date? <a href="/book">Book online</a>.</p>
        </form>
      )}
    </div>
  );
}
