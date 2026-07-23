"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";

const OPEN_EVENT = "swiftmove:open-search";

const moreLinks = [
  { label: "Areas", href: "/areas", icon: "mapPin" },
  { label: "How it works", href: "/#how", icon: "route" },
  { label: "Reviews", href: "/reviews", icon: "star" },
];

function BarItem({
  icon,
  label,
  href,
}: {
  icon: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1 py-2.5 text-muted transition-colors hover:text-content"
    >
      <Icon name={icon} className="h-5 w-5" />
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}

export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const openSearch = () => window.dispatchEvent(new Event(OPEN_EVENT));

  return (
    <>
      {/* More sheet — sits above the bottom nav so the nav stays visible */}
      {moreOpen && (
        <>
          <div
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm lg:hidden"
          />
          <div className="fixed inset-x-0 bottom-16 z-[75] rounded-t-[24px] border-t border-line bg-surface px-5 pb-3 pt-4 shadow-soft lg:hidden">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line" />
            <div className="flex flex-col">
              {moreLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-medium text-content hover:bg-cream"
                >
                  <Icon name={l.icon} className="h-5 w-5 text-[#163300]" />
                  {l.label}
                </Link>
              ))}
              <Link
                href="/blog"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm font-medium text-content hover:bg-cream"
              >
                <Icon name="box" className="h-5 w-5 text-[#163300]" />
                Blog
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-[80] border-t border-line bg-surface lg:hidden">
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center">
          <BarItem icon="home" label="Home" href="/" />
          <BarItem icon="box" label="Services" href="/services" />

          <button
            type="button"
            onClick={openSearch}
            className="flex flex-col items-center justify-center gap-1 py-2.5 text-muted transition-colors hover:text-content"
            aria-label="Search"
          >
            <Icon name="search" className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Search</span>
          </button>

          <BarItem icon="tag" label="Pricing" href="/pricing" />

          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className={
              "flex flex-col items-center justify-center gap-1 py-2.5 transition-colors " +
              (moreOpen ? "text-[#163300]" : "text-muted hover:text-content")
            }
          >
            <Icon name="dashboard" className="h-5 w-5" />
            <span className="text-[10px] font-semibold">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
