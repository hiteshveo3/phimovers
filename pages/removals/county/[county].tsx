import type { GetStaticPaths, GetStaticProps } from 'next';
import { Location as LocationIcon } from 'iconsax-reactjs';
import { counties, getCounty } from '../../../lib/counties';
import { TOWN_SERVICE_LABEL, townHref } from '../../../lib/towns';
import { countyExtras } from '../../../lib/featuredContent';
import { TickList } from '../../../kit/components/Blocks';
import { SITE_URL } from '../../../lib/contact';
import { businessRef } from '../../../lib/seo';
import { Breadcrumbs, CtaBand, DcPage, FaqSplit, HeroBadge, HeroButtons, band, card, faqSchema, h1Style, h2Style, leadStyle } from '../../../kit/components/DcPage';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: counties.map((c) => ({ params: { county: c.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ county: string }> = async ({ params }) => ({ props: { county: String(params?.county) } });

export default function CountyPage({ county: slug }: { county: string }) {
  const county = getCounty(slug)!;
  const path = `/removals/county/${county.slug}`;
  const url = `${SITE_URL}${path}`;
  const crumbs = [{ name: 'UK removals', path: '/removals' }, { name: county.name }];
  const miles = county.towns.map((t) => t.miles).filter((m) => m > 0);
  const range = miles.length ? `${Math.min(...miles)}–${Math.max(...miles)} miles` : null;

  const extras = countyExtras[county.slug];
  const faqs = [
    ...(extras?.faqs ?? []),
    {
      q: `How much do removals in ${county.name} cost?`,
      a: `Every ${county.name} move gets a fixed quote based on your inventory, access and distance. As a guide, studio moves start from £249, 2-bed houses from £499 and man and van from £50 per hour, with mileage from London included in the quote.`,
    },
    {
      q: `Which ${county.name} towns do you cover?`,
      a: `We have local pages for ${county.towns.map((t) => t.name).join(', ')} — and we quote moves anywhere else in ${county.name} too. Send both postcodes for a price.`,
    },
    {
      q: `Do you move people between London and ${county.name}?`,
      a: `Yes — moves between London and ${county.name} are a large part of what we do${range ? `. The towns we cover are around ${range} from central London` : ''}.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Removals in ${county.name}`,
    serviceType: 'House removals',
    areaServed: { '@type': 'AdministrativeArea', name: county.name },
    provider: businessRef(),
    url,
  };

  return (
    <DcPage
      title={`${county.keyword.charAt(0).toUpperCase()}${county.keyword.slice(1)} | Man and Van & House Moves | Phi Movers`}
      description={`Removals across ${county.name}: fixed-price house moves, man and van and clearances in ${county.towns.slice(0, 3).map((t) => t.name).join(', ')} and more. Insured crews, quotes up front.`}
      path={path}
      canonical={url}
      crumbs={crumbs}
      schema={[jsonLd, faqSchema(faqs)]}
    >
      <section style={{ padding: 'clamp(28px,5vw,64px) 5vw' }}>
        <Breadcrumbs crumbs={crumbs} />
        <HeroBadge ico={LocationIcon}>{county.region}</HeroBadge>
        <h1 style={{ ...h1Style('none', 'clamp(34px,4.8vw,58px)'), lineHeight: 1.03, margin: '0 0 18px' }}>Removals in {county.name}</h1>
        <p style={leadStyle('58ch', '0 0 26px')}>{county.intro}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroButtons />
        </div>
      </section>

      {extras ? (
        <section className="dc-prose" style={{ padding: '0 5vw clamp(24px,4vw,44px)' }}>
          {extras?.sections.map((x) => (
            <div key={x.h2}>
              <h2 className="dc-text">{x.h2}</h2>
              {x.paras.map((p, i) => <p key={i} className="dc-text">{p}</p>)}
              {x.list ? <TickList items={x.list} /> : null}
            </div>
          ))}
        </section>
      ) : null}

      <section style={band(true)}>
        <h2 className="dc-text" style={h2Style('0 0 18px')}>Towns we cover in {county.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
          {county.towns.map((t) => (
            <div key={t.slug} style={card()}>
              <p style={{ margin: '0 0 6px', fontWeight: 600 }}><a href={townHref(t.slug)}>Removals {t.name}</a></p>
              <p style={{ margin: '0 0 6px', fontSize: 14, color: 'rgba(15,26,9,.68)' }}>{t.postcodes.split(' ').slice(0, 3).join(', ')}{t.miles ? ` · ~${t.miles} miles from London` : ''}</p>
              {t.services.map((s) => (
                <p key={s} style={{ margin: 0, fontSize: 14 }}>
                  <a href={townHref(t.slug, s)}>{TOWN_SERVICE_LABEL[s]} {t.name}</a>
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: 'clamp(30px,4vw,56px) 5vw' }}>
        <FaqSplit title={`${county.name} removals FAQs`} items={faqs} idPrefix="county-faq" />
      </section>

      <CtaBand title={`Moving in ${county.name}?`} text="Send both postcodes for a fixed-price quote — no obligation, no deposit to enquire." />
    </DcPage>
  );
}
