import { useState, type CSSProperties, type ReactNode } from 'react';
import { Add as AddIcon, ArrowRight as ArrowRightIcon, Building3 as Building3Icon, Car as CarIcon, Clock as ClockIcon, Layer as LayerIcon, People as PeopleIcon, TickCircle as TickCircleIcon, Truck as TruckIcon } from 'iconsax-reactjs';
import { Breadcrumbs, CtaBand, DcPage, FaqList, faqSchema } from '../kit/components/DcPage';
import { Ico, type IconType } from '../kit/components/Ico';
import { CtaMark, Odo, Words, useHomeMotion } from '../kit/components/HomeMotion';
import { HOURS, PriceExplorer } from '../kit/components/PriceExplorer';
import { BANK_HOLIDAY_PCT, EVENING_PER_HOUR, SIZES, bookHref, estimate, gbp, rateCardPrice } from '../kit/estimate';
import { CANCELLATION, DEPOSIT_TEXT, FREE_MILES, HELPER_RATE, HOURS_TEXT, INSURED_TEXT, MIN_HOURS, PER_MILE, RATES, SITE } from '../kit/site-facts';
import { servicesCatalog, startingPrices } from '../kit/services-catalog';
import { getFaqsForPath } from '../lib/page-faqs';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const icon = (i: IconType, size = 18) => <Ico icon={i} size={size} aria-hidden="true" />;

