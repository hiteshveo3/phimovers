"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useBookings } from "@/components/admin/BookingsProvider";
import { useLeads } from "@/components/admin/LeadsProvider";
import { can } from "@/lib/admin/roles";
import { subscribeInvoices } from "@/lib/admin/invoices";
import type { Invoice } from "@/lib/admin/invoice-model";
import { lastMonths, monthlyReport } from "@/lib/admin/figures";
import { formatGbp } from "@/lib/leads/stats";

// Reports (Alpha app's reports_tab / office_figures): money by the day it was paid, jobs done per month and
// lead conversion. Bookings paid (paidAt) and invoice payments are shown apart: one job can appear in both.

const monthLabel = (m: string) =>
  new Date(`${m}-15T12:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

export default function AdminReportsPage() {
  const { role } = useAdminAuth();
  const { bookings, archived } = useBookings();
  const { leads } = useLeads();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [span, setSpan] = useState<6 | 12>(6);
  const allowed = can(role, "reports");

  useEffect(() => {
    if (!allowed) return undefined;
    try {
      return subscribeInvoices(setInvoices, () => setInvoices([]));
    } catch {
      return undefined;
    }
  }, [allowed]);

  const rows = useMemo(
    () => monthlyReport([...bookings, ...archived], leads, invoices, lastMonths(span)),
    [bookings, archived, leads, invoices, span],
  );
  const total = rows.reduce(
    (t, r) => ({
      paid: t.paid + r.bookingsPaid,
      inv: t.inv + r.invoicePayments,
      jobs: t.jobs + r.jobsDone,
      leads: t.leads + r.leads,
      booked: t.booked + r.leadsBooked,
    }),
    { paid: 0, inv: 0, jobs: 0, leads: 0, booked: 0 },
  );
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");

  if (!allowed) {
    return (
      <div className="ad">
        <div className="ad-card">
          <h1>Reports</h1>
          <p className="ad-muted">Reports are for the owner and finance roles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Reports</p>
          <h1>Money and jobs</h1>
          <p className="ad-sub">By month, London time.</p>
        </div>
        <div className="ad-seg" role="group" aria-label="Range">
          {([6, 12] as const).map((n) => (
            <button key={n} type="button" aria-pressed={span === n} onClick={() => setSpan(n)}>
              {n} months
            </button>
          ))}
        </div>
      </div>

      <div className="ad-kpis">
        <div className="ad-kpi"><b>{formatGbp(total.paid)}</b><span>Bookings paid</span><small>By the day marked paid</small></div>
        <div className="ad-kpi"><b>{formatGbp(total.inv)}</b><span>Invoice payments</span><small>By payment date</small></div>
        <div className="ad-kpi"><b>{total.jobs}</b><span>Jobs completed</span><small>{span} months</small></div>
        <div className="ad-kpi dark"><b>{pct(total.booked, total.leads)}</b><span>Lead conversion</span><small>{total.booked} of {total.leads} leads booked</small></div>
      </div>

      <section className="ad-card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums" }}>
          <thead>
            <tr className="ad-muted ad-small" style={{ textAlign: "right" }}>
              <th style={{ textAlign: "left", padding: "6px 8px" }}>Month</th>
              <th style={{ padding: "6px 8px" }}>Bookings paid</th>
              <th style={{ padding: "6px 8px" }}>Invoice payments</th>
              <th style={{ padding: "6px 8px" }}>Jobs done</th>
              <th style={{ padding: "6px 8px" }}>Leads</th>
              <th style={{ padding: "6px 8px" }}>Booked</th>
            </tr>
          </thead>
          <tbody>
            {[...rows].reverse().map((r) => (
              <tr key={r.month} style={{ borderTop: "1px solid var(--line-strong)", textAlign: "right" }}>
                <td style={{ textAlign: "left", padding: "8px" }}>{monthLabel(r.month)}</td>
                <td style={{ padding: "8px" }}>{formatGbp(r.bookingsPaid)}</td>
                <td style={{ padding: "8px" }}>{formatGbp(r.invoicePayments)}</td>
                <td style={{ padding: "8px" }}>{r.jobsDone}</td>
                <td style={{ padding: "8px" }}>{r.leads}</td>
                <td style={{ padding: "8px" }}>{r.leadsBooked} ({pct(r.leadsBooked, r.leads)})</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ad-muted ad-small" style={{ margin: "10px 0 0" }}>
          Bookings paid before paidAt was recorded (October 2026) have no pay date and are left out.
        </p>
      </section>
    </div>
  );
}
