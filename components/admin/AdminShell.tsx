"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown2 as ChevronDownIcon,
  ArrowLeft2 as ChevronLeftIcon,
  ArrowRight2 as ChevronRightIcon,
  Calendar as CalendarIcon,
  Calendar2 as BookingIcon,
  Box as ServicesIcon,
  Category as CategoryIcon,
  CloseCircle as CloseIcon,
  Global as GlobalIcon,
  HamburgerMenu as MoreIcon,
  Logout as LogoutIcon,
  Messages2 as ChatsIcon,
  Receipt21 as ReceiptIcon,
  Setting2 as SettingsIcon,
  Chart2 as ReportsIcon,
  People as CustomersIcon,
  Star1 as ReviewsIcon,
  Sms as MailIcon,
  User as UserIcon,
} from "iconsax-reactjs";
import { Ico, type IconType } from "@/kit/components/Ico";
import { BRAND } from "@/kit/site-facts";
import { can, type Permission } from "@/lib/admin/roles";
import { useAdminAuth } from "./AdminAuthProvider";
import { useLeads } from "./LeadsProvider";
import { useBookings } from "./BookingsProvider";
import { OfficeAIProvider, OfficeAssistantFab, useOfficeAI } from "./OfficeAssistant";

/** `perm`: shown only to roles that have it (lib/admin/roles.ts). */
type Nav = { href: string; label: string; icon: IconType; exact?: boolean; perm?: Permission };

const OFFICE: Nav[] = [
  { href: "/admin", label: "Overview", icon: CategoryIcon, exact: true },
  { href: "/admin/leads", label: "Leads", icon: MailIcon, perm: "leads" },
  { href: "/admin/bookings", label: "Bookings", icon: BookingIcon, perm: "bookings" },
  { href: "/admin/jobs", label: "Calendar", icon: CalendarIcon, perm: "bookings" },
  { href: "/admin/customers", label: "Customers", icon: CustomersIcon, perm: "bookings" },
  { href: "/admin/invoices", label: "Invoices", icon: ReceiptIcon, perm: "invoices" },
  { href: "/admin/reports", label: "Reports", icon: ReportsIcon, perm: "reports" },
  { href: "/admin/chats", label: "Chats", icon: ChatsIcon, perm: "chats" },
  { href: "/admin/reviews", label: "Reviews", icon: ReviewsIcon, perm: "leads" },
  { href: "/admin/movers", label: "Crew", icon: UserIcon, perm: "crew" },
  { href: "/admin/services", label: "Services", icon: ServicesIcon },
];
const ACCOUNT: Nav[] = [
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];
const TABS: Nav[] = [
  { href: "/admin", label: "Home", icon: CategoryIcon, exact: true },
  { href: "/admin/leads", label: "Leads", icon: MailIcon, perm: "leads" },
  { href: "/admin/bookings", label: "Bookings", icon: BookingIcon, perm: "bookings" },
  { href: "/admin/invoices", label: "Invoices", icon: ReceiptIcon, perm: "invoices" },
];
const RAIL_KEY = "phi-office-rail";

function isActive(pathname: string, n: Nav) {
  if (n.exact) return pathname === n.href;
  return pathname === n.href || pathname.startsWith(n.href + "/");
}

function SideGroup({
  name,
  open,
  onToggle,
  children,
}: {
  name: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`sh-group${open ? "" : " is-closed"}`}>
      <button
        type="button"
        className="sh-group-h"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="sh-lbl">{name}</span>
        <Ico icon={ChevronDownIcon} size={14} />
      </button>
      <div className="sh-group-body">
        <div className="sh-group-list">{children}</div>
      </div>
    </div>
  );
}

/** "Ask AI" on every screen but Home, where it is a card on the page itself. */
function AskAiButton({ pathname }: { pathname: string }) {
  const ai = useOfficeAI();
  return pathname === "/admin" ? null : <OfficeAssistantFab ai={ai} />;
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  if (pathname === "/admin/login") return <>{children}</>;
  return (
    <OfficeAIProvider>
      <Shell pathname={pathname}>{children}</Shell>
      <AskAiButton pathname={pathname} />
    </OfficeAIProvider>
  );
}

