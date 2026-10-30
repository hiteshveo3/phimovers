import { useEffect, useState, type ReactNode } from 'react';
import { Breadcrumbs, CtaBand, FaqSplit, HeroBadge, HeroButtons, LIME, LINE, MUTED, Photo, TEL, TrustLine, band, card, chipStyle, h1Style, h2Style, h3Style, icon, insuredChip } from './DcPage';
import { TickList } from './Blocks';
import { useHomeMotion } from './HomeMotion';
import QuoteForm from './QuoteForm';
import { CostTable, SERVICE_PRICE_CSS, ServicePriceCard, TypicalJob, priceMode } from './ServicePrice';
import { FREE_MILES, HELPER_RATE, INSURED_TEXT, MIN_HOURS, PER_MILE, PHONE_DISPLAY, RATES, RESPONSE_PROMISE } from '../site-facts';
import { bookHref } from '../estimate';
import { initials } from '../reviews';
import { serviceIcon, servicePhoto } from '../service-icons';
import { priceLabel, type ServiceItem } from '../../lib/data';
import type { ServiceCopy } from '../../lib/services';
import type { ServiceSeo } from '../../lib/seoTargets';
import { ArrowRight2 as ArrowRight2Icon, Call as CallIcon, Location as LocationIcon, TickCircle as TickCircleIcon } from 'iconsax-reactjs';

export type ServiceDetailProps = {
  item: ServiceItem;
  categoryTitle: string;
  copy: ServiceCopy;
  related: ServiceItem[];
  areas: { slug: string; name: string; href: string }[];
  faqs: { q: string; a: string }[];
  reviews: { name: string; location: string; text: string; avatar?: string }[];
  seo?: ServiceSeo | null;
  /** Blog guides related to this service */
  guides?: { title: string; href: string }[];
};

const HOUSE_SLUGS = ['house-removals', 'flat-removals', 'studio-moves'];

// What to sort before booking, by service family.
const BEFORE: [RegExp, string[]][] = [
  [/office|it-and|retail|warehouse/, ['Book the goods lift and loading bay at both buildings', 'Label desks and IT by floor and room', 'Tell us about out-of-hours access and building rules']],
  [/pack|crate|materials/, ['Count the rooms and any fragile or high-value items', 'Say how many boxes you already have', 'Pick a packing day before moving day']],
  [/storage/, ['Roughly how much is going into storage', 'The collection date and likely redelivery date', 'Anything that needs to stay accessible']],
  [/sofa|furniture|bed|appliance|single|marketplace|ikea|hoist|heavy|piano/, ['Measure the item, the doorways and the stairs', 'Check the lift size, or the floor if there is none', 'Say where the van can park at both ends']],
  [/./, ['Parking or a permit at both addresses', 'Lift bookings and the floor at each end', 'Boxes packed and furniture ready to move']],
];
const beforeYouBook = (slug: string) => BEFORE.find(([re]) => re.test(slug))![1];

