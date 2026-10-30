'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Add as AddIcon, Link21 as LinkIcon, Minus as MinusIcon, TickCircle as TickCircleIcon, Wallet as WalletIcon } from 'iconsax-reactjs';
import { Ico } from './Ico';
import { CtaMark } from './HomeMotion';
import { DEPOSIT_TEXT, FREE_MILES, HELPER_RATE, MIN_HOURS, PER_MILE, RATES } from '../site-facts';
import { ADD_ONS, ASSEMBLY_RATE, BANK_HOLIDAY_PCT, EVENING_PER_HOUR, MAX_HELPERS, PACKING_RATE, bookHref, gbp, quotePrice } from '../estimate';

// The one price calculator, used on the homepage and the pricing page. Van (small, Transit or Luton),
// helpers, hours (bars on desktop, a stepper on phones), when, the total and a Book link that carries the
// choice into /book?van=&hours=&helpers=. `full` (the pricing page) adds journey miles, labour services,
// item extras, the breakdown and the deposit. Every figure comes from quotePrice() in kit/estimate.ts.
// A shared link (?van=&hours=&helpers=) wins; otherwise the last choice on this device ("phi-calc").
// Styles live here (.pe-*), loaded once by DcPage.

type Vars = CSSProperties & Record<`--${string}`, string | number>;

export const HOURS = [2, 3, 4, 5, 6, 7, 8];
const WHEN: { label: string; add: string; evening?: boolean; bankHoliday?: boolean }[] = [
  { label: 'Standard', add: '+£0' },
  { label: 'Evening after 7pm', add: `+£${EVENING_PER_HOUR}/hr`, evening: true },
  { label: 'Bank holiday', add: `+${Math.round(BANK_HOLIDAY_PCT * 100)}%`, bankHoliday: true },
];
const HELPERS = Array.from({ length: MAX_HELPERS + 1 }, (_, i) => i);
const KEY = 'phi-calc';
const MAX_MILES = 100;

/** Rate-card cost for a van, hours and helpers (no extras). Kept for older imports. */
export const cost = (r: (typeof RATES)[number], hours: number, helpers = 0) => quotePrice({ van: r.id, hours, helpers }).total;
export { gbp };

type Saved = { crew: number; hours: number; helpers: number };

const fromQuery = (): Partial<Saved> => {
  const q = new URLSearchParams(window.location.search);
  const out: Partial<Saved> = {};
  const ci = RATES.findIndex((r) => r.id === q.get('van'));
  if (ci >= 0) out.crew = ci;
  const h = Number(q.get('hours'));
  if (HOURS.includes(h)) out.hours = h;
  const hp = q.get('helpers');
  if (hp !== null && HELPERS.includes(Number(hp))) out.helpers = Number(hp);
  return out;
};

const fromStorage = (): Partial<Saved> => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? 'null') as { van?: string; hours?: number; helpers?: number } | null;
    if (!s) return {};
    const out: Partial<Saved> = {};
    const ci = RATES.findIndex((r) => r.id === s.van);
    if (ci >= 0) out.crew = ci;
    if (HOURS.includes(Number(s.hours))) out.hours = Number(s.hours);
    if (HELPERS.includes(Number(s.helpers))) out.helpers = Number(s.helpers);
    return out;
  } catch {
    return {};
  }
};

function Stepper({ value, onDec, onInc, decDisabled, incDisabled, label }: { value: string; onDec: () => void; onInc: () => void; decDisabled?: boolean; incDisabled?: boolean; label: string }) {
  return (
    <div className="pe-step pe-step-on" role="group" aria-label={label}>
      <button type="button" aria-label={`Less ${label.toLowerCase()}`} disabled={decDisabled} onClick={onDec}><Ico icon={MinusIcon} size={18} /></button>
      <b aria-live="polite">{value}</b>
      <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={incDisabled} onClick={onInc}><Ico icon={AddIcon} size={18} /></button>
    </div>
  );
}

