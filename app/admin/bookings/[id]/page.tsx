"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BookingStatusBadge, PaymentBadge } from "@/components/admin/BookingBadge";
import { useBookings } from "@/components/admin/BookingsProvider";
import { draftInvoiceForBooking } from "@/lib/admin/invoice-auto";
import {
  approveDateChange,
  archiveBooking,
  assignMover,
  declineDateChange,
  deleteBooking,
  listMovers,
  setBookingNote,
  setBookingPayment,
  setBookingPrice,
  setBookingStatus,
  subscribeBooking,
  subscribeBookingPrivate,
} from "@/lib/bookings/service";
import { STAFF_MOVES, canHardDelete, priceLocked } from "@/lib/bookings/status";
import { slotClashes } from "@/lib/bookings/clash";
import {
  PAYMENT_METHODS,
  bookingStatusMeta,
  canCancel,
  formatMoveDate,
  gbp,
  type Booking,
  type BookingPrivate,
  type BookingStatus,
  type Mover,
  type PaymentMethod,
} from "@/lib/bookings/types";

/** Button text for each move in the status table (cancel has its own button). */
const MOVE_LABEL: Partial<Record<BookingStatus, string>> = {
  pending: "Reopen as pending",
  confirmed: "Confirm booking",
  accepted: "Mark crew accepted",
  en_route: "Mark on the way",
  in_progress: "Mark started",
  completed: "Mark completed",
};

const HISTORY_LABEL: Record<string, string> = {
  status: "Status",
  price: "Price",
  payment: "Payment",
  mover: "Crew",
  date: "Date",
  archived: "Archived",
  note: "Office note",
};

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 10, padding: "6px 0" }}>
      <span className="ad-muted ad-small">{k}</span>
      <span style={{ overflowWrap: "anywhere" }}>{children}</span>
    </div>
  );
}

function when(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
}

