import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import AdminAuthProvider from "@/components/admin/AdminAuthProvider";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import LeadsProvider from "@/components/admin/LeadsProvider";
import NewLeadToast from "@/components/admin/NewLeadToast";
import ConnectionBanner from "@/components/admin/ConnectionBanner";

export const metadata: Metadata = {
  title: "Admin — Phi Movers",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminAuthGate>
        <LeadsProvider>
          <AdminShell>
            <ConnectionBanner />
            {children}
            <NewLeadToast />
          </AdminShell>
        </LeadsProvider>
      </AdminAuthGate>
    </AdminAuthProvider>
  );
}