const SV_CSS = `
.sv-nav{position:sticky;top:var(--hdr,65px);z-index:30;background:rgba(242,248,233,.98);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid rgba(15,26,9,.08)}
.sv-nav-in{display:flex;align-items:center;gap:12px;padding:0 5vw}
.sv-nav ul{display:flex;gap:4px;overflow-x:auto;padding:9px 0;margin:0;list-style:none;flex:1;min-width:0;scrollbar-width:none;overscroll-behavior-x:contain}
.sv-nav ul::-webkit-scrollbar{display:none}
.sv-nav a{display:inline-flex;align-items:center;min-height:44px;padding:0 13px;border-radius:999px;font-size:13.5px;font-weight:600;white-space:nowrap;color:var(--ink-68);transition:background-color .2s ease,color .2s ease}
.sv-nav a:hover{background:rgba(255,255,255,.7);color:#0f1a09}
.sv-nav a[aria-current="true"]{background:#fff;color:#0f1a09;box-shadow:var(--card-shadow)}
.sv-nav a.sv-nav-book{flex:none;background:var(--lime);color:#0f1a09;padding:0 14px}
@media (max-width:1023.98px){.sv-nav a.sv-nav-book{display:none}}
.sv-anchor{scroll-margin-top:calc(var(--hdr,65px) + 60px)}
.sv-steps{list-style:none;margin:0 0 18px;padding:0;display:grid;gap:22px;position:relative}
.sv-steps::before{content:"";position:absolute;top:22px;bottom:22px;left:21px;border-left:2px dashed rgba(15,26,9,.18)}
.sv-step{position:relative;display:grid;grid-template-columns:44px minmax(0,1fr);column-gap:16px}
.sv-step-n{position:relative;grid-row:span 2;width:44px;height:44px;border-radius:999px;background:var(--lime);display:grid;place-items:center;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px}
.dc-prose .sv-step h3{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:20px;letter-spacing:-.02em;margin:0 0 6px}
.dc-prose .sv-step p{margin:0;font-size:15px;line-height:1.55;color:var(--ink-68)}
.sv-pills{list-style:none;margin:0 0 18px;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.sv-pills li{margin:0}
.sv-pills a{display:flex;align-items:center;min-height:44px;padding:10px 13px;border-radius:12px;background:#fff;border:1px solid rgba(15,26,9,.05);box-shadow:var(--card-shadow);font-size:14px;font-weight:600;color:var(--ink);text-decoration:none;transition:background-color .2s ease}
.dc-prose .sv-pills a{color:var(--ink);text-decoration:none}
.sv-pills a:hover{background:var(--green-soft)}
@media (max-width:760px){.sv-pills{grid-template-columns:repeat(2,minmax(0,1fr))}}
.sv-take{background:var(--band);border-radius:20px;padding:24px 26px;margin:30px 0}
.sv-take-k{display:inline-flex;margin:0 0 12px;font-size:11.5px;line-height:1.2;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
.sv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.sv-reviews{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
@media (max-width:760px){.sv-reviews{grid-template-columns:1fr}}
.sv-av{flex:none;width:36px;height:36px;border-radius:999px;object-fit:cover;background:var(--green-soft)}
.sv-case{margin:0;padding:20px;display:grid;gap:6px;align-content:start}
.sv-glance{margin:12px 0 0;display:grid;gap:10px;font-size:14.5px}
.sv-glance div{display:flex;justify-content:space-between;gap:12px;padding-bottom:10px;border-bottom:1px solid rgba(15,26,9,.08)}
.sv-glance div:last-child{border:0;padding-bottom:0}
.sv-glance dt{color:var(--ink-68)}
.sv-glance dd{margin:0;font-weight:600;text-align:right}
.sv-rel{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.sv-rel a{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:6px 18px;min-height:56px;padding:12px 0;border-bottom:1px solid var(--line);color:var(--ink)}
.sv-rel b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.sv-rel small{font-size:13.5px;font-weight:600;color:var(--accent);white-space:nowrap}
.sv-rel svg{color:var(--accent);transition:translate .35s var(--ease-soft)}
.sv-rel a:hover svg{translate:4px 0}
.sv-hero-side{display:grid;gap:14px;min-width:0}
.sv-hero-photo{aspect-ratio:16/9;border-radius:20px;overflow:hidden;box-shadow:var(--card-shadow);background:#fff}
.sv-before{margin:24px 0;padding:20px 22px;border-radius:20px;background:#fff;box-shadow:var(--card-shadow)}
.sv-before h3{margin:0 0 12px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.01em}
.sv-price-chip{background:var(--lime)!important;box-shadow:none!important}
@media (prefers-reduced-motion:reduce){.sv-nav a,.sv-pills a,.sv-rel svg{transition:none}}
`;

function P({ children }: { children: ReactNode }) {
  return <p className="dc-text">{children}</p>;
}

function H2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} className="dc-text sv-anchor">{children}</h2>;
}

function SectionNav({ links, book }: { links: { id: string; label: string }[]; book: string }) {
  const [active, setActive] = useState(links[0]?.id ?? '');
  useEffect(() => {
    const els = links.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!('IntersectionObserver' in window) || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-120px 0px -65% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [links]);
  return (
    <nav className="sv-nav" aria-label="On this page">
      <div className="sv-nav-in">
        <ul>
          {links.map((l) => (
            <li key={l.id}><a href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined}>{l.label}</a></li>
          ))}
        </ul>
        <a href={book} className="sv-nav-book">Book online</a>
      </div>
    </nav>
  );
}

