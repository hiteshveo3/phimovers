import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import BackToTop from "@/components/blog/BackToTop";
import ServiceFaq from "@/components/ServiceFaq";
import SoftImage from "@/components/SoftImage";
import { Icon } from "@/components/icons";
import {
  areas,
  comboHref,
  getAreaBySlug,
  getNearbyAreas,
} from "@/lib/areas";
import { allServices, priceLabel } from "@/lib/data";
import {
  PHONE_DISPLAY,
  PHONE_E164,
  PHONE_HREF,
  WHATSAPP_HREF,
  SITE_URL,
} from "@/lib/contact";

const SITE = SITE_URL;

export function generateStaticParams() {
  return areas.map((a) => ({ borough: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { borough: string };
}): Metadata {
  const area = getAreaBySlug(params.borough);
  if (!area) return { title: "Area not found — Phi Movers" };
  const url = `${SITE}/areas/${area.slug}`;
  return {
    title: `Removals in ${area.name} — Phi Movers`,
    description: `${area.blurb} Fixed-price house removals, sofa delivery, man & van and more in ${area.name}.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Removals in ${area.name} — Phi Movers`,
      description: area.blurb,
      url,
      type: "website",
    },
  };
}

export default function AreaPage({ params }: { params: { borough: string } }) {
  const area = getAreaBySlug(params.borough);
  if (!area) notFound();

  const nearby = getNearbyAreas(area.slug, 6);
  const url = `${SITE}/areas/${area.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Removals in ${area.name}`,
    description: area.blurb,
    areaServed: { "@type": "AdministrativeArea", name: area.name },
    provider: {
      "@type": "MovingCompany",
      name: "Phi Movers",
      telephone: PHONE_E164,
      url: SITE,
    },
    url,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((f) => ({
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
      { "@type": "ListItem", position: 3, name: area.name, item: url },
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
              <li className="text-content" aria-current="page">
                {area.name}
              </li>
            </ol>
          </nav>

          <span className="mt-6 chip border-transparent bg-[#9fe870] font-semibold text-[#163300]">
            London borough
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-content md:text-5xl">
            Removals in {area.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
            {area.blurb} Fixed-price quotes, WhatsApp booking and insured crews
            for house removals, sofas, office moves and more.
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
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-10 md:py-14">
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-lg font-bold tracking-tight text-content">
                Housing we move in {area.name}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-content/80">
                {area.housing}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-6">
              <h2 className="text-lg font-bold tracking-tight text-content">
                Access, parking &amp; permits
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-content/80">
                {area.access}
              </p>
            </div>
          </section>

          <div className="mb-6 mt-14 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-content">
                Services in {area.name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Every service we offer — with a dedicated local page for{" "}
                {area.name}.
              </p>
            </div>
            <Link
              href="/services"
              className="hidden text-sm font-semibold text-[#163300] hover:underline sm:inline-flex sm:items-center sm:gap-1"
            >
              All services
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allServices.map((s) => (
              <Link
                key={s.slug}
                href={comboHref(area.slug, s.slug)}
                className="group overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-[#9fe870]"
              >
                <SoftImage
                  src={s.image}
                  alt={s.title}
                  icon={s.icon}
                  className="aspect-[16/9] w-full"
                  imgClassName="aspect-[16/9] w-full object-cover"
                />
                <div className="p-5">
                  <span className="inline-flex rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
                    {priceLabel(s.price)}
                  </span>
                  <h3 className="mt-3 text-base font-bold leading-snug text-content group-hover:text-[#163300]">
                    {s.title} in {area.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {s.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
                    View local page
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-content">
              {area.name} removals FAQs
            </h2>
            <p className="mt-1 text-sm text-muted">
              Local answers for parking, timing and the jobs we run most in{" "}
              {area.name}.
            </p>
            <ServiceFaq faqs={area.faqs} />
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-content">
              Nearby boroughs
            </h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/areas/${n.slug}`}
                  className="rounded-pill border border-line bg-surface px-3.5 py-2 text-sm font-medium text-content transition-colors hover:border-[#9fe870] hover:text-[#163300]"
                >
                  {n.name}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-14 rounded-[28px] bg-[#9fe870] px-6 py-12 text-center text-[#163300] md:px-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Moving in {area.name}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#163300]/80">
              Message or call for a fixed-price quote — no obligation, all{" "}
              {areas.length} boroughs covered.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full justify-center bg-[#163300] px-6 text-[#9fe870] hover:bg-[#0e2400] sm:w-auto"
              >
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp us
              </a>
              <a
                href={PHONE_HREF}
                className="btn w-full justify-center bg-white/25 px-6 text-[#163300] backdrop-blur-md hover:bg-white/40 sm:w-auto"
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
