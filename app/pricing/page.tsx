import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import HeroBg from "@/components/HeroBg";
import PriceCalculator from "@/components/PriceCalculator";
import { Icon } from "@/components/icons";
import { WHATSAPP_HREF } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Man & Van Pricing — Phi Movers",
  description:
    "Simple man & van pricing from £50/hour — no complicated calculator. Choose your van, add a helper if needed, minimum 2 hours. Loading & unloading included.",
};

/* ---------- Van categories ---------- */
type Van = {
  name: string;
  rate: string;
  min: string;
  suitable: string[];
  popular?: boolean;
};

const vans: Van[] = [
  {
    name: "Small Van + Driver",
    rate: "£50",
    min: "£100",
    suitable: [
      "Single-item collection",
      "Boxes and luggage",
      "Student moves",
      "Small Marketplace purchases",
    ],
  },
  {
    name: "Luton Van + Driver",
    rate: "£65",
    min: "£130",
    popular: true,
    suitable: [
      "Flat and house moves",
      "Office relocations",
      "Multiple furniture items",
      "Larger loads",
    ],
  },
  {
    name: "Transit Van + Driver",
    rate: "£55",
    min: "£110",
    suitable: [
      "Sofa or bed collection",
      "Appliances",
      "Studio moves",
      "Small storage moves",
    ],
  },
];

/* ---------- Info data ---------- */
const mileage = [
  "First 10 journey miles included",
  "Additional mileage: £1.50/mile",
  "Long-distance jobs: fixed quote recommended",
  "Return mileage included in long-distance fixed quote",
];

const external = [
  "Parking",
  "Congestion Charge",
  "Toll & tunnel charges",
  "Ferry charges",
  "Parking fines (no legal parking available)",
];

const cancellation = [
  "Booking deposit: £40 (adjusted in final balance)",
  "48+ hours before: transferable or refundable",
  "24–48 hours: one free reschedule",
  "Under 24 hours: deposit non-refundable",
  "Customer unavailable: 2-hour minimum charge",
];

/* ---------- Reusable bits ---------- */
function InfoCard({
  title,
  items,
  note,
}: {
  title: string;
  items: string[];
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-cream p-6">
      <h3 className="text-base font-bold text-content">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-content">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
              <Icon name="check" className="h-4 w-4" size={13} strokeWidth={2.4} />
            </span>
            {i}
          </li>
        ))}
      </ul>
      {note && <p className="mt-4 text-xs text-muted">{note}</p>}
    </div>
  );
}

function VanCard({ van }: { van: Van }) {
  return (
    <div
      className={
        "relative flex flex-col rounded-[24px] bg-[#9fe870] p-7 text-[#163300] " +
        (van.popular ? "md:-translate-y-3" : "")
      }
    >
      {van.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-white/20 px-3.5 py-1 text-[11px] font-bold text-[#163300] shadow-sm backdrop-blur-md">
          Most popular
        </span>
      )}

      <h3 className="text-lg font-bold">{van.name}</h3>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-extrabold tracking-tight">
          {van.rate}
        </span>
        <span className="pb-1 text-sm font-medium text-[#163300]/70">/hour</span>
      </div>
      <p className="mt-1 text-sm text-[#163300]/70">
        2-hour minimum · {van.min}
      </p>

      <p className="mt-6 text-[11px] font-bold uppercase tracking-wide text-[#163300]/60">
        Suitable for
      </p>
      <ul className="mt-3 flex-1 space-y-2.5">
        {van.suitable.map((s) => (
          <li key={s} className="flex items-start gap-2.5 text-sm">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#163300] text-[#9fe870]">
              <Icon name="check" className="h-4 w-4" size={13} strokeWidth={2.4} />
            </span>
            <span className="font-medium">{s}</span>
          </li>
        ))}
      </ul>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="btn mt-7 w-full bg-[#163300] px-6 text-[#9fe870] hover:bg-[#0e2400]"
      >
        Book this van
        <Icon name="arrowRight" className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="section relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page text-center">
          <span className="chip border-transparent bg-[#9fe870] font-semibold text-[#163300]">
            From £50 per hour
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Simple man &amp; van pricing
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted md:text-lg">
            No complicated calculator. Choose your van, add a helper if you need
            one, and book for a minimum of two hours — loading and unloading
            assistance included.
          </p>
        </div>
      </section>

      {/* Van cards */}
      <section className="pb-4">
        <div className="container-page grid items-stretch gap-6 md:grid-cols-3">
          {vans.map((v) => (
            <VanCard key={v.name} van={v} />
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip border-transparent bg-[#9fe870] font-semibold text-[#163300]">
              Instant estimate
            </span>
            <h2 className="section-title mt-4">Build your quote</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
              Everything below is built in — van, team, hours, mileage, labour
              services and every add-on. Adjust and your price updates live.
            </p>
          </div>
          <div className="mt-10">
            <PriceCalculator />
          </div>
        </div>
      </section>

      {/* Mileage / External / Cancellation */}
      <section className="section pt-0">
        <div className="container-page grid gap-6 md:grid-cols-3">
          <InfoCard
            title="Mileage"
            items={mileage}
            note={'“Journey miles” means the distance from collection to delivery.'}
          />
          <InfoCard
            title="External charges (at cost)"
            items={external}
            note="Passed on at actual cost with no markup."
          />
          <InfoCard title="Deposit &amp; cancellation" items={cancellation} />
        </div>
      </section>

      {/* FAQ + CTA reuse */}
      <Faq variant={7} />
      <Cta variant={2} btn={1} />

      <Footer />
    </main>
  );
}
