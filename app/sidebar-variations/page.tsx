"use client";

import { useState } from "react";
import CalcSidebar, { sidebarLabels, type CalcData } from "@/components/CalcSidebar";

const sample: CalcData = {
  total: 247,
  hourly: 75,
  movers: 2,
  deposit: 40,
  rows: [
    ["Labour (3 hrs × £75)", 225],
    ["Bank-holiday +20%", 0],
    ["Mileage (18 mi)", 12],
    ["Furniture assembly (1h × 2)", 50],
    ["Packing assistance (0h × 2)", 0],
    ["Access & item extras", 20],
  ],
};

export default function SidebarVariationsPage() {
  const [active, setActive] = useState(1);
  const variants = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-base">
      <div className="container-page py-12">
        <h1 className="text-2xl font-bold text-content md:text-3xl">
          Estimate sidebar — 10 designs
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tap a variant to preview it large. Set{" "}
          <code className="rounded bg-cream px-1.5 py-0.5 text-xs">
            SIDEBAR_VARIANT
          </code>{" "}
          in <code className="rounded bg-cream px-1.5 py-0.5 text-xs">PriceCalculator.tsx</code>{" "}
          to your pick.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v}
              onClick={() => setActive(v)}
              className={
                "rounded-pill px-4 py-2 text-sm font-semibold transition-colors " +
                (active === v
                  ? "bg-[#163300] text-[#9fe870]"
                  : "border border-line bg-surface text-content hover:border-[#163300]/40")
              }
            >
              {v}. {sidebarLabels[v]}
            </button>
          ))}
        </div>

        {/* Large live preview */}
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_380px]">
          <div className="rounded-[24px] border border-dashed border-line bg-cream/50 p-6">
            <p className="text-sm font-semibold text-muted">
              Live preview — variant {active}: {sidebarLabels[active]}
            </p>
          </div>
          <CalcSidebar variant={active} data={sample} sticky={false} />
        </div>

        {/* All variants grid */}
        <h2 className="mt-16 text-lg font-bold text-content">All 10 side by side</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map((v) => (
            <div key={v}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
                {v}. {sidebarLabels[v]}
              </p>
              <CalcSidebar variant={v} data={sample} sticky={false} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
