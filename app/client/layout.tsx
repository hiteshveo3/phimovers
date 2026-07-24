import type { Metadata } from "next";
import ClientAuthProvider from "@/components/client/ClientAuthProvider";
import ClientAuthGate from "@/components/client/ClientAuthGate";
import ClientShell from "@/components/client/ClientShell";
import { ClientLeadsProvider } from "@/components/client/ClientLeadsProvider";

export const metadata: Metadata = {
  title: "My Phi — Phi Movers",
  description: "Your Phi Movers quotes, bookings and account.",
  robots: { index: false, follow: false },
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthProvider>
      <ClientAuthGate>
        <ClientLeadsProvider>
          <ClientShell>{children}</ClientShell>
        </ClientLeadsProvider>
      </ClientAuthGate>
    </ClientAuthProvider>
  );
}
