'use client';

import { useState } from 'react';
import { Add as AddIcon, Minus as MinusIcon } from 'iconsax-reactjs';
import { Ico } from './Ico';
import { CtaMark } from './HomeMotion';
import { FREE_MILES, HELPER_RATE, MIN_HOURS, PER_MILE, RATES } from '../site-facts';
import { SIZES, bookHref, estimate, gbp, quotePrice } from '../estimate';

// Price blocks shared by service, specialist and borough × service pages: the hero price card (van segments,
// hours stepper, live total), the "What it costs" table and a worked "typical job". Every figure comes from
// quotePrice() in kit/estimate.ts. Services that are priced per job (office, packing, storage, clearance…)
// show "Quoted on the call" with their published starting price instead of a total.

export type PriceMode = 'hourly' | 'quote';
type PricedItem = { slug: string; title: string; price: string };

/** Priced per job after a call or survey: no van-and-hours total is shown for these. */
const QUOTE_SLUGS = [
  'house-removals', 'office-removals', 'it-and-server-relocation', 'retail-shop-move', 'warehouse-removals', 'office-furniture-removals',
  'full-packing-service', 'fragile-only-packing', 'packing-materials', 'secure-storage', 'moving-crate-hire', 'storage-with-collection',
  'house-clearance', 'long-distance-removals', 'part-load-removals', 'piano-and-specialist', 'vehicle-transport', 'motorbike-transport',
  'sofa-and-furniture-hoisting', 'heavy-and-machinery-moving', 'antique-and-fine-art-moving', 'international-moves', 'european-moves',
  'end-of-tenancy-clean', 'free-home-survey',
];

export const priceMode = (item: PricedItem): PriceMode => (QUOTE_SLUGS.includes(item.slug) || /custom|quote|free/i.test(item.price) ? 'quote' : 'hourly');

/** Starting crew for a service: single items go driver-only in a small van, home moves get helpers. */
export function defaultCrew(slug: string): { van: string; helpers: number; hours: number } {
  if (/single-item|bed-and-mattress|appliance|marketplace|motorbike|packing-materials/.test(slug)) return { van: 'small', helpers: 0, hours: MIN_HOURS };
  if (/sofa|furniture|ikea|student|studio|same-day|last-minute/.test(slug)) return { van: 'transit', helpers: 1, hours: MIN_HOURS };
  if (/flat|house|evening/.test(slug)) return { van: 'luton', helpers: 2, hours: 4 };
  return { van: 'transit', helpers: 1, hours: 3 };
}

/** "from £55" → "£55"; anything else as written. */
const fromPrice = (price: string) => price.trim().replace(/^from\s+/i, '');

export const SERVICE_PRICE_CSS = `
.spc{background:#fff;border-radius:20px;box-shadow:var(--card-shadow);padding:clamp(18px,2.2vw,24px);display:grid;gap:14px;font-variant-numeric:tabular-nums}
.spc-label{margin:0;font-size:12.5px;font-weight:600;color:var(--ink-60)}
.spc-seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:4px;border-radius:999px;background:var(--band)}
.spc-seg button{border:0;background:transparent;min-height:40px;padding:6px 4px;border-radius:999px;font:inherit;font-size:13px;font-weight:600;color:var(--ink-68);cursor:pointer}
.spc-seg button[aria-pressed=true]{background:#fff;color:var(--ink);box-shadow:var(--card-shadow)}
.spc-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.spc-step{display:flex;align-items:center;gap:10px}
.spc-step button{display:grid;place-items:center;width:44px;height:44px;border-radius:999px;border:1px solid var(--line-strong);background:#fff;color:var(--ink);cursor:pointer}
.spc-step button:disabled{opacity:.35;cursor:default}
.spc-step b{min-width:52px;text-align:center;font-size:17px;font-weight:600}
.spc-total{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding-top:14px;border-top:1px dashed var(--line-strong)}
.spc-total strong{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(38px,4vw,48px);line-height:1;letter-spacing:-.03em}
.spc-total small{display:block;margin-top:6px;font-size:13px;color:var(--ink-60)}
.spc-quote strong{font-size:clamp(28px,3vw,36px)}
.spc-btn{display:inline-flex;align-items:center;gap:10px;min-height:44px;border-radius:999px;font-weight:600;white-space:nowrap;background:var(--lime);color:var(--ink);padding:6px 6px 6px 18px;font-size:15px}
.spc-btn .mo-cta-mark{background:rgba(255,255,255,.55)}
.spc-btn:hover{background:var(--lime-hover);color:var(--ink)}
.spc-note{margin:0;font-size:12.5px;line-height:1.5;color:var(--ink-60)}
.spc-ex{margin:20px 0;padding:18px 20px;border-radius:16px;background:var(--band)}
.spc-ex h3{margin:0 0 6px;font-size:15.5px;font-weight:600}
.spc-ex p{margin:0 0 10px;font-size:14.5px;line-height:1.55;color:var(--ink-68)}
.spc-ex dl{margin:0}
.spc-ex dl div{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-top:1px solid var(--line);font-size:14.5px}
.spc-ex dd{margin:0;font-weight:600}
@media (prefers-reduced-motion:reduce){.spc-seg button,.spc-btn{transition:none}}
`;

