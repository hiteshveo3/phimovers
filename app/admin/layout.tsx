import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import AdminAuthProvider from "@/components/admin/AdminAuthProvider";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import LeadsProvider from "@/components/admin/LeadsProvider";
import BookingsProvider from "@/components/admin/BookingsProvider";
import NewLeadToast from "@/components/admin/NewLeadToast";
import NewBookingToast from "@/components/admin/NewBookingToast";
import ConnectionBanner from "@/components/admin/ConnectionBanner";
import { ADMIN_CSS, ADMIN_FONT_LINKS } from "@/lib/admin/admin-css";

export const metadata: Metadata = {
  title: "Staff dashboard — Phi Movers",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Design tokens + fonts live only while /admin is mounted, so the public pages are untouched. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {ADMIN_FONT_LINKS.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      <AdminAuthProvider>
        <AdminAuthGate>
          <LeadsProvider>
            <BookingsProvider>
              <AdminShell>
                <ConnectionBanner />
                {children}
                <NewLeadToast />
                <NewBookingToast />
              </AdminShell>
            </BookingsProvider>
          </LeadsProvider>
        </AdminAuthGate>
      </AdminAuthProvider>
    </>
  );
}
