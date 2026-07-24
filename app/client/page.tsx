"use client";

import Link from "next/link";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import { useClientAuth } from "@/components/client/ClientAuthProvider";
import { useClientLeads } from "@/components/client/ClientLeadsProvider";
import { Icon } from "@/components/icons";
import { CALL_LABEL, PHONE_HREF, WHATSAPP_HREF } from "@/lib/contact";
import { formatLeadTime } from "@/lib/leads/types";

export default function ClientDashboardPage() {
  const { profile } = useClientAuth();
  const { leads, loading, error } = useClientLeads();
  const active = leads.filter((l) => l.status !== "lost" && l.status !== "booked");
  const booked = leads.filter((l) => l.status === "booked");
  const recent = leads.slice(0, 5);

  return (
    <div className="space-y-5 lg:space-y-8">
      <header className="hidden lg:block">
        <p className="text-xs font-bold uppercase tracking-wide text-[#163300]">
          Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          Hi {profile?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Your quotes and bookings in one place.
        </p>
      </header>

      <p className="text-lg font-extrabold lg:hidden">
        Hi {profile?.name?.split(" ")[0] || "there"}
      </p>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Open quotes", value: active.length },
          { label: "Booked", value: booked.length },
          { label: "All quotes", value: leads.length },
          {
            label: "Quoted £",
            value: leads.filter((l) => l.quoteAmount).length,
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-line bg-surface p-4 lg:p-5"
          >
            <p className="text-xs font-semibold text-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold">
              {loading ? "—" : c.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-2 sm:grid-cols-3">
        <Link
          href="/#quote"
          className="btn justify-center bg-[#9fe870] py-3.5 text-[#163300]"
        >
          <Icon name="plus" className="h-4 w-4" />
          New quote
        </Link>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="btn justify-center border border-line bg-surface py-3.5"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={PHONE_HREF}
          className="btn justify-center border border-line bg-surface py-3.5"
        >
          <Icon name="phone" className="h-4 w-4" />
          Call {CALL_LABEL}
        </a>
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-sm font-bold">Recent activity</h2>
          <Link href="/client/quotes" className="text-sm font-semibold text-[#163300]">
            See all
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {loading && (
            <li className="px-4 py-8 text-center text-sm text-muted">
              Loading…
            </li>
          )}
          {!loading && recent.length === 0 && (
            <li className="px-4 py-10 text-center">
              <p className="font-bold text-[#163300]">No quotes yet</p>
              <p className="mt-1 text-sm text-muted">
                Request a quote and it will show up here automatically.
              </p>
              <Link
                href="/#quote"
                className="btn mt-4 inline-flex bg-[#9fe870] px-5 text-[#163300]"
              >
                Get a quote
              </Link>
            </li>
          )}
          {recent.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/client/quotes/${lead.id}`}
                className="block px-4 py-3.5 active:bg-[#9fe870]/15 lg:hover:bg-[#9fe870]/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{lead.service}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {lead.from} → {lead.to}
                      {lead.quoteAmount ? ` · ${lead.quoteAmount}` : ""}
                    </p>
                  </div>
                  <LeadStatusBadge status={lead.status} />
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  {formatLeadTime(lead.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
