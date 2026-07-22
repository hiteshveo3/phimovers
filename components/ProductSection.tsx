"use client";

import { useRef } from "react";
import type { Product } from "@/lib/data";
import ProductCard from "./ProductCard";
import { Icon } from "./icons";

function Arrow({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-content transition-colors hover:bg-cream"
    >
      <Icon name={dir === "left" ? "arrowLeft" : "arrowRight"} className="h-4 w-4" />
    </button>
  );
}

export default function ProductSection({
  id,
  title,
  moreLabel,
  products,
  layout = "carousel",
}: {
  id?: string;
  title: string;
  moreLabel?: string;
  products: Product[];
  layout?: "carousel" | "grid";
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  function scrollBy(delta: number) {
    scroller.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  function onPointerDown(e: React.PointerEvent) {
    const el = scroller.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const el = scroller.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  }

  function endDrag(e: React.PointerEvent) {
    const el = scroller.current;
    drag.current.active = false;
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    }
  }

  return (
    <section id={id} className="section">
      <div className="container-page">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="section-title">{title}</h2>
          <div className="flex items-center gap-3">
            {moreLabel && (
              <a href="#" className="link-more shrink-0">
                {moreLabel}
                <span aria-hidden>→</span>
              </a>
            )}
            {layout === "carousel" && (
              <div className="hidden items-center gap-2 md:flex">
                <Arrow dir="left" onClick={() => scrollBy(-320)} />
                <Arrow dir="right" onClick={() => scrollBy(320)} />
              </div>
            )}
          </div>
        </div>

        {layout === "grid" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.title} product={p} />
            ))}
          </div>
        ) : (
          <div
            ref={scroller}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={(e) => {
              if (drag.current.moved) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="no-scrollbar -mx-5 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 active:cursor-grabbing md:mx-0 md:px-0"
          >
            {products.map((p) => (
              <div
                key={p.title}
                className="w-[260px] shrink-0 snap-start select-none md:w-[280px]"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