// "What it costs": prose and table built from site-facts through kit/estimate.ts, never typed prices.
export function CostSection({ item }: { item: ServiceItem }) {
  const quoted = priceMode(item) === 'quote';
  const small = RATES[0];
  const from = /^from\s/i.test(item.price) ? item.price.replace(/^from\s+/i, '') : '';
  return (
    <>
      <H2 id="cost">How much does it cost?</H2>
      {quoted ? (
        <P>{item.title} is priced per job: we agree a <strong>fixed quote</strong> on the call{from ? <>, with jobs starting from <strong>{from}</strong></> : null}, based on what is moving, access and distance. You know the total before we arrive.</P>
      ) : (
        <P>{item.title} is charged by the hour from our published rate card{from ? <>, from <strong>{from}</strong></> : null}: a {small.name.toLowerCase()} and driver is £{small.hourly}/hr, each helper adds £{HELPER_RATE}/hr, and there is a {MIN_HOURS}-hour minimum. After that, time is billed in 30-minute steps.</P>
      )}
      <P>The first {FREE_MILES} journey miles are included, then £{PER_MILE.toFixed(2)} a mile. See our <a href="/pricing">pricing page</a> for the full rate card and calculator.</P>
      <CostTable item={item} />
      <TypicalJob item={item} />
      <p className="dc-text" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontWeight: 600, color: 'var(--accent)' }}>
        <span style={{ flex: 'none', marginTop: 2 }}>{icon(TickCircleIcon, 18)}</span>
        Quotes are free. A deposit is only taken once we confirm your date, and it comes off the final balance.
      </p>
      <P>{RESPONSE_PROMISE}. Larger jobs can book a free home survey.</P>
    </>
  );
}

