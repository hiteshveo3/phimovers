import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import ServicesNav from "@/components/ServicesNav";
import Cta from "@/components/Cta";
import Reveal from "@/components/Reveal";
import { Icon } from "@/components/icons";
import { areas, areasByRegion, type Area } from "@/lib/areas";
import { allServices } from "@/lib/data";
import {
  SITE_URL,
  WHATSAPP_HREF,
  CALL_HREF,
  CALL_LABEL,
} from "@/lib/contact";

const SITE = SITE_URL;

const popularSlugs = [
  "camden",
  "islington",
  "hackney",
  "westminster",
  "croydon",
  "wandsworth",
];

export const metadata: Metadata = {
  title: "Areas We Cover — All 32 London Boroughs | Phi Movers",
  description:
    "Phi Movers covers every London borough. Browse removals by area — house removals, sofa delivery, man & van, office moves and more across all 32 boroughs.",
  alternates: { canonical: `${SITE}/areas` },
};

function PopularCard({ a }: { a: Area }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
          <Icon name="mapPin" className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-content">{a.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {a.blurb}
          </p>
        </div>
      </div>
      <div className="mt-auto flex gap-2 pt-5">
        <Link
          href={`/areas/${a.slug}`}
          className="btn flex-1 justify-center bg-[#9fe870] px-4 py-2.5 text-[#163300] hover:bg-[#86d957]"
        >
          View area
        </Link>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="btn justify-center border border-[#163300]/20 bg-white px-3 py-2.5 text-[#163300]"
          aria-label={`WhatsApp quote for ${a.name}`}
        >
          <Icon name="whatsapp" className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function BoroughCard({ a }: { a: Area }) {
  return (
    <Link
      href={`/areas/${a.slug}`}
      className="group flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:bg-cream"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#9fe870]/30 text-[#163300] transition-colors group-hover:bg-[#9fe870]">
        <Icon name="mapPin" className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-content group-hover:text-[#163300]">
          {a.name}
        </span>
        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted">
          {a.blurb}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#163300]">
          Removals in {a.name.split(" ")[0]}
          <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </span>
      </span>
    </Link>
  );
}

export default function AreasHubPage() {
  const regions = areasByRegion();
  const popularAreas = popularSlugs
    .map((s) => areas.find((a) => a.slug === s))
    .filter((a): a is Area => Boolean(a));
  const navItems = [
    { id: "popular", title: "Popular" },
    ...regions.map((r) => ({
      id: r.label.toLowerCase(),
      title: `${r.label} London`,
    })),
  ];

  return (
    <main>
      <Navbar />

      <section className="section relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page text-center">
          <span className="chip border-transparent bg-[#9fe870] font-semibold text-[#163300]">
            Fully insured · 32 boroughs + City
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-content md:text-5xl">
            Areas we cover
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted md:text-lg">
            Local removals across every London borough — house moves, man &amp;
            van, sofa delivery and more. Pick your area for a fixed-price quote.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#9fe870] px-6 text-[#163300] hover:bg-[#86d957]"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Get a fixed quote
            </a>
            <a
              href={CALL_HREF}
              className="btn border border-[#163300]/25 bg-white px-6 text-[#163300]"
            >
              <Icon name="phone" className="h-4 w-4" />
              {CALL_LABEL}
            </a>
          </div>
          <p className="mt-5 text-sm text-muted">
            {areas.length} areas · {allServices.length} services each
          </p>
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <ServicesNav items={navItems} />

        <section id="popular" className="scroll-mt-[120px] py-10 md:py-12">
          <div className="container-page">
            <Reveal>
              <div className="mb-6 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
                    <Icon name="star" className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-content">
                    Popular boroughs
                  </h2>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  High-demand London areas — open a local page or WhatsApp for a
                  fixed quote.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {popularAreas.map((a) => (
                  <PopularCard key={a.slug} a={a} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {regions.map((region, i) => (
          <section
            key={region.label}
            id={region.label.toLowerCase()}
            className="scroll-mt-[120px] py-10 md:py-12"
          >
            <div className="container-page">
              <Reveal delay={i * 40}>
                <div className="mb-6 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
                      <Icon name="mapPin" className="h-5 w-5" />
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-content">
                      {region.label} London
                    </h2>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    Fully insured removals across {region.areas.length} borough
                    {region.areas.length === 1 ? "" : "s"} in {region.label.toLowerCase()}{" "}
                    London.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {region.areas.map((a) => (
                    <BoroughCard key={a.slug} a={a} />
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        ))}

        <div className="container-page pb-4">
          <Cta variant={2} btn={1} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
