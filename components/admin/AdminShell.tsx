"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { useAdminAuth } from "./AdminAuthProvider";
import { useLeads } from "./LeadsProvider";

const nav = [
  { href: "/admin", label: "Home", icon: "dashboard", exact: true },
  { href: "/admin/leads", label: "Leads", icon: "mail", exact: false },
  { href: "/admin/settings", label: "More", icon: "menu", exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const { leads } = useLeads();
  const isLogin = pathname === "/admin/login";
  const newCount = leads.filter((l) => l.status === "new").length;

  if (isLogin) {
    return <div className="min-h-screen bg-[#f4f5f2]">{children}</div>;
  }

  const title = pathname.startsWith("/admin/leads/")
    ? "Lead"
    : pathname.startsWith("/admin/leads")
      ? "Leads"
      : pathname.startsWith("/admin/settings")
        ? "Settings"
        : "Overview";

  return (
    <div className="min-h-screen bg-[#f4f5f2] text-content">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-tight">
              {title}
            </p>
            {newCount > 0 && !pathname.startsWith("/admin/leads") && (
              <p className="text-[11px] font-semibold text-[#163300]">
                {newCount} new
              </p>
            )}
          </div>
          <Link href="/" className="shrink-0" aria-label="Website">
            <img
              src="/logo.png"
              alt=""
              className="no-grayscale h-8 w-8 rounded-lg object-cover"
            />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface lg:flex">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
            <img
              src="/logo.png"
              alt=""
              className="no-grayscale h-8 w-8 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-extrabold tracking-tight">Phi Admin</p>
              <p className="truncate text-[11px] text-muted">
                {user?.email ?? "Staff"}
              </p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors " +
                    (active
                      ? "bg-[#9fe870] text-[#163300]"
                      : "text-content/80 hover:bg-[#9fe870]/20")
                  }
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                  <span className="flex-1">
                    {item.label === "More" ? "Settings" : item.label}
                  </span>
                  {item.href === "/admin/leads" && newCount > 0 && (
                    <span className="rounded-pill bg-[#163300] px-2 py-0.5 text-[10px] font-bold text-[#9fe870]">
                      {newCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 border-t border-line p-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-muted hover:text-[#163300]"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              Website
            </Link>
            {user && (
              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center gap-2 text-sm font-medium text-muted hover:text-[#163300]"
              >
                <Icon name="lock" className="h-4 w-4" />
                Sign out
              </button>
            )}
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface lg:hidden">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3">
          {nav.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold " +
                  (active ? "text-[#163300]" : "text-muted")
                }
              >
                <span
                  className={
                    "relative grid h-8 w-8 place-items-center rounded-xl " +
                    (active ? "bg-[#9fe870]" : "")
                  }
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                  {item.href === "/admin/leads" && newCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#163300] px-1 text-[9px] font-bold text-[#9fe870]">
                      {newCount > 9 ? "9+" : newCount}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