export default function AdminBookingDetailPage() {
  const id = useParams<{ id: string }>()?.id ?? "";
  const router = useRouter();
  const [b, setB] = useState<Booking | null | undefined>(undefined);
  const [movers, setMovers] = useState<Mover[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [office, setOffice] = useState<BookingPrivate>({ adminNote: null, history: [] });
  const { bookings: all } = useBookings();

  useEffect(() => {
    return subscribeBooking(
      id,
      (x) => {
        setB(x);
        if (x) {
          setPrice(String(x.totalPrice));
          setMethod(x.paymentMethod);
        }
      },
      (e) => setError(e.message),
    );
  }, [id]);

  // The office note and the change history live in bookingsPrivate/{id} (staff only).
  const legacyNote = b?.adminNote ?? null;
  useEffect(() => {
    if (!id) return undefined;
    return subscribeBookingPrivate(
      { id, adminNote: legacyNote },
      (p) => {
        setOffice(p);
        setNote(p.adminNote ?? "");
      },
      (e) => setError(e.message),
    );
  }, [id, legacyNote]);

  const clashesFor = useMemo(
    () => (moverId: string) => (b ? slotClashes(b, moverId, all) : []),
    [b, all],
  );

  useEffect(() => {
    listMovers()
      .then((m) => setMovers(m.filter((x) => x.status === "active")))
      .catch(() => undefined);
  }, []);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (b === undefined) return <p className="ad-loading">Loading…</p>;
  if (b === null) {
    return (
      <div className="ad">
        <div className="ad-card">
          <p>Booking not found.</p>
          <Link href="/admin/bookings" className="ad-btn">
            Back to bookings
          </Link>
        </div>
      </div>
    );
  }

  const booking = b;
  const changeAsked = booking.moveRequestedAt && booking.moveRequestedFrom;
  const open = booking.status !== "cancelled" && booking.status !== "completed";

  const timeline = [
    ["Requested", when(booking.createdAt)],
    ["Crew accepted", when(booking.acceptedAt)],
    ["On the way", when(booking.enRouteAt)],
    ["Started", when(booking.startedAt)],
    ["Completed", when(booking.completedAt)],
    ["Cancelled", when(booking.cancelledAt)],
  ].filter(([, t]) => t) as [string, string][];

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">
            <Link href="/admin/bookings">Bookings</Link> · {booking.bookingNumber}
          </p>
          <h1>{booking.customerName}</h1>
          <p className="ad-sub">
            <BookingStatusBadge status={booking.status} /> <PaymentBadge status={booking.paymentStatus} />
            {booking.archived && <span className="ad-badge bk-cancelled">Archived</span>}
          </p>
        </div>
        <div className="ad-head-actions">
          <a className="ad-btn lime" href={`tel:${booking.customerPhone}`}>
            Call
          </a>
          {booking.customerEmail && (
            <a className="ad-btn" href={`mailto:${booking.customerEmail}`}>
              Email
            </a>
          )}
        </div>
      </div>

      {error && (
        <p className="ad-banner err" role="alert">
          {error}
        </p>
      )}

      {changeAsked && open && (
        <div className="ad-banner">
          <div style={{ flex: 1 }}>
            Customer asked to move this to <b>{formatMoveDate(booking.moveRequestedFrom!)}</b> (asked{" "}
            {when(booking.moveRequestedAt)}).
          </div>
          <button
            type="button"
            className="ad-btn sm lime"
            disabled={busy}
            onClick={() => run(() => approveDateChange(booking))}
          >
            Approve
          </button>
          <button
            type="button"
            className="ad-btn sm"
            disabled={busy}
            onClick={() => run(() => declineDateChange(booking))}
          >
            Decline
          </button>
        </div>
      )}

      <div className="ad-cols">
        <div style={{ display: "grid", gap: 18 }}>
          <section className="ad-card">
            <h2>Move</h2>
            <Row k="Service">
              {booking.serviceName}
              {booking.serviceCategory ? ` · ${booking.serviceCategory}` : ""}
            </Row>
            <Row k="Date">
              {formatMoveDate(booking.scheduledDate)}
              {booking.scheduledTime ? ` · ${booking.scheduledTime}` : ""}
            </Row>
            <Row k="Crew / hours">
              {booking.moversCount} crew · {booking.hours} h
            </Row>
            <Row k="Pickup">
              {booking.addressLine} ({booking.fromFloor || "floor n/a"}, {booking.fromLift ? "lift" : "no lift"})
            </Row>
            <Row k="Drop-off">
              {booking.toAddressLine} ({booking.toFloor || "floor n/a"}, {booking.toLift ? "lift" : "no lift"})
            </Row>
            <Row k="Parking">{booking.parking || "—"}</Row>
            {booking.heavyItems.length > 0 && <Row k="Heavy items">{booking.heavyItems.join(", ")}</Row>}
            {booking.selectedAddons.length > 0 && (
              <Row k="Add-ons">
                {booking.selectedAddons.map((a) => `${a.name} (${gbp(a.price)})`).join(", ")}
              </Row>
            )}
            <Row k="Instructions">{booking.specialInstructions || "—"}</Row>
            <Row k="Customer">
              {booking.customerName} · {booking.customerPhone}
              {booking.customerEmail ? ` · ${booking.customerEmail}` : ""}
            </Row>
          </section>

          {booking.requestPhotos.length > 0 && (
            <section className="ad-card">
              <h2>Customer photos</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
                {booking.requestPhotos.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noreferrer">
                    <img src={u} alt="Customer photo" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 14 }} />
                  </a>
                ))}
              </div>
            </section>
          )}

          {booking.jobPhotos.length > 0 && (
            <section className="ad-card">
              <h2>Crew photos</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
                {booking.jobPhotos.map((p) => (
                  <a key={p.path} href={p.url} target="_blank" rel="noreferrer">
                    <img src={p.url} alt={`${p.kind} photo`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 14 }} />
                    <span className="ad-small ad-muted">{p.kind === "after" ? "After" : "Before"}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="ad-card">
            <h2>Timeline</h2>
            {timeline.map(([k, t]) => (
              <Row key={k} k={k}>
                {t}
              </Row>
            ))}
          </section>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <section className="ad-card">
            <h2>Status</h2>
            <p className="ad-muted" style={{ marginTop: -6 }}>
              {bookingStatusMeta(booking.status).label}
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {booking.status === "confirmed" && booking.moverId === null && (
                <p className="ad-muted ad-small" style={{ margin: 0 }}>
                  Assign a crew member below. They accept the job in the app.
                </p>
              )}
              {/* Only the moves in lib/bookings/status.ts (the rules refuse anything else). */}
              {STAFF_MOVES[booking.status]
                .filter((to) => to !== "cancelled")
                .map((to) => (
                  <button
                    key={to}
                    type="button"
                    className={"ad-btn block" + (to === "confirmed" || to === "completed" ? " lime" : "")}
                    disabled={busy}
                    onClick={() => {
                      if (to === "completed") {
                        if (!window.confirm("Mark this job as completed?")) return;
                        void run(async () => {
                          await setBookingStatus(booking, "completed");
                          // A draft invoice for the job, ready to check and send (once per booking).
                          await draftInvoiceForBooking({ ...booking, status: "completed" }).catch(() => null);
                        });
                        return;
                      }
                      if (to === "pending" && !window.confirm("Reopen this booking as pending?")) return;
                      void run(() => setBookingStatus(booking, to));
                    }}
                  >
                    {MOVE_LABEL[to] ?? bookingStatusMeta(to).label}
                  </button>
                ))}
              {canCancel(booking) && (
                <button
                  type="button"
                  className="ad-btn danger block"
                  disabled={busy}
                  onClick={() => {
                    const reason = window.prompt("Reason for cancelling (the customer is told):", "");
                    if (reason !== null) void run(() => setBookingStatus(booking, "cancelled", reason));
                  }}
                >
                  Cancel booking
                </button>
              )}
            </div>
          </section>

          <section className="ad-card">
            <h2>Crew</h2>
            <label className="ad-field">
              <span>Assigned mover</span>
              <select
                className="ad-select"
                value={booking.moverId ?? ""}
                disabled={busy || !open}
                onChange={(e) => {
                  const m = movers.find((x) => x.uid === e.target.value) ?? null;
                  const clash = m ? clashesFor(m.uid) : [];
                  if (clash.length) {
                    const c = clash[0];
                    const what = c.sameSlot ? "already has a job at that time" : "already has another job that day";
                    if (!window.confirm(`${m!.name} ${what} (${c.booking.bookingNumber}, ${c.booking.scheduledTime || "no time"}). Assign anyway?`)) return;
                  }
                  void run(() => assignMover(booking, m));
                }}
              >
                <option value="">Unassigned</option>
                {movers.map((m) => (
                  <option key={m.uid} value={m.uid}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
            {booking.moverId && clashesFor(booking.moverId).length > 0 && (
              <p className="ad-banner" style={{ margin: 0 }}>
                {booking.moverName} also has{" "}
                {clashesFor(booking.moverId)
                  .map((c) => `${c.booking.bookingNumber}${c.sameSlot ? " at the same time" : ` at ${c.booking.scheduledTime || "no set time"}`}`)
                  .join(", ")}{" "}
                that day.
              </p>
            )}
            {movers.length === 0 && (
              <p className="ad-muted ad-small" style={{ margin: 0 }}>
                No crew yet. <Link href="/admin/movers" className="ad-link">Add a mover</Link>
              </p>
            )}
          </section>

          <section className="ad-card">
            <h2>Price &amp; payment</h2>
            <label className="ad-field">
              <span>Total (£)</span>
              <div className="ad-inline">
                <input
                  className="ad-input"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <button
                  type="button"
                  className="ad-btn"
                  disabled={busy || Number(price) === booking.totalPrice || !(Number(price) >= 0)}
                  onClick={() => {
                    // After payment, completion or cancellation a price change needs a second yes (AUDIT D11).
                    if (
                      priceLocked(booking) &&
                      !window.confirm(
                        `This booking is ${booking.paymentStatus === "paid" ? "paid" : booking.status}. Change the price from ${gbp(booking.totalPrice)} to ${gbp(Number(price))} anyway? The customer is told.`,
                      )
                    )
                      return;
                    void run(() => setBookingPrice(booking, Number(price)));
                  }}
                >
                  Save
                </button>
              </div>
            </label>
            <p className="ad-muted ad-small" style={{ marginTop: -6 }}>
              Base {gbp(booking.basePrice)} + add-ons {gbp(booking.addonsPrice)}
              {booking.priceIsEstimate ? " · estimate until you save a price" : " · confirmed price"}
            </p>
            {booking.paymentStatus === "paid" && (booking.paidAt || booking.paidBy) && (
              <p className="ad-muted ad-small" style={{ marginTop: -6 }}>
                Paid {when(booking.paidAt) ?? ""}{booking.paidBy ? ` · recorded by ${booking.paidBy}` : ""}
              </p>
            )}
            <label className="ad-field">
              <span>Payment method</span>
              <select className="ad-select" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ display: "grid", gap: 8 }}>
              {booking.paymentStatus !== "paid" ? (
                <button
                  type="button"
                  className="ad-btn lime block"
                  disabled={busy}
                  onClick={() => run(() => setBookingPayment(booking, "paid", method))}
                >
                  Mark paid
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="ad-btn block"
                    disabled={busy}
                    onClick={() => run(() => setBookingPayment(booking, "unpaid", method))}
                  >
                    Mark unpaid
                  </button>
                  <button
                    type="button"
                    className="ad-btn block"
                    disabled={busy}
                    onClick={() => run(() => setBookingPayment(booking, "refunded", method))}
                  >
                    Mark refunded
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="ad-card">
            <h2>Internal note</h2>
            <label className="ad-field">
              <span className="ad-muted ad-small">Only staff see this</span>
              <textarea className="ad-textarea" value={note} onChange={(e) => setNote(e.target.value)} />
            </label>
            <button
              type="button"
              className="ad-btn"
              disabled={busy || note.trim() === (office.adminNote ?? "")}
              onClick={() => run(() => setBookingNote(booking, note))}
            >
              Save note
            </button>
          </section>

          {office.history.length > 0 && (
            <section className="ad-card">
              <h2>History</h2>
              {office.history.slice(0, 30).map((h) => (
                <Row key={h.id} k={when(h.at) ?? ""}>
                  <b>{HISTORY_LABEL[h.field] ?? h.field}</b>
                  {h.field === "note" ? ` ${h.to ?? ""}` : `: ${h.from ?? "—"} → ${h.to ?? "—"}`}
                  <span className="ad-muted ad-small"> · {h.by}</span>
                </Row>
              ))}
            </section>
          )}

          <button
            type="button"
            className="ad-btn"
            disabled={busy}
            onClick={() => void run(() => archiveBooking(booking, !booking.archived))}
          >
            {booking.archived ? "Restore from archive" : "Archive booking"}
          </button>
          {canHardDelete(booking) ? (
            <button
              type="button"
              className="ad-btn danger"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Delete this unpaid booking and its photos for good? Archiving keeps it instead.")) {
                  void run(async () => {
                    await deleteBooking(booking);
                    router.replace("/admin/bookings");
                  });
                }
              }}
            >
              Delete booking
            </button>
          ) : (
            <p className="ad-muted ad-small" style={{ margin: 0 }}>
              Paid bookings are kept for the records: archive instead of deleting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