// Same look as the homepage: weight-500 display type, soft-shadow white cards, one lime action per block.
// Every figure on this page comes from kit/site-facts.ts through quotePrice() in kit/estimate.ts.
const PRICING_CSS = `
.pp-wrap{max-width:1400px;margin:0 auto;padding:0 5vw}
.pp-sec{padding-top:clamp(52px,6.5vw,84px)}
.pp-sec:last-of-type{padding-bottom:clamp(20px,3vw,36px)}
.pp-eyebrow{display:block;margin:0 0 14px;color:var(--accent);font:600 11.5px/1.2 'Instrument Sans',sans-serif;letter-spacing:.1em;text-transform:uppercase}
.pp-h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(27px,3vw,36px);line-height:1.15;letter-spacing:-.025em;margin:0;color:var(--ink);text-wrap:balance}
.pp-lead{margin:12px 0 0;max-width:56ch;font-size:15.5px;line-height:1.6;color:var(--ink-68)}
.pp-head{margin-bottom:26px}
.pp-card{background:#fff;border-radius:20px;box-shadow:var(--card-shadow)}
.pp-band{background:var(--band);border-radius:28px;padding:clamp(28px,4vw,56px)}
.pp-split{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(28px,5vw,72px);align-items:start}
/* The left column (heading and copy) stays in view while the right column scrolls. */
@media (min-width:981px){.pp-split>:first-child{position:sticky;top:112px}}
.pp-faq-intro{position:sticky;top:112px}
.pp-note{margin:14px 0 0;font-size:13px;line-height:1.55;color:var(--ink-60);max-width:78ch}
.pp-more{display:inline-flex;align-items:center;gap:8px;margin-top:22px;min-height:44px;font-weight:600;font-size:15px;color:var(--ink)}
.pp-more svg{transition:translate .35s var(--ease-soft)}
.pp-more:hover svg{translate:4px 0}
.pp-btn{display:inline-flex;align-items:center;gap:10px;border-radius:999px;font-weight:600;white-space:nowrap;background:var(--lime);color:var(--ink);padding:7px 7px 7px 20px;min-height:44px;font-size:15.5px;transition:background-color .2s ease}
.pp-btn .mo-cta-mark{background:rgba(255,255,255,.55)}
.pp-btn:hover{background:var(--lime-hover);color:var(--ink)}
.pp-textlink{font-size:14px;font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(15,26,9,.35)}

/* Hero */
.pp-hero{background-image:radial-gradient(120% 100% at 50% 0%,#dff0cc 0%,var(--band-a) 72%);padding:clamp(28px,4vw,48px) 0 0}
.pp-h1{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(36px,5vw,60px);line-height:1.06;letter-spacing:-.035em;margin:0;max-width:22ch;color:var(--ink);text-wrap:balance}
.pp-hero-lead{margin:18px 0 0;max-width:60ch;font-size:clamp(15.5px,1.4vw,17.5px);line-height:1.6;color:var(--ink-68)}
.pp-jump{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:22px 0 0;padding:0;list-style:none;font-size:13.5px;color:var(--ink-68)}
.pp-jump a{display:inline-flex;align-items:center;min-height:36px;padding:7px 13px;border-radius:999px;background:#fff;color:var(--ink);font-weight:500}
.pp-jump a:hover{background:var(--green-soft);color:var(--ink)}

/* Calculator and the numbers beside it */
.pp-top{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:16px;align-items:start;margin-top:clamp(24px,3vw,36px)}
.pp-side{display:grid;gap:16px;position:sticky;top:96px}
.pp-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:0;padding:0;list-style:none}
.pp-tile{padding:20px 22px}
.pp-tile b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(34px,3.4vw,44px);line-height:1;letter-spacing:-.03em;color:var(--accent)}
.pp-tile b small{font-size:.42em;letter-spacing:0;margin-left:5px}
.pp-tile>span{display:block;margin-top:10px;font-size:13.5px;line-height:1.45;color:var(--ink-68)}
.pp-tiers{margin:0;padding:6px 22px;list-style:none}
.pp-tiers li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 16px;align-items:baseline;padding:14px 0}
.pp-tiers li+li{border-top:1px solid var(--line)}
.pp-tiers h3{margin:0;font-size:15.5px;font-weight:600}
.pp-tiers b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:24px;line-height:1;letter-spacing:-.02em;color:var(--accent)}
.pp-tiers p{margin:0;font-size:13.5px;line-height:1.45;color:var(--ink-68)}
.pp-tiers small{text-align:right;font-size:12.5px;color:var(--ink-60);white-space:nowrap}

/* Rate card table */
.pp-tablecard{padding:6px;overflow-x:auto}
.pp-table{width:100%;border-collapse:separate;border-spacing:0;font-size:15px;font-variant-numeric:tabular-nums}
.pp-table th,.pp-table td{padding:13px 16px;text-align:left;border-bottom:1px solid var(--line)}
.pp-table thead th{background:var(--band);font-size:12.5px;font-weight:600;color:var(--ink-72);border-bottom:0}
.pp-table thead th:first-child{border-radius:12px 0 0 12px}
.pp-table thead th:last-child{border-radius:0 12px 12px 0}
.pp-table tbody tr:last-child :is(th,td){border-bottom:0}
.pp-table tbody th{font-weight:600;white-space:nowrap}
.pp-table td{color:rgba(15,26,9,.8)}
.pp-tag{display:inline-flex;margin-left:8px;padding:2px 8px;border-radius:999px;background:var(--green-soft);color:var(--accent);font-size:11px;font-weight:600;vertical-align:1px}
.pp-example{margin-top:16px;padding:clamp(18px,2.2vw,26px)}
.pp-example h3{margin:0 0 6px;font-size:15.5px;font-weight:600}
.pp-example p{margin:0 0 12px;font-size:14px;line-height:1.5;color:var(--ink-68)}
.pp-example dl{margin:0}
.pp-example dl div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:14.5px}
.pp-example dd{margin:0;font-weight:600}
.pp-example .is-total dt{font-weight:600}

/* Price your job */
.pp-job{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(18px,3vw,36px);padding:clamp(20px,2.4vw,30px)}
.pp-job h3{margin:0 0 12px;font-size:15.5px;font-weight:600}
.pp-chips{display:flex;flex-wrap:wrap;gap:6px}
.pp-chips button{border:0;padding:9px 14px;min-height:40px;border-radius:999px;background:var(--band);font:inherit;font-size:13.5px;font-weight:600;color:var(--ink);cursor:pointer;transition:background-color .25s}
.pp-chips button:hover{background:var(--green-soft)}
.pp-chips button[aria-pressed=true]{background:var(--lime)}
.pp-changes{margin-top:24px}
.pp-changes h4{margin:0 0 10px;font-size:13.5px;font-weight:600}
.pp-changes ul{margin:0;padding:0;list-style:none;display:grid;gap:9px}
.pp-changes li{display:flex;gap:10px;align-items:flex-start;font-size:14.5px;line-height:1.45;color:var(--ink-68)}
.pp-changes svg{flex:none;margin-top:1px;color:var(--accent)}
.pp-out{background:var(--band);border-radius:16px;padding:clamp(18px,2.2vw,26px);display:grid;gap:14px;align-content:start}
.pp-out-label{font-size:12.5px;font-weight:600;color:var(--ink-60)}
.pp-out strong{display:block;margin-top:6px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(40px,4.4vw,52px);line-height:1;letter-spacing:-.03em;perspective:400px}
.pp-out-sub{display:block;margin-top:8px;font-size:13.5px;color:var(--ink-68)}
.pp-facts{margin:0}
.pp-facts div{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--line);font-size:14.5px}
.pp-facts dt{color:var(--ink-68)}
.pp-facts dd{margin:0;font-weight:600;font-variant-numeric:tabular-nums}

/* Typical moves */
.pp-typ{margin:0;padding:6px 22px;list-style:none}
.pp-typ li{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr) 120px;gap:8px 22px;align-items:center;padding:14px 0}
.pp-typ li+li{border-top:1px solid var(--line)}
.pp-typ b{display:block;font-size:15px;font-weight:600}
.pp-typ small{display:block;margin-top:2px;font-size:13px;color:var(--ink-60)}
.pp-typ strong{text-align:right;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;letter-spacing:-.01em;color:var(--accent);white-space:nowrap}
.pp-range{position:relative;display:block;height:8px;border-radius:999px;background:rgba(15,26,9,.07)}
.pp-range i{position:absolute;top:0;bottom:0;border-radius:999px;background:var(--lime)}

/* What changes the price */
.pp-whys{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
.pp-why{padding:18px 20px;height:100%}
.pp-why-ico{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--green-soft);color:var(--accent)}
.pp-why h3{margin:12px 0 4px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.pp-why p{margin:0;font-size:14px;line-height:1.5;color:var(--ink-68)}
.pp-week{margin-top:12px;padding:20px 22px}
.pp-week h3{margin:0;font-size:15.5px;font-weight:600}
.pp-week>p{margin:4px 0 14px;font-size:13.5px;color:var(--ink-68)}
.pp-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin:0;padding:0;list-style:none}
.pp-days li{padding:10px 0;border-radius:12px;background:var(--band);text-align:center;font-size:12px;color:var(--ink-60)}
.pp-days b{display:block;margin-top:2px;font-size:15px;font-weight:600;color:var(--ink)}
.pp-week>small{display:block;margin-top:12px;font-size:13px;color:var(--ink-60)}

/* Every service */
.pp-groups{columns:3 320px;column-gap:16px}
.pp-group{break-inside:avoid;margin:0 0 16px;padding:8px 22px 10px}
.pp-group h3{margin:0;padding:14px 0 12px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;letter-spacing:-.01em}
.pp-group ul{margin:0;padding:0;list-style:none}
.pp-group li{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 16px;align-items:baseline;padding:11px 0;border-top:1px solid var(--line)}
.pp-group a{font-size:14.5px;font-weight:600}
.pp-group a:hover{color:var(--accent)}
.pp-group b{font-size:14.5px;font-weight:600;color:var(--accent);white-space:nowrap;text-align:right}
.pp-group small{grid-column:1 / -1;font-size:13px;line-height:1.4;color:var(--ink-60)}

/* Included, quoted separately, mileage */
.pp-covers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.pp-cover{padding:clamp(20px,2.4vw,28px)}
.pp-cover h3{margin:0 0 14px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px;letter-spacing:-.015em}
.pp-cover ul{margin:0;padding:0;list-style:none}
.pp-cover li{display:flex;align-items:center;gap:10px;padding:10px 0;font-size:14.5px;line-height:1.4}
.pp-cover li+li{border-top:1px solid var(--line)}
.pp-cover li svg{flex:none;color:var(--accent)}
.pp-cover li span{flex:1;min-width:0}
.pp-cover li em{font-style:normal;font-size:12.5px;color:var(--ink-60);white-space:nowrap}

/* Payment and changes */
.pp-pay{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 0;padding:0;list-style:none}
.pp-pay li{display:inline-flex;align-items:center;gap:8px;padding:7px 13px;border-radius:999px;background:#fff;font-size:13.5px;font-weight:500;box-shadow:var(--card-shadow)}
.pp-pay svg{color:var(--accent)}
.pp-cancel{padding:8px 22px 16px}
.pp-cancel h3{margin:0;padding:14px 0 6px;font-size:15.5px;font-weight:600}
.pp-cancel ul{margin:0;padding:0;list-style:none}
.pp-cancel li{padding:13px 0;border-top:1px solid var(--line);font-size:14.5px;line-height:1.45;color:rgba(15,26,9,.8)}

@media (max-width:980px){
  .pp-top,.pp-split,.pp-job{grid-template-columns:minmax(0,1fr)}
  .pp-side,.pp-faq-intro{position:static}
  .pp-covers{grid-template-columns:minmax(0,1fr)}
}
@media (max-width:760px){
  .pp-band{margin:0 -5vw;border-radius:0;padding:48px 5vw}
  .pp-tile{padding:16px}
  .pp-tiles{gap:12px}
  .pp-tiers p,.pp-tiers small{grid-column:1 / -1;text-align:left}
  .pp-table{font-size:14px}
  .pp-table th,.pp-table td{padding:12px 10px}
  .pp-typ{padding:4px 18px}
  .pp-typ li{grid-template-columns:minmax(0,1fr) auto}
  .pp-typ .pp-range{grid-column:1 / -1;grid-row:2}
  .pp-whys{grid-template-columns:minmax(0,1fr)}
  .pp-why{display:grid;grid-template-columns:38px minmax(0,1fr);column-gap:14px;padding:16px}
  .pp-why-ico{grid-row:span 2}
  .pp-why h3{margin:0 0 4px}
  .pp-days{gap:4px}
  .pp-days li{font-size:11px}
  .pp-days b{font-size:13.5px}
  .pp-group{padding:6px 18px 8px}
}
@media (prefers-reduced-motion:reduce){.pp-more svg,.pp-chips button,.pp-btn{transition:none}}
@media print{
  .pp-hero{background:none}
  .pp-jump,.pp-chips,.pp-btn,.pp-more{display:none!important}
  .pp-card{box-shadow:none;border:1px solid var(--line)}
  .pp-side{position:static}
}
`;

