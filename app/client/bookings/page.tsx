"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useClientAuth } from "@/components/client/ClientAuthProvider";
import { subscribeClientBookings } from "@/lib/bookings/service";
import ClientBookingBadge from "@/components/client/ClientBookingBadge";
import { STAGES, londonToday, stageOf } from "@/components/client/booking-stage";
import { formatMoveDate, gbp, type Booking } from "@/lib/bookings/types";
import { dayOf } from "@/lib/booking-flow/slots";
import { BOOKING_POLICIES } from "@/kit/site-facts";

// My bookings, after Alpha's my-bookings: Upcoming / Past / Cancelled / All with counts, a search box,
// the next move on top, and a Payments view (what is owed, a row per booking, the policies).

type Filter = "upcoming" | "past" | "cancelled" | "all";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];
const EMPTY: Record<Filter, string> = {
  upcoming: "No moves coming up.",
  past: "No past moves yet.",
  cancelled: "Nothing cancelled.",
  all: "No bookings yet.",
};

const dayOfBooking = (b: Booking) => dayOf(b.scheduledDate) ?? b.scheduledDate.slice(0, 10);

export default function ClientBookingsPage() {
  const { user } = useClientAuth();
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [view, setView] = useState<"bookings" | "payments">("bookings");
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (!user) return;
    return subscribeClientBookings(
      user.uid,
      (r) => {
        setRows(r);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
  }, [user]);

  const today = londonToday();
  const groups = useMemo(() => {
    const isPast = (b: Booking) => b.status === "completed" || (b.status !== "cancelled" && dayOfBooking(b) < today);
    const cancelled = rows.filter((b) => b.status === "cancelled");
    const past = rows.filter((b) => b.status !== "cancelled" && isPast(b)).sort((a, b) => dayOfBooking(b).localeCompare(dayOfBooking(a)));
    const upcoming = rows.filter((b) => b.status !== "cancelled" && !isPast(b)).sort((a, b) => dayOfBooking(a).localeCompare(dayOfBooking(b)));
    return { upcoming, past, cancelled, all: rows } as Record<Filter, Booking[]>;
  }, [rows, today]);

  const t = term.trim().toLowerCase();
  const list = groups[filter].filter((b) => !t || [b.bookingNumber, b.serviceName, b.addressLine, b.toAddressLine].some((v) => v.toLowerCase().includes(t)));
  const nextMove = groups.upcoming[0];
  const payable = rows.filter((b) => b.status !== "cancelled");
  const owed = payable.filter((b) => b.status === "completed" && b.paymentStatus !== "paid").reduce((n, b) => n + b.totalPrice, 0);

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="hidden text-3xl font-extrabold tracking-tight lg:block">My bookings</h1>
          <p className="text-sm text-muted">{loading ? "Loading…" : `${rows.length} total`}</p>
        </div>
        <Link href="/client/bookings/new" className="rounded-full bg-[#9fe870] px-5 py-2.5 text-sm font-bold text-[#163300]">Book a move</Link>
      </header>

      <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-line" role="tablist" aria-label="View">
        {(["bookings", "payments"] as const).map((v) => (
          <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className={"rounded-full px-4 py-2 text-sm font-bold " + (view === v ? "bg-[#163300] text-[#9fe870]" : "text-muted")}>
            {v === "bookings" ? "Bookings" : "Payments"}
          </button>
        ))}
      </div>

      {error && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>}

      {loading ? (
        <div className="space-y-2" aria-busy="true">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-stone-200" />)}
        </div>
      ) : view === "payments" ? (
        <section className="space-y-3">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-sm text-muted">Owed for finished moves</p>
            <p className="text-3xl font-extrabold">{gbp(owed)}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted">{BOOKING_POLICIES.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {payable.length === 0 && <li className="px-4 py-8 text-center text-sm text-muted">Nothing to pay.</li>}
            {payable.map((b) => (
              <li key={b.id}>
                <Link href={`/client/bookings/${b.id}`} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="min-w-0">
                    <b className="block truncate">{b.bookingNumber} · {b.serviceName}</b>
                    <span className="text-xs text-muted">{formatMoveDate(b.scheduledDate)}</span>
                  </span>
                  <span className="text-right text-sm">
                    <b className="block">{b.totalPrice > 0 ? gbp(b.totalPrice) : "Priced on a call"}</b>
                    <span className="text-xs text-muted">{b.paymentStatus === "paid" ? "Paid" : b.paymentStatus === "refunded" ? "Refunded" : b.status === "completed" ? "Due now" : "Not due yet"}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <>
          {nextMove && (
            <Link href={`/client/bookings/${nextMove.id}`} className="block rounded-2xl bg-[#163300] p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-[#9fe870]">Your next move</p>
              <p className="mt-1 text-xl font-extrabold">{formatMoveDate(nextMove.scheduledDate)} {nextMove.scheduledTime}</p>
              <p className="truncate text-sm opacity-80">{nextMove.serviceName} · {nextMove.addressLine}{nextMove.toAddressLine ? ` → ${nextMove.toAddressLine}` : ""}</p>
              <p className="mt-2 text-xs">{STAGES[Math.max(0, stageOf(nextMove.status, dayOfBooking(nextMove), today))]}</p>
            </Link>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1" role="tablist" aria-label="Filter bookings">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} onClick={() => setFilter(f.id)}
                  className={"rounded-full px-3.5 py-2 text-sm font-bold " + (filter === f.id ? "bg-[#9fe870] text-[#163300]" : "bg-white text-muted ring-1 ring-line")}>
                  {f.label} <span className="font-semibold opacity-70">{groups[f.id].length}</span>
                </button>
              ))}
            </div>
            <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search reference or address" aria-label="Search bookings"
              className="min-w-[200px] flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm" />
          </div>

          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {list.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted">
                {t ? "Nothing matches that search." : EMPTY[filter]}{" "}
                {!t && filter !== "cancelled" && <Link href="/client/bookings/new" className="font-bold text-[#163300] underline">Book a move</Link>}
              </li>
            )}
            {list.map((b) => (
              <li key={b.id}>
                <Link href={`/client/bookings/${b.id}`} className="block px-4 py-4 active:bg-[#9fe870]/15 lg:hover:bg-[#9fe870]/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold">{b.serviceName} · {formatMoveDate(b.scheduledDate)}</p>
                      <p className="mt-0.5 truncate text-sm text-muted">{b.addressLine}{b.toAddressLine ? ` → ${b.toAddressLine}` : ""}</p>
                    </div>
                    <ClientBookingBadge status={b.status} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted">
                    <span>{b.bookingNumber}</span>
                    <span>{b.totalPrice > 0 ? gbp(b.totalPrice) : "Priced on a call"} · {b.paymentStatus === "paid" ? "Paid" : "Not paid yet"}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
