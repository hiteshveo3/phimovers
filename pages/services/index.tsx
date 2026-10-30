import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { BOOK, Breadcrumbs, CtaBand, DcPage, Photo } from '../../kit/components/DcPage';
import { CtaMark, MOTION_CSS, Words, useHomeMotion } from '../../kit/components/HomeMotion';
import { Art, type ArtSubject } from '../../kit/components/Illustrations';
import { allServiceCards } from '../../kit/services-catalog';
import { servicePhoto } from '../../kit/service-icons';
import { FREE_MILES, INSURED_TEXT, RESPONSE_PROMISE } from '../../kit/site-facts';
import { Eyebrow, Head, KIT_CSS, PkSearchClear, kitIcon } from '../../kit/components/PageKit';
import { servicesCatalog } from '../../kit/services-catalog';
import { specialistCards } from '../../kit/specialist-services';
import { serviceIcon } from '../../kit/service-icons';
import { ArrowRight as ArrowRightIcon, Calculator as CalculatorIcon, Map as MapIcon, SearchNormal1 as SearchIcon, ShieldTick as ShieldTickIcon, TaskSquare as TaskIcon, Truck as TruckIcon } from 'iconsax-reactjs';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const TOTAL = servicesCatalog.reduce((n, g) => n + g.services.length, 0);

// Three popular services as picture cards. A real photo where one exists, otherwise a drawn illustration.
const TOP: { slug: string; art: ArtSubject }[] = [
  { slug: 'house-removals', art: 'van' },
  { slug: 'man-and-van', art: 'stairs' },
  { slug: 'sofa-delivery', art: 'sofa' },
];
const top = TOP.flatMap((t) => {
  const s = allServiceCards.find((c) => c.slug === t.slug);
  return s ? [{ ...s, art: t.art, photo: servicePhoto(s.slug) }] : [];
});

const INCLUDED = [
  { ico: TruckIcon, title: 'Loading and unloading', text: 'The crew does the lifting at both ends, with blankets and straps.' },
  { ico: MapIcon, title: `First ${FREE_MILES} miles free`, text: 'Journey miles from collection to delivery, before any mileage is added.' },
  { ico: ShieldTickIcon, title: INSURED_TEXT, text: 'Goods in transit and public liability cover on every job.' },
  { ico: TaskIcon, title: 'A fixed quote first', text: `${RESPONSE_PROMISE}, agreed before the day.` },
];

const SERVICES_CSS = `
.sv-group{padding-top:clamp(36px,4.5vw,56px)}
.sv-group-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px;margin-bottom:16px}
.sv-group-head h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(21px,2.1vw,25px);letter-spacing:-.02em}
.sv-group-head p{margin:0;font-size:14.5px;color:var(--ink-68)}
.sv-rows{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
.sv-row{display:grid;grid-template-columns:38px minmax(0,1fr);gap:4px 14px;align-items:start;height:100%;padding:16px 18px;color:inherit;transition:transform .3s var(--ease-soft)}
.sv-row:hover{transform:translateY(-2px)}
.sv-row .pk-ico{grid-row:1 / span 3;font-size:19px}
.sv-row b{font-size:15.5px;font-weight:600;display:flex;align-items:center;justify-content:space-between;gap:10px}
.sv-row b svg{flex:none;color:var(--ink-60);transition:translate .3s var(--ease-soft)}
.sv-row:hover b svg{translate:3px 0;color:var(--ink)}
.sv-row span{font-size:14px;line-height:1.5;color:var(--ink-68)}
.sv-row em{font-style:normal;font-size:13.5px;font-weight:600;color:var(--accent)}
.sv-row em::first-letter{text-transform:uppercase}
.sv-intro{margin:0 0 16px;max-width:70ch;font-size:15.5px;line-height:1.6;color:var(--ink-68)}
.sv-intro a{color:var(--link);font-weight:600;text-decoration:underline;text-underline-offset:3px}
.sv-top{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0;padding:0;list-style:none}
.sv-card{display:flex;flex-direction:column;height:100%;padding:6px;color:inherit;transition:transform .35s var(--ease-soft)}
.sv-card:hover{transform:translateY(-3px)}
.sv-card-img{display:block;aspect-ratio:4/3;border-radius:15px;overflow:hidden;background:var(--band-a)}
.sv-card-img svg{width:100%;height:100%}
.sv-card-body{display:grid;gap:8px;padding:16px 12px 12px}
.sv-card-body b{font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;letter-spacing:-.01em}
.sv-card-body span{font-size:14.5px;line-height:1.5;color:var(--ink-68)}
.sv-card-price{justify-self:start;padding:4px 12px;border-radius:999px;background:var(--lime);font-size:14px;font-weight:600}
.sv-incl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
.sv-incl li{padding:18px 20px}
.sv-incl b{display:block;margin:12px 0 4px;font-size:15.5px;font-weight:600}
.sv-incl p{margin:0;font-size:14px;line-height:1.5;color:var(--ink-68)}
.sv-unsure{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px}
.sv-unsure p{margin:8px 0 0;max-width:56ch;font-size:15.5px;line-height:1.6;color:var(--ink-68)}
@media (max-width:980px){.sv-top{grid-template-columns:minmax(0,1fr)}.sv-incl{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.sv-incl{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){.sv-card,.sv-row{transition:none}}
.sv-empty{padding:28px;text-align:center;font-size:15px;color:var(--ink-68)}
.sv-empty a{color:var(--link);font-weight:600;text-decoration:underline;text-underline-offset:3px}
@media (max-width:980px){
  .sv-rows{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:640px){
  .sv-rows{grid-template-columns:minmax(0,1fr);gap:8px}
  .sv-row{padding:14px 16px}
}
`;