// Crew that goes with each home size in the size guide (kit/estimate.ts SIZES).
const CREW: Record<string, { van: string; helpers: number }> = {
  item: { van: 'small', helpers: 0 },
  studio: { van: 'transit', helpers: 1 },
  '1bed': { van: 'transit', helpers: 1 },
  '2bed': { van: 'luton', helpers: 2 },
  '3bed': { van: 'luton', helpers: 2 },
  '45bed': { van: 'luton', helpers: 2 },
};

const CHANGES: Record<string, string[]> = {
  item: ['Stairs and whether there is a lift', 'Parking near the door', 'Anything that needs dismantling first'],
  studio: ['Packing finished before we arrive', 'Stairs and lift access', 'Parking near the door'],
  '1bed': ['Distance between the two addresses', 'Floors and lift booking', 'Furniture that needs dismantling'],
  '2bed': ['Journey across London', 'Stairs at either end', 'Packing and dismantling still to do'],
  '3bed': ['Amount of furniture and boxes', 'Parking and distance to the door', 'Packing finished before we arrive'],
  '45bed': ['Two vans and a larger crew', 'Access at both addresses', 'Packing and storage needs'],
};

// Typical London moves: the size guide with a lift at one end, same borough and across London.
const typical = SIZES.map((s, i) => {
  const near = estimate(i, 1, 0);
  const far = estimate(i, 1, 1);
  return { id: s.id, move: s.label, crew: s.crew, time: s.quoted ? 'Full day' : `${near.totalHours}–${far.totalHours} hrs`, lo: near.lo, hi: far.hi, cost: s.quoted ? 'Quoted' : `£${near.lo}–£${far.hi}` };
});
const typicalMax = Math.max(...typical.map((t) => t.hi));

