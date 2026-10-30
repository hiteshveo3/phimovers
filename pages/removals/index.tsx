import { Location as LocationIcon } from 'iconsax-reactjs';
import { townHref, towns } from '../../lib/towns';
import { counties } from '../../lib/counties';
import { SITE_URL } from '../../lib/contact';
import { Breadcrumbs, CtaBand, DcPage, HeroBadge, HeroButtons, band, card, h1Style, h2Style, leadStyle } from '../../kit/components/DcPage';

const REGION_ORDER = ['South East', 'East of England', 'South West', 'East Midlands', 'West Midlands', 'Yorkshire', 'North West', 'North East', 'Scotland', 'Wales', 'Northern Ireland'];

export default function RemovalsUkPage() {
  const crumbs = [{ name: 'UK removals' }];
  const regions = REGION_ORDER.map((r) => ({ region: r, list: towns.filter((t) => t.region === r) })).filter((r) => r.list.length);

  return (
    <DcPage
      title="UK Removals & Man and Van from London | Phi Movers"
      description="Removals and man and van between London and towns across the UK — Watford, Reading, Oxford, Cambridge, Bournemouth, Leeds and more. Fixed-price quotes."
      path="/removals"
      canonical={`${SITE_URL}/removals`}
      crumbs={crumbs}
    >
      <section style={{ padding: 'clamp(28px,5vw,64px) 5vw' }}>
        <Breadcrumbs crumbs={crumbs} />
        <HeroBadge ico={LocationIcon}>London-based · UK moves</HeroBadge>
        <h1 style={{ ...h1Style('18ch'), margin: '0 0 18px' }}>Removals across the UK</h1>
        <p style={leadStyle('56ch', '0 0 26px')}>Phi Movers is a London removal company. We move people between London and towns across the UK, and quote long-distance and out-of-London jobs at a fixed price before you book.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroButtons />
        </div>
      </section>

      <section style={{ padding: '0 5vw clamp(20px,3vw,32px)' }}>
        <h2 className="dc-text" style={h2Style('0 0 12px')}>Removals by county</h2>
        <p style={{ margin: 0, lineHeight: 2 }}>
          {counties.map((c, i) => (
            <span key={c.slug}>{i ? ' · ' : ''}<a href={`/removals/county/${c.slug}`}>{c.name}</a></span>
          ))}
        </p>
      </section>

      {regions.map(({ region, list }, i) => (
        <section key={region} style={band(i % 2 === 0)}>
          <h2 className="dc-text" style={h2Style('0 0 18px')}>{region}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
            {list.map((t) => (
              <div key={t.slug} style={card()}>
                <p style={{ margin: '0 0 6px', fontWeight: 600 }}><a href={townHref(t.slug)}>Removals {t.name}</a></p>
                {t.services.includes('man-and-van') ? <p style={{ margin: 0, fontSize: 14 }}><a href={townHref(t.slug, 'man-and-van')}>Man and van {t.name}</a></p> : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      <CtaBand title="Moving to or from London?" text="Send both postcodes for a fixed-price quote — no obligation." />
    </DcPage>
  );
}
