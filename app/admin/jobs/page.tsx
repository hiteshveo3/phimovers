"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft2 as PrevIcon,
  ArrowRight2 as NextIcon,
  Calendar as CalendarIcon,
  Call as CallIcon,
  Receipt21 as ReceiptIcon,
} from "iconsax-reactjs";
import EmptyState from "@/components/admin/EmptyState";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import { useLeads } from "@/components/admin/LeadsProvider";
import { Ico } from "@/kit/components/Ico";
import {
  dateFromKey,
  dayKey,
  jobsByDate,
  weekKeys,
} from "@/lib/leads/stats";
import type { Lead } from "@/lib/leads/types";

function Job({ lead }: { lead: Lead }) {
  return (
    <div className="ad-job">
      <div className="ad-kcard-top">
        <Link href={`/admin/leads/${lead.id}`} className="t">
          {lead.name}
        </Link>
        <LeadStatusBadge status={lead.status} />
      </div>
      <p>
        {lead.from} → {lead.to}
      </p>
      <p>
        {lead.service} · {lead.propertySize}
        {lead.quoteAmount ? ` · ${lead.quoteAmount}` : ""}
      </p>
      {lead.assignedTo && <p>Crew lead: {lead.assignedTo}</p>}
      <div className="ad-job-acts">
        <a href={`tel:${lead.phone}`} className="ad-mini lime" aria-label={`Call ${lead.name}`}>
          <Ico icon={CallIcon} size={14} />
          Call
        </a>
        <Link href={`/admin/invoices?lead=${lead.id}`} className="ad-mini">
          <Ico icon={ReceiptIcon} size={14} />
          Invoice
        </Link>
      </div>
    </div>
  );
}

export default function AdminJobsPage() {
  const { leads, loading } = useLeads();
  const [offset, setOffset] = useState(0);
  const [tentative, setTentative] = useState(false);

  const { dated, undated } = useMemo(
    () => jobsByDate(leads, tentative),
    [leads, tentative],
  );
  const week = useMemo(() => weekKeys(offset), [offset]);
  const today = dayKey(new Date());
  const first = dateFromKey(week[0]);
  const last = dateFromKey(week[6]);
  const fmt = (d: Date, withYear = false) =>
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      ...(withYear ? { year: "numeric" } : {}),
    });
  const inWeek = week.reduce((n, k) => n + (dated.get(k)?.length ?? 0), 0);
  const upcoming = useMemo(
    () =>
      [...dated.entries()]
        .filter(([k]) => k >= today)
        .reduce((n, [, v]) => n + v.length, 0),
    [dated, today],
  );
  const noJobs = leads.filter((l) => l.status === "booked").length === 0;

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Calendar</p>
          <h1>Jobs</h1>
          <p className="ad-sub">
            Booked moves by date. {upcoming} upcoming
            {tentative ? " (including quoted)" : ""}.
          </p>
        </div>
        <div className="ad-head-actions">
          <label className="ad-check">
            <input
              type="checkbox"
              checked={tentative}
              onChange={(e) => setTentative(e.target.checked)}
            />
            Show quoted too
          </label>
        </div>
      </div>

      <div className="ad-weeknav">
        <button type="button" className="ad-icon-btn" aria-label="Previous week" onClick={() => setOffset((o) => o - 1)}>
          <Ico icon={PrevIcon} size={18} />
        </button>
        <b>
          {fmt(first)} – {fmt(last, true)}
          <span className="ad-muted ad-small" style={{ marginLeft: 10, fontFamily: "Instrument Sans, sans-serif" }}>
            {inWeek} job{inWeek === 1 ? "" : "s"}
          </span>
        </b>
        <button type="button" className="ad-icon-btn" aria-label="Next week" onClick={() => setOffset((o) => o + 1)}>
          <Ico icon={NextIcon} size={18} />
        </button>
        <button type="button" className="ad-btn sm" disabled={offset === 0} onClick={() => setOffset(0)}>
          This week
        </button>
      </div>

      {loading ? (
        <p className="ad-loading">Loading…</p>
      ) : noJobs && !tentative ? (
        <div className="ad-card">
          <EmptyState
            icon={CalendarIcon}
            title="No booked jobs yet"
            body="When a lead is marked as booked with a move date, it shows up here."
            actionHref="/admin/leads?status=quoted"
            actionLabel="See quoted leads"
          />
        </div>
      ) : (
        <div className="ad-week">
          {week.map((k) => {
            const d = dateFromKey(k);
            const jobs = dated.get(k) ?? [];
            return (
              <section
                key={k}
                className={"ad-day" + (k === today ? " today" : "") + (jobs.length === 0 ? " empty" : "")}
                aria-label={d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              >
                <div className="ad-day-h">
                  <span className="ad-date">
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleDateString("en-GB", { weekday: "short" })}</small>
                  </span>
                  <span className="ad-muted ad-small">
                    {jobs.length === 0 ? "No jobs" : `${jobs.length} job${jobs.length === 1 ? "" : "s"}`}
                  </span>
                </div>
                {jobs.map((l) => (
                  <Job key={l.id} lead={l} />
                ))}
              </section>
            );
          })}
        </div>
      )}

      {undated.length > 0 && (
        <section className="ad-card">
          <h2>Booked, no move date</h2>
          <p className="ad-muted" style={{ marginTop: -6 }}>
            Add a date to the lead so it appears in the calendar.
          </p>
          <div className="ad-list">
            {undated.map((l) => (
              <Job key={l.id} lead={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
