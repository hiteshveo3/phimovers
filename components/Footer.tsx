"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { CALL_HREF, CALL_LABEL, WHATSAPP_HREF } from "@/lib/contact";

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Services",
    links: [
      { label: "House Removals", href: "/services/house-removals" },
      { label: "Sofa Delivery", href: "/services/sofa-delivery" },
      { label: "Office Removals", href: "/services/office-removals" },
      { label: "Packing Service", href: "/services/full-packing-service" },
      { label: "Storage", href: "/services/secure-storage" },
      { label: "Man & Van", href: "/services/man-and-van" },
      { label: "All services", href: "/services" },
      { label: "All areas", href: "/areas" },
    ],
  },
  {
    title: "London boroughs",
    links: [
      { label: "Camden", href: "/areas/camden" },
      { label: "Islington", href: "/areas/islington" },
      { label: "Hackney", href: "/areas/hackney" },
      { label: "Westminster", href: "/areas/westminster" },
      { label: "Croydon", href: "/areas/croydon" },
      { label: "All 32 boroughs", href: "/areas" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Pricing", href: "/pricing" },
      { label: "Reviews", href: "/reviews" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Get a quote", href: WHATSAPP_HREF },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Complaints", href: "/complaints" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Terms", href: "/terms" },
  { label: "Complaints", href: "/complaints" },
  { label: "Accessibility", href: "/accessibility" },
];

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line/70 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 md:pointer-events-none md:py-0"
      >
        <h4 className="text-sm font-bold text-content">{title}</h4>
        <Icon
          name="chevronDown"
          className={
            "h-4 w-4 text-muted transition-transform duration-500 md:hidden " +
            (open ? "rotate-180" : "")
          }
        />
      </button>
      <div
        className={
          "grid transition-all duration-500 ease-in-out md:grid-rows-[1fr] md:opacity-100 " +
          (open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
        }
      >
        <ul className="min-h-0 space-y-2.5 overflow-hidden pb-4 md:mt-4 md:pb-0">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-sm text-muted transition-colors hover:text-[#163300]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="site-footer" className="mt-10 border-t border-line bg-[#9fe870]/15">
      <div className="container-page py-14">
        <div className="grid gap-x-10 gap-y-2 md:grid-cols-[1.4fr_repeat(4,1fr)] md:gap-y-10">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Phi Movers"
                className="h-7 w-7 rounded-md object-cover ring-1 ring-black/5"
              />
              <span className="text-lg font-extrabold tracking-tight text-content">
                Phi Movers
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Stress-free house &amp; office removals across all 32 London
              boroughs. Fully insured and fixed-price.
            </p>
            <p className="mt-4 text-sm font-semibold text-content">
              Call us:{" "}
              <a href={CALL_HREF} className="hover:text-[#163300]">
                {CALL_LABEL}
              </a>
            </p>
          </div>

          {columns.map((col) => (
            <Column key={col.title} title={col.title} links={col.links} />
          ))}
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted transition-colors hover:text-[#163300]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col items-start justify-between gap-3 text-sm text-muted md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} Phi Movers Ltd. All rights reserved.</p>
            <p>Fully insured · Fixed-price quotes · All 32 London boroughs</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
