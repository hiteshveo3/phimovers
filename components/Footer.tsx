"use client";

import Link from "next/link";
import { Icon } from "./icons";
import {
  CALL_HREF,
  CALL_LABEL,
  WHATSAPP_HREF,
  EMAIL,
  EMAIL_HREF,
  ADDRESS,
  COMPANY_LEGAL_NAME,
} from "@/lib/contact";

type FooterLink = { label: string; href: string };

const serviceLinks: FooterLink[] = [
  { label: "House Removals", href: "/services/house-removals" },
  { label: "Flat Removals", href: "/services/flat-removals" },
  { label: "Office Removals", href: "/services/office-removals" },
  { label: "Man & Van Hire", href: "/services/man-and-van" },
  { label: "Packing Services", href: "/services/full-packing-service" },
  { label: "Storage Solutions", href: "/services/secure-storage" },
  { label: "Sofa Delivery", href: "/services/sofa-delivery" },
  { label: "Furniture Delivery", href: "/services/furniture-delivery" },
  { label: "Single Item Transport", href: "/services/single-item-delivery" },
  { label: "Student Removals", href: "/services/student-moves" },
  { label: "Piano & Specialist", href: "/services/piano-and-specialist" },
  { label: "All 30 Services →", href: "/services" },
];

const boroughLinks: FooterLink[] = [
  { label: "Camden Removals", href: "/areas/camden" },
  { label: "Islington Removals", href: "/areas/islington" },
  { label: "Hackney Removals", href: "/areas/hackney" },
  { label: "Westminster Removals", href: "/areas/westminster" },
  { label: "Croydon Removals", href: "/areas/croydon" },
  { label: "Barnet Removals", href: "/areas/barnet" },
  { label: "Bromley Removals", href: "/areas/bromley" },
  { label: "Greenwich Removals", href: "/areas/greenwich" },
  { label: "Ealing Removals", href: "/areas/ealing" },
  { label: "Wandsworth Removals", href: "/areas/wandsworth" },
  { label: "Tower Hamlets Removals", href: "/areas/tower-hamlets" },
  { label: "All 33 Boroughs →", href: "/areas" },
];

const popularMoves: FooterLink[] = [
  { label: "Man & Van Bromley", href: "/areas/bromley/man-and-van" },
  { label: "Man & Van Croydon", href: "/areas/croydon/man-and-van" },
  { label: "Man & Van Greenwich", href: "/areas/greenwich/man-and-van" },
  { label: "Man & Van Ealing", href: "/areas/ealing/man-and-van" },
  { label: "House Removals Camden", href: "/areas/camden/house-removals" },
  { label: "House Removals Hackney", href: "/areas/hackney/house-removals" },
  { label: "House Removals Islington", href: "/areas/islington/house-removals" },
  { label: "House Removals Westminster", href: "/areas/westminster/house-removals" },
  { label: "Office Removals London", href: "/services/office-removals" },
  { label: "Secure Storage Barnet", href: "/areas/barnet/secure-storage" },
  { label: "Same Day Moves London", href: "/services/same-day-move" },
  { label: "All Area Combos →", href: "/areas" },
];

const quickLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Get a Free Quote", href: WHATSAPP_HREF },
  { label: "Areas We Cover", href: "/areas" },
  { label: "Pricing Guides", href: "/pricing" },
  { label: "Customer Reviews", href: "/reviews" },
  { label: "Moving Blog & Guides", href: "/blog" },
  { label: "About Phi Movers", href: "/about" },
  { label: "Contact Details", href: "/contact" },
  { label: "Client Portal", href: "/client" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Complaints Procedure", href: "/complaints" },
  { label: "Accessibility Statement", href: "/accessibility" },
];

