import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/router';
import {
  Clock as ClockIcon,
  ArchiveBox as ArchiveBoxIcon,
  ArrowCircleUp as ArrowCircleUpIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowLeft2 as ArrowLeft2Icon,
  ArrowRight2 as ArrowRight2Icon,
  ArrowUp2 as ArrowUp2Icon,
  Book1 as Book1Icon,
  Box as BoxIcon,
  Box1 as Box1Icon,
  Briefcase as BriefcaseIcon,
  Building as BuildingIcon,
  Building4 as Building4Icon,
  Buildings2 as Buildings2Icon,
  Call as CallIcon,
  CallCalling as CallCallingIcon,
  Car as CarIcon,
  Category as CategoryIcon,
  Flag as FlagIcon,
  ShieldTick as ShieldTickIcon,
  Home2 as Home2Icon,
  Home as HomeIcon,
  House as HouseIcon,
  I3Dcube as I3DcubeIcon,
  InfoCircle as InfoCircleIcon,
  Location as LocationIcon,
  MagicStar as MagicStarIcon,
  Minus as MinusIcon,
  Add as AddIcon,
  Setting3 as Setting3Icon,
  Sms as SmsIcon,
  TickCircle as TickCircleIcon,
  Truck as TruckIcon,
  Wallet as WalletIcon,
} from 'iconsax-reactjs';
import { Ico, type IconType } from '../../../kit/components/Ico';
import { CtaMark } from '../../../kit/components/HomeMotion';
import { WaIcon, setWhatsAppText } from '../../../kit/components/WhatsApp';
import { CANCELLATION_TEXT, DEPOSIT_TEXT, EMAIL, HOURS_TEXT, INSURED_TEXT, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_TEXT, whatsappLink } from '../../../kit/site-facts';
import { trackEvent } from '../../../kit/analytics';
import { isFirebaseConfigured } from '../../firebase/config';
import { getFirebaseAuth } from '../../firebase/client';
import {
  BOOKING_POLICIES, EMAIL_RE, EXTRAS, FLOORS, HEAVY_ITEMS, HELPERS_MAX, HOURS_MAX, HOURS_MIN, KINDS, NOTE_CHIPS, PARKING, PROPERTY_SIZES,
  SERVICES, SLOT_GROUPS, STEP_LABEL, TABS, TEAMS, addDays, boroughFor, dateBookable, emptyDraft, finishesBy, firstOpening, formatDate, formatPostcode,
  hoursText, isTwoVans, jobHours, londonNow, maskMobile, money, oneAddress, quote, serviceById, serviceFromText, slotLabel, slotOpen, slotsFor, stepOfError, stepsFor, suggestion, summaryRows,
  teamLabel, validateStep, ALL_SLOTS, BOOK_AHEAD_DAYS, POSTCODE, type Draft, type Errors, type ServiceId, type StepId, type Stop, type TabId, type TeamId,
} from '../model';
import { timePrice } from '../price';
import { timeFits } from '../slots';

// The public booking flow (/book), laid out after Alpha's BookingFlow: six steps with a live summary,
// a guest fills in everything and verifies the email only at the review step (or is already signed in to
// My Phi), then a reference. The server prices it again, claims the number and the time, and emails both
// sides. Every fact (rates, deposit, cancellation, hours, phone) is Phi's, from kit/site-facts.ts.

/** Said when the time chosen was booked by someone else a moment before. */
const SLOT_TAKEN = 'This time has just been booked. Please pick another time.';

const SERVICE_ICON: Record<ServiceId, IconType> = {
  house: HomeIcon, flat: Building4Icon, studio: HouseIcon, manvan: TruckIcon, student: Book1Icon, office: BriefcaseIcon, single: I3DcubeIcon,
  sofa: Box1Icon, assembly: Setting3Icon, packing: BoxIcon, storage: ArchiveBoxIcon,
};
const STEP_ICON: Record<StepId, IconType> = { service: CategoryIcon, property: Home2Icon, details: TruckIcon, datetime: ClockIcon, address: LocationIcon, review: TickCircleIcon };
const STEP_HEAD: Record<StepId, { title: string; lead: string }> = {
  service: { title: 'What would you like us to move?', lead: 'Choose one service to start. You will see either a live price or exactly what we need to prepare a quote.' },
  property: { title: 'What are we moving?', lead: 'Your home type and size help us suggest a realistic van, crew and time. You can change both next.' },
  details: { title: 'Set the van, crew and hours', lead: 'Priced from the published rate card: the first two hours, then by the hour.' },
  datetime: { title: 'Choose your preferred moving day', lead: 'Pick a day and a start time. We confirm every slot with you by phone.' },
  address: { title: 'Help the crew reach the right door', lead: 'Both addresses, the floor and the parking, so the right van arrives first time.' },
  review: { title: 'Check everything before you send', lead: 'Nothing is booked yet. We call you to confirm.' },
};

const SESSION_KEY = 'phi-booking-v1';
/** The calculators leave their last van, hours and helpers here for /book to pick up. */
const CALC_KEYS = ['phi-calc', 'am-calc'];
type Session = { loaded: boolean; email: string | null; codes: boolean; store: boolean; mailer: boolean; signedIn: boolean };
type Done = { reference: string; email: string; emailed: boolean; offline?: boolean };

const NEXT_ROWS: { icon: IconType; text: string }[] = [
  { icon: CallIcon, text: `We call you to confirm, ${HOURS_TEXT}.` },
  { icon: TickCircleIcon, text: 'We confirm the van, crew, time and price.' },
  { icon: WalletIcon, text: DEPOSIT_TEXT },
];

const FLOOR_ICON = (f: string): IconType => (f === 'Ground' ? Home2Icon : f.startsWith('5') || f.startsWith('4') ? Buildings2Icon : BuildingIcon);
const PARKING_ICON: IconType[] = [CarIcon, FlagIcon, InfoCircleIcon];

/* ---------- small parts ---------- */

function Choice({ checked, onClick, children, className = '' }: { checked: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button type="button" role="radio" aria-checked={checked} className={`bf-choice ${className}`} onClick={onClick}>
      {children}
      <span className="bf-check" aria-hidden="true"><Ico icon={TickCircleIcon} size={20} variant="Bold" /></span>
    </button>
  );
}

/** Radio-group arrow keys: moves the checked option and the focus together. */
function radioKeys(e: React.KeyboardEvent<HTMLElement>) {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)'));
  const i = items.findIndex((b) => b === document.activeElement);
  if (i < 0) return;
  e.preventDefault();
  const next = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length];
  next.focus();
  next.click();
}

