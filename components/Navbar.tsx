"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";
import MegaMenu from "./MegaMenu";
import SearchModal, { SearchTrigger } from "./SearchModal";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "./icons";

function Logo() {
  return (
    <a href="#" className="flex shrink-0 items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870]">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="#163300"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="3" x2="12" y2="21" />
          <ellipse cx="12" cy="12" rx="6.5" ry="5" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-content">
        Phi Movers
      </span>
    </a>
  );
}

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-surface">
      <div
        className={
          "border-b transition-shadow " +
          (scrolled ? "border-line shadow-card" : "border-line")
        }
      >
        <div
          className={
            "container-page flex items-center gap-4 transition-all duration-200 " +
            (scrolled ? "h-14" : "h-16")
          }
        >
          <Logo />

          {/* Primary nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((l) =>
              l.label === "Services" ? (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    className={
                      "flex items-center gap-1 py-5 text-sm font-medium transition-colors " +
                      (servicesOpen
                        ? "text-content"
                        : "text-content/75 hover:text-content")
                    }
                  >
                    {l.label}
                    <Icon
                      name="chevronDown"
                      className={
                        "h-4 w-4 transition-transform " +
                        (servicesOpen ? "rotate-180" : "")
                      }
                    />
                  </button>
                  {servicesOpen && (
                    <div className="absolute left-0 top-full z-50 pt-2">
                      <MegaMenu />
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  className="py-5 text-sm font-medium text-content/75 transition-colors hover:text-content"
                >
                  {l.label}
                </a>
              )
            )}
          </nav>

          {/* Search (desktop only — mobile uses bottom nav) */}
          <div className="hidden flex-1 lg:block">
            <SearchTrigger />
          </div>

          {/* Right actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href="tel:+442079460134"
              className="flex items-center gap-1.5 text-sm font-semibold text-content/80 hover:text-content"
            >
              <Icon name="phone" className="h-4 w-4" />
              +44 20 7946 0134
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 rounded-pill bg-[#9fe870] px-4 py-2.5 text-sm font-bold text-[#163300] transition-colors hover:bg-[#86d957]"
            >
              <Icon name="truck" className="h-4 w-4" />
              Get a Quote
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile CTA (replaces hamburger) */}
          <a
            href="#pricing"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-[#9fe870] px-4 py-2 text-sm font-bold text-[#163300] transition-colors hover:bg-[#86d957] lg:hidden"
          >
            <Icon name="truck" className="h-4 w-4" />
            Get a Quote
          </a>
        </div>
      </div>

      <SearchModal />
    </header>
  );
}