export default function Footer() {
  return (
    <footer id="site-footer" className="mt-16 border-t border-line bg-[#f8faf5] dark:bg-[#0c1a00]">
      {/* Top Value Badges with HugeIcons */}
      <div className="border-b border-line/70 bg-[#9fe870]/10 py-6">
        <div className="container-page grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
              <Icon name="shield" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-content leading-tight">Fully Insured</p>
              <p className="text-xs text-muted">£50k Goods in Transit & £2M Public Liability</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
              <Icon name="tag" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-content leading-tight">Fixed Price Guarantee</p>
              <p className="text-xs text-muted">No hidden fees on moving day</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
              <Icon name="truck" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-content leading-tight">All 32 Boroughs</p>
              <p className="text-xs text-muted">ULEZ & Congestion compliant fleet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
              <Icon name="star" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-content leading-tight">4.9/5 Rated Movers</p>
              <p className="text-xs text-muted">140+ five-star verified moves</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Column 1: Brand & Contact Info using HugeIcons */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Phi Movers London"
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-black/5"
              />
              <span className="text-xl font-extrabold tracking-tight text-content">
                Phi Movers
              </span>
            </Link>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              London house removals, office moves and man with a van services with clear quotes, access planning and fully insured crews.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#9fe870]/20 text-[#163300] dark:bg-[#9fe870]/10 dark:text-[#9fe870]">
                  <Icon name="mapPin" className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">Find Us</span>
                  <span className="text-[15px] font-medium text-content leading-snug">{ADDRESS}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#9fe870]/20 text-[#163300] dark:bg-[#9fe870]/10 dark:text-[#9fe870]">
                  <Icon name="clock" className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">Opening Hours</span>
                  <span className="text-[15px] font-medium text-content">7:00 AM – 9:00 PM, All Days</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#9fe870]/20 text-[#163300] dark:bg-[#9fe870]/10 dark:text-[#9fe870]">
                  <Icon name="phone" className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">Call Us</span>
                  <a href={CALL_HREF} className="text-[15px] font-semibold text-content hover:text-[#163300] hover:underline">
                    {CALL_LABEL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#9fe870]/20 text-[#163300] dark:bg-[#9fe870]/10 dark:text-[#9fe870]">
                  <Icon name="mail" className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">Email Us</span>
                  <a href={EMAIL_HREF} className="text-[15px] font-medium text-content hover:text-[#163300] hover:underline">
                    {EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#9fe870]/20 text-[#163300] dark:bg-[#9fe870]/10 dark:text-[#9fe870]">
                  <Icon name="whatsapp" className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">WhatsApp</span>
                  <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="text-[15px] font-medium text-content hover:text-[#163300] hover:underline">
                    Chat with Dispatch 24/7
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Our Services (15px font, 1 link per row) */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-bold tracking-tight text-content">Our Services</h4>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-muted transition-colors hover:text-[#163300] hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: London Boroughs (15px font, 1 link per row) */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-bold tracking-tight text-content">London Boroughs</h4>
            <ul className="mt-4 space-y-2.5">
              {boroughLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-muted transition-colors hover:text-[#163300] hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Popular London Moves (15px font, 1 link per row) */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-bold tracking-tight text-content">Popular Moves</h4>
            <ul className="mt-4 space-y-2.5">
              {popularMoves.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-muted transition-colors hover:text-[#163300] hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Quick Links & Company (15px font, 1 link per row) */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-bold tracking-tight text-content">Quick Links</h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-muted transition-colors hover:text-[#163300] hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* London Postcode Coverage Cloud for SEO */}
        <div className="mt-12 rounded-2xl border border-line bg-surface/70 p-5 text-xs text-muted">
          <p className="font-bold text-[14px] text-content">Greater London Coverage & Postcode Areas:</p>
          <p className="mt-1.5 leading-relaxed text-[13px]">
            Phi Movers provides full moving and transport services across all London postcodes: 
            <span className="font-semibold text-content"> Central London</span> (EC1–EC4, WC1–WC2), 
            <span className="font-semibold text-content"> East London</span> (E1–E20, IG1–IG11, RM1–RM15), 
            <span className="font-semibold text-content"> North London</span> (N1–N22, EN1–EN11), 
            <span className="font-semibold text-content"> North West London</span> (NW1–NW11, HA0–HA9), 
            <span className="font-semibold text-content"> South East London</span> (SE1–SE28, BR1–BR8, DA1–DA18), 
            <span className="font-semibold text-content"> South West London</span> (SW1–SW20, CR0–CR9, SM1–SM7, KT1–KT24), 
            and <span className="font-semibold text-content">West London</span> (W1–W14, UB1–UB11, TW1–TW20).
          </p>
        </div>

        {/* Legal & Copyright */}
        <div className="mt-8 border-t border-line pt-6">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[14px] font-medium text-muted transition-colors hover:text-[#163300]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col items-start justify-between gap-2 text-xs text-muted md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {COMPANY_LEGAL_NAME}. All rights reserved.</p>
            <p>Registered in England & Wales · Fully Insured Removals & Storage Specialists</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