export default function Services() {
  useHomeMotion();
  const [q, setQ] = useState('');
  // The site search sends people here as /services?q=…
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('q');
    if (v) setQ(v);
  }, []);
  const needle = q.trim().toLowerCase();
  const groups = useMemo(
    () => servicesCatalog
      .map((g) => ({ ...g, services: needle ? g.services.filter((s) => `${s.title} ${s.text}`.toLowerCase().includes(needle)) : g.services }))
      .filter((g) => g.services.length > 0),
    [needle],
  );
  const shown = groups.reduce((n, g) => n + g.services.length, 0);
  return (
    <DcPage
      title="Removal & Specialist Moving Services London | Phi Movers"
      description="Every Phi Movers service — house and office removals, man & van, sofa hoisting, single items, crate hire, heavy items, storage and long-distance UK moves."
      path="/services"
      crumbs={[{ name: 'Services' }]}
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + KIT_CSS + SERVICES_CSS }} />
      <div className="pk">
        <section className="pk-hero">
          <div className="pk-wrap">
            <Breadcrumbs crumbs={[{ name: 'Services' }]} />
            <Eyebrow>All 32 London boroughs</Eyebrow>
            <h1 className="pk-h1 mo-title"><Words text="Our removal services" /></h1>
            <p className="pk-hero-lead">Everything you need to move, packed into one team — home and office removals, packing, storage and specialist handling, all fixed-price and fully insured.</p>
            <div className="pk-find" role="search">
              <label className="pk-find-box">
                {kitIcon(SearchIcon, 20)}
                <span className="dc-sr">Find a service</span>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a service, e.g. sofa, office, storage" autoComplete="off" />
                <PkSearchClear value={q} onClear={() => setQ('')} />
                <span className="pk-find-count" aria-live="polite">{needle ? `${shown} of ${TOTAL}` : `${TOTAL} services`}</span>
              </label>
            </div>
            <ul className="pk-chips" aria-label="Service groups">
              {servicesCatalog.map((g) => (
                <li key={g.id}><a href={`#${g.id}`}>{g.shortTitle}<small>{g.services.length}</small></a></li>
              ))}
            </ul>
          </div>
        </section>

        {!needle && (
          <section className="pk-sec" aria-labelledby="top-h">
            <div className="pk-wrap">
              <div className="pk-head">
                <Head id="top-h" eyebrow="Popular" title="Where most moves start" />
              </div>
              <ul className="sv-top">
                {top.map((s, i) => (
                  <li key={s.href} data-reveal="" style={{ '--i': i } as Vars}>
                    <a href={s.href} className="pk-card sv-card">
                      <span className="sv-card-img">{s.photo ? <Photo src={s.photo} alt="" /> : <Art subject={s.art} style="line" label={`${s.title} illustration`} />}</span>
                      <span className="sv-card-body">
                        <b>{s.title}</b>
                        <span>{s.text}</span>
                        <em className="sv-card-price" style={{ fontStyle: 'normal' }}>{s.price.replace(/^from\s+/i, 'From ')}</em>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {!needle && (
          <section className="pk-sec" aria-labelledby="incl-h">
            <div className="pk-wrap">
              <div className="pk-head">
                <Head id="incl-h" eyebrow="Every job" title="What every job includes" />
              </div>
              <ul className="sv-incl">
                {INCLUDED.map((x, i) => (
                  <li key={x.title} className="pk-card" data-reveal="" style={{ '--i': i } as Vars}>
                    <span className="pk-ico">{kitIcon(x.ico, 20)}</span>
                    <b>{x.title}</b>
                    <p>{x.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {!needle && (
          <section className="pk-sec" aria-labelledby="specialist-h" id="specialist-moves">
            <div className="pk-wrap">
              <div className="pk-head">
                <Head id="specialist-h" eyebrow="Specialist moves" title="Sofas, single items & specialist services" />
              </div>
              <p className="sv-intro">Dedicated crews and kit for the jobs that need more than a van: sofa hoisting through windows and balconies, marketplace and IKEA collections, heavy and machinery moves, crate hire, antiques, and long-distance moves across the UK.</p>
              <ul className="sv-rows">
                {specialistCards.map((s, i) => (
                  <li key={s.href} data-reveal="" style={{ '--i': i % 3 } as Vars}>
                    <a href={s.href} className="pk-card sv-row">
                      <span className="pk-ico">{kitIcon(serviceIcon(s.icon), 20)}</span>
                      <b>{s.title}{kitIcon(ArrowRightIcon, 15)}</b>
                      <span>{s.text}</span>
                      <em>{s.price}</em>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="sv-intro" style={{ marginTop: 18 }}>Moving outside London? See <a href="/removals">UK removals and furniture delivery by town</a>.</p>
            </div>
          </section>
        )}

        <section className="pk-sec" aria-labelledby="all-services">
          <div className="pk-wrap">
            <div className="pk-head">
              <Head id="all-services" eyebrow="Full list" title={`All ${TOTAL} services`} />
            </div>
            {groups.length === 0 && (
              <p className="pk-card sv-empty">Nothing matches “{q}”. Describe the job when you <a href={BOOK}>book online</a> and we will tell you which van and crew it needs.</p>
            )}
            {groups.map((g, gi) => (
              <div key={g.id} id={g.id} className="sv-group" style={gi === 0 ? { paddingTop: 0 } : undefined}>
                <div className="sv-group-head">
                  <h3>{g.title}</h3>
                  <p>{g.intro}</p>
                </div>
                <ul className="sv-rows">
                  {g.services.map((s, i) => (
                    <li key={s.href} data-reveal="" style={{ '--i': i % 3 } as Vars}>
                      <a href={s.href} className="pk-card sv-row">
                        <span className="pk-ico">{kitIcon(serviceIcon(s.icon), 20)}</span>
                        <b>{s.title}{kitIcon(ArrowRightIcon, 15)}</b>
                        <span>{s.text}</span>
                        <em>{s.price}</em>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="pk-sec" aria-labelledby="unsure-h">
          <div className="pk-wrap">
            <div className="pk-band sv-unsure">
              <div>
                <h2 id="unsure-h" className="pk-h2 mo-head"><Words text="Not sure which one you need?" /></h2>
                <p>Pick a van, helpers and hours in the calculator to see a price, then book it or ask us which fits.</p>
              </div>
              <a href="/pricing#calculator" className="pk-btn mo-btn">{kitIcon(CalculatorIcon, 18)} Open the calculator <CtaMark /></a>
            </div>
          </div>
        </section>
      </div>

      <CtaBand title="Ready to book your stress-free move?" text="Start your free quote in under a minute — we usually reply within about one working hour. No obligation, no hidden fees." />
    </DcPage>
  );
}
