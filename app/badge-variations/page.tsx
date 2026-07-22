"use client";

import { useState } from "react";
import Badge, { badgeLabels } from "@/components/Badge";

const variants = Array.from({ length: 10 }, (_, i) => i + 1);

export default function BadgeVariationsPage() {
  const [active, setActive] = useState(4);

  return (
    <main className="min-h-screen bg-base">
      <div className="container-page py-12">
        <h1 className="text-2xl font-bold">Badge variations</h1>
        <p className="mt-2 text-sm text-muted">
          Toggle a style to preview the &ldquo;Free Survey &amp; Quote&rdquo;
          badge on the green banner. Tell me the number to apply it.
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
              {v}. {badgeLabels[v]}
            </button>
          ))}
        </div>

        {/* Preview on the green banner */}
        <div className="mt-10 rounded-[24px] bg-[#9fe870] p-8 text-[#163300] md:p-14">
          <Badge variant={active} label="Free Survey & Quote" />
          <h2 className="mt-3 max-w-xl text-2xl font-bold md:text-3xl">
            Book a free home survey and get a fixed-price quote from our expert
            movers
          </h2>
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
              className="flex flex-col items-start gap-4 rounded-[20px] bg-[#9fe870] p-6 text-left"
            >
              <span className="text-[10px] font-bold text-[#163300]/60">
                {v}. {badgeLabels[v]}
              </span>
              <Badge variant={v} label="Free Survey & Quote" />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
