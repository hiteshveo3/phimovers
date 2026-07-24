"use client";

import Link from "next/link";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import { useClientLeads } from "@/components/client/ClientLeadsProvider";
import { formatLeadTime } from "@/lib/leads/types";

export default function ClientQuotesPage() {
  const { leads, loading, error } = useClientLeads();

  return (
    <div className="space-y-4">
      <header className="hidden lg:block">
        <h1 className="text-3xl font-extrabold tracking-tight">My quotes</h1>
        <p className="mt-1 text-sm text-muted">
          {loading ? "Loading…" : `${leads.length} total`}
        </p>
      </header>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {loading && (
          <li className="px-4 py-10 text-center text-sm text-muted">Loading…</li>
        )}
        {!loading && leads.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted">
            No quotes linked yet.{" "}
            <Link href="/#quote" className="font-bold text-[#163300] underline">
              Request one
            </Link>
          </li>
        )}
        {leads.map((lead) => (
          <li key={lead.id}>
            <Link
              href={`/client/quotes/${lead.id}`}
              className="block px-4 py-4 active:bg-[#9fe870]/15 lg:hover:bg-[#9fe870]/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold">{lead.service}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {lead.from} → {lead.to}
                  </p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>
                  {lead.quoteAmount || "Quote pending"}
                  {lead.date ? ` · ${lead.date}` : ""}
                </span>
                <span>{formatLeadTime(lead.createdAt)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
