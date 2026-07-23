"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Icon } from "./icons";

type QA = { q: string; a: string };

export default function ServiceFaq({ faqs }: { faqs: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-2 space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={Math.min(i * 40, 200)}>
            <div
              className={
                "rounded-2xl border bg-surface px-5 shadow-sm transition-colors " +
                (isOpen
                  ? "border-[#9fe870] bg-[#9fe870]/15"
                  : "border-[#163300]/20")
              }
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 py-4 text-left text-[15px] font-bold text-[#163300]"
              >
                <span className="flex-1">{f.q}</span>
                <span
                  className={
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all " +
                    (isOpen
                      ? "bg-[#9fe870] text-[#163300]"
                      : "bg-[#163300]/10 text-[#163300]")
                  }
                >
                  <Icon
                    name="chevronDown"
                    className={
                      "h-4 w-4 transition-transform duration-300 " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </span>
              </button>
              <div
                className={
                  "grid transition-all duration-500 ease-in-out " +
                  (isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0")
                }
              >
                <div className="overflow-hidden">
                  <p className="pb-5 font-serif text-[15px] leading-relaxed text-[#163300]/80">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
