"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, SearchNormal1 as SearchIcon } from "iconsax-reactjs";
import EmptyState from "@/components/admin/EmptyState";
import { useBookings } from "@/components/admin/BookingsProvider";
import { BookingStatusBadge, PaymentBadge } from "@/components/admin/BookingBadge";
import { Ico } from "@/kit/components/Ico";
import { csvName, exportBookingsCsv } from "@/lib/admin/csv";
import { downloadCsv } from "@/lib/leads/stats";
import {
  BOOKING_STATUSES,
  formatMoveDate,
  gbp,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings/types";

type Filter = "all" | "action" | "archived" | BookingStatus;

function matches(b: Booking, q: string) {
  if (!q) return true;
  const hay = [
    b.bookingNumber,
    b.customerName,
    b.customerPhone,
    b.customerEmail,
    b.addressLine,
    b.toAddressLine,
    b.moverName ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

export default function AdminBookingsPage() {
  const { bookings, archived, loading, error } = useBookings();
  const [filter, setFilter] = useState<Filter>("action");
  const [q, setQ] = useState("");

  const base = useMemo(
    () => (filter === "archived" ? archived : bookings).filter((b) => matches(b, q)),
    [bookings, archived, filter, q],
  );
  const needsAction = (b: Booking) =>
    b.status === "pending" || (b.moveRequestedAt && b.status !== "cancelled" && b.status !== "completed");
  const rows = useMemo(() => {
    const list = base.filter((b) =>
      filter === "all" || filter === "archived" ? true : filter === "action" ? needsAction(b) : b.status === filter,
    );
    return filter === "all" || filter === "action" || filter === "archived"
      ? list
      : [...list].sort(
          (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime(),
        );
  }, [base, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length, action: base.filter(needsAction).length, archived: archived.length };
    for (const b of base) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [base, archived]);

  const revenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((n, b) => n + b.totalPrice, 0);
  const outstanding = bookings
    .filter((b) => b.status !== "cancelled" && b.paymentStatus === "unpaid")
    .reduce((n, b) => n + b.totalPrice, 0);

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Bookings</p>
          <h1>Bookings</h1>
          <p className="ad-sub">
            {loading ? "Loading…" : `${rows.length} showing of ${bookings.length}`}
          </p>
        </div>
        <div className="ad-head-actions">
          <button
            type="button"
            className="ad-btn"
            disabled={rows.length === 0}
            onClick={() => downloadCsv(csvName("bookings"), exportBookingsCsv(rows))}
          >
            Export CSV
          </button>
          <Link href="/admin/movers" className="ad-btn">
            Crew
          </Link>
          <Link href="/admin/services" className="ad-btn">
            Services &amp; prices
          </Link>
        </div>
      </div>

      {error && (
        <p className="ad-banner err" role="alert">
          {error}
        </p>
      )}

      <div className="ad-kpis">
        <div className="ad-kpi">
          <span>Need action</span>
          <b>{counts.action ?? 0}</b>
        </div>
        <div className="ad-kpi">
          <span>Upcoming</span>
          <b>{(counts.confirmed ?? 0) + (counts.accepted ?? 0)}</b>
        </div>
        <div className="ad-kpi">
          <span>Paid</span>
          <b>{gbp(revenue)}</b>
        </div>
        <div className="ad-kpi">
          <span>Outstanding</span>
          <b>{gbp(outstanding)}</b>
        </div>
      </div>

      <label className="ad-search">
        <Ico icon={SearchIcon} size={18} />
        <input
          className="ad-input"
          type="search"
          placeholder="Search name, phone, reference or address"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>

      <div className="ad-chips" role="group" aria-label="Filter by status">
        {(
          [
            { value: "action", label: "Needs action" },
            { value: "all", label: "All" },
            ...BOOKING_STATUSES.map((s) => ({ value: s.value, label: s.label })),
            { value: "archived", label: "Archived" },
          ] as { value: Filter; label: string }[]
        ).map((c) => (
          <button
            key={c.value}
            type="button"
            className="ad-chip"
            aria-pressed={filter === c.value}
            onClick={() => setFilter(c.value)}
          >
            {c.label} <small>{counts[c.value] ?? 0}</small>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="ad-loading">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="ad-card">
          <EmptyState
            icon={CalendarIcon}
            title="No bookings here"
            body="Customers book from the website portal or the app. New requests show up in Needs action."
          />
        </div>
      ) : (
        <div className="ad-list">
          {rows.map((b) => (
            <Link key={b.id} href={`/admin/bookings/${b.id}`} className="ad-lead on-grey">
              <div className="ad-lead-main">
                <strong>
                  {b.customerName}
                  <BookingStatusBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                  {b.moveRequestedAt && b.status !== "cancelled" && b.status !== "completed" && (
                    <span className="ad-badge sla-warn">New date asked</span>
                  )}
                </strong>
                <span>
                  {b.bookingNumber} · {b.serviceName} · {formatMoveDate(b.scheduledDate)}
                  {b.scheduledTime ? ` ${b.scheduledTime}` : ""}
                </span>
                <span>
                  {b.addressLine} → {b.toAddressLine}
                </span>
                {b.moverName && <span>Crew: {b.moverName}</span>}
              </div>
              <div className="ad-lead-side">
                <b>{gbp(b.totalPrice)}</b>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
