"use client";

import { useState, type ReactNode } from "react";
import { faqs } from "@/lib/data";
import { Icon } from "./icons";

export const faqLabels: Record<number, string> = {
  1: "Bordered list",
  2: "Cards",
  3: "Plus / minus",
  4: "Left accent bar",
  5: "Filled when open",
  6: "Minimal dividers",
  7: "Numbered",
  8: "Rounded filled",
  9: "Big questions",
  10: "Green accent",
};

const chevron = (open: boolean) => (
  <Icon
    name="chevronDown"
    className={
      "h-5 w-5 shrink-0 transition-transform " + (open ? "rotate-180" : "")
    }
  />
);

const plus = (open: boolean) => (
  <span className="grid h-6 w-6 shrink-0 place-items-center text-xl font-medium leading-none">
    {open ? "−" : "+"}
  </span>
);

type Cfg = {
  list: string;
  item: (open: boolean) => string;
  q: (open: boolean) => string;
  a: (open: boolean) => string;
  ind: (open: boolean) => ReactNode;
  prefix?: (i: number, open: boolean) => ReactNode;
};

function getCfg(variant: number): Cfg {
  switch (variant) {
    case 2:
      return {
        list: "space-y-3",
        item: () => "rounded-card border border-line bg-surface px-5",
        q: () =>
          "flex w-full items-center gap-3 py-4 text-left text-base font-semibold text-content",
        a: () => "pb-5 text-sm text-muted",
        ind: chevron,
      };
    case 3:
      return {
        list: "divide-y divide-line border-y border-line",
        item: () => "",
        q: () =>
          "flex w-full items-center gap-3 py-4 text-left text-base font-semibold text-content",
        a: () => "pb-4 text-sm text-muted",
        ind: plus,
      };
    case 4:
      return {
        list: "space-y-2",
        item: (o) =>
          "rounded-r-lg border-l-4 pl-4 pr-2 transition-colors " +
          (o ? "border-[#9fe870] bg-[#9fe870]/10" : "border-line"),
        q: () =>
          "flex w-full items-center gap-3 py-4 text-left text-base font-semibold text-content",
        a: () => "pb-4 text-sm text-muted",
        ind: chevron,
      };
    case 5:
      return {
        list: "space-y-3",
        item: (o) =>
          "rounded-card px-5 transition-colors " +
          (o ? "bg-[#163300]" : "bg-cream"),
        q: (o) =>
          "flex w-full items-center gap-3 py-4 text-left text-base font-semibold " +
          (o ? "text-white" : "text-content"),
        a: () => "pb-5 text-sm text-white/70",
        ind: (o) => (
          <span className={o ? "text-white" : "text-content"}>{chevron(o)}</span>
        ),
      };
    case 6:
      return {
        list: "",
        item: () => "border-b border-line/70",
        q: () =>
          "flex w-full items-center gap-3 py-3.5 text-left text-[15px] font-medium text-content",
        a: () => "pb-3.5 text-sm text-muted",
        ind: chevron,
      };
    case 7:
      return {
        list: "space-y-3",
        item: () => "rounded-2xl bg-cream px-5",
        q: () =>
          "flex w-full items-center gap-4 py-4 text-left text-base font-semibold text-content",
        a: () => "pb-5 text-sm text-muted",
        ind: (o) => <span className="text-content">{chevron(o)}</span>,
        prefix: (i) => (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#9fe870] text-base font-extrabold text-black">
            {i + 1}
          </span>
        ),
      };
    case 8:
      return {
        list: "space-y-3",
        item: () => "rounded-2xl bg-cream px-5",
        q: () =>
          "flex w-full items-center gap-3 py-4 text-left text-base font-semibold text-content",
        a: () => "pb-5 text-sm text-muted",
        ind: plus,
      };
    case 9:
      return {
        list: "divide-y divide-line",
        item: () => "",
        q: () =>
          "flex w-full items-start gap-3 py-5 text-left text-xl font-bold tracking-tight text-content md:text-2xl",
        a: () => "pb-5 text-sm text-muted md:text-base",
        ind: (o) => (
          <span className="mt-1">{plus(o)}</span>
        ),
      };
    case 10:
      return {
        list: "space-y-2",
        item: (o) =>
          "rounded-card px-5 transition-colors " +
          (o ? "bg-[#9fe870]" : "bg-cream"),
        q: (o) =>
          "flex w-full items-center gap-3 py-4 text-left text-base font-semibold " +
          (o ? "text-[#163300]" : "text-content"),
        a: () => "pb-5 text-sm text-[#163300]/80",
        ind: chevron,
      };
    case 1:
    default:
      return {
        list: "divide-y divide-line border-y border-line",
        item: () => "",
        q: () =>
          "flex w-full items-center gap-3 py-4 text-left text-base font-semibold text-content",
        a: () => "pb-4 text-sm text-muted",
        ind: chevron,
      };
  }
}

export default function Faq({ variant = 1 }: { variant?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const cfg = getCfg(variant);

  return (
    <section id="faq" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Everything you need to know about booking your move with Phi Movers.
          </p>
        </div>

        <div className={"mx-auto mt-8 max-w-3xl " + cfg.list}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={cfg.item(isOpen)}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cfg.q(isOpen)}
                  aria-expanded={isOpen}
                >
                  {cfg.prefix?.(i, isOpen)}
                  <span className="flex-1">{f.q}</span>
                  {cfg.ind(isOpen)}
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
                    <div className={cfg.a(isOpen)}>{f.a}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
