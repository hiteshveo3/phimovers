import { Breadcrumbs, DcPage } from '../kit/components/DcPage';
import { MOTION_CSS, Words, useHomeMotion } from '../kit/components/HomeMotion';
import { Eyebrow, KIT_CSS } from '../kit/components/PageKit';
import { BOROUGHS, REGION_HREF, REGION_ORDER } from '../kit/areas-list';
import { servicesCatalog } from '../kit/services-catalog';
import { BRAND, SITE } from '../kit/site-facts';
import { posts } from '../lib/blog';
import { getArticle } from '../lib/blogArticles';
import { counties } from '../lib/counties';
import { towns, townHref } from '../lib/towns';

// The HTML site directory: every public page a visitor can reach, grouped. Built from the same lists as the
// menus, so a new service, borough, town or guide appears here automatically.
const AP_CSS = `
.ap-sec{padding-top:clamp(36px,4.5vw,56px)}
.ap-sec h2{margin:0 0 14px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(22px,2.2vw,27px);letter-spacing:-.02em}
.ap-sec h3{margin:18px 0 8px;font-size:14px;font-weight:600;color:var(--ink-72)}
.ap-list{columns:4 200px;column-gap:24px;margin:0;padding:0;list-style:none}
.ap-list li{break-inside:avoid}
.ap-list a{display:flex;align-items:center;min-height:36px;font-size:14.5px;color:var(--ink);text-decoration:underline;text-decoration-color:rgba(15,26,9,.2);text-underline-offset:3px}
.ap-list a:hover{text-decoration-color:currentColor}
`;

const MAIN: [string, string][] = [
  ['Home', '/'], ['Services', '/services'], ['Pricing and calculator', '/pricing'], ['Book online', '/book'], ['Areas we cover', '/areas'],
  ['UK removals by town', '/removals'], ['Reviews', '/reviews'], ['Moving guides', '/blog'], ['About us', '/about'], ['Contact', '/contact'],
  ['Help and FAQs', '/help'], ['Insurance', '/insurance'], ['Trust and verification', '/trust'], ['My bookings', '/my-bookings'], ['Track your quote', '/track'],
];
const LEGAL: [string, string][] = [
  ['Terms and conditions', '/terms'], ['Privacy policy', '/privacy'], ['Cookie policy', '/cookies'], ['Complaints', '/complaints'],
  ['Accessibility', '/accessibility'], ['Legal', '/legal'], ['Delete your account', '/delete-account'],
];

function List({ links }: { links: [string, string][] }) {
  return <ul className="ap-list">{links.map(([t, h]) => <li key={h}><a href={h}>{t}</a></li>)}</ul>;
}

export default function AllPages() {
  useHomeMotion();
  const guides = posts.filter((p) => getArticle(p.slug));
  return (
    <DcPage
      title={`All Pages | ${BRAND}`}
      description={`Every page on the ${BRAND} website: services, prices, London boroughs, UK towns, moving guides and company pages.`}
      path="/all-pages"
      canonical={`${SITE}/all-pages`}
      crumbs={[{ name: 'All pages' }]}
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + KIT_CSS + AP_CSS }} />
      <div className="pk">
        <section className="pk-hero">
          <div className="pk-wrap">
            <Breadcrumbs crumbs={[{ name: 'All pages' }]} />
            <Eyebrow>Site map</Eyebrow>
            <h1 className="pk-h1 mo-title"><Words text="Every page on the site" /></h1>
          </div>
        </section>
        <div className="pk-wrap" style={{ paddingBottom: 'clamp(40px,5vw,72px)' }}>
          <section className="ap-sec" aria-labelledby="ap-main"><h2 id="ap-main">Main pages</h2><List links={MAIN} /></section>
          <section className="ap-sec" aria-labelledby="ap-svc">
            <h2 id="ap-svc">Services</h2>
            {servicesCatalog.map((g) => (
              <div key={g.id}><h3>{g.title}</h3><List links={g.services.map((s) => [s.title, s.href] as [string, string])} /></div>
            ))}
          </section>
          <section className="ap-sec" aria-labelledby="ap-areas">
            <h2 id="ap-areas">London areas</h2>
            {REGION_ORDER.map((r) => (
              <div key={r}>
                <h3><a href={REGION_HREF[r]}>{r}</a></h3>
                <List links={BOROUGHS.filter((b) => b.region === r).map((b) => [b.name, b.href] as [string, string])} />
              </div>
            ))}
          </section>
          <section className="ap-sec" aria-labelledby="ap-uk">
            <h2 id="ap-uk">UK removals</h2>
            <h3>Counties</h3>
            <List links={counties.map((c) => [c.name, `/removals/county/${c.slug}`] as [string, string])} />
            <h3>Towns</h3>
            <List links={towns.map((t) => [t.name, townHref(t.slug)] as [string, string])} />
          </section>
          <section className="ap-sec" aria-labelledby="ap-blog"><h2 id="ap-blog">Moving guides</h2><List links={guides.map((p) => [p.title, `/blog/${p.slug}`] as [string, string])} /></section>
          <section className="ap-sec" aria-labelledby="ap-legal"><h2 id="ap-legal">Policies</h2><List links={LEGAL} /></section>
        </div>
      </div>
    </DcPage>
  );
}
