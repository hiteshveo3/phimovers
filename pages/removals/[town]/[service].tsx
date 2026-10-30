import type { GetStaticPaths, GetStaticProps } from 'next';
import { Location as LocationIcon } from 'iconsax-reactjs';
import { getTown, nearbyTowns, townCoverage, townHref, towns, type Town } from '../../../lib/towns';
import { getServiceBySlug } from '../../../lib/data';
import { buildServiceCopy } from '../../../lib/services';
import { businessRef, offerFromPrice } from '../../../lib/seo';
import { PHONE_E164, SITE_URL } from '../../../lib/contact';
import { Breadcrumbs, CtaBand, DcPage, FaqSplit, HeroBadge, HeroButtons, SideCard, TrustChips, band, card, faqSchema, h1Style, h2Style, leadStyle, monoLabel } from '../../../kit/components/DcPage';
import { TickList } from '../../../kit/components/Blocks';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: towns.flatMap((t) => t.services.map((service) => ({ params: { town: t.slug, service } }))),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ town: string; service: string }> = async ({ params }) => ({
  props: { town: String(params?.town), service: String(params?.service) },
});

type Faq = { q: string; a: string };
type Section = { h2: string; paras: string[] };
type Copy = {
  label: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: Section[];
  faqs: Faq[];
  side: string;
};

