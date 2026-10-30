import type { GetStaticProps } from 'next';
import { Location as LocationIcon } from 'iconsax-reactjs';
import { areas, areasByRegion, type Area } from '../../lib/areas';
import { allServices } from '../../lib/data';
import { SITE_URL } from '../../lib/contact';
import { Breadcrumbs, CtaBand, DcPage, HeroBadge, HeroButtons, MapEmbed, band, chipStyle, h1Style, h2Style, leadStyle } from '../../kit/components/DcPage';
import { AreaCard } from '../../kit/components/AreaBits';
import { BOOK } from '../../kit/components/DcPage';
import { INSURED_TEXT } from '../../kit/site-facts';

// Boroughs nearest our Dagenham base (kit/site-facts ADDRESS).
const nearBaseSlugs = ['barking-and-dagenham', 'havering', 'redbridge', 'newham'];
const popularSlugs = ['camden', 'islington', 'hackney', 'westminster', 'croydon', 'wandsworth'];

export const getStaticProps: GetStaticProps = async () => ({ props: {} });

const sectionHead = (title: string, lead: string) => (
  <div style={{ maxWidth: 680, marginBottom: 22 }}>
    <h2 className="dc-text" style={h2Style('0 0 10px')}>{title}</h2>
    <p className="dc-text" style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'rgba(15,26,9,.68)' }}>{lead}</p>
  </div>
);

export default function AreasHubPage() {
  const regions = areasByRegion();
  const nearBase = nearBaseSlugs.map((s) => areas.find((a) => a.slug === s)).filter((a): a is Area => Boolean(a));
  const popular = popularSlugs.map((s) => areas.find((a) => a.slug === s)).filter((a): a is Area => Boolean(a));
  const crumbs = [{ name: 'Areas' }];
  const isHoods = (label: string) => label === 'London neighbourhoods';
  const regionId = (label: string) => (label === 'Regions & Key Hubs' ? 'regions-key-hubs' : isHoods(label) ? 'neighbourhoods' : label.toLowerCase());
  const regionTitle = (label: string) => (isHoods(label) ? label : `${label} London`);
  const nav = [{ id: 'near-base', title: 'Near our base' }, { id: 'popular', title: 'Popular' }, ...regions.map((r) => ({ id: regionId(r.label), title: regionTitle(r.label) }))];

  return (
    <DcPage
      title="Areas We Cover — All 32 London Boroughs | Phi Movers"
      description="Phi Movers covers every London borough. Browse removals by area — house removals, sofa delivery, man & van, office moves and more across all 32 boroughs."
      path="/areas"
      canonical={`${SITE_URL}/areas`}
      crumbs={crumbs}
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'center', padding: 'clamp(28px,5vw,60px) 5vw' }}>
        <div style={{ minWidth: 0 }}>
          <Breadcrumbs crumbs={crumbs} />
          <HeroBadge ico={LocationIcon}>{INSURED_TEXT} · 32 boroughs + City</HeroBadge>
          <h1 style={h1Style('18ch')}>Areas we cover</h1>
          <p style={leadStyle('52ch', '0 0 24px')}>Local removals across every London borough — house moves, man &amp; van, sofa delivery and more. Pick your area for a fixed-price quote.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HeroButtons />
          </div>
          <p style={{ margin: '18px 0 0', fontSize: 14.5, color: 'rgba(15,26,9,.68)' }}>{areas.length} areas · {allServices.length} services · <a href="/removals">Moving outside London?</a></p>
        </div>
        <MapEmbed zoom={9} title="Map of Greater London showing the Phi Movers base in Dagenham" />
      </section>

      <section style={{ padding: '0 5vw clamp(20px,3vw,32px)' }}>
        <nav aria-label="Jump to a region" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {nav.map((n) => <a key={n.id} href={`#${n.id}`} className="dc-chip" style={chipStyle}>{n.title}</a>)}
        </nav>
      </section>

      <section id="near-base" style={{ padding: 'clamp(28px,4vw,52px) 5vw', scrollMarginTop: 90 }}>
        {sectionHead('Close to our Dagenham base', 'Our office is in Dagenham, so these boroughs are on our doorstep.')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {nearBase.map((a) => <AreaCard key={a.slug} href={`/areas/${a.slug}`} name={a.name} blurb={a.blurb} label="View area" />)}
        </div>
      </section>

      <section id="popular" style={{ ...band(true), scrollMarginTop: 90 }}>
        {sectionHead('Popular boroughs', 'High-demand London areas — open a local page or get a fixed quote.')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {popular.map((a, i) => (
            <AreaCard
              key={a.slug}
              href={`/areas/${a.slug}`}
              name={a.name}
              blurb={a.blurb}
              label="View area"
              lime={i === 0}
              extra={<a href={BOOK} aria-label={`Get a quote for ${a.name}`} style={{ color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 }}>Get a quote</a>}
            />
          ))}
        </div>
      </section>

      <div id="all-boroughs" style={{ scrollMarginTop: 90 }}>
        {regions.map((region) => {
          const id = regionId(region.label);
          return (
            <section key={region.label} id={id} style={{ padding: 'clamp(28px,4vw,52px) 5vw', scrollMarginTop: 90 }}>
              {sectionHead(
                regionTitle(region.label),
                isHoods(region.label)
                  ? `Local removals and man and van pages for ${region.areas.length} popular London neighbourhoods.`
                  : `Fully insured removals across ${region.areas.length} borough${region.areas.length === 1 ? '' : 's'} in ${region.label.toLowerCase()} London.`,
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
                {region.areas.map((a) => (
                  <AreaCard key={a.slug} href={`/areas/${a.slug}`} name={a.name} blurb={a.blurb} label={`Removals in ${a.name.split(' ')[0]}`} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <CtaBand title="Ready to book your stress-free move?" text="Start your free quote in under a minute — we usually reply within about one working hour. No obligation, no hidden fees." />
    </DcPage>
  );
}