export default function ServiceDetail({ item, categoryTitle, copy, related, areas, faqs, reviews, seo, guides }: ServiceDetailProps) {
  useHomeMotion();
  const isHouse = item.slug === 'house-removals';
  const houseTable = HOUSE_SLUGS.includes(item.slug);
  const lower = item.title.toLowerCase();
  const isHourly = priceMode(item) === 'hourly';
  const crumbs = [{ name: 'Services', path: '/services' }, { name: item.title }];
  const Badge = serviceIcon(item.icon);
  const photo = servicePhoto(item.slug);
  const book = bookHref({ service: item.slug });

  // Five links at most: the sticky bar is for jumping, not a table of contents.
  const links = [
    { id: 'overview', label: 'Overview' },
    { id: 'cost', label: 'Cost' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faqs', label: 'FAQs' },
  ];

  const glance: [string, string][] = [
    ['Pricing', priceLabel(item.price)],
    ['Response time', 'About 1 working hour'],
    [isHourly ? 'Minimum booking' : 'Quote type', isHourly ? `${MIN_HOURS} hours` : 'Fixed price'],
    ['Coverage', 'All 32 boroughs'],
    ['Insurance', INSURED_TEXT],
  ];

  const ctaTitle = `Ready to book your ${lower}?`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SV_CSS + SERVICE_PRICE_CSS }} />

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'center', padding: 'clamp(28px,5vw,64px) 5vw', backgroundImage: 'radial-gradient(120% 100% at 50% 0%,#dff0cc 0%,var(--band-a) 72%)' }}>
        <div style={{ minWidth: 0 }}>
          <Breadcrumbs crumbs={crumbs} />
          <HeroBadge ico={Badge}>{categoryTitle}</HeroBadge>
          <h1 style={{ ...h1Style('none', 'clamp(34px,4.6vw,58px)'), margin: '0 0 18px' }}>
            {seo ? seo.h1 : isHouse ? 'Stress-Free House Removals Across London' : `${item.title} in London`}
          </h1>
          <p style={{ fontSize: 'clamp(15.5px,1.4vw,17.5px)', lineHeight: 1.6, color: MUTED, margin: '0 0 26px', maxWidth: '52ch', textWrap: 'pretty' }}>
            {seo?.lead
              ? seo.lead
              : isHouse
              ? 'Clear quotes covering your crew, van, loading and transport — delivered by fully insured teams across all 32 London boroughs. Send a quote request with a few details of your rooms and addresses and we will confirm the right van and a fixed price before moving day, usually within about an hour. No deposit to enquire, no card details needed for a quote, and no obligation until you are happy to book.'
              : `${item.desc} Fixed-price, fully insured ${lower} with a friendly local crew across all 32 London boroughs. Send your postcodes and a few details in a quote request — we will confirm the right van, crew and a clear price before you book, usually within about an hour. No deposit to enquire and no obligation until you are ready.`}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <HeroButtons book={book} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px', margin: '22px 0 0' }}>
            <a href="#cost" className="sv-price-chip" style={{ ...chipStyle, fontWeight: 600 }}>{priceLabel(item.price)}</a>
            <a href="#areas" style={{ ...chipStyle, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{icon(LocationIcon, 15)} All 32 boroughs</a>
          </div>
          <TrustLine middle={insuredChip} />
        </div>
        <div className="sv-hero-side">
          {photo && <div className="sv-hero-photo"><Photo src={photo} alt={`${item.title} in London`} eager /></div>}
          <ServicePriceCard item={item} />
        </div>
      </section>

      <SectionNav links={links} book={book} />

      <section style={band(true, 'clamp(26px,4vw,44px) 5vw')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {[['32', 'Boroughs covered'], ['Fixed', 'Quotes before move day'], ['Insured', 'Goods + liability']].map(([n, l]) => (
            <div key={l}>
              <p className="dc-text" style={{ ...h3Style(26), color: 'var(--accent)' }}>{n}</p>
              <p className="dc-text" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: MUTED }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="dc-two-col" style={{ padding: 'clamp(28px,4vw,52px) 5vw' }}>
        <div className="dc-prose" style={{ minWidth: 0 }}>
          <H2 id="overview">{seo?.overviewH2 ?? `${item.title} across London, done properly`}</H2>
          {copy.intro.map((para, i) => <P key={i}>{para}</P>)}

          {seo?.sections.map((x) => (
            <div key={x.id}>
              <H2 id={x.id}>{x.h2}</H2>
              {x.paras.map((para, i) => <P key={i}>{para}</P>)}
              {x.list ? <TickList items={x.list} /> : null}
            </div>
          ))}
          {seo?.related?.length ? (
            <P>
              Related services:{' '}
              {seo.related.map((r, i) => (
                <span key={r.href}>{i ? ', ' : ''}<a href={r.href}>{r.label}</a></span>
              ))}
              .
            </P>
          ) : null}
          {guides?.length ? (
            <>
              <H2 id="guides">Helpful guides</H2>
              <ul>
                {guides.map((g) => (
                  <li key={g.href} className="dc-text"><a href={g.href}>{g.title}</a></li>
                ))}
              </ul>
            </>
          ) : null}

          <H2 id="included">What’s included as standard</H2>
          <P>We believe the price you’re quoted should be the price you pay. That’s why every {lower} booking comes with the essentials built in — no surprise charges bolted on when the crew arrives.</P>
          <TickList items={copy.included} max={4} />

          <H2 id="ideal">Who this service is for</H2>
          <P>Not sure whether this is the right option? It’s a great fit for a wide range of moves, including:</P>
          <TickList items={copy.idealFor} max={4} />
          <div className="sv-before">
            <h3>Before you book</h3>
            <TickList items={beforeYouBook(item.slug)} />
          </div>

          <H2 id="how-it-works">How it works, step by step</H2>
          <P>
            {item.slug === 'sofa-delivery'
              ? 'From photos and postcodes to sofa in place — here’s what happens on a typical London sofa delivery.'
              : 'We’ve refined our process across London moves every week to keep everything simple and predictable. Here’s exactly what happens from your first enquiry through to completion.'}
          </P>
          <ol className="sv-steps">
            {copy.steps.map((s, i) => (
              <li key={s.title} className="sv-step">
                <span className="sv-step-n" aria-hidden="true">{i + 1}</span>
                <h3 className="dc-text">{s.title}</h3>
                <p className="dc-text">{s.body}</p>
              </li>
            ))}
          </ol>

          <CostSection item={item} />

          {houseTable && (
            <>
              <H2 id="van-size">What size van do I need?</H2>
              <P>Not sure which van fits your home? Use this simple guide — then confirm by phone or quote request and we’ll lock the right option into your fixed quote.</P>
              <div className="dc-table-wrap">
                <table className="dc-table">
                  <thead><tr><th scope="col">Property</th><th scope="col">Typical van</th></tr></thead>
                  <tbody>
                    {([
                      ['Studio / bedsits', 'Small van'],
                      ['1-bed flat', 'Small or Transit van'],
                      ['2-bed flat or small house', 'Transit or Luton'],
                      ['3-bed house', 'Luton van'],
                      ['4-bed+ house', 'Luton + extra crew / second run'],
                    ] as [string, string][]).map((r) => (
                      <tr key={r[0]}><td>{r[0]}</td><td style={{ whiteSpace: 'normal' }}>{r[1]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <H2 id="affects">What affects the price</H2>
          <P>A few practical factors move the final number up or down. Knowing them in advance helps you plan and, in many cases, keep costs lower:</P>
          <TickList items={copy.affects} max={4} />

          <div className="sv-take">
            <p className="sv-take-k">Key takeaways</p>
            <TickList
              items={[
                isHourly ? `${item.title} follows the published rate card: ${MIN_HOURS}-hour minimum, then 30-minute steps.` : `${item.title} is quoted as a fixed price, agreed before the day.`,
                `Loading, unloading and the first ${FREE_MILES} journey miles are included.`,
                `${INSURED_TEXT}, across all 32 London boroughs.`,
                `${RESPONSE_PROMISE}.`,
              ]}
            />
          </div>

          <H2 id="areas">Covering all 32 London boroughs</H2>
          <P>Wherever you’re moving in London, pick your borough for a dedicated {lower} page — or browse the full <a href="/areas">areas hub</a>.</P>
          <ul className="sv-pills">
            {areas.map((b) => (
              <li key={b.slug}><a href={b.href}>{b.name}</a></li>
            ))}
          </ul>
          <P>Our drivers know which streets are too narrow for a Luton, where the low bridges and red routes sit, and how Congestion Charge and ULEZ affect your route — so the move stays on schedule.</P>
        </div>

        <aside className="dc-aside">
          <div style={card()}>
            <p style={h3Style(18, '0 0 10px')}>Book or get a fixed quote</p>
            <p style={{ margin: '0 0 14px', fontSize: 14.5, lineHeight: 1.55, color: MUTED }}>{RESPONSE_PROMISE}. No obligation.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
              <a href={book} className="dc-btn dc-btn-lime dc-btn-mark" style={{ fontSize: 15, padding: '13px 20px' }}>Book online</a>
              <a href={TEL} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14.5, textDecoration: 'underline', textUnderlineOffset: 3 }}>{icon(CallIcon, 16)} {PHONE_DISPLAY}</a>
            </div>
          </div>
          <div style={card()}>
            <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>At a glance</p>
            <dl className="sv-glance">
              {glance.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <section style={{ padding: '0 5vw clamp(28px,4vw,52px)' }}>
        <h2 className="dc-text" style={h2Style('0 0 22px')}>Why choose Phi Movers</h2>
        <div className="sv-grid">
          {[
            ['Fixed, transparent prices', 'The quote you agree is the price you pay — no hidden fees added on the day.'],
            ['Genuine London specialists', 'London is where we work every day, so we know the boroughs, permits and shortcuts.'],
            [INSURED_TEXT, 'Goods-in-transit and public liability cover come as standard on every job.'],
            ['Loading help included', 'Our crews do the heavy lifting with you, never charged as an extra.'],
            ['Flexible scheduling', 'Evenings, weekends and same-day slots to fit around your life.'],
            ['Experienced local crews', 'Uniformed movers who turn up on time with the right kit for London access.'],
          ].map(([t, d]) => (
            <article key={t} style={card()}>
              <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 999, background: LIME, marginBottom: 14 }}>{icon(TickCircleIcon, 18)}</span>
              <h3 className="dc-text" style={h3Style(18, '0 0 8px')}>{t}</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: MUTED }}>{d}</p>
            </article>
          ))}
        </div>
      </section>

      {isHouse && (
        <section style={{ ...band(true, 'clamp(30px,4vw,56px) 5vw') }}>
          <H2 id="case-studies">Example London house moves</H2>
          <p className="dc-text" style={{ margin: '0 0 22px', fontSize: 16, color: MUTED, maxWidth: '62ch' }}>Typical routes and access challenges we handle — illustrative examples to help you picture your own moving day (not a claim of case-study photography).</p>
          <div className="sv-grid">
            {([
              ['Hackney → Islington', '2-bed flat, 3rd floor walk-up', 'Narrow staircase and a Saturday slot. Two movers + Luton; sofa carried by hand. Done by early afternoon on a fixed quote.'],
              ['Croydon → Wandsworth', '3-bed house, driveway access', 'Full house contents with basic bed dismantle/reassemble. Parking arranged the week before — no waiting time on the day.'],
              ['Camden → Barnet', 'Family house + fragile kitchen', 'Customer packed clothes; we packed glassware. Fixed price held even with an extra wardrobe discovered on the morning.'],
            ] as [string, string, string][]).map(([route, challenge, outcome]) => (
              <figure key={route} className="sv-case" style={card(false, 20)}>
                <p style={h3Style(17, '0')}>{route}</p>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>{challenge}</p>
                <p style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.55, color: MUTED }}>{outcome}</p>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: 'clamp(30px,4vw,56px) 5vw', borderTop: `1px solid ${LINE}` }}>
        <H2 id="reviews">What customers say</H2>
        <div className="sv-reviews" style={{ marginTop: 22 }}>
          {reviews.map((r) => (
            <figure key={r.name} className="bk-review">
              <div className="bk-review-top">
                <span role="img" aria-label="5 out of 5 stars" style={{ letterSpacing: 2, color: '#f5a623' }}>★★★★★</span>
              </div>
              <blockquote>{r.text}</blockquote>
              <figcaption>
                <span className="bk-avatar" aria-hidden="true">{initials(r.name)}</span>
                <span>{r.name}<small>{r.location}</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="quote" className="sv-anchor" style={{ ...band(true, 'clamp(30px,4vw,56px) 5vw'), borderBottom: 0 }}>
        <h2 className="dc-text" style={h2Style('0 0 8px')}>Get a fixed quote</h2>
        <p className="dc-text" style={{ margin: '0 0 24px', fontSize: 16, color: 'rgba(15,26,9,.62)', maxWidth: '60ch' }}>Call us or send a quote request — we usually reply within about one working hour. No obligation.</p>
        <div style={{ maxWidth: 840 }}>
          <QuoteForm serviceTitle={item.title} />
        </div>
      </section>

      <section style={{ ...band(true, 'clamp(30px,4vw,56px) 5vw'), borderBottom: 0, borderTop: `1px solid ${LINE}` }}>
        <FaqSplit id="faqs" title="FAQs" lead={`Answers about ${item.title.toLowerCase()}: pricing, booking, access and what is included.`} items={faqs} idPrefix="svc-faq" />
      </section>

      <section style={{ padding: 'clamp(30px,4vw,56px) 5vw', borderTop: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px 20px', margin: '0 0 22px' }}>
          <h2 className="dc-text" style={h2Style('0')}>Related services</h2>
          <a href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 15 }}>View all {icon(ArrowRight2Icon, 16)}</a>
        </div>
        <ul className="sv-rel">
          {related.map((s) => (
            <li key={s.slug}>
              <a href={s.href}><b>{s.title}</b><small>{priceLabel(s.price)}</small>{icon(ArrowRight2Icon, 18)}</a>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand book={book} title={ctaTitle} text={`${RESPONSE_PROMISE}. No obligation, no hidden fees, all 32 London boroughs.`} />
    </>
  );
}
