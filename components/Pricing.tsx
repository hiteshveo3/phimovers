"use client";

import { useState } from "react";
import { proTiers, proFeatures, type BillingKey } from "@/lib/data";

export default function Pricing() {
  const [active, setActive] = useState<BillingKey>("yearly");
  const tier = proTiers.find((t) => t.key === active)!;

  return (
    <section id="pricing" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Simple, transparent pricing</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Clear fixed-price quotes with no hidden fees. Pick the option that
            fits your move — we&apos;ll confirm the exact price after a quick
            survey.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-pill border border-line bg-cream p-1">
            {proTiers.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={
                  "relative rounded-pill px-4 py-2 text-sm font-semibold transition-colors " +
                  (active === t.key
                    ? "bg-surface text-content shadow-card"
                    : "text-muted hover:text-content")
                }
              >
                {t.label}
                {t.badge && (
                  <span className="ml-2 rounded-pill bg-[#163300]/15 px-2 py-0.5 text-[11px] font-bold text-[#163300]">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="mx-auto mt-8 max-w-md">
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e4600] via-[#163300] to-[#081b00] p-8 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#9fe870]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#9fe870]/15 blur-3xl"
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Phi Movers · {tier.label}
              </p>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-extrabold tabular-nums">
                  {tier.price}
                </span>
                <span className="pb-1.5 text-sm text-white/60">
                  {tier.period}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/60">{tier.sub}</p>

              <ul className="mt-6 space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15 text-xs">
                      ✓
                    </span>
                    <span className="text-white/90">{f}</span>
                  </li>
                ))}
              </ul>

              <a href="#" className="btn-accent mt-7 w-full">
                Get This Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