function Chip({ on, onClick, children, disabled }: { on: boolean; onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return <button type="button" aria-pressed={on} className="bf-chip" onClick={onClick} disabled={disabled}>{children}</button>;
}

function Toggle({ on, onClick, icon, children, sub, title }: { on: boolean; onClick: () => void; icon: IconType; children: ReactNode; sub?: string; title?: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} className="bf-toggle" onClick={onClick} title={title}>
      <span className="bf-toggle-ico"><Ico icon={icon} size={20} /></span>
      <span><b>{children}</b>{sub && <small>{sub}</small>}</span>
    </button>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p className="bf-err" id={id} role="alert">{msg}</p> : null;
}

function StepHead({ icon, title, lead, sub = false, compact = false }: { icon: IconType; title: string; lead: string; sub?: boolean; compact?: boolean }) {
  const H = sub ? 'h2' : 'h1';
  if (compact) return <div className="bf-head"><H className="bf-h1">{title}</H></div>;
  return (
    <div className="bf-head">
      <span className="bf-head-ico"><Ico icon={icon} size={22} /></span>
      <div>
        <H className="bf-h1">{title}</H>
        <p className="bf-lead">{lead}</p>
      </div>
    </div>
  );
}

function Primary({ children, onClick, type = 'button', disabled }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} className="bf-primary mo-btn" onClick={onClick} disabled={disabled}>{children} <CtaMark /></button>;
}

/** Facts the visitor is trusting us with, under the summary. Only Phi's published facts. */
function TrustRows() {
  const rows: [IconType, string][] = [
    [WalletIcon, 'Nothing is charged when you ask'],
    [ShieldTickIcon, INSURED_TEXT],
    [ClockIcon, CANCELLATION_TEXT],
  ];
  return (
    <ul className="bf-trust">
      {rows.map(([I, t]) => <li key={t}><Ico icon={I} size={17} />{t}</li>)}
    </ul>
  );
}

/** What each parking answer shows on its button; the full text is the tooltip and what is saved. */
const PARKING_SHORT = ['Yes', 'Permit or bay', 'Not sure'];

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/* ---------- sign in (email code) ---------- */

export function SignIn({ onSignedIn, whatsapp }: { onSignedIn: (email: string) => void; whatsapp?: string }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState('');
  const [devCode, setDevCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const em = email.trim().toLowerCase();
    if (!EMAIL_RE.test(em)) { setError('Please check this email address.'); return; }
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/booking/code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: em }) });
      const j = await r.json().catch(() => ({}));
      if (r.status === 429) setError('Too many codes asked for. Please wait a few minutes, or call us.');
      else if (!r.ok) setError('We could not send the code. Please try again, or call us and we will book it for you.');
      else { setChallenge(j.challenge); setDevCode(j.devCode ?? ''); setEmail(em); setTimeout(() => codeRef.current?.focus(), 50); }
    } catch {
      setError('We could not send the code. Please check your connection and try again.');
    }
    setBusy(false);
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/booking/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, challenge }) });
      if (r.ok) { onSignedIn(email); return; }
      setError(r.status === 429 ? 'Too many tries. Please wait a few minutes.' : 'That code is not right or has expired. Check the email, or send a new code.');
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setBusy(false);
  };

  return (
    <div className="bf-card" data-reveal="">
      <StepHead icon={SmsIcon} title={challenge ? 'Enter the code' : 'Last step: your email address'} lead={challenge ? `We sent a six-digit code to ${email}. It works for 10 minutes.` : 'We send a six-digit code to it. Enter the code, check your booking and send it.'} />
      {!challenge ? (
        <form className="bf-signin" onSubmit={send} noValidate>
          <label className="bf-label" htmlFor="bf-email">Email address</label>
          <div className="bf-inline">
            <input id="bf-email" className="bf-input" type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'bf-email-err' : undefined} />
            <Primary type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send code'}</Primary>
          </div>
          <FieldError id="bf-email-err" msg={error} />
        </form>
      ) : (
        <form className="bf-signin" onSubmit={verify} noValidate>
          <label className="bf-label" htmlFor="bf-code">Six-digit code</label>
          <div className="bf-inline">
            <input id="bf-code" ref={codeRef} className="bf-input bf-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} aria-invalid={Boolean(error)} aria-describedby={error ? 'bf-code-err' : undefined} />
            <Primary type="submit" disabled={busy || code.length !== 6}>{busy ? 'Checking…' : 'Continue'}</Primary>
          </div>
          <FieldError id="bf-code-err" msg={error} />
          {devCode && <p className="bf-dev">Development only, no email provider set: your code is <b>{devCode}</b>.</p>}
          <p className="bf-small"><button type="button" className="bf-textbtn" onClick={() => { setChallenge(''); setCode(''); setError(''); }}>Use a different email</button> · <button type="button" className="bf-textbtn" onClick={() => send()}>Send a new code</button></p>
        </form>
      )}
      <ul className="bf-points">
        {['Your booking confirmation goes to this address.', 'It is asked once: this device stays signed in for 30 days, for booking and tracking.', <>Already have a My Phi account? <a href="/client/login?next=/book">Sign in</a> instead.</>].map((t, i) => <li key={i}><Ico icon={TickCircleIcon} size={18} variant="Bold" />{t}</li>)}
      </ul>
      {whatsapp && <WaRow href={whatsapp} title="Rather not use email?" text="Send this booking on WhatsApp instead. Your choices are typed in for you." />}
    </div>
  );
}

/* ---------- WhatsApp ---------- */

function bookingWaText(d: Draft) {
  const rows = summaryRows(d);
  if (!rows.length) return WHATSAPP_TEXT;
  const total = quote(d).totalText;
  return ['Hi Phi Movers, I would like to book:', ...rows.map((r) => `${r.label}: ${r.value}`), total && `Price shown: ${total}`].filter(Boolean).join('\n');
}

function WaRow({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <div className="bf-wa-row">
      <span className="bf-wa-txt"><b>{title}</b><small>{text}</small></span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="bf-ghost bf-wa-btn"><WaIcon size={20} /> WhatsApp us</a>
    </div>
  );
}

/* ---------- calendar ---------- */

