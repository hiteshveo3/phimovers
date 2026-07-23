"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; title: string };

export default function ServicesNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Scroll-spy: mark the category currently under the sticky bar as active.
  useEffect(() => {
    const onScroll = () => {
      let current = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 130) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  // Keep the active chip centred in the horizontal scroller.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const chip = chipRefs.current[active];
    if (!scroller || !chip) return;
    const target =
      chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  }, [active]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sticky top-14 z-40 border-b border-line bg-surface">
      <div className="container-page">
        <div
          ref={scrollerRef}
          className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 py-2.5 md:-mx-8 md:px-8"
        >
          {items.map((it) => {
            const on = active === it.id;
            return (
              <button
                key={it.id}
                ref={(el) => {
                  chipRefs.current[it.id] = el;
                }}
                onClick={() => go(it.id)}
                className={
                  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                  (on
                    ? "bg-[#9fe870] text-[#163300]"
                    : "text-content hover:bg-[#9fe870]/20 hover:text-[#163300]")
                }
              >
                {it.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
