import type { GetStaticPaths, GetStaticProps } from 'next';
import { Location as LocationIcon } from 'iconsax-reactjs';
import { allAreaServiceParams, areas, areaServiceHref, comboHref, getAreaBySlug, getNearbyAreas } from '../../../lib/areas';
import { allServices, getServiceBySlug, priceLabel } from '../../../lib/data';
import { buildServiceCopy, relatedServices } from '../../../lib/services';
import { EVIDENCE_BACKED_COMBOS, getComboCopy } from '../../../lib/combos';
import { comboExtras, comboSeo } from '../../../lib/seoTargets';
import { businessRef, offerFromPrice } from '../../../lib/seo';
import { getFaqsForPath } from '../../../lib/page-faqs';
import { SITE_URL } from '../../../lib/contact';
import { Breadcrumbs, CtaBand, DcPage, FaqSplit, HeroBadge, HeroButtons, Photo, SideCard, band, card, chipStyle, h1Style, h2Style, h3Style, monoLabel } from '../../../kit/components/DcPage';
import { CostTable, SERVICE_PRICE_CSS, ServicePriceCard, TypicalJob, priceMode } from '../../../kit/components/ServicePrice';
import { servicePhoto } from '../../../kit/service-icons';
import { bookHref } from '../../../kit/estimate';
import { INSURED_TEXT, MIN_HOURS } from '../../../kit/site-facts';
import { ReviewGrid, StatBand } from '../../../kit/components/Blocks';
import { ServiceTiles } from '../../../kit/components/AreaBits';

