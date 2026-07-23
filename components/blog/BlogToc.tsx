"use client";

import { useEffect, useState } from "react";
import { Icon } from "../icons";

type Item = { id: string; label: string };

export default function BlogToc({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let current = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 120) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-[58px] z-40 rounded-2xl border border-line bg-surface p-5 shadow-soft lg:static lg:z-auto lg:shadow-none"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between lg:cursor-default"
      >
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          On this page
        </span>
        <Icon
          name="chevronDown"
          className={
            "h-4 w-4 text-muted transition-transform lg:hidden " +
            (open ? "rotate-180" : "")
          }
        />
      </button>

      <ol
        className={
          "mt-4 gap-1 sm:grid-cols-2 lg:grid " + (open ? "grid" : "hidden")
        }
      >
        {items.map((t, i) => {
          const on = active === t.id;
          return (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                onClick={() => setOpen(false)}
                className={
                  "flex gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors " +
                  (on
                    ? "bg-[#9fe870]/25 font-semibold text-[#163300]"
                    : "text-content/80 hover:text-[#163300]")
                }
              >
                <span
                  className={
                    "font-bold " + (on ? "text-[#163300]" : "text-[#163300]/60")
                  }
                >
                  {i + 1}.
                </span>
                {t.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
