"use client";

import { useState } from "react";
import { categories } from "@/lib/data";
import ServiceCard, { serviceLabels } from "@/components/ServiceCard";

const variants = Array.from({ length: 10 }, (_, i) => i + 1);

export default function ServiceVariationsPage() {
  const [active, setActive] = useState(1);

  return (
    <main className="min-h-screen overflow-x-clip bg-base">
      <div className="container-page py-12">
        <h1 className="text-2xl font-bold">Service card variations</h1>
        <p className="mt-2 text-sm text-muted">
          Toggle a style to preview it in the horizontal scroller. Tell me the
          number to apply it to the real &ldquo;Our services&rdquo; section.
        </p>

        {/* Toggle */}
        <div className="mt-6 flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v}
              onClick={() => setActive(v)}
              className={
                "rounded-pill border px-4 py-2 text-sm font-semibold transition-colors " +
                (active === v
                  ? "border-[#163300] bg-[#9fe870] text-[#163300]"
                  : "border-line bg-surface text-muted hover:text-content")
              }
            >
              {v}. {serviceLabels[v]}
            </button>
          ))}
        </div>

        <div className="mt-8 text-sm font-bold uppercase tracking-widest text-muted">
          Variation {active} — {serviceLabels[active]}
        </div>

        {/* Scroller preview — bleeds to page edge, cards rest with padding */}
        <div className="no-scrollbar -mx-5 mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-16 md:-mx-8 md:px-8">
          {categories.map((c) => (
            <div key={c.title} className="h-44 w-56 shrink-0 snap-start">
              <ServiceCard variant={active} c={c} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