const SITE = SITE_URL;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: allAreaServiceParams().map((p) => ({ params: { borough: p.borough, service: p.service } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ borough: string; service: string }> = async ({ params }) => ({
  props: { borough: String(params?.borough), service: String(params?.service) },
});

const WHY: [string, (a: string) => string][] = [
  ['Fixed, transparent prices', () => 'The quote you agree for your addresses is the price you pay — no hidden fees on the day.'],
  ['Genuine local knowledge', (a) => `We move in ${a} and across London, so parking, permits and access go into the plan.`],
  [INSURED_TEXT, () => 'Goods-in-transit and public liability cover come as standard on every job.'],
  ['Loading help included', () => 'Our crews do the heavy lifting with you — never charged as an extra.'],
  ['Flexible scheduling', () => 'Evenings, weekends and same-day slots when capacity allows.'],
  ['Experienced crews', () => 'Uniformed movers who turn up on time with the right kit for London access.'],
];

const ul = (items: string[]) => <ul>{items.map((t) => <li key={t} className="dc-text">{t}</li>)}</ul>;

export default function AreaServicePage({ borough, service }: { borough: string; service: string }) {
  const area = getAreaBySlug(borough)!;
  const { item, category } = getServiceBySlug(service)!;
  const copy = buildServiceCopy(item, area.name);
  const combo = getComboCopy(area, item);
  const seo = comboSeo(area, item);
  const extras = comboExtras[`${area.slug}/${item.slug}`] ?? [];
  const nearby = getNearbyAreas(area.slug, 6);
  const relatedInArea = allServices.filter((s) => s.slug !== item.slug).slice(0, 6);
  const relatedGlobal = relatedServices(item.slug, 3);
  const url = `${SITE}${comboHref(area.slug, item.slug)}`;
  const lower = item.title.toLowerCase();
  const isHourly = priceMode(item) === 'hourly';
  const photo = servicePhoto(item.slug);
  const book = bookHref({ service: item.slug });
  // Only combos with search evidence are indexed (and listed in the sitemap); the rest stay reachable but noindex.
  const indexed = EVIDENCE_BACKED_COMBOS.some((c) => c.borough === area.slug && c.service === item.slug);
  const faqs = getFaqsForPath(`/areas/${area.slug}/${item.slug}`);
  const crumbs = [
    { name: 'Areas', path: '/areas' },
    { name: area.name, path: `/areas/${area.slug}` },
    { name: item.title },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${item.title} in ${area.name}`,
    description: combo.hero,
    ...(photo ? { image: `${SITE}${photo}` } : {}),
    provider: businessRef(),
    areaServed: { '@type': 'AdministrativeArea', name: area.name },
    url,
    offers: offerFromPrice(item.price),
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const facts: [string, string][] = [
    ['Pricing', priceLabel(item.price)],
    ['Area', area.name],
    ['Response time', 'About 1 working hour'],
    [isHourly ? 'Minimum booking' : 'Quote type', isHourly ? `${MIN_HOURS} hours` : 'Fixed price'],
    ['Insurance', INSURED_TEXT],
  ];

  return (
    <DcPage
      title={seo ? seo.title : `${item.title} in ${area.name} — Phi Movers`}
      description={seo ? seo.description : combo.hero.slice(0, 160)}
      path={comboHref(area.slug, item.slug)}
      canonical={url}
      ogImage={photo || undefined}
      crumbs={crumbs}
      schema={[jsonLd, faqLd]}
      noindex={!indexed}
    >
      <style dangerouslySetInnerHTML={{ __html: SERVICE_PRICE_CSS }} />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'center', padding: 'clamp(28px,5vw,64px) 5vw' }}>
        <div style={{ minWidth: 0 }}>
          <Breadcrumbs crumbs={crumbs} />
          <HeroBadge ico={LocationIcon}>{area.name} · {category.title}</HeroBadge>
          <h1 style={{ ...h1Style('none', 'clamp(32px,4.4vw,54px)'), lineHeight: 1.05, margin: '0 0 18px' }}>{seo ? seo.h1 : `${item.title} in ${area.name}`}</h1>
          <p style={{ fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.55, color: 'rgba(15,26,9,.7)', margin: '0 0 26px', maxWidth: '50ch', textWrap: 'pretty' }}>{combo.hero}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HeroButtons book={book} />
          </div>
          <p style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', margin: '20px 0 0', fontSize: 14.5, fontWeight: 500 }}>
            <a href="#cost">{priceLabel(item.price)}</a>
            <a href="#local">{area.name}</a>
          </p>
        </div>
        <div style={{ display: 'grid', gap: 14, minWidth: 0 }}>
          {photo && (
            <div style={{ aspectRatio: '16/9', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--card-shadow)', background: '#fff' }}>
              <Photo src={photo} alt={`${item.title} in ${area.name}`} eager />
            </div>
          )}
          <ServicePriceCard item={item} area={area.name} />
        </div>
      </section>

      <section style={band(true, 'clamp(24px,4vw,40px) 5vw')}>
        <StatBand items={[
          { value: 'Local', label: area.name },
          { value: 'Fixed', label: 'Quotes before move day' },
          { value: 'Insured', label: 'Goods + liability' },
        ]} />
      </section>

      <div className="dc-two-col" style={{ padding: 'clamp(28px,4vw,52px) 5vw' }}>
        <div className="dc-prose" style={{ minWidth: 0 }}>
          <h2 id="overview" className="dc-text" style={{ marginTop: 0 }}>{item.title} across {area.name}, done properly</h2>
          {seo ? <p className="dc-text">{seo.intro}</p> : null}
          {extras.map((x) => (
            <div key={x.id}>
              <h2 id={x.id} className="dc-text">{x.h2}</h2>
              {x.paras.map((p, i) => <p key={i} className="dc-text">{p}</p>)}
              {x.list ? ul(x.list) : null}
            </div>
          ))}
          {combo.intro.map((p, i) => <p key={`c-${i}`} className="dc-text">{p}</p>)}
          {copy.intro.map((p, i) => <p key={`s-${i}`} className="dc-text">{p}</p>)}

          <h2 id="included" className="dc-text">What&apos;s included in {area.name}</h2>
          <p className="dc-text">The price you&apos;re quoted for {lower} in {area.name} should be the price you pay — essentials built in, no surprise charges when the crew arrives.</p>
          {ul(copy.included)}

          <h2 id="ideal" className="dc-text">Who this is for in {area.name}</h2>
          <p className="dc-text">Not sure whether this is the right option for your {area.name} addresses? It&apos;s a strong fit for:</p>
          {ul(copy.idealFor)}

          <h2 id="how-it-works" className="dc-text">How it works in {area.name}</h2>
          <p className="dc-text">From first call to job complete — here&apos;s what happens on a typical {lower} booking in {area.name}.</p>
          <ol style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, display: 'grid', gap: 18 }}>
            {copy.steps.map((s, i) => (
              <li key={s.title} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', columnGap: 16, margin: 0 }}>
                <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--lime)', display: 'grid', placeItems: 'center', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 500, fontSize: 18 }}>{i + 1}</span>
                <div>
                  <h3 className="dc-text" style={{ margin: '0 0 6px' }}>{s.title}</h3>
                  <p className="dc-text" style={{ margin: 0 }}>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 id="cost" className="dc-text">How much does it cost in {area.name}?</h2>
          <p className="dc-text">As a guide we list <strong>{priceLabel(item.price)}</strong> for {lower}. Your final price for {area.name} depends on volume, floors/stairs, parking and distance — confirmed before we set off. Same rates in every borough.</p>
          <CostTable item={item} />
          <TypicalJob item={item} />
          <p className="dc-text">Quotes are free. A deposit is only taken once we confirm your date. See our <a href="/pricing">pricing page</a> or the full <a href={`/services/${item.slug}`}>{item.title} page</a> for rate detail.</p>

          <h2 id="affects" className="dc-text">What affects the price in {area.name}</h2>
          <p className="dc-text">Knowing these upfront keeps your {area.name} quote accurate:</p>
          {ul(copy.affects)}

          <div id="local" style={{ scrollMarginTop: 90 }}>
            <h2 id="housing" className="dc-text">Moving in {area.name} — local notes</h2>
            <h3 className="dc-text">Housing we see</h3>
            <p className="dc-text">{area.housing}</p>
            <h3 className="dc-text">Access, parking &amp; permits</h3>
            <p className="dc-text">{area.access}</p>
            <div style={{ ...card(true, 22), margin: '22px 0 0' }}>
              <p style={monoLabel('0 0 8px')}>Local tip for {area.name}</p>
              <p className="dc-text" style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6 }}>{combo.tip}</p>
            </div>
          </div>

          <h2 id="why" className="dc-text">Why choose Phi Movers in {area.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {WHY.map(([t, d]) => (
              <div key={t} style={card(false, 18)}>
                <p style={h3Style(17, '0 0 6px')}>{t}</p>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'rgba(15,26,9,.68)' }}>{d(area.name)}</p>
              </div>
            ))}
          </div>

        </div>

        <aside className="dc-aside">
          <SideCard book={book} title="Get a fixed quote" text={`${item.title} in ${area.name} — most replies within about one working hour. No deposit to enquire.`} />
          <div style={card()}>
            <p style={monoLabel()}>At a glance</p>
            <dl style={{ margin: 0, display: 'grid', gap: 10 }}>
              {facts.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14.5, borderBottom: '1px solid rgba(15,26,9,.08)', paddingBottom: 10 }}>
                  <dt style={{ color: 'rgba(15,26,9,.6)' }}>{k}</dt>
                  <dd style={{ margin: 0, fontWeight: 600, textAlign: 'right' }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <section id="reviews" style={band(true)}>
        <h2 className="dc-text" style={h2Style('0 0 22px')}>What customers say</h2>
        <ReviewGrid count={2} themes={false} />
      </section>

      <section id="faqs" style={{ padding: 'clamp(30px,4vw,56px) 5vw' }}>
        <FaqSplit title={`${item.title} in ${area.name} — FAQs`} lead={`${faqs.length} answers covering ${area.name} access, pricing, booking and ${lower}.`} items={faqs} idPrefix="combo-faq" />
      </section>

      <section style={band(true)}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px 24px', marginBottom: 20 }}>
          <h2 className="dc-text" style={h2Style('0')}>More services in {area.name}</h2>
          <a href={`/areas/${area.slug}`} className="dc-inline-link" style={{ fontWeight: 600 }}>{area.name} hub</a>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {relatedInArea.map((s) => <a key={s.slug} href={areaServiceHref(area, s.slug)} className="dc-chip" style={chipStyle}>{s.title}</a>)}
        </div>
      </section>

      <section style={{ padding: 'clamp(28px,4vw,52px) 5vw' }}>
        <h2 className="dc-text" style={h2Style('0 0 20px')}>{item.title} nearby</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {nearby.map((n) => <a key={n.slug} href={areaServiceHref(n, item.slug)} className="dc-chip" style={chipStyle}>{item.title} in {n.name}</a>)}
          <a href={`/services/${item.slug}`} className="dc-chip" style={chipStyle}>London-wide {item.title}</a>
        </div>
      </section>

      <section style={{ ...band(true), borderBottom: 0 }}>
        <h2 className="dc-text" style={h2Style('0 0 22px')}>Related services in {area.name}</h2>
        <ServiceTiles
          items={relatedGlobal.map((s) => ({ slug: s.slug, title: s.title, price: priceLabel(s.price), image: s.image }))}
          hrefFor={(slug) => areaServiceHref(area, slug)}
          titleFor={(t) => `${t} in ${area.name}`}
        />
      </section>

      <CtaBand
        book={book}
        title={`Ready to book your ${lower} in ${area.name}?`}
        text={`Message or call for a fixed-price quote — most replies within about an hour, no obligation, covering all ${areas.length} London boroughs.`}
      />
    </DcPage>
  );
}