const MOVERS: { ico: IconType; title: string; text: string }[] = [
  { ico: TruckIcon, title: 'Van', text: 'Small van, Transit or Luton. The bigger the load, the bigger the van.' },
  { ico: PeopleIcon, title: 'Crew', text: `Driver only or up to three helpers at £${HELPER_RATE}/hr each. More hands means fewer hours.` },
  { ico: ClockIcon, title: 'Hours', text: `${MIN_HOURS}-hour minimum, then 30-minute steps at the hourly rate.` },
  { ico: CarIcon, title: 'Distance', text: `First ${FREE_MILES} journey miles included, then £${PER_MILE.toFixed(2)} a mile.` },
  { ico: Building3Icon, title: 'Stairs and parking', text: 'No stair fee, but several floors or a long walk from the van takes longer.' },
  { ico: LayerIcon, title: 'Packing', text: 'Unfinished packing and furniture to dismantle are the usual causes of overruns.' },
];

const included = ['Loading and unloading', `First ${FREE_MILES} journey miles`, 'Blankets and straps', 'Normal stairs, no stair fee', INSURED_TEXT];
const separate = ['Packing help, by the hour', 'Boxes and materials', 'Furniture assembly, by the hour', 'Piano and specialist items', 'Storage between dates'];
const external = ['Parking and permits', 'Congestion Charge', 'Toll and tunnel charges', 'Parking fines where no legal parking exists'];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const JUMPS: [string, string][] = [['Calculator', '#calculator'], ['Rate card', '#rate-card'], ['Price your job', '#your-job'], ['Every service', '#services'], ['What is included', '#included'], ['Deposit', '#payment'], ['Questions', '#questions']];

