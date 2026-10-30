"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "@/components/admin/EmptyState";
import { useBookings } from "@/components/admin/BookingsProvider";
import { setReviewStatus, subscribeReviews, type BookingReview, type ReviewStatus } from "@/lib/bookings/service";

// Reviews moderation (Alpha app's reviews_tab): customers review a completed booking in the portal or the
// app; the office approves or hides each one. Only approved reviews may be shown on the site (the site
// reads them on the server). Nothing is edited: a review is shown as written or not at all.

const FILTERS: { value: ReviewStatus | "all"; label: string }[] = [
  { value: "pending", label: "To check" },
  { value: "approved", label: "Approved" },
  { value: "hidden", label: "Hidden" },
  { value: "all", label: "All" },
];

export default function AdminReviewsPage() {
  const { bookings, archived } = useBookings();
  const [rows, setRows] = useState<BookingReview[] | null>(null);
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    try {
      return subscribeReviews(setRows, (e) => setError(e.message));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reviews could not be loaded.");
      return undefined;
    }
  }, []);

  const byId = useMemo(() => new Map([...bookings, ...archived].map((b) => [b.id, b])), [bookings, archived]);
  const shown = (rows ?? []).filter((r) => filter === "all" || r.status === filter);

  async function set(r: BookingReview, status: ReviewStatus) {
    setBusy(r.id);
    setError("");
    try {
      await setReviewStatus(r.id, status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not save.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Reviews</p>
          <h1>Customer reviews</h1>
          <p className="ad-sub">Approve the ones that may appear on the website; hide the rest.</p>
        </div>
      </div>
      {error && <p className="ad-banner err" role="alert">{error}</p>}
      <div className="ad-chips" role="group" aria-label="Filter">
        {FILTERS.map((f) => (
          <button key={f.value} type="button" className="ad-chip" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label} <small>{(rows ?? []).filter((r) => f.value === "all" || r.status === f.value).length}</small>
          </button>
        ))}
      </div>
      {rows === null && !error && <p className="ad-loading">Loading…</p>}
      {rows && shown.length === 0 && <EmptyState title="Nothing here" body="Reviews arrive after completed jobs." />}
      <div className="ad-list">
        {shown.map((r) => {
          const b = byId.get(r.bookingId);
          return (
            <div key={r.id} className="ad-card" style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <b aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}{"☆".repeat(Math.max(0, 5 - r.rating))}</b>
                <span className="ad-muted ad-small">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
                  {b ? (
                    <>
                      {" · "}
                      <Link className="ad-link" href={`/admin/bookings/${b.id}`}>{b.customerName} · {b.bookingNumber}</Link>
                    </>
                  ) : null}
                </span>
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{r.comment || <span className="ad-muted">No comment, rating only.</span>}</p>
              <div className="ad-head-actions">
                <button type="button" className="ad-btn sm lime" disabled={busy === r.id || r.status === "approved"} onClick={() => void set(r, "approved")}>
                  Approve
                </button>
                <button type="button" className="ad-btn sm" disabled={busy === r.id || r.status === "hidden"} onClick={() => void set(r, "hidden")}>
                  Hide
                </button>
                {r.moderatedBy && <span className="ad-muted ad-small">{r.status} by {r.moderatedBy}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