export function PriceExplorer({ share = false, full = false, heading = 'Who do you need?', service }: { share?: boolean; full?: boolean; heading?: string; service?: string }) {
  const [crew, setCrew] = useState(1);
  const [hours, setHours] = useState(3);
  const [when, setWhen] = useState(0);
  const [helpers, setHelpers] = useState(0);
  const [miles, setMiles] = useState(5);
  const [assemblyHours, setAssemblyHours] = useState(0);
  const [packingHours, setPackingHours] = useState(0);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [copied, setCopied] = useState<'' | 'done' | 'failed'>('');
  const ready = useRef(false);
  const rate = RATES[crew];
  const w = WHEN[when];
  const priceFor = (h: number) => quotePrice({ van: rate.id, hours: h, helpers, evening: w.evening, bankHoliday: w.bankHoliday, ...(full ? { miles, assemblyHours, packingHours, addOns } : {}) });
  const q = priceFor(hours);
  const bar = (h: number) => quotePrice({ van: rate.id, hours: h, helpers, evening: w.evening, bankHoliday: w.bankHoliday }).total;
  const max = bar(HOURS[HOURS.length - 1]);
  const book = bookHref({ van: rate.id, hours, helpers, service });

  // A shared link wins, then the last choice made on this device.
  useEffect(() => {
    const s = { ...fromStorage(), ...fromQuery() };
    if (s.crew !== undefined) setCrew(s.crew);
    if (s.hours) setHours(s.hours);
    if (s.helpers !== undefined) setHelpers(s.helpers);
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    try { localStorage.setItem(KEY, JSON.stringify({ van: rate.id, hours, helpers })); } catch { /* storage off */ }
  }, [rate.id, hours, helpers]);

  const shareLink = async () => {
    const url = `${window.location.origin}/pricing?van=${rate.id}&hours=${hours}&helpers=${helpers}#calculator`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied('done');
    } catch {
      setCopied('failed');
    }
    window.setTimeout(() => setCopied(''), 2500);
  };

  const toggle = (k: string) => setAddOns((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const rows: [string, number][] = [
    [`Van and crew (${q.hours} h × ${gbp(q.hourly)})`, q.labour],
    [`Bank holiday +${Math.round(BANK_HOLIDAY_PCT * 100)}%`, q.bankHoliday],
    [`Mileage (${miles} mi, first ${FREE_MILES} free)`, q.mileage],
    [`Furniture assembly (${assemblyHours} h × ${q.movers})`, q.assembly],
    [`Packing help (${packingHours} h × ${q.movers})`, q.packing],
    ['Access and item extras', q.addOns],
  ];

  return (
    <div className={full ? 'pe pe-full' : 'pe'} data-seen-watch="">
      <h3>{heading}</h3>
      <div className="pe-seg" role="group" aria-label="Van">
        {RATES.map((r, i) => (
          <button key={r.id} type="button" aria-pressed={i === crew} onClick={() => setCrew(i)}>{r.short}{full && <small className="pe-seg-hint">£{r.hourly}/hr</small>}</button>
        ))}
      </div>

      <h4>How many helpers?</h4>
      <div className="pe-chips" role="group" aria-label="Helpers">
        {HELPERS.map((n) => (
          <button key={n} type="button" aria-pressed={n === helpers} onClick={() => setHelpers(n)}>{n === 0 ? 'Driver only' : `${n} helper${n > 1 ? 's' : ''}`}<small>{n === 0 ? '+£0' : `+£${n * HELPER_RATE}/hr`}</small></button>
        ))}
      </div>

      <h4>How many hours?</h4>
      <div className="pe-chart" role="group" aria-label="Hours on site">
        {HOURS.map((h, i) => (
          <button key={h} type="button" className="pe-bar" aria-pressed={h === hours} aria-label={`${h} hours, ${gbp(bar(h))}`} onClick={() => setHours(h)} style={{ '--i': i } as Vars}>
            <small>{Math.round(bar(h))}</small>
            <i style={{ height: `${Math.round((bar(h) / max) * 82)}%` }} />
          </button>
        ))}
      </div>
      <div className="pe-hours" aria-hidden="true">
        {HOURS.map((h) => <span key={h} className={h === hours ? 'on' : undefined}>{h}h</span>)}
      </div>
      <div className="pe-step" role="group" aria-label="Hours on site">
        <button type="button" aria-label="One hour less" disabled={hours === HOURS[0]} onClick={() => setHours((h) => Math.max(HOURS[0], h - 1))}><Ico icon={MinusIcon} size={18} /></button>
        <b aria-live="polite">{hours} h</b>
        <button type="button" aria-label="One hour more" disabled={hours === HOURS[HOURS.length - 1]} onClick={() => setHours((h) => Math.min(HOURS[HOURS.length - 1], h + 1))}><Ico icon={AddIcon} size={18} /></button>
      </div>
      <p className="pe-note">{rate.name}: {rate.suits} {MIN_HOURS}-hour minimum, then billed in 30-minute steps. Loading and unloading included.</p>

      <h4>When?</h4>
      <div className="pe-chips" role="group" aria-label="Day and time">
        {WHEN.map((x, i) => (
          <button key={x.label} type="button" aria-pressed={i === when} onClick={() => setWhen(i)}>{x.label}<small>{x.add}</small></button>
        ))}
      </div>

      {full && (
        <>
          <h4 id="pe-miles">Journey distance: {miles} miles</h4>
          <input className="pe-range" type="range" min={0} max={MAX_MILES} step={1} value={miles} aria-labelledby="pe-miles" onChange={(e) => setMiles(Number(e.target.value))} />
          <div className="pe-scale"><span>0 mi</span><span>First {FREE_MILES} mi included, then £{PER_MILE.toFixed(2)}/mi</span><span>{MAX_MILES} mi</span></div>

          <h4>Labour services (per hour, per mover)</h4>
          <div className="pe-services">
            <div className="pe-svc">
              <p>Furniture assembly</p>
              <p>£{ASSEMBLY_RATE}/hr per mover</p>
              <Stepper label="Assembly hours" value={`${assemblyHours} h`} decDisabled={assemblyHours <= 0} incDisabled={assemblyHours >= 8} onDec={() => setAssemblyHours((h) => Math.max(0, h - 0.5))} onInc={() => setAssemblyHours((h) => Math.min(8, h + 0.5))} />
            </div>
            <div className="pe-svc">
              <p>Packing help</p>
              <p>£{PACKING_RATE}/hr per mover</p>
              <Stepper label="Packing hours" value={`${packingHours} h`} decDisabled={packingHours <= 0} incDisabled={packingHours >= 8} onDec={() => setPackingHours((h) => Math.max(0, h - 0.5))} onInc={() => setPackingHours((h) => Math.min(8, h + 0.5))} />
            </div>
          </div>

          <h4>Access and item extras</h4>
          <div className="pe-opts" role="group" aria-label="Access and item extras">
            {ADD_ONS.map((o) => (
              <button key={o.key} type="button" className="pe-opt" aria-pressed={addOns.includes(o.key)} onClick={() => toggle(o.key)}>
                <span><Ico icon={TickCircleIcon} size={18} aria-hidden="true" />{o.label}</span>
                <small>+£{o.price}</small>
              </button>
            ))}
          </div>
          <p className="pe-note">Normal stairs are never charged. An extra stop also adds any extra miles and time. Piano and specialist items are quoted separately.</p>
        </>
      )}

      <div className="pe-total">
        <div>
          <strong aria-live="polite"><span key={`${crew}-${hours}-${helpers}-${when}-${q.total}`} className="flip-in">{gbp(q.total)}</span></strong>
          <p>{q.hours}-hour move · {rate.short}{helpers > 0 ? ` + ${helpers} helper${helpers > 1 ? 's' : ''}` : ''}<small>That is {gbp(Math.round((q.total / q.hours) * 100) / 100)} an hour. A guide price, confirmed in your fixed quote.</small></p>
        </div>
        <a href={book} className="pe-btn mo-btn">Book {hours} h <CtaMark /></a>
      </div>
      {full && (
        <dl className="pe-rows">
          {rows.map(([l, v]) => (
            <div key={l}><dt>{l}</dt><dd>{v > 0 ? gbp(v) : '—'}</dd></div>
          ))}
          <div className="is-total"><dt>Total</dt><dd>{gbp(q.total)}</dd></div>
        </dl>
      )}
      <p className="pe-foot">{full ? DEPOSIT_TEXT : `First ${FREE_MILES} journey miles included. A guide for the van and hours shown; you get a fixed quote before moving day.`}</p>
      <div className="pe-row">
        <span className="pe-promo"><Ico icon={WalletIcon} size={15} aria-hidden="true" /> Fixed-price quotes</span>
        {share && (
          <button type="button" className="pe-share" onClick={shareLink} aria-live="polite">
            <Ico icon={copied === 'done' ? TickCircleIcon : LinkIcon} size={15} aria-hidden="true" />
            {copied === 'done' ? 'Link copied' : copied === 'failed' ? 'Could not copy' : 'Share this price'}
          </button>
        )}
      </div>
    </div>
  );
}

// Radii follow the kit scale: 20 cards, 16 inner panels, 12 controls, 999 pills. One shadow token.
export const PRICE_EXPLORER_CSS = `
.pe{background:#fff;border-radius:20px;box-shadow:var(--card-shadow);padding:clamp(20px,2.4vw,30px);display:flex;flex-direction:column;font-variant-numeric:tabular-nums}
.pe-btn{display:inline-flex;align-items:center;gap:10px;border-radius:999px;font-weight:600;white-space:nowrap;background:var(--lime);color:var(--ink);padding:7px 7px 7px 20px;font-size:15.5px;min-height:44px;transition:background-color .2s ease}
.pe-btn .mo-cta-mark{background:rgba(255,255,255,.55)}
.pe-btn:hover{background:var(--lime-hover);color:var(--ink)}
.pe h3{margin:0 0 12px;font-size:15.5px;font-weight:600}
.pe h4{margin:22px 0 10px;font-size:13.5px;font-weight:600}
.pe-seg{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;border-radius:999px;background:var(--band);align-self:flex-start}
.pe-seg button{border:0;background:transparent;padding:9px 16px;min-height:40px;border-radius:999px;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink-68);cursor:pointer;transition:background-color .25s,color .25s,box-shadow .25s}
.pe-seg button[aria-pressed=true]{background:#fff;color:var(--ink);box-shadow:var(--card-shadow)}
.pe-seg-hint{margin-left:6px;font-size:11.5px;font-weight:600;color:var(--accent)}
.pe-chart{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;height:190px;align-items:end;border-bottom:1px solid var(--line)}
.pe-bar{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;height:100%;border:0;background:none;padding:0;cursor:pointer;font:inherit}
.pe-bar small{font-size:11.5px;color:var(--ink-60);font-weight:600}
.pe-bar i{display:block;width:min(30px,100%);border-radius:12px 12px 0 0;background:var(--band);transform-origin:bottom;transition:height .5s var(--ease-soft),background-color .25s}
.pe-bar:hover i{background:var(--green-soft)}
.pe-bar[aria-pressed=true] i{background:var(--lime)}
.pe-bar[aria-pressed=true] small{color:var(--ink)}
.pe-hours{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;margin-top:6px;text-align:center;font-size:12px;color:var(--ink-60)}
.pe-hours .on{color:var(--ink);font-weight:600}
.pe-step{display:none;align-items:center;gap:14px}
.pe-step.pe-step-on{display:flex}
.pe-step button{display:grid;place-items:center;width:44px;height:44px;border-radius:999px;border:1px solid var(--line-strong);background:#fff;color:var(--ink);cursor:pointer}
.pe-step button:disabled{opacity:.35;cursor:default}
.pe-step b{min-width:64px;text-align:center;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:28px;letter-spacing:-.02em}
.pe-note{margin:10px 0 0;font-size:13.5px;line-height:1.5;color:var(--ink-60)}
.pe-chips{display:flex;flex-wrap:wrap;gap:6px}
.pe-chips button{border:0;padding:8px 13px;min-height:40px;border-radius:999px;background:var(--band);font:inherit;font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .25s}
.pe-chips button small{margin-left:4px;color:var(--accent);font-weight:600;font-size:11.5px}
.pe-chips button[aria-pressed=true]{background:var(--lime)}
.pe-chips button[aria-pressed=true] small{color:var(--ink)}
.pe-range{width:100%;accent-color:var(--ink);margin:4px 0 0;min-height:32px}
.pe-scale{display:flex;justify-content:space-between;gap:10px;margin-top:2px;font-size:12px;color:var(--ink-60)}
.pe-services{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.pe-svc{padding:16px;border-radius:16px;background:var(--band)}
.pe-svc p{margin:0}
.pe-svc p:first-child{font-size:14.5px;font-weight:600}
.pe-svc p+p{margin:2px 0 12px;font-size:12.5px;color:var(--ink-60)}
.pe-svc .pe-step b{font-size:22px;min-width:56px}
.pe-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.pe-opt{display:flex;align-items:center;justify-content:space-between;gap:10px;border:0;padding:12px 14px;min-height:44px;border-radius:12px;background:var(--band);font:inherit;font-size:14px;font-weight:600;color:var(--ink);text-align:left;cursor:pointer;transition:background-color .25s}
.pe-opt:hover{background:var(--green-soft)}
.pe-opt[aria-pressed=true]{background:var(--lime)}
.pe-opt span{display:flex;align-items:center;gap:8px}
.pe-opt svg{flex:none;opacity:.25}
.pe-opt[aria-pressed=true] svg{opacity:1}
.pe-opt small{flex:none;font-size:12.5px;font-weight:600;color:var(--accent)}
.pe-opt[aria-pressed=true] small{color:var(--ink)}
.pe-total{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;margin-top:22px;padding-top:22px;border-top:1px dashed var(--line-strong)}
.pe-total strong{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(46px,5vw,60px);line-height:1;letter-spacing:-.03em;perspective:400px}
.pe-total p{margin:8px 0 0;font-size:15px}
.pe-total p small{display:block;font-size:13.5px;color:var(--ink-60);margin-top:2px}
.pe-rows{margin:16px 0 0}
.pe-rows div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:14.5px}
.pe-rows dt{color:var(--ink-68)}
.pe-rows dd{margin:0;font-weight:600}
.pe-rows .is-total dt{color:var(--ink);font-weight:600}
.pe-foot{margin:14px 0 0;font-size:13.5px;color:var(--ink-68);line-height:1.5}
.pe-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;margin-top:12px}
.pe-promo{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:999px;background:var(--green-soft);color:var(--accent);font-size:13.5px;font-weight:600}
.pe-share{display:inline-flex;align-items:center;gap:6px;min-height:44px;border:0;background:none;padding:0;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(15,26,9,.35);cursor:pointer}
@media (prefers-reduced-motion:no-preference){
  .js-reveal [data-seen-watch]:not([data-seen]) .pe-bar i{transform:scaleY(0)}
  [data-seen] .pe-bar i{animation:ih-grow .9s var(--ease-soft) both;animation-delay:calc(var(--i) * 60ms)}
}
@media (prefers-reduced-motion:reduce){
  .pe-bar i,.pe-seg button,.pe-chips button,.pe-opt,.pe-btn{transition:none}
}
@media print{
  .pe-chart,.pe-hours,.pe-step,.pe-share,.pe-btn{display:none!important}
  .pe{box-shadow:none;border:1px solid var(--line)}
}
@media (max-width:760px){
  .pe-chart,.pe-hours{display:none}
  .pe-step{display:flex}
  .pe>*{order:1}
  .pe:not(.pe-full) .pe-total{order:0;margin:0 0 20px;padding:0 0 20px;border-top:0;border-bottom:1px dashed var(--line-strong)}
  .pe-seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%}
  .pe-seg button{padding:9px 4px;font-size:12.5px}
  .pe-seg-hint{display:block;margin:0}
  .pe-services,.pe-opts{grid-template-columns:minmax(0,1fr)}
}
`;