const faqs = getFaqsForPath('/pricing');
const from = RATES[0];

function Head({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: ReactNode; id: string }) {
  return (
    <>
      <p className="pp-eyebrow">{eyebrow}</p>
      <h2 id={id} className="pp-h2 mo-head"><Words text={title} /></h2>
      {lead && <p className="pp-lead mo-lead">{lead}</p>}
    </>
  );
}

/** Pick what you are moving: starting price, typical time and cost, and what changes it. */
function JobPicker() {
  const [i, setI] = useState(2);
  const s = SIZES[i];
  const e = estimate(i, 1, 0);
  const crew = CREW[s.id];
  const hours = Math.ceil(e.totalHours);
  return (
    <div className="pp-card pp-job" data-reveal="">
      <div>
        <h3 id="job-q">What are you moving?</h3>
        <div className="pp-chips" role="group" aria-labelledby="job-q">
          {SIZES.map((j, n) => (
            <button key={j.id} type="button" aria-pressed={n === i} onClick={() => setI(n)}>{j.label}</button>
          ))}
        </div>
        <div className="pp-changes">
          <h4>What changes the price</h4>
          <ul>{(CHANGES[s.id] ?? []).map((c) => <li key={c}>{icon(TickCircleIcon, 17)}{c}</li>)}</ul>
        </div>
      </div>
      <div className="pp-out" aria-live="polite">
        <div>
          <span className="pp-out-label">{s.quoted ? 'Price' : 'Starting price'}</span>
          <strong><span key={s.id} className="flip-in">{s.quoted ? 'Quoted' : gbp(s.base)}</span></strong>
          <span className="pp-out-sub">{s.crew}{s.quoted ? ', priced on the call' : ` · first ${MIN_HOURS} hrs, then ${gbp(s.hr)}/hr`}</span>
        </div>
        {!s.quoted && (
          <dl className="pp-facts">
            <div><dt>Typical time</dt><dd>{e.totalHours} hrs</dd></div>
            <div><dt>Typical cost</dt><dd>{e.range}</dd></div>
          </dl>
        )}
        <div>
          <a href={bookHref({ ...crew, hours: s.quoted ? undefined : hours })} className="pp-btn mo-btn">{s.quoted ? 'Ask for a quote' : 'Book online'} <CtaMark /></a>
        </div>
      </div>
    </div>
  );
}

