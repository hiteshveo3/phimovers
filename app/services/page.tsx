import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cta from "@/components/Cta";
import HeroBg from "@/components/HeroBg";
import ServicesNav from "@/components/ServicesNav";
import { Icon } from "@/components/icons";
import SoftImage from "@/components/SoftImage";
import { serviceCategories, type ServiceItem } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our removal services — Phi Movers | London",
  description:
    "Explore every Phi Movers service — home removals, man & van, office moves, packing, storage and specialist handling across all 32 London boroughs.",
  alternates: { canonical: "https://phimovers.co.uk/services" },
};

function ServiceItemCard({ s }: { s: ServiceItem }) {
  return (
    <Link
      href={s.href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:bg-cream"
    >
      <div className="relative">
        <SoftImage
          src={s.image}
          alt={s.title}
          icon={s.icon}
          className="aspect-[16/10] w-full"
          imgClassName="aspect-[16/10] w-full object-cover"
        />
        <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
          <Icon name={s.icon} className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-snug text-content group-hover:text-[#163300]">
            {s.title}
          </h3>
          <span className="shrink-0 rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-bold text-[#163300]">
            {s.price}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.desc}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
          Learn more
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function ServicesPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="section relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page text-center">
          <span className="chip border-transparent bg-[#9fe870] font-semibold text-[#163300]">
            All 32 London boroughs
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Our removal services
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted md:text-lg">
            Everything you need to move, packed into one team — home and office
            removals, packing, storage and specialist handling, all fixed-price
            and fully insured.
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="bg-[#f4f5f2]">
        <ServicesNav
          items={serviceCategories.map((c) => ({ id: c.id, title: c.title }))}
        />
        {serviceCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-[120px] py-10">
            <div className="container-page">
              <div className="mb-6 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
                    <Icon name={cat.items[0].icon} className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-content">
                    {cat.title}
                  </h2>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {cat.intro}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((s) => (
                  <ServiceItemCard key={s.title} s={s} />
                ))}
              </div>
            </div>
          </section>
        ))}

        <Cta variant={2} btn={1} />
      </div>

      <Footer />
    </main>
  );
}
