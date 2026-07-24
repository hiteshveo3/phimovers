"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { useClientAuth } from "./ClientAuthProvider";

const nav = [
  { href: "/client", label: "Home", icon: "dashboard", exact: true },
  { href: "/client/quotes", label: "Quotes", icon: "mail", exact: false },
  { href: "/client/account", label: "Account", icon: "user", exact: false },
];

function active(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, user, logout } = useClientAuth();
  const bare =
    pathname === "/client/login" || pathname === "/client/complete-profile";

  if (bare) {
    return <div className="min-h-screen bg-[#f4f5f2]">{children}</div>;
  }

  const title =
    pathname.startsWith("/client/quotes/")
      ? "Quote"
      : pathname.startsWith("/client/quotes")
        ? "My quotes"
        : pathname.startsWith("/client/account")
          ? "Account"
          : "My moves";

  return (
    <div className="min-h-screen bg-[#f4f5f2] text-content">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-sm lg:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <p className="truncate text-base font-extrabold">{title}</p>
          <Link href="/" aria-label="Website">
            <img
              src="/logo.png"
              alt=""
              className="no-grayscale h-8 w-8 rounded-lg object-cover"
            />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex min-h-screen max-w-[1200px]">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-line bg-surface lg:flex">
          <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
            <img
              src="/logo.png"
              alt=""
              className="no-grayscale h-8 w-8 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-extrabold">My Phi</p>
              <p className="truncate text-[11px] text-muted">
                {profile?.name || user?.email}
              </p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {nav.map((item) => {
              const on = active(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold " +
                    (on
                      ? "bg-[#9fe870] text-[#163300]"
                      : "text-content/80 hover:bg-[#9fe870]/20")
                  }
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="space-y-2 border-t border-line p-4">
            <Link
              href="/#quote"
              className="flex items-center gap-2 text-sm font-medium text-muted hover:text-[#163300]"
            >
              <Icon name="plus" className="h-4 w-4" />
              New quote
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex w-full items-center gap-2 text-sm font-medium text-muted hover:text-[#163300]"
            >
              <Icon name="lock" className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface lg:hidden">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3">
          {nav.map((item) => {
            const on = active(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold " +
                  (on ? "text-[#163300]" : "text-muted")
                }
              >
                <span
                  className={
                    "grid h-8 w-8 place-items-center rounded-xl " +
                    (on ? "bg-[#9fe870]" : "")
                  }
                >
                  <Icon name={item.icon} className="h-5 w-5" />
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
