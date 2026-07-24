"use client";

import { usePathname } from "next/navigation";

/** Mobile bottom padding only on public pages (BottomNav hidden on /admin + /client). */
export default function BodyPad({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname?.startsWith("/admin") || pathname?.startsWith("/client");
  return (
    <div className={bare ? "min-h-screen" : "pb-16 lg:pb-0"}>{children}</div>
  );
}