function Range({ lo, hi }: { lo: number; hi: number }) {
  if (!hi) return <span className="pp-range" aria-hidden="true" />;
  const left = (lo / typicalMax) * 100;
  const width = Math.max(3, (hi / typicalMax) * 100 - left);
  return <span className="pp-range" aria-hidden="true"><i style={{ left: `${left}%`, width: `${width}%` }} /></span>;
}

/** The 30-minute rule with one overrun worked through from the rate card. */
function OverrunExample() {
  const r = RATES[1];
  const booked = rateCardPrice(r.id, 3, 1);
  const actual = rateCardPrice(r.id, 3.5, 1);
  const hourly = r.hourly + HELPER_RATE;
  return (
    <div className="pp-card pp-example" data-reveal="">
      <h3>If a job runs over</h3>
      <p>A studio booked for 3 hours with a {r.name.toLowerCase()} and one helper. Packing was not finished, so the job takes 3 h 20 min and is billed as 3 h 30 min.</p>
      <dl>
        <div><dt>Booked: 3 hrs × {gbp(hourly)}</dt><dd>{gbp(booked)}</dd></div>
        <div><dt>Extra 30 minutes at the same rate</dt><dd>{gbp(actual - booked)}</dd></div>
        <div className="is-total"><dt>Total for 3 h 30 min</dt><dd>{gbp(actual)}</dd></div>
      </dl>
    </div>
  );
}

