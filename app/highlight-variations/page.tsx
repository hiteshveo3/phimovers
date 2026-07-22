"use client";

import { useState } from "react";
import Highlight, { highlightLabels } from "@/components/Highlight";

const variants = Array.from({ length: 10 }, (_, i) => i + 1);

export default function HighlightVariationsPage() {
  const [active, setActive] = useState(1);

  return (
    <main className="min-h-screen bg-base">
      <div className="container-page py-12">
        <h1 className="text-2xl font-bold">Headline highlight variations</h1>
        <p className="mt-2 text-sm text-muted">
          Toggle a style below to preview it on the headline. Tell me the number
          to apply it to the real hero.
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
              {v}. {highlightLabels[v]}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="mt-10 rounded-card border border-line bg-surface p-8 md:p-14">
          <span className="chip mb-6">
            Variation {active} — {highlightLabels[active]}
          </span>
          <h2 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
            Stress-free removals that{" "}
            <Highlight variant={active}>get you moving</Highlight>
          </h2>
          <p className="mt-5 max-w-xl text-base text-muted md:text-lg">
            Professional house &amp; office removals, packing and storage across
            the UK.
          </p>
        </div>

        {/* All at a glance */}
        <h3 className="mt-14 text-sm font-bold uppercase tracking-widest text-muted">
          All styles
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {variants.map((v) => (
            <button
              key={v}
              onClick={() => setActive(v)}
              className="rounded-card border border-line bg-surface p-6 text-left transition-colors hover:border-[#163300]/40"
            >
              <div className="text-xs font-semibold text-muted">
                {v}. {highlightLabels[v]}
              </div>
              <div className="mt-3 text-2xl font-extrabold tracking-tight">
                <Highlight variant={v}>get you moving</Highlight>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
