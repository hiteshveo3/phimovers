import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import BackToTop from "@/components/blog/BackToTop";
import ServiceFaq from "@/components/ServiceFaq";
import ReviewCard, { type Review } from "@/components/ReviewCard";
import Reveal from "@/components/Reveal";
import SoftImage from "@/components/SoftImage";
import QuoteForm from "@/components/QuoteForm";
import { Icon } from "@/components/icons";
import {
  CALL_HREF,
  CALL_LABEL,
  PHONE_E164,
  WHATSAPP_HREF,
  SITE_URL,
} from "@/lib/contact";
import {
  allServices,
  getServiceBySlug,
  priceLabel,
  type ServiceItem,
} from "@/lib/data";
import { areas, comboHref } from "@/lib/areas";
import { buildServiceCopy, relatedServices } from "@/lib/services";
import { offerFromPrice } from "@/lib/seo";

const SITE = SITE_URL;

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const entry = getServiceBySlug(params.slug);
  if (!entry) return { title: "Service not found — Phi Movers" };
  const { item } = entry;
  const url = `${SITE}/services/${item.slug}`;
  const isHouse = item.slug === "house-removals";
  const description = isHouse
    ? "Insured house removals across all 32 London boroughs. Get a clear fixed quote for your van, crew, loading and transport. Enquire today."
    : `${item.desc} Fixed-price, fully insured ${item.title.toLowerCase()} across all 32 London boroughs. ${priceLabel(item.price)}.`;
  return {
    title: isHouse
      ? "House Removals London | Fixed-Price Moves | Phi Movers"
      : `${item.title} in London — Phi Movers`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: isHouse
        ? "House Removals London | Fixed-Price Moves | Phi Movers"
        : `${item.title} — Phi Movers`,
      description,
      url,
      type: "website",
      images: [
        {
          url: item.image.startsWith("http") ? item.image : `${SITE}${item.image}`,
          width: 640,
          height: 400,
          alt: `${item.title} in London — Phi Movers`,
        },
      ],
    },
  };
}

