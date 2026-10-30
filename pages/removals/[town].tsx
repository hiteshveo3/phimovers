import type { GetStaticPaths, GetStaticProps } from 'next';
import { Location as LocationIcon } from 'iconsax-reactjs';
import { getTown, nearbyTowns, townCoverage, townHref, towns } from '../../lib/towns';
import { countyHref } from '../../lib/counties';
import { townExtras } from '../../lib/featuredContent';
import { SITE_URL } from '../../lib/contact';
import { businessRef } from '../../lib/seo';
import { Breadcrumbs, CtaBand, DcPage, FaqSplit, HeroBadge, HeroButtons, SideCard, TrustChips, band, card, faqSchema, h1Style, h2Style, leadStyle, monoLabel } from '../../kit/components/DcPage';
import { TickList } from '../../kit/components/Blocks';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: towns.map((t) => ({ params: { town: t.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ town: string }> = async ({ params }) => ({ props: { town: String(params?.town) } });

const PRICES = [
  'Studio flat moves from £249, 1-bed from £329',
  '2-bed house moves from £499, 3-bed from £749',
  '4-bed and larger homes from £999',
  'Man and van from £50/hour (two-hour minimum)',
  'Full packing from £150, storage from £15/week',
];

export default function TownPage({ town: slug }: { town: string }) {
  const town = getTown(slug)!;
  const nearby = nearbyTowns(town);
  const county = countyHref(town.county);
  const extras = townExtras[town.slug];
  const url = `${SITE_URL}${townHref(town.slug)}`;
  const crumbs = [{ name: 'UK removals', path: '/removals' }, { name: town.name }];
  const distance = town.miles ? `around ${town.miles} miles` : 'a sea crossing';

  const faqs = [
    ...(extras?.faqs ?? []),
    town.localFaq,
    {
      q: `How much do removals in ${town.name} cost?`,
      a: `We price every ${town.name} move from your inventory, access and distance, so you get a fixed quote before moving day. As a guide, studio moves start from £249 and 2-bed houses from £499, with mileage beyond the first 10 miles added to the quote.`,
    },
    {
      q: `Are your ${town.name} removals insured?`,
      a: 'Yes. Every move includes goods-in-transit and public liability insurance as standard.',
    },
    {
      q: `Do you offer packing and storage for ${town.name} moves?`,
      a: 'Yes — full or fragile-only packing and secure storage can be added to any move.',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Removals in ${town.name}`,
    serviceType: 'House removals',
    areaServed: { '@type': 'City', name: town.name },
    provider: businessRef(),
    url,
  };

  return (
    <DcPage
      title={`House Removals ${town.name} | Removal Company ${town.county} | Phi Movers`}
      description={`Removals in ${town.name}, ${town.county}: fixed-price house moves, man and van and packing from an insured removal company. Moves between ${town.name} and London quoted up front.`}
      path={townHref(town.slug)}
      canonical={url}
      crumbs={crumbs}
      schema={[jsonLd, faqSchema(faqs)]}
    >
      <section style={{ padding: 'clamp(28px,5vw,64px) 5vw' }}>
        <div style={{ minWidth: 0 }}>
          <Breadcrumbs crumbs={crumbs} />
          <HeroBadge ico={LocationIcon}>{town.county} · {town.region}</HeroBadge>
          <h1 style={{ ...h1Style('none', 'clamp(34px,4.8vw,58px)'), lineHeight: 1.03, margin: '0 0 18px' }}>House Removals in {town.name}</h1>
          <p style={leadStyle('56ch', '0 0 26px')}>
            Looking for a removal company in {town.name}? Phi Movers handles house removals, flat moves and man and van for {town.name} ({town.postcodes.split(' ').slice(0, 3).join(', ')} and nearby) with fixed prices agreed before moving day.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HeroButtons />
          </div>
          <TrustChips middle={{ ico: LocationIcon, text: town.name }} />
        </div>
      </section>

      <div className="dc-two-col" style={{ padding: 'clamp(28px,4vw,52px) 5vw' }}>
        <div className="dc-prose" style={{ minWidth: 0 }}>
          <h2 className="dc-text" style={{ marginTop: 0 }}>Removal company in {town.name}</h2>
          {town.intro ? <p className="dc-text">{town.intro}</p> : null}
          <p className="dc-text">{townCoverage(town)}</p>
          <p className="dc-text">Every {town.name} move is priced from your inventory and the access at both addresses. The quote covers the crew, van, loading, transport and unloading — no extra charges for stairs or a longer carry on the day.</p>

          {extras?.sections.map((x) => (
            <div key={x.h2}>
              <h2 className="dc-text">{x.h2}</h2>
              {x.paras.map((p, i) => <p key={i} className="dc-text">{p}</p>)}
              {x.list ? <TickList items={x.list} /> : null}
            </div>
          ))}

          <h2 className="dc-text">Housing we move in {town.name}</h2>
          <p className="dc-text">{town.housing}</p>

          <h2 className="dc-text">Access and parking in {town.name}</h2>
          <p className="dc-text">{town.access}</p>

          {town.facts?.length ? (
            <>
              <h2 className="dc-text">{town.name} at a glance</h2>
              <p className="dc-text">The local details we plan {town.name} moves around{town.council ? <> — {town.name} is covered by {town.council}, which handles parking suspensions and permits</> : null}:</p>
              <TickList items={town.facts} />
            </>
          ) : null}

          <h2 className="dc-text">Moving between {town.name} and London</h2>
          <p className="dc-text">{town.name} is {distance} from central London. We plan the timing so loading, the journey and unloading fit the day, and the mileage is built into your fixed quote rather than added afterwards.</p>
          <TickList items={PRICES} />

          <h2 className="dc-text">Removal services in {town.name}</h2>
          <p className="dc-text">
            Choose the services you need: <a href="/services/house-removals">house removals</a>, {town.services.includes('man-and-van') ? <a href={townHref(town.slug, 'man-and-van')}>man and van in {town.name}</a> : <a href="/services/man-and-van">man and van</a>}, {town.services.includes('house-clearance') ? <a href={townHref(town.slug, 'house-clearance')}>house clearance in {town.name}</a> : <a href="/services/house-clearance">house clearance</a>}, <a href="/services/full-packing-service">packing</a>, {town.services.includes('secure-storage') ? <a href={townHref(town.slug, 'secure-storage')}>removals and storage in {town.name}</a> : <a href="/services/secure-storage">storage</a>}, {town.services.includes('office-removals') ? <a href={townHref(town.slug, 'office-removals')}>office removals in {town.name}</a> : <a href="/services/office-removals">office removals</a>}, <a href={townHref(town.slug, 'furniture-delivery')}>furniture and sofa delivery in {town.name}</a>, <a href="/services/long-distance-removals">long distance removals</a>, <a href="/services/single-item-delivery">single item delivery</a> and <a href="/services/piano-and-specialist">piano moving</a>.
          </p>
        </div>
        <aside className="dc-aside">
          {county ? <p className="dc-text" style={{ margin: '0 0 12px' }}><a href={county}>Removals across {town.county}</a></p> : null}
          <SideCard title="Get a fixed quote" text={`Send both postcodes and a few details — we’ll confirm the right van and a fixed price for your ${town.name} move.`} />
          {nearby.length ? (
            <nav aria-label="Nearby towns" style={card()}>
              <p style={monoLabel()}>Nearby towns</p>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 2.1 }}>
                {nearby.map((n) => (
                  <span key={n.slug} style={{ display: 'block' }}><a href={townHref(n.slug)}>Removals {n.name}</a></span>
                ))}
              </p>
            </nav>
          ) : null}
        </aside>
      </div>

      <section style={band(true)}>
        <FaqSplit title={`${town.name} removals FAQs`} lead={`Answers to the questions we get most about moving in and out of ${town.name}.`} items={faqs} idPrefix="town-faq" />
      </section>

      <CtaBand title={`Moving in ${town.name}?`} text="Message or call for a fixed-price quote — no obligation, no deposit to enquire." />
    </DcPage>
  );
}
