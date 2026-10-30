import { useEffect, useId, useMemo, useState } from 'react';
import Select from '../ui/Select';
import { Add as AddIcon, ArrowRight as ArrowRightIcon, Minus as MinusIcon, TickCircle as TickCircleIcon } from 'iconsax-reactjs';
import { Ico } from '../Ico';
import { api } from '../../assistant/client';
import { QUOTE_HREF, T, tf } from '../../assistant/config';
import { emptyDetails, normalisePhone, validateDetails, type Details, type Errors, type Stop } from '../../assistant/booking';
import { addDays, dateBookable, formatDate, londonNow, SLOT_GROUPS, SLOTS } from '../../assistant/dates';
import { CREWS, MAX_HOURS, MIN_HOURS, money, priceText, timeLabel, VAN_IDS, type Quote } from '../../assistant/quote';
import { PHONE_DISPLAY, PHONE_TEL } from '../../site-facts';
import { trackEvent } from '../../analytics';

// The guide-price card the assistant shows: adjustable van and hours (re-priced on the server),
// then "Get a quote" sends a quote request from inside the chat. It is saved as a lead for the
// Phi Movers team, who confirm the fixed quote.

const dayLabel = (iso?: string) => (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? formatDate(iso) : iso ?? '');

export function QuoteCard({ quote, booked, onQuote, onBooked }: {
  quote: Quote;
  booked?: string;
  onQuote: (q: Quote) => void;
  onBooked: (reference: string, q: Quote) => void;
}) {
  const uid = useId();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [mode, setMode] = useState<'card' | 'checkout'>('card');

  const reprice = async (change: Partial<Quote>) => {
    if (busy) return;
    setBusy(true);
    setErr('');
    const res = await api<{ quote: Quote }>('/api/chat/quote', { input: { ...quote, ...change } });
    setBusy(false);
    if (res.ok) onQuote(res.data.quote);
    else setErr(T.quote.failed);
  };

  const hourly = quote.mode === 'hourly';
  const rows: [string, string][] = [[T.quote.rowJob, quote.title]];
  if (quote.sizeLabel) rows.push([T.quote.rowSize, quote.sizeLabel]);
  if (hourly) rows.push([T.quote.rowVan, quote.vanLabel], [T.quote.rowHours, `${quote.hours} hours`]);
  if (quote.from) rows.push([T.quote.rowFrom, quote.from]);
  if (quote.to) rows.push([T.quote.rowTo, quote.to]);
  rows.push([T.quote.rowDay, quote.day ? dayLabel(quote.day) : T.quote.open]);
  if (quote.time) rows.push([T.quote.rowTime, timeLabel(quote.time)]);

  if (booked) {
    return (
      <div className="amc-quote is-booked" role="status">
        <p className="amc-quote-done"><Ico icon={TickCircleIcon} size={20} variant="Bold" /> {tf(T.checkout.booked, { reference: booked })}</p>
        <ul className="amc-quote-rows">{rows.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}</ul>
        <p className="amc-quote-note" style={{ margin: 0 }}>
          <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> · <a href="/client">{T.checkout.track}</a>
        </p>
      </div>
    );
  }

  if (mode === 'checkout') {
    return <Checkout quote={quote} onBack={() => setMode('card')} onBooked={onBooked} />;
  }

  return (
    <div className="amc-quote" aria-busy={busy}>
      <div className="amc-quote-head">
        <span>{T.quote.title}</span>
        <b className={quote.onCall ? 'amc-quote-total is-text' : 'amc-quote-total'}>{priceText(quote)}</b>
      </div>
      <ul className="amc-quote-rows">{rows.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}</ul>

      {quote.mode === 'call' && <p className="amc-quote-note">{T.quote.onCall} <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p>}
      {hourly && (
        <>
          <div className="amc-quote-adjust">
            <div className="amc-quote-field">
              <span className="amc-quote-label" id={`${uid}-van`}>{T.quote.van}</span>
              <div className="amc-seg" role="radiogroup" aria-labelledby={`${uid}-van`}>
                {VAN_IDS.map((id) => (
                  <button key={id} type="button" role="radio" aria-checked={quote.van === id} disabled={busy} onClick={() => quote.van !== id && reprice({ van: id })}>{CREWS[id].short}</button>
                ))}
              </div>
            </div>
            <div className="amc-quote-field">
              <span className="amc-quote-label">{T.quote.hours}</span>
              <div className="amc-stepper">
                <button type="button" aria-label={tf(T.quote.fewer, { what: 'hours' })} disabled={busy || quote.hours <= MIN_HOURS} onClick={() => reprice({ hours: quote.hours - 0.5 })}><Ico icon={MinusIcon} size={16} /></button>
                <output aria-live="polite">{quote.hours} h</output>
                <button type="button" aria-label={tf(T.quote.more, { what: 'hours' })} disabled={busy || quote.hours >= MAX_HOURS} onClick={() => reprice({ hours: quote.hours + 0.5 })}><Ico icon={AddIcon} size={16} /></button>
              </div>
            </div>
          </div>
          <ul className="amc-quote-lines">
            {quote.lines.map((l) => <li key={l.label}><span>{l.label}</span><b>{money(l.amount)}</b></li>)}
          </ul>
          <p className="amc-quote-note">{T.quote.extras} <a href="/pricing">{T.quote.extrasLink}</a></p>
        </>
      )}
      <p className="amc-quote-note">{T.quote.estimate}</p>
      {err && <p className="amc-quote-err" role="alert">{err}</p>}
      <div className="amc-quote-actions">
        <button type="button" className="amc-btn amc-btn-primary" onClick={() => { setMode('checkout'); trackEvent({ action: 'assistant_quote_start', category: 'assistant', label: quote.title }); }}>
          {T.quote.book} <Ico icon={ArrowRightIcon} size={17} />
        </button>
        <a className="amc-link" href={QUOTE_HREF}>{T.quote.fullForm}</a>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- the quote request form */

function Err({ id, msg }: { id: string; msg?: string }) {
  const text = msg ? ((T.checkout.errors as Record<string, string>)[msg] ?? msg) : '';
  return text ? <span id={id} className="amc-quote-err" style={{ margin: 0 }}>{text}</span> : null;
}

function StopFields({ id, title, optional, stop, errors, onChange }: { id: 'from' | 'to'; title: string; optional?: boolean; stop: Stop; errors: Errors; onChange: (s: Stop) => void }) {
  const uid = useId();
  const e = (k: string) => errors[`${id}.${k}`];
  return (
    <fieldset className="amc-fieldset">
      <legend className="amc-quote-label">{title}</legend>
      <div className="amc-grid2">
        <label className="amc-field">{T.checkout.postcode}
          <input value={stop.postcode} onChange={(ev) => onChange({ ...stop, postcode: ev.target.value })} placeholder={id === 'from' ? 'RM8 2UT' : 'E17 4AB'} autoCapitalize="characters" autoComplete={id === 'from' ? 'postal-code' : 'off'} aria-invalid={Boolean(e('postcode'))} aria-describedby={`${uid}-pc`} required={!optional} />
          <Err id={`${uid}-pc`} msg={e('postcode')} />
        </label>
        <label className="amc-field">{T.checkout.line}
          <input value={stop.line} onChange={(ev) => onChange({ ...stop, line: ev.target.value })} autoComplete={id === 'from' ? 'address-line1' : 'off'} />
        </label>
      </div>
    </fieldset>
  );
}

function Checkout({ quote, onBack, onBooked }: { quote: Quote; onBack: () => void; onBooked: (reference: string, q: Quote) => void }) {
  const uid = useId();
  const [d, setD] = useState<Details>(() => emptyDetails(quote));
  const [errors, setErrors] = useState<Errors>({});
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const [today, setToday] = useState('');

  // London dates, worked out after mount so the server render and the browser agree.
  useEffect(() => setToday(londonNow().date), []);
  const days = useMemo(() => (today ? Array.from({ length: 14 }, (_, i) => addDays(today, i)).filter((x) => dateBookable(x)) : []), [today]);
  const dayList = d.date && !days.includes(d.date) ? [d.date, ...days] : days;

  const set = (p: Partial<Details>) => {
    setD((x) => ({ ...x, ...p }));
    setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !Object.keys(p).some((f) => k === f || k.startsWith(`${f}.`)))));
  };

  const single = quote.job === 'single';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const found = validateDetails(quote, d);
    setErrors(found);
    setErr(Object.keys(found).length ? T.checkout.check : '');
    if (Object.keys(found).length) return;
    setSending(true);
    const res = await api<{ reference: string; quote: Quote }>('/api/chat/book', { quote, details: d });
    setSending(false);
    if (!res.ok) {
      setErr(tf(res.status === 429 ? T.checkout.errors.busy : T.checkout.errors.failed, { phone: PHONE_DISPLAY }));
      return;
    }
    trackEvent({ action: 'assistant_quote_request', category: 'assistant', label: quote.title, value: quote.total });
    onBooked(res.data.reference, res.data.quote);
  };

  return (
    <form className="amc-quote amc-checkout" onSubmit={submit} noValidate>
      <div className="amc-quote-head">
        <span>{T.checkout.title}</span>
        <b className={quote.onCall ? 'amc-quote-total is-text' : 'amc-quote-total'}>{priceText(quote)}</b>
      </div>
      <p className="amc-quote-note">{T.checkout.lead}</p>

      <p className="amc-quote-label" id={`${uid}-day`}>{T.checkout.day}</p>
      <div className="amc-days" role="radiogroup" aria-labelledby={`${uid}-day`}>
        {dayList.map((x) => (
          <button key={x} type="button" role="radio" aria-checked={d.date === x} onClick={() => set({ date: d.date === x ? '' : x })}>
            {x === today ? 'Today' : x === addDays(today, 1) ? 'Tomorrow' : formatDate(x, 'short').split(' ')[0]}
            <small>{formatDate(x, 'short').split(' ').slice(1).join(' ')}</small>
          </button>
        ))}
      </div>
      <Err id={`${uid}-day-err`} msg={errors.date} />

      <label className="amc-field">{T.checkout.time}
        <Select value={d.time} onChange={(v) => set({ time: v })} disabled={!d.date} invalid={Boolean(errors.time)} placeholder={d.date ? 'Any time' : 'Pick a day first'} options={[{ value: '', label: 'Any time' }, ...SLOT_GROUPS.flatMap((g) => SLOTS.filter((t) => t >= g.from && t < g.to).map((t) => ({ value: t, label: timeLabel(t), group: g.label })))]} />
        <Err id={`${uid}-time-err`} msg={errors.time} />
      </label>

      <StopFields id="from" title={single ? T.checkout.address : T.checkout.from} stop={d.from} errors={errors} onChange={(from) => set({ from })} />
      {!single && <StopFields id="to" title={T.checkout.to} optional stop={d.to} errors={errors} onChange={(to) => set({ to })} />}

      <div className="amc-grid2">
        <label className="amc-field">{T.checkout.name}
          <input value={d.name} onChange={(ev) => set({ name: ev.target.value })} autoComplete="name" aria-invalid={Boolean(errors.name)} />
          <Err id={`${uid}-name`} msg={errors.name} />
        </label>
        <label className="amc-field">{T.checkout.phone}
          <input type="tel" inputMode="tel" value={d.phone} onChange={(ev) => set({ phone: ev.target.value })} onBlur={() => d.phone && normalisePhone(d.phone) && set({ phone: normalisePhone(d.phone) ?? d.phone })} autoComplete="tel" placeholder="07405 793433" aria-invalid={Boolean(errors.phone)} />
          <Err id={`${uid}-phone`} msg={errors.phone} />
        </label>
      </div>
      <label className="amc-field">{T.checkout.email}
        <input type="email" inputMode="email" value={d.email} onChange={(ev) => set({ email: ev.target.value })} autoComplete="email" aria-invalid={Boolean(errors.email)} />
        <Err id={`${uid}-email`} msg={errors.email} />
      </label>
      <label className="amc-field">{T.checkout.notes}<textarea rows={2} value={d.notes} maxLength={1000} onChange={(ev) => set({ notes: ev.target.value })} /></label>

      <label className="amc-consent">
        <input type="checkbox" checked={d.consent} onChange={(ev) => set({ consent: ev.target.checked })} aria-invalid={Boolean(errors.consent)} />
        <span>{T.checkout.consentBefore} <a href="/terms" target="_blank" rel="noopener">{T.checkout.terms}</a> {T.checkout.consentAnd} <a href="/privacy" target="_blank" rel="noopener">{T.checkout.privacy}</a>.</span>
      </label>
      <Err id={`${uid}-consent`} msg={errors.consent} />

      {err && <p className="amc-quote-err" role="alert">{err}</p>}
      <div className="amc-quote-actions">
        <button type="submit" className="amc-btn amc-btn-primary" disabled={sending}>{sending ? T.checkout.sending : T.checkout.send}</button>
        <button type="button" className="amc-link" onClick={onBack}>{T.checkout.back}</button>
      </div>
    </form>
  );
}
