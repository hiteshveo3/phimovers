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
import { Icon } from "@/components/icons";
import {
  allAreaServiceParams,
  areas,
  comboHref,
  getAreaBySlug,
  getNearbyAreas,
} from "@/lib/areas";
import {
  allServices,
  getServiceBySlug,
  priceLabel,
  type ServiceItem,
} from "@/lib/data";
import { buildServiceCopy, relatedServices } from "@/lib/services";
import { getComboCopy } from "@/lib/combos";
import { offerFromPrice } from "@/lib/seo";
import {
  CALL_HREF,
  CALL_LABEL,
  PHONE_E164,
  WHATSAPP_HREF,
  SITE_URL,
} from "@/lib/contact";

const SITE = SITE_URL;

export function generateStaticParams() {
  return allAreaServiceParams();
}

export function generateMetadata({
  params,
}: {
  params: { borough: string; service: string };
}): Metadata {
  const area = getAreaBySlug(params.borough);
  const entry = getServiceBySlug(params.service);
  if (!area || !entry) return { title: "Page not found — Phi Movers" };
  const { item } = entry;
  const combo = getComboCopy(area, item);
  const url = `${SITE}${comboHref(area.slug, item.slug)}`;
  return {
    title: `${item.title} in ${area.name} — Phi Movers`,
    description: combo.hero.slice(0, 160),
    alternates: { canonical: url },
    robots: combo.priority
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${item.title} in ${area.name} — Phi Movers`,
      description: combo.hero.slice(0, 160),
      url,
      type: "website",
      images: [{ url: item.image, width: 640, height: 400, alt: item.title }],
    },
  };
}

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

function StatBand({ areaName }: { areaName: string }) {
  const stats: [string, string][] = [
    ["Local", areaName],
    ["Fixed", "Quotes before move day"],
    ["Insured", "Goods + liability"],
  ];
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
      {stats.map(([n, l]) => (
        <div
          key={l}
          className="bg-surface px-3 py-3 text-center sm:px-4 sm:py-3.5"
        >
          <div className="text-xl font-extrabold text-[#9fe870] sm:text-2xl">
            {n}
          </div>
          <div className="mt-0.5 text-[11px] text-muted sm:text-xs">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Sidebar({
  item,
  areaName,
}: {
  item: ServiceItem;
  areaName: string;
}) {
  const isHourly =
    item.slug === "man-and-van" || item.slug === "student-moves";
  const facts: [string, string][] = [
    ["Pricing", priceLabel(item.price)],
    ["Area", areaName],
    ["Response time", "Within ~1 hour"],
    [
      isHourly ? "Minimum booking" : "Quote type",
      isHourly ? "2 hours" : "Fixed price",
    ],
    ["Insurance", "Goods + liability"],
  ];
  return (
    <div className="space-y-4 lg:sticky lg:top-[70px] lg:self-start">
      <div className="rounded-2xl bg-[#9fe870] p-5 text-[#163300]">
        <p className="text-base font-extrabold" style={{ color: "#163300" }}>
          Get a fixed quote
        </p>
        <p className="mt-1 text-sm text-[#163300]/75">
          {item.title} in {areaName} — most replies within about one working
          hour. No deposit to enquire.
        </p>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-4 w-full justify-center bg-[#163300] px-5 text-[#9fe870] hover:bg-[#0e2400]"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={CALL_HREF}
          className="btn mt-3 w-full justify-center border border-[#163300]/15 bg-white/70 px-5 text-[#163300] backdrop-blur-sm hover:bg-white"
        >
          <Icon name="phone" className="h-4 w-4" />
          {CALL_LABEL}
        </a>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-sm font-extrabold text-content">At a glance</p>
        <dl className="mt-3 space-y-2.5">
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

import { siteReviews } from "@/lib/reviews";

const localReviews = (): Review[] =>
  siteReviews.slice(0, 2).map(({ name, location, rating, text, avatar }) => ({
    name,
    location,
    rating,
    text,
    avatar,
  }));

export default function AreaServicePage({
  params,
}: {
  params: { borough: string; service: string };
}) {
  const area = getAreaBySlug(params.borough);
  const entry = getServiceBySlug(params.service);
  if (!area || !entry) notFound();

  const { item, category } = entry;
  const copy = buildServiceCopy(item);
  const combo = getComboCopy(area, item);
  const nearby = getNearbyAreas(area.slug, 6);
  const relatedInArea = allServices
    .filter((s) => s.slug !== item.slug)
    .slice(0, 6);
  const relatedGlobal = relatedServices(item.slug, 3);
  const url = `${SITE}${comboHref(area.slug, item.slug)}`;
  const reviews = localReviews();

  const localFaqs = [
    combo.faq,
    ...area.faqs,
    ...copy.faqs,
    {
      q: `How do I book ${item.title.toLowerCase()} in ${area.name}?`,
      a: `WhatsApp or call with both postcodes, floors/stairs and a quick inventory or photos. We usually reply within about one working hour with a clear price for ${area.name}. No deposit to enquire — a small deposit only applies when you confirm a booking.`,
    },
    {
      q: `Do I need a parking permit for a removals van in ${area.name}?`,
      a: `${area.access} If your street needs a suspended bay, arrange it a few working days ahead — we’ll tell you if your addresses typically need one.`,
    },
    {
      q: `Is ${item.title.toLowerCase()} in ${area.name} insured?`,
      a: `Yes. Jobs include goods-in-transit and public liability cover as standard. Ask if you need higher cover for particularly valuable items.`,
    },
    {
      q: `Can you do evening or weekend ${item.title.toLowerCase()} in ${area.name}?`,
      a: `Often yes, subject to crew. ${area.name} weekends fill faster — mid-week and evening slots are usually more flexible at shorter notice.`,
    },
  ];

  // Deduplicate FAQ questions (keep first)
  const seen = new Set<string>();
  const faqs = localFaqs.filter((f) => {
    const key = f.q.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${item.title} in ${area.name}`,
    description: combo.hero,
    image: item.image,
    provider: {
      "@type": "MovingCompany",
      name: "Phi Movers",
      telephone: PHONE_E164,
      areaServed: "London",
    },
    areaServed: { "@type": "AdministrativeArea", name: area.name },
    url,
    offers: offerFromPrice(item.price),
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
        name: "Areas",
        item: `${SITE}/areas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: area.name,
        item: `${SITE}/areas/${area.slug}`,
      },
      { "@type": "ListItem", position: 4, name: item.title, item: url },
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
                <Link href="/areas" className="hover:text-[#163300]">
                  Areas
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/areas/${area.slug}`}
                  className="hover:text-[#163300]"
                >
                  {area.name}
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
                {area.name} · {category.title}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-content md:text-4xl">
                {item.title} in {area.name}
              </h1>
              <p
                className="mt-3 max-w-xl text-sm leading-relaxed md:text-base"
                style={{ color: "#4b5563" }}
              >
                {combo.hero}
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
                  href="#local"
                  className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-[#163300]"
                >
                  <Icon name="mapPin" className="h-4 w-4 text-[#163300]" />
                  {area.name}
                </Link>
              </div>
            </div>

            <SoftImage
              src={item.image}
              alt={`${item.title} in ${area.name}`}
              icon={item.icon}
              priority
              className="aspect-[16/11] w-full -translate-y-1 animate-fade-up rounded-[24px] sm:-translate-y-2 lg:-translate-y-4"
              imgClassName="aspect-[16/11] w-full rounded-[24px] object-cover object-top"
            />
          </div>
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="space-y-4">
              <div className="rounded-2xl border border-line bg-surface p-6 md:p-7">
                <H2 id="overview">
                  {item.title} across {area.name}, done properly
                </H2>
                <div className="mt-3 space-y-4">
                  {combo.intro.map((para, i) => (
                    <P key={`c-${i}`}>{para}</P>
                  ))}
                  {copy.intro.map((para, i) => (
                    <P key={`s-${i}`}>{para}</P>
                  ))}
                </div>
              </div>

              <Reveal>
                <StatBand areaName={area.name} />
              </Reveal>

              <H2 id="included">What&apos;s included in {area.name}</H2>
              <P>
                The price you&apos;re quoted for {item.title.toLowerCase()} in{" "}
                {area.name} should be the price you pay — essentials built in,
                no surprise charges when the crew arrives.
              </P>
              <CheckList items={copy.included} />

              <H2 id="ideal">Who this is for in {area.name}</H2>
              <P>
                Not sure whether this is the right option for your{" "}
                {area.name} addresses? It&apos;s a strong fit for:
              </P>
              <CheckList items={copy.idealFor} />

              <H2 id="how-it-works">How it works in {area.name}</H2>
              <P>
                From first WhatsApp to job complete — here&apos;s what happens
                on a typical {item.title.toLowerCase()} booking in {area.name}.
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
                  <H2 id="cost">How much does it cost in {area.name}?</H2>
                  <P>
                    As a guide we list{" "}
                    <strong className="font-semibold text-content">
                      {priceLabel(item.price)}
                    </strong>{" "}
                    for {item.title.toLowerCase()}. Your final price for{" "}
                    {area.name} depends on volume, floors/stairs, parking and
                    distance — confirmed before we set off.
                  </P>
                  <P>
                    Quotes are free with no card details needed to enquire. A
                    small deposit only applies when you confirm a booking. See
                    our{" "}
                    <Link
                      href="/pricing"
                      className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2 hover:text-[#0e2400]"
                    >
                      pricing page
                    </Link>{" "}
                    or the full{" "}
                    <Link
                      href={`/services/${item.slug}`}
                      className="font-semibold text-[#163300] underline decoration-[#9fe870] underline-offset-2 hover:text-[#0e2400]"
                    >
                      {item.title} page
                    </Link>{" "}
                    for rate detail.
                  </P>
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#163300]">
                    <Icon
                      name="check"
                      className="h-4 w-4 shrink-0"
                      size={16}
                      strokeWidth={2.6}
                    />
                    No deposit to enquire — deposit only when you book.
                  </p>
                </div>
              </Reveal>

              <H2 id="affects">What affects the price in {area.name}</H2>
              <P>
                Knowing these upfront keeps your {area.name} quote accurate:
              </P>
              <CheckList items={copy.affects} />

              <Reveal>
                <div id="local" className="scroll-mt-24 space-y-4">
                  <H2 id="housing">Moving in {area.name} — local notes</H2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-line bg-surface p-5">
                      <p className="font-bold text-content">Housing we see</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-content/80">
                        {area.housing}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-line bg-surface p-5">
                      <p className="font-bold text-content">
                        Access, parking &amp; permits
                      </p>
                      <p className="mt-2 text-[15px] leading-relaxed text-content/80">
                        {area.access}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#9fe870] p-6 text-[#163300]">
                    <p className="text-sm font-extrabold uppercase tracking-wide">
                      Local tip for {area.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#163300]/85">
                      {combo.tip}
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div>
                  <H2 id="why">Why choose Phi Movers in {area.name}</H2>
                  <ul className="mt-2 grid gap-4 sm:grid-cols-2">
                    {[
                      [
                        "Fixed, transparent prices",
                        "The quote you agree for your addresses is the price you pay — no hidden fees on the day.",
                      ],
                      [
                        "Genuine local knowledge",
                        `We move in ${area.name} and across London, so parking, permits and access go into the plan.`,
                      ],
                      [
                        "Fully insured every time",
                        "Goods-in-transit and liability cover come as standard on every job.",
                      ],
                      [
                        "Loading help included",
                        "Our crews do the heavy lifting with you — never charged as an extra.",
                      ],
                      [
                        "Flexible scheduling",
                        "Evenings, weekends and same-day slots when capacity allows.",
                      ],
                      [
                        "Experienced crews",
                        "Uniformed movers who turn up on time with the right kit for London access.",
                      ],
                    ].map(([t, d]) => (
                      <li
                        key={t}
                        className="rounded-2xl border border-line bg-surface p-5"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
                          <Icon
                            name="check"
                            className="h-5 w-5"
                            strokeWidth={2.2}
                          />
                        </span>
                        <p className="mt-3 font-bold text-content">{t}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          {d}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <div className="my-6 flex flex-col items-start justify-between gap-4 rounded-[24px] bg-[#9fe870] p-6 text-[#163300] sm:flex-row sm:items-center">
                  <div>
                    <p className="text-lg font-extrabold">
                      Ready to book {item.title.toLowerCase()} in {area.name}?
                    </p>
                    <p className="mt-1 text-sm text-[#163300]/70">
                      Get a fixed-price quote on WhatsApp or by phone — no
                      obligation.
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

              <Reveal>
                <div>
                  <H2 id="reviews">What customers say</H2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {reviews.map((r) => (
                      <ReviewCard key={r.name} review={r} variant={3} />
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div>
                  <H2 id="faqs">
                    {item.title} in {area.name} — FAQs
                  </H2>
                  <P>
                    {faqs.length} answers covering {area.name} access, pricing,
                    booking and {item.title.toLowerCase()}.
                  </P>
                  <ServiceFaq faqs={faqs} />
                </div>
              </Reveal>
            </article>

            <Sidebar item={item} areaName={area.name} />
          </div>

          <Reveal>
            <section className="mt-14">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-content">
                  More services in {area.name}
                </h2>
                <Link
                  href={`/areas/${area.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#163300] hover:underline"
                >
                  {area.name} hub
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {relatedInArea.map((s) => (
                  <Link
                    key={s.slug}
                    href={comboHref(area.slug, s.slug)}
                    className="rounded-pill border border-line bg-surface px-3.5 py-2 text-sm font-medium text-content transition-colors hover:border-[#9fe870] hover:text-[#163300]"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal delay={40}>
            <section className="mt-10">
              <h2 className="text-2xl font-bold tracking-tight text-content">
                {item.title} nearby
              </h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {nearby.map((n) => (
                  <Link
                    key={n.slug}
                    href={comboHref(n.slug, item.slug)}
                    className="rounded-pill border border-line bg-surface px-3.5 py-2 text-sm font-medium text-content transition-colors hover:border-[#9fe870] hover:text-[#163300]"
                  >
                    {item.title} in {n.name}
                  </Link>
                ))}
                <Link
                  href={`/services/${item.slug}`}
                  className="rounded-pill border border-line bg-surface px-3.5 py-2 text-sm font-medium text-content transition-colors hover:border-[#9fe870] hover:text-[#163300]"
                >
                  London-wide {item.title}
                </Link>
              </div>
            </section>
          </Reveal>

          <Reveal delay={60}>
            <section className="mt-10">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-content">
                  Related services in {area.name}
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedGlobal.map((s) => (
                    <Link
                      key={s.slug}
                      href={comboHref(area.slug, s.slug)}
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
                          {s.title} in {area.name}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
                          View local page
                          <Icon name="arrowRight" className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                ))}
              </div>
            </section>
          </Reveal>
        </div>

        <section className="container-page pb-4">
          <div className="rounded-[28px] bg-[#9fe870] px-6 py-14 text-center text-[#163300] md:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Ready to book your {item.title.toLowerCase()} in {area.name}?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[#163300]/80">
              Message or call for a fixed-price quote — most replies within
              about an hour, no obligation, covering all {areas.length} London
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

      <div className="h-32 lg:hidden" aria-hidden />

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
