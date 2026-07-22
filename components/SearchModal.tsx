"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { allProducts } from "@/lib/data";
import { Icon } from "./icons";

const OPEN_EVENT = "swiftmove:open-search";

export function SearchTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={
        "flex h-10 w-full items-center gap-3 rounded-pill border border-line bg-cream px-4 text-left text-sm text-muted transition-colors hover:border-[#163300]/40 " +
        className
      }
    >
      <Icon name="search" className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">Search services, areas…</span>
      <span className="hidden shrink-0 rounded-md border border-line bg-surface px-1.5 py-0.5 text-[11px] font-medium text-muted sm:block">
        ⌘ K
      </span>
    </button>
  );
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener(OPEN_EVENT, openHandler);
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener(OPEN_EVENT, openHandler);
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allProducts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div className="absolute left-1/2 top-[12vh] w-[92vw] max-w-xl -translate-x-1/2">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Icon name="search" className="h-5 w-5 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, packages or areas…"
              className="h-14 w-full bg-transparent text-base text-content outline-none placeholder:text-muted"
            />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close search"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line text-muted transition-colors hover:bg-cream"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[52vh] overflow-y-auto p-2">
            {!query.trim() ? (
              <p className="px-3 py-8 text-center text-sm text-muted">
                Try “home removals”, “storage”, “man &amp; van” or a city.
              </p>
            ) : results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-muted">
                No results for “{query}”
              </p>
            ) : (
              <ul>
                {results.map((p) => (
                  <li key={p.title}>
                    <a
                      href="#"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-cream"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-content">
                          {p.title}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {p.author} · {p.category}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-content">
                        {p.price}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-muted">
            <span>Press Esc to close</span>
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="font-semibold text-[#163300]"
            >
              Get a quote →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
