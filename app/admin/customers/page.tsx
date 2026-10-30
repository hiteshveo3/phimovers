"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SearchNormal1 as SearchIcon } from "iconsax-reactjs";
import EmptyState from "@/components/admin/EmptyState";
import { useBookings } from "@/components/admin/BookingsProvider";
import { useLeads } from "@/components/admin/LeadsProvider";
import { Ico } from "@/kit/components/Ico";
import { csvName, exportCustomersCsv } from "@/lib/admin/csv";
import { mergeCustomers } from "@/lib/admin/figures";
import { downloadCsv, formatGbp } from "@/lib/leads/stats";

// Customers (Alpha's CustomerList): everyone who sent a quote or booked, merged by phone (else email), with
// their leads and bookings. Website chats are in Chats; they carry no phone until a quote is sent.

export default function AdminCustomersPage() {
  const { leads, loading: leadsLoading } = useLeads();
  const { bookings, archived, loading } = useBookings();
  const [q, setQ] = useState("");
  const all = useMemo(() => mergeCustomers(leads, [...bookings, ...archived]), [leads, bookings, archived]);
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return all;
    const digits = t.replace(/\D/g, "");
    return all.filter(
      (c) =>
        c.name.toLowerCase().includes(t) ||
        c.email.toLowerCase().includes(t) ||
        (digits.length >= 3 && c.phone.replace(/\D/g, "").includes(digits)),
    );
  }, [all, q]);

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Customers</p>
          <h1>Customers</h1>
          <p className="ad-sub">{leadsLoading || loading ? "Loading…" : `${rows.length} of ${all.length}`}</p>
        </div>
        <div className="ad-head-actions">
          <button
            type="button"
            className="ad-btn"
            disabled={rows.length === 0}
            onClick={() => downloadCsv(csvName("customers"), exportCustomersCsv(rows))}
          >
            Export CSV
          </button>
        </div>
      </div>

      <label className="ad-search">
        <Ico icon={SearchIcon} size={18} />
        <input
          className="ad-input"
          type="search"
          placeholder="Search name, phone or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>

      {rows.length === 0 && !(leadsLoading || loading) && (
        <EmptyState title="No customers yet" body="Quotes and bookings appear here, one row per person." />
      )}

      <div className="ad-list">
        {rows.slice(0, 300).map((c) => (
          <div key={c.key} className="ad-lead-row" style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <span style={{ display: "grid", minWidth: 0 }}>
              <b>{c.name || "No name"}</b>
              <span className="ad-muted ad-small">
                {[c.phone, c.email].filter(Boolean).join(" · ")}
              </span>
              <span className="ad-small">
                {c.leads} quote{c.leads === 1 ? "" : "s"} · {c.bookings} booking{c.bookings === 1 ? "" : "s"}
                {c.paid ? ` · ${formatGbp(c.paid)} paid` : ""}
                {c.bookingIds[0] && (
                  <>
                    {" · "}
                    <Link className="ad-link" href={`/admin/bookings/${c.bookingIds[0]}`}>latest booking</Link>
                  </>
                )}
                {c.leadIds[0] && (
                  <>
                    {" · "}
                    <Link className="ad-link" href={`/admin/leads/${c.leadIds[0]}`}>latest quote</Link>
                  </>
                )}
              </span>
            </span>
            <span className="ad-head-actions" style={{ gap: 6 }}>
              {c.phone && <a className="ad-btn sm lime" href={`tel:${c.phone}`}>Call</a>}
              {c.email && <a className="ad-btn sm" href={`mailto:${c.email}`}>Email</a>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
