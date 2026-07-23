"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";
import { CALL_HREF, CALL_LABEL, WHATSAPP_HREF } from "@/lib/contact";
import MegaMenu from "./MegaMenu";
import AreasMegaMenu from "./AreasMegaMenu";
import SearchModal, { SearchTrigger } from "./SearchModal";
import { Icon } from "./icons";

type OpenMenu = "services" | "areas" | null;

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <img
        src="/logo.png"
        alt="Phi Movers"
        className="h-6 w-6 rounded-md object-cover ring-1 ring-black/5"
      />
      <span className="text-lg font-extrabold tracking-tight text-content">
        Phi Movers
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (menu: OpenMenu) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };
  const close = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const megaLinkClass = (active: boolean) =>
    "flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
    (active
      ? "bg-[#9fe870]/25 text-content"
      : "text-content/75 hover:bg-[#9fe870]/20 hover:text-content");

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
            "container-page relative flex items-center gap-4 transition-all duration-200 " +
            (scrolled ? "h-14" : "h-16")
          }
        >
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              if (l.label === "Services") {
                return (
                  <div
                    key={l.label}
                    onMouseEnter={() => open("services")}
                    onMouseLeave={close}
                  >
                    <Link href={l.href} className={megaLinkClass(openMenu === "services")}>
                      {l.label}
                      <Icon
                        name="chevronDown"
                        className={
                          "h-4 w-4 transition-transform " +
                          (openMenu === "services" ? "rotate-180" : "")
                        }
                      />
                    </Link>
                  </div>
                );
              }
              if (l.label === "Areas") {
                return (
                  <div
                    key={l.label}
                    onMouseEnter={() => open("areas")}
                    onMouseLeave={close}
                  >
                    <Link href={l.href} className={megaLinkClass(openMenu === "areas")}>
                      {l.label}
                      <Icon
                        name="chevronDown"
                        className={
                          "h-4 w-4 transition-transform " +
                          (openMenu === "areas" ? "rotate-180" : "")
                        }
                      />
                    </Link>
                  </div>
                );
              }
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-content/75 transition-colors hover:bg-[#9fe870]/20 hover:text-content"
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden flex-1 lg:block">
            <SearchTrigger />
          </div>

          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href={CALL_HREF}
              className="flex items-center gap-1.5 text-sm font-semibold text-content/80 hover:text-content"
            >
              <Icon name="phone" className="h-4 w-4" />
              {CALL_LABEL}
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-pill bg-[#9fe870] px-4 py-2.5 text-sm font-bold text-[#163300] transition-colors hover:bg-[#86d957]"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Get a Quote
            </a>
          </div>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-[#9fe870] px-4 py-2 text-sm font-bold text-[#163300] transition-colors hover:bg-[#86d957] lg:hidden"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            Get a Quote
          </a>

          {openMenu && (
            <div
              onMouseEnter={() => open(openMenu)}
              onMouseLeave={close}
              className="absolute inset-x-0 top-full z-50 hidden pt-2 lg:block"
            >
              {openMenu === "services" ? <MegaMenu /> : <AreasMegaMenu />}
            </div>
          )}
        </div>
      </div>

      <SearchModal />
    </header>
  );
}