export default function Pricing() {
  useHomeMotion();
  const serviceCount = servicesCatalog.reduce((n, g) => n + g.services.length, 0);
  return (
    <DcPage
      title={`Man and Van Prices London from £${from.hourly}/hr | Phi Movers`}
      description={`Phi Movers' published rate card: ${RATES.map((r) => `${r.name.toLowerCase()} £${r.hourly}/hr`).join(', ')}. ${MIN_HOURS}-hour minimum, first ${FREE_MILES} miles free, live calculator and fixed quotes.`}
      path="/pricing"
      canonical={`${SITE}/pricing`}
      crumbs={[{ name: 'Pricing' }]}
      schema={[faqSchema(faqs)]}
    >
      <style dangerouslySetInnerHTML={{ __html: PRICING_CSS }} />
      <div className="pp">
        <section className="pp-hero">
          <div className="pp-wrap">
            <Breadcrumbs crumbs={[{ name: 'Pricing' }]} />
            <p className="pp-eyebrow">Pricing</p>
            <h1 className="pp-h1 mo-title"><Words text="Our prices, published in full" /></h1>
            <p className="pp-hero-lead">Three things decide what a move costs: the van, the crew and the hours. Everything else is either included or quoted separately and agreed before the day.</p>
            <ul className="pp-jump" aria-label="On this page">
              <li>Jump to:</li>
              {JUMPS.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}
            </ul>

            <div id="calculator" className="pp-top">
              <PriceExplorer share full heading="Choose your van" />
              <div className="pp-side">
                <ul className="pp-tiles">
                  <li className="pp-card pp-tile" data-reveal=""><b><Odo value={`£${from.hourly}`} /><small>/hr</small></b><span>{from.name.toLowerCase()} and driver</span></li>
                  <li className="pp-card pp-tile" data-reveal="" style={{ '--i': 1 } as Vars}><b><Odo value={`${MIN_HOURS}`} /><small>hrs</small></b><span>minimum, then 30-minute steps</span></li>
                  <li className="pp-card pp-tile" data-reveal="" style={{ '--i': 2 } as Vars}><b><Odo value={`${FREE_MILES}`} /><small>mi</small></b><span>journey miles included, then £{PER_MILE.toFixed(2)}/mi</span></li>
                  <li className="pp-card pp-tile" data-reveal="" style={{ '--i': 3 } as Vars}><b>£<Odo value={`${HELPER_RATE}`} /><small>/hr</small></b><span>for each extra helper</span></li>
                </ul>
                <div className="pp-card" data-reveal="">
                  <h2 className="dc-sr">Van and driver rates</h2>
                  <ul className="pp-tiers">
                    {RATES.map((r) => (
                      <li key={r.id}>
                        <h3>{r.name} and driver</h3>
                        <b>£{r.hourly}/hr</b>
                        <p>{r.suits}</p>
                        <small>{MIN_HOURS} hrs minimum · {gbp(r.base)}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="pp-note">{MIN_HOURS}-hour minimum on every booking, then 30-minute steps. Evenings after 7pm add £{EVENING_PER_HOUR}/hr and bank holidays add {Math.round(BANK_HOLIDAY_PCT * 100)}%. Fixed quotes on request.</p>
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="rate-card">
          <div className="pp-wrap">
            <div className="pp-head">
              <Head id="rate-card" eyebrow="Rate card" title="Hours and totals" lead={`Van and driver, from the ${MIN_HOURS}-hour minimum to a full eight-hour day. Add £${HELPER_RATE}/hr for each helper.`} />
            </div>
            <div className="pp-card pp-tablecard" data-reveal="">
              <table className="pp-table">
                <caption className="dc-sr">Total price by hours on site, van and driver</caption>
                <thead>
                  <tr><th scope="col">Hours</th>{RATES.map((r) => <th key={r.id} scope="col">{r.short}</th>)}</tr>
                </thead>
                <tbody>
                  {HOURS.map((h) => (
                    <tr key={h}>
                      <th scope="row">{h} hrs{h === MIN_HOURS && <span className="pp-tag">Minimum</span>}</th>
                      {RATES.map((r) => <td key={r.id}>{gbp(rateCardPrice(r.id, h))}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <OverrunExample />
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="your-job">
          <div className="pp-wrap">
            <div className="pp-head">
              <Head id="your-job" eyebrow="Your job" title="Price your job" lead="Pick what you are moving to see the starting price, typical time and what changes it." />
            </div>
            <JobPicker />
            <p className="pp-note">Guide prices from the rate card, assuming a lift or one flight at one end and packing finished before we arrive.</p>
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="typical">
          <div className="pp-wrap pp-split">
            <div>
              <Head id="typical" eyebrow="Examples" title="Typical London moves" lead="Worked out from the rate card above: from a move inside one borough to one across London." />
            </div>
            <ul className="pp-card pp-typ" data-reveal="">
              {typical.map((t) => (
                <li key={t.id}>
                  <div><b>{t.move}</b><small>{t.crew} · {t.time}</small></div>
                  <Range lo={t.lo} hi={t.hi} />
                  <strong>{t.cost}</strong>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="changes">
          <div className="pp-wrap">
            <div className="pp-band pp-split">
              <div>
                <Head id="changes" eyebrow="What changes it" title="What moves the price" />
              </div>
              <div>
                <ul className="pp-whys">
                  {MOVERS.map((m, i) => (
                    <li key={m.title} data-reveal="" style={{ '--i': i } as Vars}>
                      <div className="pp-card pp-why">
                        <span className="pp-why-ico icon-pop">{icon(m.ico, 20)}</span>
                        <h3>{m.title}</h3>
                        <p>{m.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="pp-card pp-week" data-reveal="">
                  <h3>Open every day</h3>
                  <p>A {MIN_HOURS}-hour job, {from.name.toLowerCase()} and driver</p>
                  <ul className="pp-days">
                    {DAYS.map((d) => <li key={d}>{d}<b>{gbp(from.base)}</b></li>)}
                  </ul>
                  <small>We work {HOURS_TEXT}. Evenings after 7pm add £{EVENING_PER_HOUR}/hr and bank holidays add {Math.round(BANK_HOLIDAY_PCT * 100)}%.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="services">
          <div className="pp-wrap">
            <div className="pp-head">
              <Head id="services" eyebrow="Every service" title="Starting prices for every service" lead={`All ${serviceCount} services, with the lowest price a job can start from.`} />
            </div>
            <div className="pp-groups">
              {servicesCatalog.map((g) => (
                <div key={g.id} className="pp-card pp-group">
                  <h3>{g.title}</h3>
                  <ul>
                    {g.services.map((s) => (
                      <li key={s.href}>
                        <a href={s.href}>{s.title}</a>
                        <b>{startingPrices[s.href]?.from ?? 'Quoted'}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="pp-note">Guide starting prices. Van and crew jobs follow the rate card above; the final figure is agreed before you book.</p>
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="included">
          <div className="pp-wrap">
            <div className="pp-head">
              <Head id="included" eyebrow="What is covered" title="Included, and quoted separately" />
            </div>
            <div className="pp-covers">
              <div className="pp-card pp-cover" data-reveal="">
                <h3>Included in every price</h3>
                <ul>{included.map((t) => <li key={t}>{icon(TickCircleIcon, 18)}<span>{t}</span></li>)}</ul>
              </div>
              <div className="pp-card pp-cover" data-reveal="" style={{ '--i': 1 } as Vars}>
                <h3>Quoted separately</h3>
                <ul>{separate.map((t) => <li key={t}>{icon(AddIcon, 18)}<span>{t}</span><em>Quoted</em></li>)}</ul>
                <p className="pp-note">Agreed with you before moving day.</p>
              </div>
              <div className="pp-card pp-cover" data-reveal="" style={{ '--i': 2 } as Vars}>
                <h3>Passed on at cost</h3>
                <ul>{external.map((t) => <li key={t}>{icon(AddIcon, 18)}<span>{t}</span><em>At cost</em></li>)}</ul>
                <p className="pp-note">No markup. Long-distance jobs get a fixed quote.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="payment">
          <div className="pp-wrap">
            <div className="pp-band pp-split">
              <div>
                <Head id="payment" eyebrow="Deposit and changes" title="Free to ask, deposit once confirmed" lead={DEPOSIT_TEXT} />
                <ul className="pp-pay">
                  <li>{icon(TickCircleIcon, 16)} Free quote</li>
                  <li>{icon(TickCircleIcon, 16)} Deposit comes off the balance</li>
                  <li>{icon(TickCircleIcon, 16)} Open {HOURS_TEXT}</li>
                </ul>
              </div>
              <div className="pp-card pp-cancel" data-reveal="">
                <h3>Deposit and cancellation</h3>
                <ul>{CANCELLATION.map((c) => <li key={c}>{c}</li>)}</ul>
                <p className="pp-note">The full wording is in our <a href="/terms" className="pp-textlink" style={{ fontSize: 13 }}>terms and conditions</a>.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pp-sec" aria-labelledby="questions">
          <div className="pp-wrap pp-split">
            <div className="pp-faq-intro">
              <Head id="questions" eyebrow="FAQ" title="Pricing questions" />
              <a href="/help" className="pp-more"><span className="mo-link">More answers</span>{icon(ArrowRightIcon, 16)}</a>
            </div>
            <FaqList items={faqs} idPrefix="pricing-faq" />
          </div>
        </section>
      </div>

      <CtaBand title="Get your exact price" text="Two postcodes, the floors and what is moving is usually all we need." book={bookHref()} />
    </DcPage>
  );
}