/* ---------- reusable bits ---------- */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 pt-2 text-2xl font-bold tracking-tight text-content"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed text-content/80">{children}</p>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 text-[15px] text-content/85 sm:grid-cols-2">
      {items.map((t) => (
        <li
          key={t}
          className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:bg-[#9fe870]/15"
        >
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
            <Icon name="check" className="h-3.5 w-3.5" size={14} strokeWidth={3} />
          </span>
          <span className="font-medium">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function PriceTable({
  mode = "hourly",
}: {
  mode?: "hourly" | "house" | "sofa";
}) {
  if (mode === "sofa") {
    const rows: [string, string][] = [
      ["Dedicated sofa delivery", "From £55 fixed"],
      ["Corner / large sofa or high floors", "Quoted from size & access"],
      ["Man & van (multi-item / hourly)", "From £50/hour"],
      ["Hourly two-hour minimum", "From £100 before extras"],
      ["Additional mileage", "£1.50/mile (first 10 free)"],
    ];
    return (
      <div className="my-4 overflow-hidden rounded-2xl border border-line">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#9fe870] text-[#163300]">
              <th className="px-4 py-3 font-bold" scope="col">
                Sofa &amp; small-job guide
              </th>
              <th className="px-4 py-3 text-right font-bold" scope="col">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]} className={i % 2 ? "bg-cream" : "bg-surface"}>
                <td className="border-t border-line px-4 py-3 font-semibold text-content">
                  {r[0]}
                </td>
                <td className="border-t border-line px-4 py-3 text-right text-content/80">
                  {r[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-line bg-cream px-4 py-2.5 text-xs text-muted">
          From £55 is for a dedicated sofa run once size, floors and distance are
          known — not an hourly house-move rate. Quotes are free; a small deposit
          only applies when you confirm a booking.
        </p>
      </div>
    );
  }

  if (mode === "house") {
    const rows: [string, string][] = [
      ["Studio / 1-bed flat", "Guide from £299"],
      ["2-bed flat / small house", "Guide from £499"],
      ["3-bed house", "Guide from £749"],
      ["4-bed+ house", "Guide from £999"],
    ];
    return (
      <div className="my-4 overflow-hidden rounded-2xl border border-line">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#9fe870] text-[#163300]">
              <th className="px-4 py-3 font-bold" scope="col">
                House move size
              </th>
              <th className="px-4 py-3 text-right font-bold" scope="col">
                Fixed-quote guide
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]} className={i % 2 ? "bg-cream" : "bg-surface"}>
                <td className="border-t border-line px-4 py-3 font-semibold text-content">
                  {r[0]}
                </td>
                <td className="border-t border-line px-4 py-3 text-right text-content/80">
                  {r[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-line bg-cream px-4 py-2.5 text-xs text-muted">
          Guides only — your final price is a fixed quote based on inventory,
          access and distance. Hourly man &amp; van rates live on{" "}
          <a
            href="/services/man-and-van"
            className="font-semibold text-[#163300] underline underline-offset-2"
          >
            man &amp; van
          </a>
          .
        </p>
      </div>
    );
  }

  const rows: [string, string][] = [
    ["Small Van + Driver", "From £50/hour"],
    ["Transit Van + Driver", "From £55/hour"],
    ["Luton Van + Driver", "From £65/hour"],
    ["Additional helper", "+£20/hour"],
    ["Two-hour minimum", "From £100 before extras"],
    ["Additional mileage", "£1.50/mile (first 10 free)"],
  ];
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#9fe870] text-[#163300]">
            <th className="px-4 py-3 font-bold" scope="col">
              Man &amp; van rate guide
            </th>
            <th className="px-4 py-3 text-right font-bold" scope="col">
              Hourly
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r[0]} className={i % 2 ? "bg-cream" : "bg-surface"}>
              <td className="border-t border-line px-4 py-3 font-semibold text-content">
                {r[0]}
              </td>
              <td className="border-t border-line px-4 py-3 text-right text-content/80">
                {r[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const serviceReviews: Review[] = [
  {
    name: "Alena Carty",
    location: "Camden, London",
    rating: 5,
    text: "The crew wrapped every piece of furniture and had us moved across town before lunch. Fixed price with no surprises — the most stress-free move we've ever had.",
    avatar: "/reviews/alena-carty.jpg",
  },
  {
    name: "Mark Taylor",
    location: "Greenwich, London",
    rating: 5,
    text: "Polite, quick and genuinely careful with every single box. They got a huge sofa up a narrow staircase without a scratch. Couldn't recommend them more.",
    avatar: "/reviews/mark-taylor.jpg",
  },
];

function StatBand() {
  const stats: [string, string][] = [
    ["32", "Boroughs covered"],
    ["Fixed", "Quotes before move day"],
    ["Insured", "Goods + liability"],
  ];
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
      {stats.map(([n, l]) => (
        <div key={l} className="bg-surface px-3 py-3 text-center sm:px-4 sm:py-3.5">
          <div className="text-xl font-extrabold text-[#9fe870] sm:text-2xl">{n}</div>
          <div className="mt-0.5 text-[11px] text-muted sm:text-xs">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- sidebar ---------- */

function Sidebar({ item }: { item: ServiceItem }) {
  const isHourly =
    item.slug === "man-and-van" || item.slug === "student-moves";
  const facts: [string, string][] = [
    ["Pricing", priceLabel(item.price)],
    ["Response time", "Within ~1 hour"],
    [
      isHourly ? "Minimum booking" : "Quote type",
      isHourly ? "2 hours" : "Fixed price",
    ],
    ["Coverage", "All 32 boroughs"],
    ["Insurance", "Goods + liability"],
  ];
  return (
    <div className="space-y-4 lg:sticky lg:top-[70px] lg:self-start">
      {/* Quote card */}
      <div className="rounded-2xl bg-[#9fe870] p-5 text-[#163300]">
        <p
          className="text-base font-extrabold"
          style={{ color: "#163300" }}
        >
          Get a fixed quote
        </p>
        <p
          className="mt-1 text-sm leading-snug"
          style={{ color: "#163300" }}
        >
          WhatsApp or call — we usually reply within about one working hour. No
          obligation.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-3 w-full justify-center bg-[#163300] px-5 py-2.5 text-[#9fe870] hover:bg-[#0e2400]"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp us
        </a>
        <a
          href={CALL_HREF}
          className="btn mt-2 w-full justify-center border border-[#163300]/15 bg-white px-5 py-2.5 text-[#163300] hover:bg-white"
        >
          <Icon name="phone" className="h-4 w-4" />
          <span className="tabular-nums">{CALL_LABEL}</span>
        </a>
      </div>

      {/* Quick facts */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-extrabold uppercase tracking-wide text-content">
          At a glance
        </p>
        <dl className="mt-3 space-y-2.5 text-sm">
          {facts.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0"
            >
              <dt className="text-muted">{k}</dt>
              <dd className="font-semibold text-content">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const houseGuideFaqs: { q: string; a: string }[] = [
  {
    q: "How should I prepare for moving day?",
    a: "Declutter first — every item you move costs money to move. Pack rarely used items early, leave daily essentials until last, and pack an “open me first” box with chargers, kettle, toiletries and a change of clothes. Defrost the fridge the night before and keep valuables with you.",
  },
  {
    q: "Any packing tips — or can you pack for me?",
    a: "Heavy items (books) go in small boxes; lighter items (bedding) in large ones. Fill gaps, and label boxes on the side. Prefer to skip packing? Add our full packing service — we wrap, box and label, often the day before. On the day we protect floors, doorways and furniture before lifting.",
  },
  {
    q: "What about parking and permits in London?",
    a: "Many boroughs need a suspended bay or visitor permit for a removals van — arrange both addresses a few working days ahead. Not sure what you need? Ask us — we deal with London parking daily and will confirm access, stairs and carry distance before the crew arrives.",
  },
];

const HOUSE_SLUGS = new Set([
  "house-removals",
  "flat-removals",
  "studio-moves",
]);

/* ---------- page ---------- */

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = getServiceBySlug(params.slug);
  if (!entry) notFound();

  const { item, category } = entry;
  const copy = buildServiceCopy(item);
  const related = relatedServices(item.slug, 3);
  const faqs = HOUSE_SLUGS.has(item.slug)
    ? [...copy.faqs, ...houseGuideFaqs]
    : copy.faqs;

  const url = `${SITE}/services/${item.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: item.title,
        description: item.desc,
        serviceType: item.title,
        provider: {
          "@type": "MovingCompany",
          "@id": `${SITE}/#business`,
          name: "Phi Movers",
          url: SITE,
          telephone: PHONE_E164,
        },
        areaServed: { "@type": "City", name: "London" },
        url,
        offers: offerFromPrice(item.price),
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE}/services`,
      },
      { "@type": "ListItem", position: 3, name: item.title, item: url },
    ],
  };

  return (
    <main>
      <Navbar />
      <BackToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <section className="section relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[#163300]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/services" className="hover:text-[#163300]">
                  Services
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-content" aria-current="page">
                {item.title}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-8">
            <div className="animate-fade-up">
              <span className="chip border-transparent bg-[#9fe870] font-semibold text-[#163300]">
                {category.title}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-content md:text-4xl">
                {item.slug === "house-removals"
                  ? "Stress-Free House Removals Across London"
                  : `${item.title} in London`}
              </h1>
              <p
                className="mt-3 max-w-xl text-sm leading-relaxed md:text-base"
                style={{ color: "#4b5563" }}
              >
                {item.slug === "house-removals"
                  ? "Clear quotes covering your crew, van, loading and transport — delivered by fully insured teams across all 32 London boroughs. WhatsApp a few photos of your rooms and addresses and we will confirm the right van and a fixed price before moving day, usually within about an hour. No deposit to enquire, no card details needed for a quote, and no obligation until you are happy to book."
                  : `${item.desc} Fixed-price, fully insured ${item.title.toLowerCase()} with a friendly local crew across all 32 London boroughs. Send your postcodes and a few photos on WhatsApp — we will confirm the right van, crew and a clear price before you book, usually within about an hour. No deposit to enquire and no obligation until you are ready.`}
              </p>

              <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full justify-center bg-[#9fe870] px-6 text-[#163300] hover:bg-[#86d957] sm:w-auto"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={CALL_HREF}
                  className="btn w-full justify-center border border-[#163300]/25 bg-white px-6 text-[#163300] hover:bg-white sm:w-auto"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {CALL_LABEL}
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                <Link
                  href="#cost"
                  className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[#163300]"
                >
                  <Icon name="tag" className="h-4 w-4 text-[#163300]" />
                  {priceLabel(item.price)}
                </Link>
                <Link
                  href="#areas"
                  className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[#163300]"
                >
                  <Icon name="mapPin" className="h-4 w-4 text-[#163300]" />
                  All 32 boroughs
                </Link>
              </div>
            </div>

            <SoftImage
              src={item.image}
              alt={`${item.title} crew loading furniture into a van in London`}
              icon={item.icon}
              priority
              className="aspect-[16/11] w-full -translate-y-1 animate-fade-up rounded-[24px] sm:-translate-y-2 lg:-translate-y-4"
              imgClassName="aspect-[16/11] w-full rounded-[24px] object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="bg-[#f4f5f2]">
        <div className="container-page py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Article */}
            <article className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-6 md:p-7">
                <H2 id="overview">
                  {item.title} across London, done properly
                </H2>
                <div className="mt-3 space-y-4">
                  {copy.intro.map((para, i) => (
                    <P key={i}>{para}</P>
                  ))}
                </div>
              </div>

              <Reveal>
                <StatBand />
              </Reveal>

              <H2 id="included">What&apos;s included as standard</H2>
              <P>
                We believe the price you&apos;re quoted should be the price you
                pay. That&apos;s why every {item.title.toLowerCase()} booking
                comes with the essentials built in — no surprise charges bolted
                on when the crew arrives.
              </P>
              <CheckList items={copy.included} />

              <H2 id="ideal">Who this service is for</H2>
              <P>
                Not sure whether this is the right option? It&apos;s a great fit
                for a wide range of moves, including:
              </P>
              <CheckList items={copy.idealFor} />

              <H2 id="how-it-works">How it works, step by step</H2>
              <P>
                {item.slug === "sofa-delivery"
                  ? "From photos and postcodes to sofa in place — here’s what happens on a typical London sofa delivery."
                  : "We’ve refined our process across London moves every week to keep everything simple and predictable. Here’s exactly what happens from your first enquiry through to completion."}
              </P>
              <ol className="space-y-4">
                {copy.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#9fe870] text-sm font-bold text-[#163300]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-content">{s.title}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-content/80">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Reveal>
                <div>
              <H2 id="cost">How much does it cost?</H2>
              {item.slug === "sofa-delivery" ? (
                <>
                  <P>
                    Dedicated sofa delivery starts from{" "}
                    <strong className="font-semibold text-content">£55</strong>{" "}
                    once we know sofa size, floors/stairs and distance. That is a
                    fixed job price for the sofa run — not the same as hourly man
                    &amp; van.
                  </P>
                  <P>
                    Hourly man-and-van starts from £50/hour with a two-hour
                    minimum (from £100 before relevant additions). Use that when
                    you need a flexible multi-item load; use dedicated sofa
                    pricing when it&apos;s mainly the sofa. See our{" "}
                    <Link
                      href="/pricing"
                      className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2 hover:text-[#0e2400]"
                    >
                      pricing page
                    </Link>{" "}
                    for the full rate card.
                  </P>
                </>
              ) : item.slug === "house-removals" ? (
                <>
                  <P>
                    Full house removals receive an individually calculated{" "}
                    <strong className="font-semibold text-content">
                      fixed quotation
                    </strong>{" "}
                    based on inventory, access and distance — so you know the
                    total before we arrive. Loading, unloading and the first 10
                    journey miles are included.
                  </P>
                  <P>
                    Hourly man-and-van services start from £50/hour with a
                    two-hour minimum (from £100 before relevant additions). That
                    rate card is for smaller flexible jobs — not a £50 full house
                    move. See our{" "}
                    <Link
                      href="/pricing"
                      className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2 hover:text-[#0e2400]"
                    >
                      pricing page
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/services/man-and-van"
                      className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2 hover:text-[#0e2400]"
                    >
                      man &amp; van
                    </Link>{" "}
                    for hourly details.
                  </P>
                </>
              ) : (
                <>
                  <P>
                    Every job is quoted clearly before we arrive. Your price is
                    built from van size, crew, access and distance, with the
                    first 10 journey miles included. See our{" "}
                    <Link
                      href="/pricing"
                      className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2 hover:text-[#0e2400]"
                    >
                      pricing page
                    </Link>{" "}
                    for the full rate card.
                  </P>
                  <P>
                    Hourly man-and-van services start from £50/hour with a
                    two-hour minimum. After the minimum, extra time is billed in
                    30-minute blocks. Full house removals receive a fixed
                    quotation based on inventory, access and distance.
                  </P>
                </>
              )}
              <PriceTable
                mode={
                  item.slug === "sofa-delivery"
                    ? "sofa"
                    : item.slug === "house-removals" ||
                        item.slug === "flat-removals" ||
                        item.slug === "studio-moves"
                      ? "house"
                      : "hourly"
                }
              />
              <p className="flex items-center gap-2 text-sm font-medium text-[#163300]">
                <Icon name="check" className="h-4 w-4 shrink-0" size={16} strokeWidth={2.6} />
                Quotes are free — no deposit or card details just to enquire. A
                small deposit only applies when you confirm a booking.
              </p>
              <P>
                WhatsApp or call with your addresses — most replies within about
                one working hour. Larger jobs can book a free home survey.
              </P>
                </div>
              </Reveal>

              {(item.slug === "house-removals" ||
                item.slug === "flat-removals" ||
                item.slug === "studio-moves") && (
                <Reveal delay={60}>
                <div>
                  <H2 id="van-size">What size van do I need?</H2>
                  <P>
                    Not sure which van fits your home? Use this simple guide —
                    then confirm with photos on WhatsApp and we&apos;ll lock the
                    right option into your fixed quote.
                  </P>
                  <div className="my-4 overflow-hidden rounded-2xl border border-line">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="bg-[#9fe870] text-[#163300]">
                          <th className="px-4 py-3 font-bold" scope="col">
                            Property
                          </th>
                          <th className="px-4 py-3 font-bold" scope="col">
                            Typical van
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(
                          [
                            ["Studio / bedsits", "Small van"],
                            ["1-bed flat", "Small or Transit van"],
                            ["2-bed flat or small house", "Transit or Luton"],
                            ["3-bed house", "Luton van"],
                            ["4-bed+ house", "Luton + extra crew / second run"],
                          ] as [string, string][]
                        ).map((r, i) => (
                          <tr
                            key={r[0]}
                            className={i % 2 ? "bg-cream" : "bg-surface"}
                          >
                            <td className="border-t border-line px-4 py-3 font-semibold text-content">
                              {r[0]}
                            </td>
                            <td className="border-t border-line px-4 py-3 text-content/80">
                              {r[1]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                </Reveal>
              )}

              <H2 id="affects">What affects the price</H2>
              <P>
                A few practical factors move the final number up or down. Knowing
                them in advance helps you plan and, in many cases, keep costs
                lower:
              </P>
              <CheckList items={copy.affects} />

              {/* Key takeaways */}
              <aside className="my-4 rounded-2xl bg-[#9fe870] p-6 text-[#163300]">
                <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
                  <Icon name="check" className="h-4 w-4" size={15} strokeWidth={2.4} />
                  Key takeaways
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {[
                    `${item.title} is quoted with a clear, fixed price — no hidden fees on the day.`,
                    "Loading, unloading and the first 10 miles are always included.",
                    "Fully insured crews cover all 32 London boroughs.",
                    "WhatsApp or call for a quote — most replies within about an hour.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Icon
                        name="check"
                        className="mt-0.5 h-4 w-4 shrink-0"
                        size={14}
                        strokeWidth={2.4}
                      />
                      <span className="font-medium">{t}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <H2 id="areas">Covering all 32 London boroughs</H2>
              <P>
                Wherever you&apos;re moving in London, pick your borough for a
                dedicated {item.title.toLowerCase()} page — or browse the full{" "}
                <Link
                  href="/areas"
                  className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2 hover:text-[#0e2400]"
                >
                  areas hub
                </Link>
                .
              </P>
              <div className="my-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {areas.map((b) => (
                  <Link
                    key={b.slug}
                    href={comboHref(b.slug, item.slug)}
                    className="rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-[#163300] transition-colors hover:border-[#9fe870] hover:bg-[#9fe870]/15"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
              <P>
                Our drivers know which streets are too narrow for a Luton, where
                the low bridges and red routes sit, and how Congestion Charge and
                ULEZ affect your route — so the move stays on schedule.
              </P>

              <Reveal>
                <div>
                  <H2 id="why">Why choose Phi Movers</H2>
                  <ul className="mt-2 grid gap-4 sm:grid-cols-2">
                    {[
                      ["Fixed, transparent prices", "The quote you agree is the price you pay — no hidden fees added on the day."],
                      ["Genuine London specialists", "We only move in London, so we know the boroughs, permits and shortcuts."],
                      ["Fully insured every time", "Goods-in-transit and liability cover come as standard on every job."],
                      ["Loading help included", "Our crews do the heavy lifting with you, never charged as an extra."],
                      ["Flexible scheduling", "Evenings, weekends and same-day slots to fit around your life."],
                      ["Experienced local crews", "Uniformed movers who turn up on time with the right kit for London access."],
                    ].map(([t, d]) => (
                      <li
                        key={t}
                        className="rounded-2xl border border-line bg-surface p-5"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
                          <Icon name="check" className="h-5 w-5" strokeWidth={2.2} />
                        </span>
                        <p className="mt-3 font-bold text-content">{t}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* In-article CTA */}
              <Reveal delay={60}>
              <div className="my-6 flex flex-col items-start justify-between gap-4 rounded-[24px] bg-[#9fe870] p-6 text-[#163300] sm:flex-row sm:items-center">
                <div>
                  <p className="text-lg font-extrabold">
                    {`Ready to book your ${item.title.toLowerCase()}?`}
                  </p>
                  <p className="mt-1 text-sm text-[#163300]/70">
                    Get a fixed-price quote on WhatsApp or by phone — all 32
                    boroughs.
                  </p>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn justify-center bg-[#163300] px-6 text-[#9fe870] hover:bg-[#0e2400]"
                  >
                    <Icon name="whatsapp" className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={CALL_HREF}
                    className="btn justify-center border border-[#163300]/15 bg-white/70 px-6 text-[#163300] backdrop-blur-sm hover:bg-white"
                  >
                    <Icon name="phone" className="h-4 w-4" />
                    {CALL_LABEL}
                  </a>
                </div>
              </div>
              </Reveal>

              {/* Case studies — house removals master page */}
              {item.slug === "house-removals" && (
                <>
                  <H2 id="case-studies">Example London house moves</H2>
                  <P>
                    Typical routes and access challenges we handle — illustrative
                    examples to help you picture your own moving day (not a claim
                    of case-study photography).
                  </P>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {(
                      [
                        [
                          "Hackney → Islington",
                          "2-bed flat, 3rd floor walk-up",
                          "Narrow staircase and a Saturday slot. Two movers + Luton; sofa carried by hand. Done by early afternoon on a fixed quote.",
                        ],
                        [
                          "Croydon → Wandsworth",
                          "3-bed house, driveway access",
                          "Full house contents with basic bed dismantle/reassemble. Parking arranged the week before — no waiting time on the day.",
                        ],
                        [
                          "Camden → Barnet",
                          "Family house + fragile kitchen",
                          "Customer packed clothes; we packed glassware. Fixed price held even with an extra wardrobe discovered on the morning.",
                        ],
                      ] as [string, string, string][]
                    ).map(([route, challenge, outcome]) => (
                      <figure
                        key={route}
                        className="rounded-2xl border border-line bg-surface p-5"
                      >
                        <p className="text-sm font-extrabold text-[#163300]">
                          {route}
                        </p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                          {challenge}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-content/80">
                          {outcome}
                        </p>
                      </figure>
                    ))}
                  </div>
                </>
              )}

              <Reveal>
                <div>
                  <H2 id="reviews">What customers say</H2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {serviceReviews.map((r) => (
                      <ReviewCard key={r.name} review={r} variant={3} />
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div>
                  <H2 id="faqs">FAQs</H2>
                  <ServiceFaq faqs={faqs} />
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <Sidebar item={item} />
          </div>

          {/* Related services */}
          <Reveal>
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-content">
                Related services
              </h2>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#163300] hover:underline"
              >
                View all
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={s.href}
                    className="group overflow-hidden rounded-2xl border border-line bg-surface"
                  >
                    <SoftImage
                      src={s.image}
                      alt={s.title}
                      icon={s.icon || "box"}
                      className="aspect-[16/9] w-full"
                      imgClassName="aspect-[16/9] w-full object-cover"
                    />
                    <div className="p-5">
                      <span className="inline-flex rounded-pill bg-[#9fe870]/35 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
                        {priceLabel(s.price)}
                      </span>
                      <h3 className="mt-3 text-base font-bold leading-snug text-content group-hover:text-[#163300]">
                        {s.title}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
                        Learn more
                        <Icon name="arrowRight" className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
              ))}
            </div>
          </section>
          </Reveal>
        </div>

        {/* Quote form */}
        <section className="container-page pb-8">
          <QuoteForm serviceTitle={item.title} />
        </section>

        {/* Final CTA — WhatsApp + Call */}
        <section className="container-page pb-4">
          <div className="rounded-[28px] bg-[#9fe870] px-6 py-14 text-center text-[#163300] md:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              {`Ready to book your ${item.title.toLowerCase()}?`}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#163300]/80">
              Message or call us for a fixed-price quote — most replies within
              about an hour, no obligation, no hidden fees, all 32 London
              boroughs.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full justify-center bg-[#163300] px-6 text-[#9fe870] hover:bg-[#0e2400] sm:w-auto"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={CALL_HREF}
                className="btn w-full justify-center border border-[#163300]/15 bg-white/70 px-6 text-[#163300] backdrop-blur-sm hover:bg-white sm:w-auto"
              >
                <Icon name="phone" className="h-4 w-4" />
                {CALL_LABEL}
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Spacer so the mobile sticky CTA never covers footer content */}
      <div className="h-32 lg:hidden" aria-hidden />

      {/* Mobile sticky CTA — sits above the bottom nav */}
      <div className="fixed inset-x-0 bottom-16 z-[60] border-t border-line bg-surface/95 px-4 py-2.5 backdrop-blur-sm lg:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn flex-[1.4] justify-center bg-[#9fe870] px-3 py-2.5 text-[#163300]"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={CALL_HREF}
            className="btn flex-1 justify-center border border-line bg-surface px-3 py-2.5 text-content"
          >
            <Icon name="phone" className="h-4 w-4" />
            Call
          </a>
        </div>
      </div>
    </main>
  );
}