/** Town-level copy for each sub-page type. Prices come from lib/data.ts. */
function copyFor(service: string, town: Town): Copy {
  const n = town.name;
  switch (service) {
    case 'house-clearance':
      return {
        label: 'House clearance',
        title: `House Clearance ${n} | Clearance from £120 | Phi Movers`,
        description: `House clearance in ${n}: full houses, flats, lofts and garages cleared by an insured crew, with reusable items donated or recycled where possible. From £120.`,
        h1: `House Clearance ${n}`,
        lead: `Clearing a home in ${n} after a move, a tenancy or a bereavement? Our crew loads everything, takes it away and leaves the rooms empty and swept — priced up front from £120.`,
        sections: [
          {
            h2: `What we clear in ${n}`,
            paras: [
              'Whole houses and flats, single rooms, lofts, garages, sheds and gardens. Furniture, white goods, boxes and general household items are all included — tell us about anything unusual, such as paint, chemicals or building waste, before the day so we can confirm what we can take.',
              'Items in good condition are separated for reuse or donation where possible, and the rest is sorted for recycling and responsible disposal rather than sent straight to landfill.',
            ],
          },
          {
            h2: `How house clearance pricing works in ${n}`,
            paras: [
              `Clearance is priced from the volume of items, how easy they are to carry out and the distance from London. Send photos of each room and we’ll give you a fixed price for your ${n} clearance before we book.`,
            ],
          },
        ],
        faqs: [
          { q: `How much does house clearance cost in ${n}?`, a: `House clearance starts from £120. Your fixed quote depends on volume, access and travel to ${n} — photos are usually enough to price it.` },
          { q: 'Can you clear a property I’m not living in?', a: 'Yes — for empty properties, probate and end-of-tenancy clearances we can collect keys from you or an agent by arrangement.' },
          { q: 'Do you combine clearance with a move?', a: 'Yes. We can move what you’re keeping and clear the rest on the same visit.' },
        ],
        side: `Send photos of the rooms you need clearing in ${n} and we’ll reply with a fixed price.`,
      };
    case 'office-removals':
      return {
        label: 'Office removals',
        title: `Office Removals ${n} | Commercial Movers | Phi Movers`,
        description: `Office removals in ${n} planned around your business — out-of-hours moves, labelled desks and careful IT handling, with a fixed quote after a quick survey.`,
        h1: `Office Removals ${n}`,
        lead: `Moving an office in ${n}? We plan the move around your working hours, label every desk and crate, and handle IT with care — so your team is back at work with as little downtime as possible.`,
        sections: [
          {
            h2: `Commercial removals in ${n}`,
            paras: [
              'Office moves usually run in the evening or at a weekend. We agree a written plan with you: what moves, in what order, where every desk lands and who signs off at each end.',
              'Desks and storage are dismantled and rebuilt where needed, monitors and computers are wrapped and moved with their cables, and confidential files stay in sealed crates.',
            ],
          },
          {
            h2: `Pricing an office move in ${n}`,
            paras: [
              `Office removals are quoted individually after a survey, video call or floor plan. Your fixed quote covers crew, vehicles, materials and travel to ${n}.`,
            ],
          },
        ],
        faqs: [
          { q: `Can you move our ${n} office at the weekend?`, a: 'Yes — most office moves are out of hours so you don’t lose working days.' },
          { q: 'Do you move IT equipment?', a: 'Yes, standard IT and monitors are part of the move. Server rooms are planned separately through our IT & server relocation service.' },
          { q: 'Can you move office furniture only?', a: 'Yes. We regularly move desks and storage between floors or sites, or into storage during a refit.' },
        ],
        side: `Tell us your office size and dates in ${n} and we’ll arrange a quick survey.`,
      };
    case 'secure-storage':
      return {
        label: 'Removals and storage',
        title: `Removals and Storage ${n} | Storage from £15/wk | Phi Movers`,
        description: `Removals and storage for ${n}: we collect your belongings, keep them in secure CCTV-monitored storage and deliver when you’re ready. Storage from £15 a week.`,
        h1: `Removals and Storage ${n}`,
        lead: `Need somewhere safe for your things between moves or during building work? We collect from your ${n} address, store everything securely and deliver it back when you’re ready.`,
        sections: [
          {
            h2: `How storage with collection works for ${n}`,
            paras: [
              'We wrap and load your furniture and boxes, list everything on an inventory and take it into secure, CCTV-monitored storage. When your new home or renovation is ready, we deliver it all back and place it room by room.',
              'Because one team handles collection, storage and delivery, nothing is unloaded and reloaded by strangers along the way.',
            ],
          },
          {
            h2: 'What storage costs',
            paras: [
              `Storage starts from £15 a week or £55 a month. Collection and redelivery to ${n} are quoted as a fixed price based on volume and distance.`,
            ],
          },
        ],
        faqs: [
          { q: 'How long can I store my belongings?', a: 'As long as you need — from a week between tenancies to several months during a renovation or a move abroad.' },
          { q: 'Can I add or remove items while they’re in storage?', a: 'Yes, by arrangement. Let us know in advance so we can have your items ready.' },
          { q: 'Do you make an inventory?', a: 'Yes. Every collection is listed so you know exactly what we’re holding.' },
        ],
        side: `Tell us roughly what you need storing and your ${n} postcode for a fixed quote.`,
      };
    case 'furniture-delivery':
      return {
        label: 'Furniture delivery',
        title: `Furniture Delivery ${n} | Furniture & Sofa Courier | Phi Movers`,
        description: `Furniture delivery and courier for ${n}: sofas, beds, wardrobes and marketplace buys collected, carried in and placed by a two-person crew. Fixed prices.`,
        h1: `Furniture Delivery & Courier ${n}`,
        lead: `Bought a sofa in London that needs to reach ${n}, or moving a few pieces of furniture in or out of town? Our two-person crew collects, wraps, carries in and places it — with a fixed price agreed first.`,
        sections: [
          {
            h2: `Furniture courier between London and ${n}`,
            paras: [
              `Most of our ${n} furniture jobs start or finish in London: a sofa from a London showroom, a wardrobe from a family home, or a few pieces for a new flat. Because our crews are London-based, these runs fit naturally into our schedule, and the mileage to ${n} is built into the price rather than added afterwards.`,
              `For smaller loads with flexible dates, a <a href="/services/part-load-removals">part load</a> shares van space with another job heading the same way, which usually keeps the cost down.`,
            ],
          },
          {
            h2: 'Sofas, single items and marketplace buys',
            paras: [
              `We move sofas and corner units, beds and mattresses, wardrobes, dining sets, appliances and anything you’ve bought on eBay, Gumtree or Facebook Marketplace. Send the item’s measurements and the access at both ends — stairs, lifts, tight turns — so we bring the right crew and kit. If a sofa won’t fit up the stairs, see our <a href="/services/sofa-and-furniture-hoisting">sofa and furniture hoisting</a> service.`,
              `Every item is blanket-wrapped and strapped in the van, carried into the room you choose and checked with you before we leave. Basic <a href="/services/furniture-assembly">dismantling and reassembly</a> can be added.`,
            ],
          },
          {
            h2: `Furniture delivery prices for ${n}`,
            paras: [
              `Single-item delivery starts from £50 within London. For ${n}, you get a fixed quote based on the item, the access and the distance from London — send photos and both postcodes for a price.`,
            ],
          },
        ],
        faqs: [
          { q: `Can you collect furniture in London and deliver it to ${n}?`, a: `Yes — that’s one of the most common jobs we do for ${n}. Send both postcodes and the item details for a fixed price.` },
          { q: 'Do you carry furniture upstairs?', a: 'Yes. Carry-in to the room you choose is included; tell us about stairs and tight turns when you book.' },
          { q: 'Can you collect from a private seller?', a: 'Yes. Give us the seller’s address and a contact number, and confirm the item is ready before we set off.' },
        ],
        side: `Send the item, its measurements and both postcodes — we’ll reply with a fixed furniture delivery price for ${n}.`,
      };
    default:
      return {
        label: 'Man and van',
        title: `Man and Van ${n} | Man with a Van from £50/hr | Phi Movers`,
        description: `Man and van in ${n}: a man with a van for flat moves, single items and moves to or from London. Loading help included, fully insured, from £50/hour.`,
        h1: `Man and Van ${n}`,
        lead: `Need a man with a van in ${n}? Get a driver, a clean Luton or medium van and help with all the lifting — from £50 per hour with a two-hour minimum, fully insured.`,
        sections: [
          {
            h2: `Man and van prices in ${n}`,
            paras: [
              `Man and van bookings start from £50 per hour with a two-hour minimum, billed in 30-minute blocks after that. Add an extra helper for £20 per hour for heavy or bulky items. Because our vans are London-based, travel to ${n} and mileage are agreed up front in your quote — see our <a href="/blog/man-and-van-prices-uk">man and van prices guide</a> for how UK pricing compares.`,
            ],
          },
        ],
        faqs: [
          { q: `How much is a man and van in ${n}?`, a: `Our man and van starts from £50 per hour with a two-hour minimum, plus £20 per hour for an extra helper. For ${n} jobs, travel time and mileage are included in the quote you agree before booking.` },
          { q: `Is a man with a van in ${n} cheaper than van hire?`, a: 'For most small moves it works out similar or cheaper once you count fuel, insurance and your own time — and the driver does the lifting with you.' },
          { q: 'What size van do you use?', a: 'Most bookings use a Luton van, which fits roughly a studio or one-bed flat. Smaller jobs may get a medium van.' },
        ],
        side: `Send both postcodes and what you’re moving — we’ll confirm the van and a clear price for ${n}.`,
      };
  }
}

