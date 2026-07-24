"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import { useClientLeads } from "@/components/client/ClientLeadsProvider";
import { Icon } from "@/components/icons";
import { PHONE_HREF, WHATSAPP_HREF } from "@/lib/contact";
import {
  formatLeadTime,
  LEAD_STATUSES,
  type LeadStatus,
} from "@/lib/leads/types";

const STEPS: LeadStatus[] = ["new", "contacted", "quoted", "booked"];

export default function ClientQuoteDetailPage() {
  const { id } = useParams();
  const { leads, loading } = useClientLeads();
  const lead = useMemo(
    () => leads.find((l) => l.id === String(id)) ?? null,
    [leads, id],
  );

  if (loading && !lead) {
    return <p className="py-16 text-center text-sm text-muted">Loading…</p>;
  }

  if (!lead) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted">Quote not found.</p>
        <Link href="/client/quotes" className="btn mt-4 bg-[#9fe870] px-4 text-[#163300]">
          Back
        </Link>
      </div>
    );
  }

  const idx = STEPS.indexOf(lead.status);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link
        href="/client/quotes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-[#163300]"
      >
        <Icon name="arrowLeft" className="h-4 w-4" />
        Quotes
      </Link>

      <header className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-extrabold lg:text-2xl">{lead.service}</h1>
          <LeadStatusBadge status={lead.status} />
        </div>
        <p className="mt-1 text-xs text-muted">
          Updated {formatLeadTime(lead.updatedAt)}
        </p>
        <p className="mt-3 text-sm font-semibold">
          {lead.from} → {lead.to}
        </p>
        {lead.quoteAmount && (
          <p className="mt-4 rounded-xl border border-[#9fe870]/50 bg-[#9fe870]/20 px-4 py-3 text-base font-extrabold text-[#163300]">
            Your quote: {lead.quoteAmount}
          </p>
        )}
      </header>

      {lead.status !== "lost" ? (
        <section className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
            Progress
          </h2>
          <ol className="mt-4 space-y-3">
            {STEPS.map((s, i) => {
              const done = idx >= i;
              const current = idx === i;
              const label =
                LEAD_STATUSES.find((x) => x.value === s)?.label ?? s;
              return (
                <li key={s} className="flex items-center gap-3">
                  <span
                    className={
                      "grid h-8 w-8 place-items-center rounded-full text-xs font-bold " +
                      (done
                        ? "bg-[#163300] text-[#9fe870]"
                        : "bg-[#f4f5f2] text-[#9ca3af]")
                    }
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={
                      "text-sm font-semibold " +
                      (current ? "text-[#163300]" : "text-muted")
                    }
                  >
                    {label}
                    {current ? " · current" : ""}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      ) : (
        <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          This enquiry is closed. WhatsApp us if you’d like a fresh quote.
        </p>
      )}

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
          Details
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Date</dt>
            <dd className="font-semibold">{lead.date || "Flexible"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Property</dt>
            <dd className="font-semibold">{lead.propertySize}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Submitted</dt>
            <dd className="font-semibold">{formatLeadTime(lead.createdAt)}</dd>
          </div>
        </dl>
      </section>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={PHONE_HREF}
          className="btn justify-center border border-line bg-surface py-3"
        >
          <Icon name="phone" className="h-4 w-4" />
          Call
        </a>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="btn justify-center bg-[#9fe870] py-3 text-[#163300]"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
