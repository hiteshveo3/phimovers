"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useClientAuth } from "@/components/client/ClientAuthProvider";
import { QUOTE_DAYS, quoteExpiry } from "@/lib/quote/decision";
import { serviceFromText } from "@/lib/booking-flow/model";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import { useClientLeads } from "@/components/client/ClientLeadsProvider";
import { Icon } from "@/components/icons";
import { EMAIL_HREF, PHONE_HREF } from "@/lib/contact";
import {
  formatLeadTime,
  LEAD_STATUSES,
  type LeadStatus,
} from "@/lib/leads/types";

const STEPS: LeadStatus[] = ["new", "contacted", "quoted", "booked"];

export default function ClientQuoteDetailPage() {
  const { id } = useParams()!;
  const { leads, loading } = useClientLeads();
  const { user } = useClientAuth();
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
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
  const decided = answer || (lead.activity.some((a) => /^Customer accepted/.test(a.text)) ? "accepted" : lead.activity.some((a) => /^Customer declined/.test(a.text)) ? "declined" : "");
  const expires = quoteExpiry(lead.activity, lead.updatedAt);
  const expired = Boolean(expires && expires.getTime() < Date.now());
  const bookHref = `/book?${new URLSearchParams({ service: serviceFromText(lead.service) || "house", ...(lead.date ? { date: lead.date } : {}), ...(lead.from ? { from: lead.from } : {}), ...(lead.to ? { to: lead.to } : {}) }).toString()}`;

  async function decide(decision: "accept" | "decline") {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/client/quotes", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` }, body: JSON.stringify({ leadId: lead!.id, decision }) });
      if (r.ok) setAnswer(decision === "accept" ? "accepted" : "declined");
      else setError(r.status === 410 ? "This quote has expired. Call us for a fresh one." : "That did not work. Please try again, or call us.");
    } catch {
      setError("Please check your connection and try again.");
    }
    setBusy(false);
  }

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
          {lead.trackCode && <>Reference <b className="text-[#163300]">{lead.trackCode}</b> · </>}Updated {formatLeadTime(lead.updatedAt)}
        </p>
        <p className="mt-3 text-sm font-semibold">
          {lead.from} → {lead.to}
        </p>
        {lead.quoteAmount && (
          <p className="mt-4 rounded-xl border border-[#9fe870]/50 bg-[#9fe870]/20 px-4 py-3 text-base font-extrabold text-[#163300]">
            Your quote: {lead.quoteAmount}
          </p>
        )}
        {lead.status === "quoted" && lead.quoteAmount && (
          <div className="mt-3 space-y-2">
            {decided === "accepted" ? (
              <p className="text-sm">You accepted this quote. <a href={bookHref} className="font-bold underline">Pick your date and time</a>, or we will call you to book it.</p>
            ) : decided === "declined" ? (
              <p className="text-sm text-muted">You declined this quote. Call us any time for a fresh one.</p>
            ) : expired ? (
              <p className="text-sm text-muted">This quote was valid for {QUOTE_DAYS} days and has expired. Call us for a fresh one.</p>
            ) : (
              <>
                {expires && <p className="text-xs text-muted">Valid until {expires.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Europe/London" })}.</p>}
                <div className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => decide("accept")} className="flex-1 rounded-full bg-[#163300] py-2.5 text-sm font-bold text-[#9fe870] disabled:opacity-50">Accept quote</button>
                  <button type="button" disabled={busy} onClick={() => decide("decline")} className="flex-1 rounded-full border border-line py-2.5 text-sm font-bold disabled:opacity-50">Decline</button>
                </div>
              </>
            )}
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          </div>
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
          This enquiry is closed. Call or email us if you’d like a fresh quote.
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
          href={EMAIL_HREF}
          className="btn justify-center bg-[#9fe870] py-3 text-[#163300]"
        >
          <Icon name="mail" className="h-4 w-4" />
          Email
        </a>
      </div>
    </div>
  );
}
