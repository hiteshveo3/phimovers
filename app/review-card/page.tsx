"use client";

import { useState } from "react";
import ReviewCard, { reviewLabels } from "@/components/ReviewCard";

const variants = Array.from({ length: 10 }, (_, i) => i + 1);

export default function ReviewCardPage() {
  const [active, setActive] = useState(1);

  return (
    <main className="min-h-screen bg-cream">
      <div className="container-page py-12">
        <h1 className="text-2xl font-bold">Review card variations</h1>
        <p className="mt-2 text-sm text-muted">
          Toggle a style to preview. Tell me the number to apply it.
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
              {v}. {reviewLabels[v]}
            </button>
          ))}
        </div>

        {/* white section */}
        <div className="mt-8 flex justify-center rounded-[28px] bg-white p-8 md:p-16">
          <ReviewCard variant={active} />
        </div>
      </div>
    </main>
  );
}
