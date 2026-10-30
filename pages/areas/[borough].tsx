import type { GetStaticPaths, GetStaticProps } from 'next';
import { Location as LocationIcon } from 'iconsax-reactjs';
import { areas, areaServiceHref, getAreaBySlug, getNearbyAreas } from '../../lib/areas';
import { allServices, priceLabel } from '../../lib/data';
import { SITE_URL } from '../../lib/contact';
import { businessRef } from '../../lib/seo';
import { getFaqsForPath } from '../../lib/page-faqs';
import { townHref } from '../../lib/towns';
import { Breadcrumbs, CtaBand, DcPage, FaqSplit, HeroBadge, HeroButtons, MapEmbed, SideCard, TrustChips, band, card, h1Style, h2Style, leadStyle, monoLabel } from '../../kit/components/DcPage';
import { BOROUGHS, type Region } from '../../kit/areas-list';
import { SIZES, bookHref, estimate } from '../../kit/estimate';
import { FREE_MILES, MIN_HOURS } from '../../kit/site-facts';
import { ServiceTiles } from '../../kit/components/AreaBits';
import { areaHubSeo } from '../../lib/seoTargets';
import { areaHubExtras } from '../../lib/featuredContent';
import { TickList } from '../../kit/components/Blocks';

const SITE = SITE_URL;