export default function TownServicePage({ town: slug, service }: { town: string; service: string }) {
  const town = getTown(slug)!;
  const { item } = getServiceBySlug(service)!;
  const copy = buildServiceCopy(item, town.name);
  const c = copyFor(service, town);
  const nearby = nearbyTowns(town).filter((n) => n.services.includes(service as Town['services'][number]));
  const path = townHref(town.slug, service);
  const url = `${SITE_URL}${path}`;
  const crumbs = [{ name: 'UK removals', path: '/removals' }, { name: town.name, path: townHref(town.slug) }, { name: c.label }];
  const faqs = [...c.faqs, town.localFaq];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${c.label} in ${town.name}`,
    serviceType: item.title,
    areaServed: { '@type': 'City', name: town.name },
    provider: businessRef(),
    url,
    offers: offerFromPrice(item.price),
  };

  return (
    <DcPage title={c.title} description={c.description} path={path} canonical={url} ogImage={item.image} crumbs={crumbs} schema={[jsonLd, faqSchema(faqs)]}>
      <section style={{ padding: 'clamp(28px,5vw,64px) 5vw' }}>
        <div style={{ minWidth: 0 }}>
          <Breadcrumbs crumbs={crumbs} />
          <HeroBadge ico={LocationIcon}>{town.name} · {town.county}</HeroBadge>
          <h1 style={{ ...h1Style('none', 'clamp(34px,4.8vw,58px)'), lineHeight: 1.03, margin: '0 0 18px' }}>{c.h1}</h1>
          <p style={leadStyle('56ch', '0 0 26px')}>{c.lead}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <HeroButtons />
          </div>
          <TrustChips middle={{ ico: LocationIcon, text: town.name }} />
        </div>
      </section>

      <div className="dc-two-col" style={{ padding: 'clamp(28px,4vw,52px) 5vw' }}>
        <div className="dc-prose" style={{ minWidth: 0 }}>
          <h2 className="dc-text" style={{ marginTop: 0 }}>{c.label} for {town.name}</h2>
          <p className="dc-text">{townCoverage(town)}</p>
          {town.intro ? <p className="dc-text">{town.intro}</p> : null}

          {c.sections.map((s) => (
            <div key={s.h2}>
              <h2 className="dc-text">{s.h2}</h2>
              {s.paras.map((p, i) => <p key={i} className="dc-text" dangerouslySetInnerHTML={{ __html: p }} />)}
            </div>
          ))}

          <h2 className="dc-text">What’s included</h2>
          <TickList items={copy.included} />

          <h2 className="dc-text">Moving in {town.name} — local notes</h2>
          <p className="dc-text">{town.housing}</p>
          <p className="dc-text">{town.access}</p>

          <p className="dc-text">Moving a whole house? See our <a href={townHref(town.slug)}>removals in {town.name}</a> page for fixed-price house moves, packing and storage.</p>
        </div>
        <aside className="dc-aside">
          <SideCard title="Get a fixed quote" text={c.side} />
          {nearby.length ? (
            <nav aria-label={`${c.label} nearby`} style={card()}>
              <p style={monoLabel()}>{c.label} nearby</p>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 2.1 }}>
                {nearby.map((n) => (
                  <span key={n.slug} style={{ display: 'block' }}><a href={townHref(n.slug, service)}>{c.label} {n.name}</a></span>
                ))}
              </p>
            </nav>
          ) : null}
        </aside>
      </div>

      <section style={band(true)}>
        <FaqSplit title={`${c.h1} FAQs`} items={faqs} idPrefix="town-svc-faq" />
      </section>

      <CtaBand title={`${c.label} in ${town.name}?`} text="Message or call for a clear price — no obligation, no deposit to enquire." />
    </DcPage>
  );
}
