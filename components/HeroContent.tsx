import { WHATSAPP_HREF } from "@/lib/contact";
import { Icon } from "./icons";
import Highlight from "./Highlight";

// Change this (1-10) to switch the headline highlight style.
const HIGHLIGHT_VARIANT = 7;

const trust = [
  "Fully insured",
  "Fixed-price quotes",
  "Local London crews",
  "All 32 boroughs",
];

export default function HeroContent() {
  return (
    <div className="container-page">
      <div className="mx-auto max-w-3xl text-center">
        <span className="chip mb-6">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#9fe870]" />
          Fully insured · Covering all 32 London boroughs
        </span>

        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          Stress-free removals that{" "}
          <Highlight variant={HIGHLIGHT_VARIANT}>get you moving</Highlight>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted md:text-lg">
          Professional house &amp; office removals, packing and storage across
          every London borough. Get a free, no-obligation quote in minutes.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            Get a Free Quote
          </a>
          <a href="/services" className="btn-light">
            Our Services
          </a>
        </div>

        {/* Coverage proof */}
        <div className="mt-9 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-pill border border-line bg-surface px-5 py-2.5 shadow-soft">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
              <Icon name="mapPin" className="h-5 w-5" />
            </span>
            <div className="text-left">
              <div className="text-sm font-bold text-content">
                All 32 London boroughs
              </div>
              <p className="text-xs text-muted">
                North · South · East · West London
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted">
        {trust.map((t) => (
          <span key={t} className="inline-flex items-center gap-1.5">
            <Icon name="check" className="h-4 w-4 text-[#163300]" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
