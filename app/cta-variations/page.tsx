"use client";

import { useState } from "react";
import Cta, { ctaLabels } from "@/components/Cta";

const variants = Array.from({ length: 10 }, (_, i) => i + 1);

export default function CtaVariationsPage() {
  const [active, setActive] = useState(1);

  return (
    <main className="min-h-screen bg-base">
      <div className="container-page py-12">
        <h1 className="text-2xl font-bold">Last CTA variations</h1>
        <p className="mt-2 text-sm text-muted">
          Toggle a style to preview the final call-to-action. Tell me the number
          to apply it.
        </p>

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
              {v}. {ctaLabels[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-16">
        <Cta key={active} variant={active} />
      </div>
    </main>
  );
}
