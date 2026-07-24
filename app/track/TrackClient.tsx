"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { CALL_LABEL, PHONE_HREF, WHATSAPP_HREF } from "@/lib/contact";
import {
  LEAD_STATUSES,
  type PublicLeadView,
  type LeadStatus,
} from "@/lib/leads/types";

const STEPS: LeadStatus[] = ["new", "contacted", "quoted", "booked"];

function statusLabel(s: LeadStatus) {
  return LEAD_STATUSES.find((x) => x.value === s)?.label ?? s;
}

function stepIndex(status: LeadStatus) {
  if (status === "lost") return -1;
  return STEPS.indexOf(status);
}

export default function TrackClient() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lead, setLead] = useState<PublicLeadView | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    setLead(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not find your quote.");
        return;
      }
      setLead(data.lead as PublicLeadView);
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusy(false);
    }
  }

  const idx = useMemo(() => (lead ? stepIndex(lead.status) : 0), [lead]);

  return (
    <main className="relative min-h-screen bg-[#f4f5f2] text-[#163300]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(159,232,112,0.4), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-lg px-4 py-10 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4b5563] hover:text-[#163300]"
        >
          <Icon name="arrowLeft" className="h-4 w-4" />
          Phi Movers
        </Link>

        <header className="mt-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[#163300]/80">
            Customer dashboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Track your quote
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#4b5563]">
            Enter the code from your quote confirmation and the phone number you
            used. No login needed.
          </p>
        </header>

        {!lead ? (
          <form
            onSubmit={onSubmit}
            className="mt-8 space-y-4 rounded-[24px] border border-[#e5e7eb] bg-white p-5 sm:p-6"
          >
            <label className="block text-sm font-semibold">
              Tracking code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB12CD"
                required
                className="mt-1.5 h-12 w-full rounded-xl border border-[#e5e7eb] bg-[#f6f6f4] px-3.5 text-base font-bold tracking-widest text-[#163300] outline-none ring-[#9fe870] focus:ring-2"
                autoComplete="off"
              />
            </label>
            <label className="block text-sm font-semibold">
              Phone on the quote
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07…"
                required
                className="mt-1.5 h-12 w-full rounded-xl border border-[#e5e7eb] bg-[#f6f6f4] px-3.5 text-base text-[#163300] outline-none ring-[#9fe870] focus:ring-2"
                autoComplete="tel"
              />
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn w-full justify-center bg-[#9fe870] py-3.5 text-[#163300] disabled:opacity-60"
            >
              {busy ? "Checking…" : "View status"}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            <section className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#6b7280]">Hi {lead.nameFirst}</p>
                  <h2 className="mt-0.5 text-xl font-extrabold">
                    {lead.service}
                  </h2>
                  <p className="mt-1 text-sm text-[#4b5563]">
                    {lead.from} → {lead.to}
                    {lead.date ? ` · ${lead.date}` : ""}
                  </p>
                </div>
                <span className="rounded-pill bg-[#9fe870]/50 px-3 py-1 text-xs font-bold">
                  {statusLabel(lead.status)}
                </span>
              </div>

              {lead.status === "lost" ? (
                <p className="mt-5 rounded-xl bg-[#f4f5f2] px-3 py-3 text-sm text-[#4b5563]">
                  This enquiry is closed. Message us on WhatsApp if plans
                  changed — happy to requote.
                </p>
              ) : (
                <ol className="mt-6 space-y-3">
                  {STEPS.map((s, i) => {
                    const done = idx >= i;
                    const current = idx === i;
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
                            (current ? "text-[#163300]" : "text-[#6b7280]")
                          }
                        >
                          {statusLabel(s)}
                          {current ? " · current" : ""}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}

              {lead.quoteAmount && (
                <p className="mt-5 rounded-xl border border-[#9fe870]/50 bg-[#9fe870]/20 px-4 py-3 text-sm font-bold">
                  Quote: {lead.quoteAmount}
                </p>
              )}

              <p className="mt-4 text-[11px] text-[#9ca3af]">
                Code {lead.trackCode} · Updated{" "}
                {lead.updatedAt
                  ? new Date(lead.updatedAt).toLocaleString("en-GB")
                  : "—"}
              </p>
            </section>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={PHONE_HREF}
                className="btn justify-center border border-[#e5e7eb] bg-white py-3"
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

            <button
              type="button"
              onClick={() => {
                setLead(null);
                setError("");
              }}
              className="w-full text-center text-sm font-semibold text-[#4b5563]"
            >
              Check another quote
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-[#6b7280]">
          Need help? Call {CALL_LABEL} or WhatsApp us anytime.
        </p>
      </div>
    </main>
  );
}
