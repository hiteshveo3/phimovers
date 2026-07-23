import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import BackToTop from "@/components/blog/BackToTop";
import ServiceFaq from "@/components/ServiceFaq";
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
} from "@/lib/data";
import { buildServiceCopy, relatedServices } from "@/lib/services";
import {
  PHONE_DISPLAY,
  PHONE_E164,
  PHONE_HREF,
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
  const url = `${SITE}${comboHref(area.slug, item.slug)}`;
  return {
    title: `${item.title} in ${area.name} — Phi Movers`,
    description: `${item.title} in ${area.name}. ${item.desc} Fixed-price, fully insured Phi Movers across ${area.name} and all 32 London boroughs.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${item.title} in ${area.name} — Phi Movers`,
      description: item.desc,
      url,
      type: "website",
      images: [{ url: item.image, width: 640, height: 400, alt: item.title }],
    },
  };
}

export default function AreaServicePage({
  params,
}: {
  params: { borough: string; service: string };
}) {
  const area = getAreaBySlug(params.borough);
  const entry = getServiceBySlug(params.service);
  if (!area || !entry) notFound();

  const { item } = entry;
  const copy = buildServiceCopy(item);
  const nearby = getNearbyAreas(area.slug, 5);
  const relatedInArea = allServices
    .filter((s) => s.slug !== item.slug)
    .slice(0, 6);
  const relatedSameService = nearby.slice(0, 5);
  const relatedGlobal = relatedServices(item.slug, 3);
  const url = `${SITE}${comboHref(area.slug, item.slug)}`;

  const localFaqs = [
    {
      q: `Do you offer ${item.title.toLowerCase()} in ${area.name}?`,
      a: `Yes — we provide ${item.title.toLowerCase()} throughout ${area.name} and every other London borough. Local crews know the parking, access and best routes for ${area.name}.`,
    },
    {
      q: `How much does ${item.title.toLowerCase()} cost in ${area.name}?`,
      a: `Prices in ${area.name} depend on volume, access and timing. As a guide we list ${priceLabel(item.price)} — WhatsApp or call for a fixed quote for your exact addresses in ${area.name}.`,
    },
    ...copy.faqs.slice(0, 3),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${item.title} in ${area.name}`,
    description: `${item.desc} Available in ${area.name}.`,
    image: item.image,
    provider: {
      "@type": "MovingCompany",
      name: "Phi Movers",
      telephone: PHONE_E164,
      areaServed: "London",
    },
    areaServed: { "@type": "AdministrativeArea", name: area.name },
    url,
    offers: { "@type": "Offer", price: item.price, priceCurrency: "GBP" },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: localFaqs.map((f) => ({
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

      <section className="relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page py-10 md:py-14">
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

          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <span className="chip border-transparent bg-[#9fe870] font-semibold text-[#163300]">
                {area.name}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-content md:text-5xl">
                {item.title} in {area.name}
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted md:text-lg">
                {item.desc} Local, fixed-price {item.title.toLowerCase()} across{" "}
                {area.name} — with insured crews who know the borough.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-[#9fe870] px-6 text-[#163300] hover:bg-[#86d957]"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp
                </a>
                <a href={PHONE_HREF} className="btn btn-light px-6">
                  <Icon name="phone" className="h-4 w-4" />
                  {PHONE_DISPLAY}
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="tag" className="h-4 w-4 text-[#163300]" />
                  {priceLabel(item.price)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="mapPin" className="h-4 w-4 text-[#163300]" />
                  {area.name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="shield" className="h-4 w-4 text-[#163300]" />
                  Fully insured
                </span>
              </div>
            </div>

            <img
              src={item.image}
              alt={`${item.title} in ${area.name}`}
              className="aspect-[16/11] w-full rounded-[24px] object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <article className="space-y-6">
              <div className="rounded-2xl border border-line bg-surface p-6 md:p-7">
                <h2 className="text-2xl font-bold tracking-tight text-content">
                  {item.title} across {area.name}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-content/80">
                  {area.blurb} When you book {item.title.toLowerCase()} in{" "}
                  {area.name}, you get a clear fixed price, loading help
                  included, and a crew used to London access — stairs, lifts,
                  permits and busy streets.
                </p>
                {copy.intro.slice(0, 2).map((para, i) => (
                  <p
                    key={i}
                    className="mt-3 text-[15px] leading-relaxed text-content/80"
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-content">
                  What&apos;s included in {area.name}
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {copy.included.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
                        <Icon
                          name="check"
                          className="h-3.5 w-3.5"
                          size={14}
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-[15px] text-content/85">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-content">
                  Ideal for in {area.name}
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {copy.idealFor.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
                        <Icon
                          name="check"
                          className="h-3.5 w-3.5"
                          size={14}
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-[15px] text-content/85">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-[#9fe870] p-6 text-[#163300]">
                <p className="text-sm font-extrabold uppercase tracking-wide">
                  Local tip for {area.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#163300]/85">
                  Parking and access vary street by street in {area.name}. Tell
                  us about stairs, lifts and where the van can stop — we&apos;ll
                  build that into your fixed quote so moving day stays smooth.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-content">
                  Frequently asked questions
                </h2>
                <ServiceFaq faqs={localFaqs} />
              </div>
            </article>

            <aside className="lg:sticky lg:top-[70px] lg:self-start">
              <div className="rounded-2xl bg-[#9fe870] p-5 text-[#163300]">
                <p className="text-sm font-extrabold">Get a fixed quote</p>
                <p className="mt-1 text-sm text-[#163300]/75">
                  {item.title} in {area.name} — reply within about an hour.
                </p>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-4 w-full justify-center bg-[#163300] px-5 text-[#9fe870] hover:bg-[#0e2400]"
                >
                  <Icon name="whatsapp" className="h-4 w-4" />
                  WhatsApp us
                </a>
                <a
                  href={PHONE_HREF}
                  className="btn mt-3 w-full justify-center bg-white/25 px-5 text-[#163300] backdrop-blur-md hover:bg-white/40"
                >
                  <Icon name="phone" className="h-4 w-4" />
                  {PHONE_DISPLAY}
                </a>
                <Link
                  href={`/services/${item.slug}`}
                  className="mt-4 block text-center text-sm font-semibold text-[#163300] hover:underline"
                >
                  Full {item.title} page →
                </Link>
              </div>
            </aside>
          </div>

          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-content">
              More services in {area.name}
            </h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
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

          <section className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-content">
              {item.title} nearby
            </h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {relatedSameService.map((n) => (
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

          <section className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-content">
              Related services
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedGlobal.map((s) => (
                <Link
                  key={s.slug}
                  href={comboHref(area.slug, s.slug)}
                  className="group overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-soft"
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="p-5">
                    <span className="inline-flex rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
                      {priceLabel(s.price)}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-content group-hover:text-[#163300]">
                      {s.title} in {area.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-14 rounded-[28px] bg-[#163300] px-6 py-12 text-center text-white md:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-[#9fe870] md:text-4xl">
              Ready for {item.title.toLowerCase()} in {area.name}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
              WhatsApp or call for a fixed-price quote — covering all{" "}
              {areas.length} London boroughs.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full justify-center bg-[#9fe870] px-6 text-[#163300] hover:bg-[#86d957] sm:w-auto"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp us
              </a>
              <a
                href={PHONE_HREF}
                className="btn w-full justify-center bg-white/10 px-6 text-white hover:bg-white/20 sm:w-auto"
              >
                <Icon name="phone" className="h-4 w-4" />
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