/** Hero price card: van, hours and a live total, or "Quoted on the call" for per-job services. */
export function ServicePriceCard({ item, area }: { item: PricedItem; area?: string }) {
  const crew = defaultCrew(item.slug);
  const [van, setVan] = useState(crew.van);
  const [hours, setHours] = useState(crew.hours);
  const mode = priceMode(item);
  const q = quotePrice({ van, hours, helpers: crew.helpers });
  if (mode === 'quote') {
    return (
      <div className="spc spc-quote">
        <p className="spc-label">{item.title}{area ? ` in ${area}` : ''}</p>
        <div className="spc-total">
          <div>
            <strong>Quoted on the call</strong>
            <small>{/^from\s/i.test(item.price) ? `Jobs start from ${fromPrice(item.price)}. ` : ''}A fixed price agreed before the day.</small>
          </div>
        </div>
        <a href={bookHref({ service: item.slug })} className="spc-btn mo-btn" style={{ justifySelf: 'start' }}>Ask for a price <CtaMark /></a>
      </div>
    );
  }
  return (
    <div className="spc">
      <p className="spc-label" id={`spc-${item.slug}`}>Price your {item.title.toLowerCase()}{area ? ` in ${area}` : ''}</p>
      <div className="spc-seg" role="group" aria-labelledby={`spc-${item.slug}`}>
        {RATES.map((r) => <button key={r.id} type="button" aria-pressed={van === r.id} onClick={() => setVan(r.id)}>{r.short}</button>)}
      </div>
      <div className="spc-row">
        <span style={{ fontSize: 14, fontWeight: 600 }}>Hours</span>
        <div className="spc-step" role="group" aria-label="Hours on site">
          <button type="button" aria-label="One hour less" disabled={hours <= MIN_HOURS} onClick={() => setHours((h) => Math.max(MIN_HOURS, h - 1))}><Ico icon={MinusIcon} size={18} /></button>
          <b aria-live="polite">{hours} h</b>
          <button type="button" aria-label="One hour more" disabled={hours >= 8} onClick={() => setHours((h) => Math.min(8, h + 1))}><Ico icon={AddIcon} size={18} /></button>
        </div>
      </div>
      <div className="spc-total">
        <div>
          <strong aria-live="polite">{gbp(q.total)}</strong>
          <small>{q.rate.short}{crew.helpers ? ` + ${crew.helpers} helper${crew.helpers > 1 ? 's' : ''}` : ', driver only'} · {hours} h</small>
        </div>
        <a href={bookHref({ service: item.slug, van, hours, helpers: crew.helpers })} className="spc-btn mo-btn">Book <CtaMark /></a>
      </div>
      <p className="spc-note">{MIN_HOURS}-hour minimum, then 30-minute steps. First {FREE_MILES} miles included.</p>
    </div>
  );
}

/** "What it costs" rows, built from the rate card and the size guide. */
export function costRows(item: PricedItem): [string, string][] {
  const rows: [string, string][] = [];
  if (priceMode(item) === 'quote' && /^from\s/i.test(item.price)) rows.push([`${item.title}, starting price`, fromPrice(item.price)]);
  if (/house|flat|studio|student/.test(item.slug)) {
    SIZES.forEach((s, i) => rows.push([`${s.label} (${s.crew})`, estimate(i, 1, 0).range]));
  } else {
    RATES.forEach((r) => rows.push([`${r.name} and driver`, `£${r.hourly}/hr`]));
  }
  rows.push(['Each extra helper', `+£${HELPER_RATE}/hr`]);
  rows.push([`${MIN_HOURS}-hour minimum`, `From ${gbp(RATES[0].base)}`]);
  rows.push(['Journey miles', `First ${FREE_MILES} free, then £${PER_MILE.toFixed(2)}/mi`]);
  return rows;
}

export function CostTable({ item }: { item: PricedItem }) {
  return (
    <div className="dc-table-wrap">
      <table className="dc-table">
        <caption className="dc-sr">What {item.title.toLowerCase()} costs</caption>
        <thead><tr><th scope="col">Job</th><th scope="col" style={{ textAlign: 'right' }}>Price</th></tr></thead>
        <tbody>
          {costRows(item).map(([k, v]) => <tr key={k}><td>{k}</td><td style={{ textAlign: 'right' }}>{v}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

/** A worked example: van, crew and hours multiplied out from the rate card. */
export function TypicalJob({ item }: { item: PricedItem }) {
  if (priceMode(item) === 'quote') return null;
  const c = defaultCrew(item.slug);
  const q = quotePrice({ van: c.van, hours: c.hours + 1, helpers: c.helpers });
  return (
    <div className="spc-ex">
      <h3>Typical job</h3>
      <p>A {item.title.toLowerCase()} with a {q.rate.name.toLowerCase()}{c.helpers ? ` and ${c.helpers} helper${c.helpers > 1 ? 's' : ''}` : ', driver only'} that takes {q.hours} hours inside our free miles.</p>
      <dl>
        <div><dt>{q.hours} h × {gbp(q.hourly)}</dt><dd>{gbp(q.labour)}</dd></div>
        <div><dt>Mileage (first {FREE_MILES} free)</dt><dd>£0</dd></div>
        <div><dt>Total</dt><dd>{gbp(q.total)}</dd></div>
      </dl>
    </div>
  );
}