function Shell({ children, pathname }: { children: ReactNode; pathname: string }) {
  const { user, logout, demo, role } = useAdminAuth();
  const allowed = (n: Nav) => !n.perm || can(role, n.perm);
  const { leads } = useLeads();
  const { pending: pendingBookings, changeRequests } = useBookings();
  const bookingAlerts = pendingBookings + changeRequests;
  const [more, setMore] = useState(false);
  const [rail, setRail] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({
    Office: true,
    Account: true,
    Website: true,
  });
  const newCount = leads.filter((l) => l.status === "new").length;

  useEffect(() => {
    try {
      setRail(localStorage.getItem(RAIL_KEY) === "1");
    } catch {
      /* storage blocked: sidebar starts open */
    }
  }, []);

  useEffect(() => {
    setMore(false);
  }, [pathname]);

  useEffect(() => {
    if (!more) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [more]);

  const toggleRail = () =>
    setRail((r) => {
      const next = !r;
      try {
        localStorage.setItem(RAIL_KEY, next ? "1" : "0");
      } catch {
        /* choice lasts for this page only */
      }
      return next;
    });
  const toggleGroup = (name: string) =>
    setOpen((o) => ({ ...o, [name]: !o[name] }));

  const email = user?.email ?? "Staff";
  const moreCurrent = isActive(pathname, ACCOUNT[0]);

  const link = (n: Nav) => (
    <Link
      key={n.href}
      href={n.href}
      className="sh-row"
      title={n.label}
      aria-current={isActive(pathname, n) ? "page" : undefined}
    >
      <Ico icon={n.icon} size={20} />
      <span className="sh-lbl">{n.label}</span>
      {n.href === "/admin/leads" && newCount > 0 && (
        <span className="sh-count">{newCount}</span>
      )}
      {n.href === "/admin/bookings" && bookingAlerts > 0 && (
        <span className="sh-count">{bookingAlerts}</span>
      )}
    </Link>
  );

  return (
    <div className={`sh${rail ? " is-rail" : ""}`}>
      <aside className={`sh-side${rail ? " is-rail" : ""}`} aria-label="Staff menu">
        <div className="sh-side-top">
          <Link href="/admin" className="sh-brand">
            <b><img src="/brand/phi-movers-icon-192.png" alt="" width={26} height={26} style={{ display: 'inline-block', width: 26, height: 26, borderRadius: 8, marginRight: 8, verticalAlign: 'middle' }} />{BRAND}</b>
            <small>Staff</small>
          </Link>
          <button
            type="button"
            className="sh-toggle"
            aria-label={rail ? "Open the menu" : "Collapse the menu"}
            aria-expanded={!rail}
            onClick={toggleRail}
          >
            <Ico icon={rail ? ChevronRightIcon : ChevronLeftIcon} size={18} />
          </button>
        </div>
        <nav aria-label="Staff sections">
          <SideGroup name="Office" open={open.Office} onToggle={() => toggleGroup("Office")}>
            {OFFICE.filter(allowed).map(link)}
          </SideGroup>
          <SideGroup name="Account" open={open.Account} onToggle={() => toggleGroup("Account")}>
            {ACCOUNT.map(link)}
          </SideGroup>
          <SideGroup name="Website" open={open.Website} onToggle={() => toggleGroup("Website")}>
            <a href="/" className="sh-row" title="View website">
              <Ico icon={GlobalIcon} size={20} />
              <span className="sh-lbl">View website</span>
            </a>
          </SideGroup>
        </nav>
        <div className="sh-side-foot">
          <div className="sh-who-card">
            <i aria-hidden="true">
              <Ico icon={UserIcon} size={18} />
            </i>
            <span title={email}>{email}</span>
            <button type="button" onClick={() => logout()}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <header className="sh-top">
        <Link href="/admin" className="sh-brand">
          <b><img src="/brand/phi-movers-icon-192.png" alt="" width={26} height={26} style={{ display: 'inline-block', width: 26, height: 26, borderRadius: 8, marginRight: 8, verticalAlign: 'middle' }} />{BRAND}</b>
          <small>{demo ? "Staff · demo" : "Staff"}</small>
        </Link>
        <div className="sh-end">
          <Link
            href="/admin/leads?status=new"
            className="sh-icon"
            aria-label={`${newCount} new leads`}
          >
            <Ico icon={MailIcon} size={22} />
            {newCount > 0 && (
              <span className="sh-dot">{newCount > 9 ? "9+" : newCount}</span>
            )}
          </Link>
        </div>
      </header>

      <main id="main" className="sh-main">
        {children}
      </main>

      <nav className="sh-tabs" aria-label="Staff tabs">
        {TABS.filter(allowed).map((t) => {
          const cur = isActive(pathname, t);
          return (
            <Link
              key={t.href}
              href={t.href}
              className="sh-tab"
              aria-current={cur ? "page" : undefined}
            >
              <Ico icon={t.icon} size={24} variant={cur ? "Bold" : "Linear"} />
              {t.label}
              {t.href === "/admin/leads" && newCount > 0 && (
                <span className="sh-dot">{newCount > 9 ? "9+" : newCount}</span>
              )}
              {t.href === "/admin/bookings" && bookingAlerts > 0 && (
                <span className="sh-dot">{bookingAlerts > 9 ? "9+" : bookingAlerts}</span>
              )}
            </Link>
          );
        })}
        <button
          type="button"
          className="sh-tab"
          aria-current={moreCurrent ? "page" : undefined}
          aria-expanded={more}
          onClick={() => setMore(true)}
        >
          <Ico icon={MoreIcon} size={24} variant={moreCurrent ? "Bold" : "Linear"} />
          More
        </button>
      </nav>

      {more && (
        <div className="sh-sheet" role="dialog" aria-modal="true" aria-label="More">
          <button type="button" aria-label="Close" onClick={() => setMore(false)} />
          <div className="sh-sheet-panel">
            <h2>More</h2>
            <Link
              href="/admin/settings"
              className="sh-row"
              aria-current={moreCurrent ? "page" : undefined}
            >
              <Ico icon={SettingsIcon} size={22} />
              Settings
            </Link>
            <Link href="/admin/chats" className="sh-row" aria-current={isActive(pathname, { href: "/admin/chats", label: "Chats", icon: ChatsIcon }) ? "page" : undefined}>
              <Ico icon={ChatsIcon} size={22} />
              Website chats
            </Link>
            <a href="/" className="sh-row">
              <Ico icon={GlobalIcon} size={22} />
              View website
            </a>
            <button type="button" className="sh-row" onClick={() => logout()}>
              <Ico icon={LogoutIcon} size={22} />
              Sign out
            </button>
            <button type="button" className="sh-row" onClick={() => setMore(false)}>
              <Ico icon={CloseIcon} size={22} />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