function MonthCalendar({ value, onPick }: { value: string; onPick: (d: string) => void }) {
  const today = londonNow().date;
  const [month, setMonth] = useState((value || today).slice(0, 7));
  const first = new Date(`${month}-01T12:00:00Z`);
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`)];
  const shift = (n: number) => {
    const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + n, 1));
    setMonth(d.toISOString().slice(0, 7));
  };
  const last = addDays(today, BOOK_AHEAD_DAYS);
  return (
    <div className="bf-cal">
      <div className="bf-cal-top">
        <button type="button" className="bf-iconbtn" onClick={() => shift(-1)} disabled={month <= today.slice(0, 7)} aria-label="Previous month"><Ico icon={ArrowLeft2Icon} size={18} /></button>
        <b>{first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</b>
        <button type="button" className="bf-iconbtn" onClick={() => shift(1)} disabled={month >= last.slice(0, 7)} aria-label="Next month"><Ico icon={ArrowRight2Icon} size={18} /></button>
      </div>
      <div className="bf-cal-grid">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d} className="bf-cal-dow" aria-hidden="true">{d}</span>)}
        {cells.map((c, i) => c ? (
          <button key={c} type="button" className="bf-cal-day" aria-pressed={c === value} disabled={!dateBookable(c)} onClick={() => onPick(c)} aria-label={formatDate(c)}>{Number(c.slice(8))}</button>
        ) : <span key={`x${i}`} />)}
      </div>
    </div>
  );
}

/* ---------- address block ---------- */

function StopFields({ id, title, stop, onChange, errors }: { id: 'from' | 'to'; title: string; stop: Stop; onChange: (s: Stop) => void; errors: Errors }) {
  const full = POSTCODE.test(stop.postcode.trim());
  const borough = full ? boroughFor(stop.postcode) : null;
  const set = (p: Partial<Stop>) => onChange({ ...stop, ...p });
  // The town comes from postcodes.io (free, no key) once the postcode is complete. Only the postcode is
  // sent, and a town the person typed themselves is never overwritten. Typing still works if it fails.
  const autoTown = useRef('');
  const stopRef = useRef(stop);
  stopRef.current = stop;
  const compact = stop.postcode.replace(/\s+/g, '').toUpperCase();
  useEffect(() => {
    if (!POSTCODE.test(compact)) return undefined;
    const ctrl = new AbortController();
    fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(compact)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const town: string = j?.result?.admin_district || j?.result?.admin_county || j?.result?.region || '';
        const cur = stopRef.current;
        if (town && (!cur.town || cur.town === autoTown.current)) {
          autoTown.current = town;
          onChange({ ...cur, town });
        }
      })
      .catch(() => { /* offline or blocked: the field stays editable */ });
    return () => ctrl.abort();
    // onChange is recreated every render; the postcode is the only real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact]);
  return (
    <fieldset className="bf-stop">
      <legend>{title}</legend>
      <div className="bf-grid2">
        <div>
          <label className="bf-label" htmlFor={`${id}-pc`}>Postcode</label>
          <input id={`${id}-pc`} className="bf-input" autoComplete={id === 'from' ? 'postal-code' : 'off'} placeholder="e.g. RM8 2UT" value={stop.postcode} onChange={(e) => set({ postcode: e.target.value.toUpperCase().slice(0, 10) })} onBlur={() => stop.postcode && set({ postcode: formatPostcode(stop.postcode) })} aria-invalid={Boolean(errors[`${id}.postcode`])} aria-describedby={errors[`${id}.postcode`] ? `${id}-pc-err` : undefined} />
          {full && <span className={borough ? 'bf-tag ok' : 'bf-tag far'}>{borough ? `${borough.name}` : 'Outside the London boroughs we list · journey confirmed on the call'}</span>}
          <FieldError id={`${id}-pc-err`} msg={errors[`${id}.postcode`]} />
        </div>
        <div>
          <label className="bf-label" htmlFor={`${id}-town`}>Town or borough</label>
          <input id={`${id}-town`} className="bf-input" autoComplete={id === 'from' ? 'address-level2' : 'off'} placeholder="Town" value={stop.town} onChange={(e) => set({ town: e.target.value })} />
        </div>
      </div>
      <label className="bf-label" htmlFor={`${id}-line`}>House or flat number and street</label>
      <input id={`${id}-line`} className="bf-input" autoComplete={id === 'from' ? 'address-line1' : 'off'} placeholder="e.g. Flat 4, 12 High Road" value={stop.line} onChange={(e) => set({ line: e.target.value })} aria-invalid={Boolean(errors[`${id}.line`])} aria-describedby={errors[`${id}.line`] ? `${id}-line-err` : undefined} />
      <FieldError id={`${id}-line-err`} msg={errors[`${id}.line`]} />
      <p className="bf-label" id={`${id}-floor-l`}>Which floor?</p>
      <div className="bf-toggles" role="radiogroup" aria-labelledby={`${id}-floor-l`} onKeyDown={radioKeys}>
        {FLOORS.map((f) => <Toggle key={f} icon={FLOOR_ICON(f)} on={stop.floor === f} onClick={() => set({ floor: f, lift: f === 'Ground' ? '' : stop.lift })}>{f === 'Ground' ? 'Ground floor' : f}</Toggle>)}
      </div>
      <FieldError id={`${id}-floor-err`} msg={errors[`${id}.floor`]} />
      {stop.floor && stop.floor !== 'Ground' && (
        <>
          <p className="bf-label" id={`${id}-lift-l`}>Is there a lift?</p>
          <div className="bf-toggles two" role="radiogroup" aria-labelledby={`${id}-lift-l`} onKeyDown={radioKeys}>
            <Toggle icon={ArrowCircleUpIcon} on={stop.lift === 'yes'} onClick={() => set({ lift: 'yes' })}>Yes, a lift</Toggle>
            <Toggle icon={ArrowUp2Icon} on={stop.lift === 'no'} onClick={() => set({ lift: 'no' })}>Stairs only</Toggle>
          </div>
        </>
      )}
      <p className="bf-label" id={`${id}-park-l`}>Is there space for a van outside?</p>
      <div className="bf-toggles" role="radiogroup" aria-label={`${title} parking`} onKeyDown={radioKeys}>
        {PARKING.map((p, i) => <Toggle key={p} icon={PARKING_ICON[i]} title={p} on={stop.parking === p} onClick={() => set({ parking: p })}>{PARKING_SHORT[i]}</Toggle>)}
      </div>
      <p className="bf-small">If not, we sort out the permit or bay with you.</p>
    </fieldset>
  );
}

/* ---------- summary ---------- */

const CORE_ROWS = ['Service', 'Van & crew', 'Date & time'];

function Summary({ d, open, onToggle, wa, action }: { d: Draft; open: boolean; onToggle: () => void; wa: string; action?: ReactNode }) {
  const q = quote(d);
  const rows = summaryRows(d);
  const core = rows.filter((r) => CORE_ROWS.includes(r.label));
  const more = rows.filter((r) => !CORE_ROWS.includes(r.label));
  const totalLabel = q.kind === 'estimate' ? 'Estimated total' : 'Price';
  return (
    <aside className={open ? 'bf-sum open' : 'bf-sum'} aria-label="Your booking">
      <div className="bf-sum-bar">
        <button type="button" className="bf-sum-toggle" onClick={onToggle} aria-expanded={open}>
          <span>{totalLabel}</span>
          <b>{q.totalText || 'Choose a service'}</b>
          <small>{open ? 'Hide details' : 'View details'}</small>
        </button>
        {action}
      </div>
      <div className="bf-sum-body">
        {core.length ? (
          <dl className="bf-sum-rows">
            {core.map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>)}
          </dl>
        ) : (
          <p className="bf-sum-empty">Choose a service to see your price.</p>
        )}
        {q.totalText && (
          <div className="bf-sum-total">
            <span>{totalLabel}</span>
            <strong aria-live="polite" aria-atomic="true"><span key={q.totalText} className="flip-in">{q.totalText}</span></strong>
          </div>
        )}
        <button type="button" className="bf-sum-more-btn" onClick={onToggle} aria-expanded={open}>{open ? 'Hide details' : 'View details'}</button>
        {open && (
          <div className="bf-sum-more">
            {more.length > 0 && (
              <dl className="bf-sum-rows">
                {more.map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>)}
              </dl>
            )}
            {q.lines.length > 0 && (
              <ul className="bf-sum-lines">
                {q.lines.map((l) => <li key={l.label}><span>{l.label}{l.note && <small>{l.note}</small>}</span>{l.amount !== undefined && <b>{money(l.amount)}</b>}</li>)}
              </ul>
            )}
            <TrustRows />
            <a href={wa} target="_blank" rel="noopener noreferrer" className="bf-ghost bf-wa-btn bf-sum-wa"><WaIcon size={20} /> {rows.length ? 'Send these details on WhatsApp' : 'WhatsApp us'}</a>
            <p className="bf-sum-call"><Ico icon={CallCallingIcon} size={17} /><span>Prefer to talk? <a href={PHONE_TEL}>{PHONE_DISPLAY}</a><small>{HOURS_TEXT}</small></span></p>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ---------- ics ---------- */

function downloadIcs(ref: string, d: Draft) {
  if (!d.date || !d.time) return;
  const start = `${d.date.replace(/-/g, '')}T${d.time.replace(':', '')}00`;
  const end = `${d.date.replace(/-/g, '')}T${finishesBy(d.time, jobHours(d)).replace(':', '')}00`;
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Phi Movers//Booking//EN', 'BEGIN:VEVENT', `UID:${ref}@phimovers.co.uk`, `DTSTART;TZID=Europe/London:${start}`, `DTEND;TZID=Europe/London:${end}`,
    `SUMMARY:Phi Movers – ${serviceById(d.service)?.name ?? 'Move'} (to be confirmed)`, `DESCRIPTION:Reference ${ref}. We call to confirm. ${PHONE_DISPLAY}`, `LOCATION:${formatPostcode(d.from.postcode)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url; a.download = `phi-movers-${ref}.ics`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Without a booking backend the request opens the visitor's email app, with everything typed in. */
function mailtoFallback(d: Draft) {
  const lines = ['Booking request', ...summaryRows(d).map((r) => `${r.label}: ${r.value}`), `Price shown: ${quote(d).totalText}`, `Name: ${d.name}`, `Phone: ${d.phone}`, `Email: ${d.email}`, d.notes && `Notes: ${d.notes}`].filter(Boolean);
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Booking request')}&body=${encodeURIComponent(lines.join('\n'))}`;
}

async function idToken(): Promise<string | null> {
  try {
    return isFirebaseConfigured() ? (await getFirebaseAuth().currentUser?.getIdToken()) ?? null : null;
  } catch {
    return null;
  }
}

/* ---------- the flow ---------- */

export default function BookingFlow() {
  const router = useRouter();
  const [session, setSession] = useState<Session>({ loaded: false, email: null, codes: false, store: false, mailer: false, signedIn: false });
  const [d, setD] = useState<Draft>(emptyDraft);
  const [tab, setTab] = useState<TabId>('moves');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [sumOpen, setSumOpen] = useState(false);
  const [moreDates, setMoreDates] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const presetTeam = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const steps = stepsFor(d);
  const stepParam = String(router.query.step ?? '');
  const step: StepId = (steps as string[]).includes(stepParam) ? (stepParam as StepId) : 'service';
  const index = steps.indexOf(step);
  const svc = serviceById(d.service);

  // Live availability: the half hours already full on the chosen day. The server checks again on submit.
  const [taken, setTaken] = useState<{ date: string; cells: string[] }>({ date: '', cells: [] });
  const [takenAt, setTakenAt] = useState(0);
  useEffect(() => {
    if (!d.date) return undefined;
    let live = true;
    fetch(`/api/booking/slots?date=${encodeURIComponent(d.date)}`).then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (live && Array.isArray(j?.taken)) setTaken({ date: d.date, cells: j.taken.filter((c: unknown) => typeof c === 'string') });
    }).catch(() => { /* offline: the server still refuses a taken time */ });
    return () => { live = false; };
  }, [d.date, takenAt]);
  const timeFree = (t: string) => taken.date !== d.date || !taken.cells.length || timeFits(t, jobHours(d), taken.cells);

  const update = (p: Partial<Draft>) => {
    setD((x) => ({ ...x, ...p }));
    setErrors((e) => {
      const keys = Object.keys(e).filter((k) => !Object.keys(p).some((f) => k === f || k.startsWith(`${f}.`)));
      return keys.length === Object.keys(e).length ? e : Object.fromEntries(keys.map((k) => [k, e[k]]));
    });
  };

  // Load the session and any saved draft; prefill from links such as /book?service=house&van=luton&hours=3&helpers=2,
  // ?size=2bed&kind=flat&date=2026-11-02&time=09:00&from=RM8%202UT&to=E1%206AN (calculator, service pages and Ask Phi).
  useEffect(() => {
    let saved: Partial<Draft> = {};
    try { saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '{}'); } catch { /* storage off */ }
    const q = new URLSearchParams(window.location.search);
    const pre: Partial<Draft> = {};
    const s = serviceById(serviceFromText(q.get('service')));
    if (s) { pre.service = s.id; setTab(s.tab); }
    const team = TEAMS.find((t) => t.id === q.get('van'));
    if (team) { pre.team = team.id; pre.helpers = team.helpers; presetTeam.current = true; }
    const hp = q.get('helpers');
    if (hp !== null && Number(hp) >= 0 && Number(hp) <= HELPERS_MAX) pre.helpers = Math.round(Number(hp));
    const h = Number(q.get('hours'));
    if (h >= HOURS_MIN && h <= HOURS_MAX) pre.hours = Math.round(h * 2) / 2;
    if (!team && !(h >= HOURS_MIN) && !saved.team) {
      for (const key of CALC_KEYS) {
        try {
          const calc = JSON.parse(localStorage.getItem(key) ?? 'null') as { van?: string; hours?: number; helpers?: number } | null;
          const van = TEAMS.find((t) => t.id === calc?.van);
          if (!van) continue;
          pre.team = van.id; presetTeam.current = true;
          pre.helpers = Number.isInteger(calc?.helpers) && Number(calc?.helpers) <= HELPERS_MAX ? Number(calc?.helpers) : van.helpers;
          const ch = Number(calc?.hours);
          if (ch >= HOURS_MIN && ch <= HOURS_MAX) pre.hours = Math.round(ch * 2) / 2;
          break;
        } catch { /* storage off or not JSON */ }
      }
    }
    const size = PROPERTY_SIZES.find((x) => x.id === q.get('size'));
    if (size && (s?.property ?? true)) pre.size = size.id;
    const kind = KINDS.find((k) => k.id === q.get('kind'));
    if (kind) pre.kind = kind.id;
    const date = q.get('date') ?? '';
    if (dateBookable(date)) {
      pre.date = date;
      const time = q.get('time') ?? '';
      if (ALL_SLOTS.includes(time) && slotOpen(date, time)) pre.time = time;
    }
    const fromPc = q.get('from') ?? '';
    const toPc = q.get('to') ?? '';
    setD((x) => {
      const next = { ...x, ...saved, ...pre, from: { ...x.from, ...saved.from }, to: { ...x.to, ...saved.to }, consent: false };
      if (POSTCODE.test(fromPc)) next.from = { ...next.from, postcode: formatPostcode(fromPc) };
      if (POSTCODE.test(toPc)) next.to = { ...next.to, postcode: formatPostcode(toPc) };
      // Nothing chosen yet: the next bookable day and its first open start, so the date step is one tap.
      if (!next.date || !dateBookable(next.date)) {
        const first = firstOpening();
        if (first) { next.date = first.date; next.time = first.time; }
      }
      return next;
    });
    if (saved.service && !s) setTab(serviceById(saved.service)?.tab ?? 'moves');

    const load = async (signedIn: boolean, profile?: { name?: string | null; email?: string | null }) => {
      try {
        const j = await (await fetch('/api/booking/session')).json();
        setSession({ loaded: true, email: j.email ?? null, codes: Boolean(j.codes), store: Boolean(j.store), mailer: Boolean(j.mailer), signedIn });
        if (j.email) setD((x) => ({ ...x, email: j.email }));
      } catch {
        setSession({ loaded: true, email: null, codes: false, store: false, mailer: false, signedIn });
      }
      if (profile) setD((x) => ({ ...x, name: x.name || profile.name || '', email: x.email || profile.email || '' }));
    };
    // A My Phi account is a verified identity: no email code needed.
    if (isFirebaseConfigured()) {
      const off = getFirebaseAuth().onAuthStateChanged((u) => {
        off();
        void load(Boolean(u), u ? { name: u.displayName, email: u.email } : undefined);
      });
      return () => off();
    }
    void load(false);
    return undefined;
    // Runs once on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...d, consent: false })); } catch { /* storage off */ }
  }, [d]);
  const wa = whatsappLink(bookingWaText(d));
  useEffect(() => { setWhatsAppText(bookingWaText(d)); }, [d]);

  // Step views, for drop-off (no personal data).
  useEffect(() => {
    if (session.loaded) trackEvent({ action: 'booking_step', category: 'booking', label: step, params: { step, step_number: index + 1 } });
  }, [step, index, session.loaded]);

  const go = (s: StepId) => {
    setErrors({});
    router.push({ pathname: '/book', query: { step: s } }, undefined, { shallow: true, scroll: false });
    requestAnimationFrame(() => { const el = cardRef.current; if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' }); });
  };

  const focusError = () => requestAnimationFrame(() => {
    const el = cardRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], .bf-err');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el && el.matches('input,textarea,button')) el.focus({ preventScroll: true });
  });

  const next = () => {
    const e = validateStep(step, d);
    if (step === 'datetime' && d.time && !e.date && !e.time && !timeFree(d.time)) e.time = SLOT_TAKEN;
    setErrors(e);
    if (Object.keys(e).length) { focusError(); return; }
    // Apply the suggestion when the van and hours were not chosen on a calculator.
    if ((step === 'property' || (step === 'service' && !svc?.property)) && !presetTeam.current) {
      const sg = suggestion(d);
      if (sg) update({ team: sg.team, helpers: sg.helpers, hours: sg.hours });
    }
    go(steps[index + 1]);
  };
  const back = () => (index > 0 ? go(steps[index - 1]) : router.push('/'));

  const submit = async () => {
    const e = validateStep('review', d);
    setErrors(e);
    if (Object.keys(e).length) { focusError(); return; }
    setBusy(true); setSubmitError('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = session.signedIn ? await idToken() : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const r = await fetch('/api/booking/submit', { method: 'POST', headers, body: JSON.stringify({ draft: d, source: 'web' }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        trackEvent({ action: 'booking_request', category: 'booking', label: d.service, params: { submission_id: j.id, service: d.service, value: quote(d).total ?? 0, currency: 'GBP' } });
        setDone({ reference: j.reference, email: j.email, emailed: j.emailed });
        try { sessionStorage.removeItem(SESSION_KEY); } catch { /* storage off */ }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (r.status === 503) {
        mailtoFallback(d);
        setDone({ reference: '', email: d.email, emailed: false, offline: true });
      } else if (r.status === 409 && j.error === 'slotTaken') {
        update({ time: '' });
        setTakenAt(Date.now());
        go('datetime');
        setErrors({ time: SLOT_TAKEN });
      } else if (r.status === 400 && j.errors) {
        const first = Object.keys(j.errors)[0];
        if (first && stepOfError(first) !== 'review') go(stepOfError(first));
        setErrors(j.errors);
        setSubmitError('Some details need another look. The step with the problem is marked.');
      } else if (r.status === 401) {
        setSession((s) => ({ ...s, email: null, signedIn: false }));
      } else {
        setSubmitError(r.status === 429 ? 'Too many bookings have been sent from this connection. Please wait a few minutes, or call us.' : 'We could not send your booking. Please try again, or call us and we will book it for you.');
      }
    } catch {
      setSubmitError('We could not send your booking. Please check your connection, or call us and we will book it for you.');
    }
    setBusy(false);
  };

  const today = londonNow().date;
  const dayList = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(today, i)), [today]);
  const q = quote(d);
  const needsSignIn = session.loaded && session.codes && !session.email && !session.signedIn && step === 'review';
  const teamTotal = (t: (typeof TEAMS)[number]) => timePrice(t.id, d.team === t.id ? d.helpers : t.helpers, d.hours, d.time).total;

  if (done) {
    return (
      <div className="bf-done" data-reveal="">
        <span className="bf-done-ico icon-pop"><Ico icon={TickCircleIcon} size={34} variant="Bold" /></span>
        <h1 className="bf-h1">{done.offline ? 'Your email app is ready to send it' : 'Your request is safely with us'}</h1>
        {done.reference && (
          <>
            <p className="bf-ref-label">Your reference</p>
            <p className="bf-ref">{done.reference}</p>
          </>
        )}
        <p className="bf-lead">{done.offline
          ? `Our booking system is not taking requests online right now, so nothing has been sent yet. Send the email that opened, or call ${PHONE_DISPLAY}.`
          : 'This is not a confirmed booking yet. We check the van and crew and call you to confirm.'}</p>
        {done.emailed && <p className="bf-small">A copy has been sent to {done.email}.</p>}
        <ol className="bf-next" aria-label="What happens next">
          {NEXT_ROWS.map((r) => <li key={r.text}><span className="bf-next-ico"><Ico icon={r.icon} size={18} /></span><span><b>{r.text}</b></span></li>)}
        </ol>
        <div className="bf-done-row">
          {done.reference && <a href={session.signedIn ? '/client/bookings' : `/track?ref=${encodeURIComponent(done.reference)}`} className="bf-primary mo-btn">Track this booking <CtaMark /></a>}
          {done.offline && <button type="button" className="bf-primary mo-btn" onClick={() => mailtoFallback(d)}>Open the email again <CtaMark /></button>}
          {d.date && d.time && done.reference && <button type="button" className="bf-ghost" onClick={() => downloadIcs(done.reference, d)}><Ico icon={ClockIcon} size={18} /> Add to calendar</button>}
        </div>
        <p className="bf-small bf-center">Questions? <a href={whatsappLink(done.reference ? `Hi Phi Movers, a question about booking ${done.reference}.` : bookingWaText(d))} target="_blank" rel="noopener noreferrer">WhatsApp us</a> or call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a></p>
        <a href="/" className="bf-textlink">Back to home</a>
      </div>
    );
  }

  return (
    <div className="bf-layout">
      <div className="bf-main" ref={cardRef}>
        <div className="bf-progress">
          {session.loaded && <button type="button" className="bf-backlink" onClick={back}><Ico icon={ArrowLeftIcon} size={16} /> Back</button>}
          <p>
            <span>{!session.loaded ? 'Before you start' : `Step ${index + 1} of ${steps.length} · ${needsSignIn ? 'Confirm your email' : STEP_LABEL[step]}`}</span>
          </p>
          <div className="bf-track" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={index + 1} aria-label="Booking progress">
            <i style={{ width: !session.loaded ? '6%' : `${((index + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        {!session.loaded ? (
          <div className="bf-card bf-skel" aria-busy="true">Loading…</div>
        ) : needsSignIn ? (
          <SignIn whatsapp={wa} onSignedIn={(email) => { setSession((s) => ({ ...s, email })); update({ email }); }} />
        ) : (
          <div className="bf-card" key={step}>
            <form id="bf-form" noValidate onSubmit={(e) => { e.preventDefault(); if (step === 'review') submit(); else next(); }}>
              <StepHead compact icon={STEP_ICON[step]} title={STEP_HEAD[step].title} lead={STEP_HEAD[step].lead} />

              {step === 'service' && (
                <>
                  <div className="bf-tabs" role="tablist" aria-label="Service type">
                    {TABS.map((t) => <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>{t.label} <span className="bf-tab-n">{SERVICES.filter((s) => s.tab === t.id).length}</span></button>)}
                  </div>
                  <div className="bf-services" role="radiogroup" aria-label="Service" onKeyDown={radioKeys}>
                    {SERVICES.filter((s) => s.tab === tab).map((s) => (
                      <Choice key={s.id} checked={d.service === s.id} onClick={() => update({ service: s.id })} className="bf-svc">
                        <span className="bf-svc-ico"><Ico icon={SERVICE_ICON[s.id]} size={22} /></span>
                        <span className="bf-svc-txt">
                          <b>{s.name}{s.popular && <span className="bf-popular">Most booked</span>}</b>
                          <small>{s.lead}</small><em>{s.from}</em>{s.mode === 'hourly' && <span className="bf-tag ok">Live price</span>}
                        </span>
                      </Choice>
                    ))}
                  </div>
                  <FieldError id="svc-err" msg={errors.service} />
                </>
              )}

              {step === 'property' && (
                <>
                  <p className="bf-label" id="bf-kind-l">Property type</p>
                  <div className="bf-seg" role="radiogroup" aria-labelledby="bf-kind-l" onKeyDown={radioKeys}>
                    {KINDS.map((k) => <button key={k.id} type="button" role="radio" aria-checked={d.kind === k.id} aria-invalid={Boolean(errors.kind) || undefined} onClick={() => update({ kind: k.id })}>{k.label}</button>)}
                  </div>
                  <FieldError id="kind-err" msg={errors.kind} />
                  <p className="bf-label" id="bf-size-l">Size</p>
                  <div className="bf-sizes" role="radiogroup" aria-labelledby="bf-size-l" onKeyDown={radioKeys}>
                    {PROPERTY_SIZES.map((s) => <Choice key={s.id} checked={d.size === s.id} onClick={() => update({ size: s.id })}>{s.label}</Choice>)}
                  </div>
                  <FieldError id="size-err" msg={errors.size} />
                  <p className="bf-hint"><Ico icon={MagicStarIcon} size={18} variant="Bold" />
                    {(() => {
                      if (!d.size) return 'Pick a size and we will suggest the van, crew and hours.';
                      if (isTwoVans(d)) return 'Suggested: two Lutons for the day. A home this size is priced on a short call.';
                      const sg = suggestion(d);
                      return sg ? `Suggested: ${teamLabel(sg.team, sg.helpers)} × ${hoursText(sg.hours)}, about ${money(timePrice(sg.team, sg.helpers, sg.hours).total)}. You can change this next.` : '';
                    })()}
                  </p>
                </>
              )}

              {step === 'details' && svc && (
                <>
                  {svc.mode === 'hourly' && !isTwoVans(d) && (
                    <>
                      <p className="bf-label" id="bf-team-l">Choose a van and crew</p>
                      <div className="bf-teams" role="radiogroup" aria-labelledby="bf-team-l" onKeyDown={radioKeys}>
                        {TEAMS.map((t) => {
                          const sg = suggestion(d);
                          const tp = timePrice(t.id, t.helpers, HOURS_MIN);
                          return (
                            <Choice key={t.id} checked={d.team === t.id} onClick={() => update({ team: t.id as TeamId, helpers: t.helpers })} className="bf-team">
                              {sg?.team === t.id && <span className="bf-badge">Suggested</span>}
                              <b>{teamLabel(t.id, d.team === t.id ? d.helpers : t.helpers)}</b>
                              <span className="bf-team-price"><span key={teamTotal(t)} className="flip-in">{money(teamTotal(t))}</span> <small>for {hoursText(d.hours)} · {money(tp.total)} first 2 hours</small></span>
                              <small>{t.suits}</small>
                            </Choice>
                          );
                        })}
                      </div>
                      <FieldError id="team-err" msg={errors.team} />
                      <p className="bf-label">Helpers with the driver</p>
                      <div className="bf-stepper">
                        <button type="button" className="bf-iconbtn" aria-label="One helper fewer" disabled={d.helpers <= 0} onClick={() => update({ helpers: Math.max(0, d.helpers - 1) })}><Ico icon={MinusIcon} size={18} /></button>
                        <output aria-live="polite"><span key={d.helpers} className="flip-in">{d.helpers === 0 ? 'Driver only' : `${d.helpers} helper${d.helpers > 1 ? 's' : ''}`}</span></output>
                        <button type="button" className="bf-iconbtn" aria-label="One more helper" disabled={d.helpers >= HELPERS_MAX} onClick={() => update({ helpers: Math.min(HELPERS_MAX, d.helpers + 1) })}><Ico icon={AddIcon} size={18} /></button>
                      </div>
                      <p className="bf-label">Hours on site</p>
                      <div className="bf-chips bf-hours" role="group" aria-label="Quick pick hours">
                        {[2, 3, 4, 5, 6].map((h) => <Chip key={h} on={d.hours === h} onClick={() => update({ hours: h })}>{h} hours</Chip>)}
                      </div>
                      <div className="bf-stepper">
                        <button type="button" className="bf-iconbtn" aria-label="Half an hour less" disabled={d.hours <= HOURS_MIN} onClick={() => update({ hours: Math.max(HOURS_MIN, d.hours - 0.5) })}><Ico icon={MinusIcon} size={18} /></button>
                        <output aria-live="polite"><span key={d.hours} className="flip-in">{hoursText(d.hours)}</span></output>
                        <button type="button" className="bf-iconbtn" aria-label="Half an hour more" disabled={d.hours >= HOURS_MAX} onClick={() => update({ hours: Math.min(HOURS_MAX, d.hours + 0.5) })}><Ico icon={AddIcon} size={18} /></button>
                      </div>
                      <FieldError id="hours-err" msg={errors.hours} />
                      <p className="bf-small">{BOOKING_POLICIES[0]}. The office confirms the final price before the day.</p>
                      {q.kind === 'estimate' && d.team && <p className="bf-live">{teamLabel(d.team as TeamId, d.helpers)} × {hoursText(d.hours)} = <b>{q.totalText}</b></p>}
                      <p className="bf-label">Add to the job <small>priced on the call</small></p>
                      <div className="bf-chips">{EXTRAS.map((x) => <Chip key={x} on={d.extras.includes(x)} onClick={() => update({ extras: toggle(d.extras, x) })}>{x}</Chip>)}</div>
                    </>
                  )}
                  {(svc.mode === 'quote' || isTwoVans(d)) && (
                    <>
                      <label className="bf-label" htmlFor="bf-desc">Describe the job</label>
                      <textarea id="bf-desc" className="bf-input" rows={4} placeholder={isTwoVans(d) ? 'For example: 4-bed house, garage and loft, piano on the ground floor.' : 'For example: 12 desks, 2 server racks and filing, Friday evening.'} value={d.description} onChange={(e) => update({ description: e.target.value })} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'desc-err' : undefined} />
                      <FieldError id="desc-err" msg={errors.description} />
                      <p className="bf-hint"><Ico icon={MagicStarIcon} size={18} variant="Bold" />We price this on a short call. Reply to our email with photos if you can, and we confirm the price before the day.</p>
                    </>
                  )}
                  <p className="bf-label">Anything heavy or awkward? <small>helps us bring the right kit</small></p>
                  <div className="bf-chips">{HEAVY_ITEMS.map((x) => <Chip key={x} on={d.items.includes(x)} onClick={() => update({ items: toggle(d.items, x) })}>{x}</Chip>)}</div>
                </>
              )}

              {step === 'datetime' && (
                <>
                  <div className="bf-days" role="radiogroup" aria-label="Day" onKeyDown={radioKeys}>
                    {dayList.map((day, i) => (
                      <button key={day} type="button" role="radio" aria-checked={d.date === day} className="bf-day" disabled={!dateBookable(day)} onClick={() => update({ date: day, time: d.date === day ? d.time : '' })}>
                        <b>{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formatDate(day, 'short').split(' ')[0]}</b>
                        <small>{formatDate(day, 'short').split(' ').slice(1).join(' ')}</small>
                      </button>
                    ))}
                  </div>
                  <button type="button" className="bf-textbtn" onClick={() => setMoreDates((m) => !m)} aria-expanded={moreDates}>{moreDates ? 'Close calendar' : 'More dates'}</button>
                  {moreDates && <MonthCalendar value={d.date} onPick={(day) => { update({ date: day, time: '' }); setMoreDates(false); }} />}
                  <FieldError id="date-err" msg={errors.date} />
                  {d.date && (
                    <>
                      <p className="bf-label">Start time · {formatDate(d.date)}</p>
                      {SLOT_GROUPS.map((g) => {
                        const slots = slotsFor(g);
                        if (!slots.some((t) => slotOpen(d.date, t))) return null;
                        return (
                          <div key={g.id} className="bf-slotgroup">
                            <span>{g.label}</span>
                            <div className="bf-chips">{slots.map((t) => <Chip key={t} on={d.time === t} disabled={!slotOpen(d.date, t) || !timeFree(t)} onClick={() => update({ time: t })}>{slotLabel(t)}</Chip>)}</div>
                          </div>
                        );
                      })}
                      <FieldError id="time-err" msg={errors.time || (d.time && !timeFree(d.time) ? SLOT_TAKEN : '')} />
                      {taken.date === d.date && taken.cells.length > 0 && <p className="bf-small">Greyed-out times are already booked.</p>}
                      {d.time && <p className="bf-live">About {hoursText(jobHours(d))} on site · finishes by {slotLabel(finishesBy(d.time, jobHours(d)))}</p>}
                    </>
                  )}
                  <p className="bf-small">Book up to {BOOK_AHEAD_DAYS} days ahead. We confirm every slot by phone. For a move today, call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a>.</p>
                </>
              )}

              {step === 'address' && (
                <>
                  <div className={oneAddress(d) ? 'bf-stops one' : 'bf-stops'}>
                    <StopFields id="from" title={oneAddress(d) ? 'Address' : 'Collection address'} stop={d.from} onChange={(from) => update({ from })} errors={errors} />
                    {!oneAddress(d) && <StopFields id="to" title="Delivery address" stop={d.to} onChange={(to) => update({ to })} errors={errors} />}
                  </div>
                  <label className="bf-label" htmlFor="bf-access">Access notes <small>optional</small></label>
                  <textarea id="bf-access" className="bf-input" rows={1} placeholder="Gate codes, loading bay, a tight stair turn, where the van can stop" value={d.access} onChange={(e) => update({ access: e.target.value })} />
                  <p className="bf-hint"><Ico icon={LocationIcon} size={18} />Please arrange a parking space or visitor permit for the van. {BOOKING_POLICIES[1]}.</p>
                </>
              )}

              {step === 'review' && (
                <>
                  <h2 className="bf-h2 bf-h2-first">Your booking</h2>
                  <div className="bf-review-total">
                    <span>{q.kind === 'estimate' ? 'Estimated total' : 'Price'}</span>
                    <strong>{q.totalText}</strong>
                    {q.kind === 'estimate' && <small>An estimate from the rate card, for the hours you chose. The office confirms the final price before the day.</small>}
                    {q.kind === 'call' && <small>We confirm the price on a short call before the day.</small>}
                  </div>
                  <dl className="bf-review">
                    {summaryRows(d).map((r) => {
                      const target: StepId = r.label === 'Service' ? 'service' : r.label === 'Property' ? 'property' : r.label === 'Date & time' ? 'datetime' : ['From', 'To', 'Address'].includes(r.label) ? 'address' : 'details';
                      return <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd><button type="button" className="bf-textbtn" onClick={() => go(target)}>Change</button></div>;
                    })}
                  </dl>

                  <h2 className="bf-h2">Your details</h2>
                  <div className="bf-grid2">
                    <div>
                      <label className="bf-label" htmlFor="bf-name">Full name</label>
                      <input id="bf-name" className="bf-input" autoComplete="name" value={d.name} onChange={(e) => update({ name: e.target.value })} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-err' : undefined} />
                      <FieldError id="name-err" msg={errors.name} />
                    </div>
                    <div>
                      <label className="bf-label" htmlFor="bf-phone">Mobile number</label>
                      <input id="bf-phone" className="bf-input" type="tel" inputMode="tel" autoComplete="tel" placeholder="07XXX XXXXXX" maxLength={12} value={d.phone} onChange={(e) => update({ phone: maskMobile(e.target.value) })} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-err bf-phone-note' : 'bf-phone-note'} />
                      <FieldError id="phone-err" msg={errors.phone} />
                      <p className="bf-small" id="bf-phone-note">We only use it to confirm this booking.</p>
                    </div>
                  </div>
                  {session.email ? (
                    <p className="bf-signed">Confirmation goes to <b>{session.email}</b></p>
                  ) : (
                    <>
                      <label className="bf-label" htmlFor="bf-mail">Email</label>
                      <input id="bf-mail" className="bf-input" type="email" autoComplete="email" value={d.email} onChange={(e) => update({ email: e.target.value })} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'mail-err' : undefined} />
                      <FieldError id="mail-err" msg={errors.email} />
                    </>
                  )}
                  <label className="bf-label" htmlFor="bf-notes">Anything else we should know?</label>
                  <p className="bf-small">Quick notes for the crew</p>
                  <div className="bf-chips">{NOTE_CHIPS.map((x) => <Chip key={x} on={d.noteChips.includes(x)} onClick={() => update({ noteChips: toggle(d.noteChips, x) })}>{x}</Chip>)}</div>
                  <textarea id="bf-notes" className="bf-input" rows={3} placeholder="Priority rooms, fragile items, pets, or anything about access" value={d.notes} onChange={(e) => update({ notes: e.target.value })} />

                  <div className="bf-pay">
                    <span className="bf-head-ico"><Ico icon={WalletIcon} size={20} /></span>
                    <div><b>Nothing is charged now</b><small>{DEPOSIT_TEXT}</small></div>
                  </div>

                  <h2 className="bf-h2">Booking policies</h2>
                  <ul className="bf-policies">{BOOKING_POLICIES.map((p) => <li key={p}><Ico icon={TickCircleIcon} size={18} />{p}</li>)}</ul>
                  <label className="bf-consent">
                    <input type="checkbox" checked={d.consent} onChange={(e) => update({ consent: e.target.checked })} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'consent-err' : undefined} />
                    <span>I agree to the <a href="/terms" target="_blank" rel="noopener">booking terms</a> and <a href="/privacy" target="_blank" rel="noopener">privacy notice</a>.</span>
                  </label>
                  <FieldError id="consent-err" msg={errors.consent} />
                  {submitError && <p className="bf-err" role="alert">{submitError} You can also <a href={wa} target="_blank" rel="noopener noreferrer">send it on WhatsApp</a>.</p>}
                  {!session.store && <p className="bf-small">Online booking is not connected right now: sending opens your email app with the request filled in, and we reply by phone.</p>}
                </>
              )}

              <div className="bf-actions">
                {step === 'review'
                  ? <Primary type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send my booking request'}</Primary>
                  : <Primary type="submit">Continue</Primary>}
              </div>
            </form>
          </div>
        )}
      </div>

      <Summary
        d={d}
        wa={wa}
        open={sumOpen}
        onToggle={() => setSumOpen((o) => !o)}
        action={session.loaded && !needsSignIn ? <button type="submit" form="bf-form" className="bf-primary bf-sum-go" disabled={busy}>{step === 'review' ? (busy ? 'Sending…' : 'Send request') : 'Continue'}</button> : undefined}
      />
    </div>
  );
}