// Region hub pages list their boroughs; everything else is a borough or neighbourhood page.
const HUB_REGION: Record<string, Region> = {
  'central-london': 'Central London',
  'north-london': 'North London',
  'east-london': 'East London',
  'south-london': 'South London',
  'west-london': 'West London',
};
// Towns outside London kept at their old /areas URL until redirected; their canonical is the town page.
const MOVED_TO_TOWNS = ['leamington-spa', 'warwick'];

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: areas.map((a) => ({ params: { borough: a.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ borough: string }> = async ({ params }) => ({ props: { borough: String(params?.borough) } });

export default function AreaPage({ borough }: { borough: string }) {
  const area = getAreaBySlug(borough)!;
  const nearby = getNearbyAreas(area.slug, 6);
  const url = `${SITE}/areas/${area.slug}`;
  const crumbs = [{ name: 'Areas', path: '/areas' }, { name: area.name }];
  const seo = areaHubSeo(area);
  const extras = areaHubExtras[area.slug];
  const pageFaqs = [...(extras?.faqs ?? []), ...area.faqs, ...getFaqsForPath('/areas')];
  const region = HUB_REGION[area.slug];
  const hubBoroughs = region ? BOROUGHS.filter((b) => b.region === region) : [];
  const canonical = MOVED_TO_TOWNS.includes(area.slug) ? `${SITE}${townHref(area.slug)}` : url;
  // Typical moves here, from the size guide: same borough, lift or one flight at one end.
  const typical = SIZES.filter((s) => !s.quoted).map((s) => ({ label: s.label, crew: s.crew, range: estimate(SIZES.indexOf(s), 1, 0).range }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Removals in ${area.name}`,
    description: area.blurb,
    areaServed: { '@type': 'AdministrativeArea', name: area.name },
    provider: businessRef(),
    url,
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <DcPage
      title={seo.title}
      description={seo.description}
      path={`/areas/${area.slug}`}
      canonical={canonical}
      crumbs={crumbs}
      schema={[jsonLd, faqLd]}
    >
      <section style={{ padding: 'clamp(28px,5vw,64px) 5vw' }}>
        <div style={{ minWidth: 0 }}>
          <Breadcrumbs crumbs={crumbs} />
          <HeroBadge ico={LocationIcon}>{area.borough ? `London neighbourhood · ${area.postcodes}` : 'London borough'}</HeroBadge>
          <h1 style={{ ...h1Style('none', 'clamp(34px,4.8vw,58px)'), lineHeight: 1.03, margin: '0 0 18px' }}>{seo.h1}</h1>
          <p style={leadStyle('54ch', '0 0 26px')}>{area.blurb} Fixed-price quotes, phone booking and insured crews for house removals, sofas, office moves and more.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HeroButtons book={bookHref()} />
          </div>
          <TrustChips middle={{ ico: LocationIcon, text: area.name }} />
        </div>
      </section>

      <div className="dc-two-col" style={{ padding: 'clamp(28px,4vw,52px) 5vw' }}>
        <div className="dc-prose" style={{ minWidth: 0 }}>
          <h2 className="dc-text" style={{ marginTop: 0 }}>Removal company in {area.name}</h2>
          <p className="dc-text">{seo.intro}</p>
          {extras?.sections.map((x) => (
            <div key={x.h2}>
              <h2 className="dc-text">{x.h2}</h2>
              {x.paras.map((p, i) => <p key={i} className="dc-text">{p}</p>)}
              {x.list ? <TickList items={x.list} /> : null}
            </div>
          ))}
          <h2 className="dc-text">Housing we move in {area.name}</h2>
          <p className="dc-text">{area.housing}</p>
          <h2 className="dc-text">Access, parking &amp; permits</h2>
          <p className="dc-text">{area.access}</p>

          {hubBoroughs.length > 0 && (
            <>
              <h2 className="dc-text">Boroughs in {region}</h2>
              <p className="dc-text">Each borough has its own page with local parking notes, prices and services.</p>
              <ul className="ab-boroughs">
                {hubBoroughs.map((b) => <li key={b.slug}><a href={b.href}>{b.name}</a></li>)}
              </ul>
            </>
          )}

          <h2 className="dc-text">Typical moves {region ? `across ${region}` : `in ${area.name}`}</h2>
          <p className="dc-text">Guide prices from our published rates, with a lift or one flight of stairs at one end and packing finished. The first {FREE_MILES} journey miles are included; a {MIN_HOURS}-hour minimum applies.</p>
          <div className="dc-table-wrap">
            <table className="dc-table">
              <caption className="dc-sr">Typical move prices in {area.name}</caption>
              <thead><tr><th scope="col">Move</th><th scope="col">Van and crew</th><th scope="col" style={{ textAlign: 'right' }}>Guide price</th></tr></thead>
              <tbody>
                {typical.map((t) => <tr key={t.label}><td>{t.label}</td><td>{t.crew}</td><td style={{ textAlign: 'right' }}>{t.range}</td></tr>)}
              </tbody>
            </table>
          </div>
          <p className="dc-text" style={{ fontSize: 14, color: 'var(--ink-60)' }}>Larger homes are quoted individually. Try the <a href="/pricing#calculator">price calculator</a> for your own van and hours.</p>

          {!region && (
            <>
              <h2 className="dc-text">Moving out of {area.name}, or into it</h2>
              <p className="dc-text">Moving from {area.name} to a nearby borough, or into {area.name} from elsewhere in London? We cover both ends at the same rates. Moving further? We run planned single-day moves from London to towns across the UK, quoted at a fixed price.</p>
              <p className="dc-text">
                {nearby.slice(0, 4).map((n, i) => <span key={n.slug}>{i ? ', ' : ''}<a href={`/areas/${n.slug}`}>{n.name}</a></span>)}
                {' '}· <a href="/removals">removals outside London</a>
              </p>
            </>
          )}

          <h2 className="dc-text">Map of {area.name}</h2>
          <MapEmbed zoom={region ? 11 : 13} title={`Map of ${area.name}`} aspectRatio="16/9" place={`${area.name}, London`} />
        </div>
        <aside className="dc-aside">
          <SideCard title="Get a fixed quote" text="Fixed-price quotes, phone booking and insured crews for house removals, sofas, office moves and more." book={bookHref()} />
          <nav aria-label="Nearby boroughs" style={card()}>
            <p style={monoLabel()}>Nearby boroughs</p>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 2.1 }}>
              {nearby.map((n) => (
                <span key={n.slug} style={{ display: 'block' }}><a href={`/areas/${n.slug}`}>{n.name}</a></span>
              ))}
            </p>
          </nav>
        </aside>
      </div>

      <section style={band(true)}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px 24px', marginBottom: 22 }}>
          <div>
            <h2 className="dc-text" style={h2Style('0 0 8px')}>Services in {area.name}</h2>
            <p className="dc-text" style={{ margin: 0, fontSize: 16, color: 'rgba(15,26,9,.68)' }}>Every service we offer — with a dedicated local page for {area.name}.</p>
          </div>
          <a href="/services" className="dc-inline-link" style={{ fontWeight: 600 }}>All services</a>
        </div>
        <ServiceTiles
          items={allServices.map((s) => ({ slug: s.slug, title: s.title, price: priceLabel(s.price), desc: s.desc, image: s.image }))}
          hrefFor={(slug) => areaServiceHref(area, slug)}
          titleFor={(t) => `${t} in ${area.name}`}
          showDesc
        />
      </section>

      <section style={{ padding: 'clamp(30px,4vw,56px) 5vw' }}>
        <FaqSplit title={`${area.name} removals FAQs`} lead={`Local answers for parking, timing and the jobs we run most in ${area.name}.`} items={pageFaqs} idPrefix="area-faq" />
      </section>

      <style dangerouslySetInnerHTML={{ __html: '.ab-boroughs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 18px;padding:0;list-style:none}.ab-boroughs a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border-radius:999px;background:#fff;box-shadow:var(--card-shadow);font-size:14px;font-weight:600;text-decoration:none}.dc-prose .ab-boroughs a{color:var(--ink);text-decoration:none}' }} />
      <CtaBand book={bookHref()} title={`Moving in ${area.name}?`} text={`Message or call for a fixed-price quote — no obligation, all ${areas.length} boroughs covered.`} />
    </DcPage>
  );
}
