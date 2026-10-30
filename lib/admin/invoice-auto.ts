"use client";

// When a job is marked Completed, a draft invoice is made for it, once per booking, so billing is one
// check-and-send away (as on Alpha Movers). It is only a draft: nothing is emailed, and staff check the
// hours and price (the booking's price) before sending.
// Completed here on the dashboard, the draft is made at once. Completed in the app (the crew finishing
// the job on their phone), it is made the next time the invoices page opens (draftsForCompletedBookings).

import type { Booking } from "@/lib/bookings/types";
import { blankInvoice, todayIso, totalsOf, type Invoice } from "./invoice-model";
import { listInvoicesOnce, saveInvoice } from "./invoices";

/** Only recent jobs are swept, so turning this on does not draft invoices for old, already-billed work. */
const SWEEP_DAYS = 14;

const hasInvoice = (b: Booking, all: Invoice[]) =>
  all.some((i) => i.bookingRef === b.bookingNumber.toUpperCase());

export async function draftInvoiceForBooking(
  b: Booking,
  known?: Invoice[],
  authorEmail?: string,
): Promise<Invoice | null> {
  if (b.status !== "completed" || !b.bookingNumber) return null;
  const all = known ?? (await listInvoicesOnce());
  // Any invoice for this booking counts, even a cancelled one, so a draft staff voided is not made again.
  if (hasInvoice(b, all)) return null;

  const today = todayIso();
  const crew = b.moversCount > 0 ? `${b.moversCount} mover${b.moversCount === 1 ? "" : "s"}` : "";
  const description = [b.serviceName || "Removal", crew].filter(Boolean).join(" · ").slice(0, 200);
  // Itemised (hours, then add-ons) while the price is still the booking's own; one line for the total
  // once staff changed it.
  const addons = b.selectedAddons.reduce((n, a) => n + a.price, 0);
  const itemised = b.hours > 0 && b.basePrice > 0 && Math.abs(b.basePrice + addons - b.totalPrice) < 0.01;
  const lines: Invoice["lines"] = itemised
    ? [
        { description, qty: b.hours, unit: "hr", rate: Math.round((b.basePrice / b.hours) * 100) / 100 },
        ...b.selectedAddons.map((a) => ({ description: a.name, qty: 1, unit: "job", rate: a.price })),
      ]
    : [{ description, qty: 1, unit: "job", rate: Math.max(0, b.totalPrice) }];
  const priced = b.totalPrice > 0;
  const paid = b.paymentStatus === "paid" && priced;
  const blank = blankInvoice(today);
  const total = totalsOf({ ...blank, lines }).total;

  const res = await saveInvoice(
    {
      ...blank,
      customer: { name: b.customerName, business: "", address: b.addressLine, email: b.customerEmail, phone: b.customerPhone },
      bookingRef: b.bookingNumber.toUpperCase(),
      jobRef: b.bookingNumber,
      moveDate: b.scheduledDate.slice(0, 10),
      lines,
      payments: paid ? [{ date: today, amount: total, method: b.paymentMethod.replace("_", " "), reference: b.bookingNumber }] : [],
      internalNotes: [
        b.toAddressLine ? `Route: ${b.addressLine} to ${b.toAddressLine}` : "",
        priced ? "Price is the booking price: check the real hours before sending." : "This booking had no price: add it before sending.",
        `Made automatically when ${b.bookingNumber} was completed.`,
      ].filter(Boolean).join("\n"),
    },
    null,
    all.map((i) => i.number),
    authorEmail,
  );
  return res.ok ? res.invoice : null;
}

/** Drafts for recently completed jobs that have no invoice yet. Never throws; returns the numbers made. */
export async function draftsForCompletedBookings(
  bookings: Booking[],
  invoices: Invoice[],
  authorEmail?: string,
): Promise<string[]> {
  const made: string[] = [];
  const since = Date.now() - SWEEP_DAYS * 86400000;
  const all = [...invoices];
  const todo = bookings.filter(
    (b) => b.status === "completed" && b.completedAt && Date.parse(b.completedAt) >= since && !hasInvoice(b, all),
  );
  for (const b of todo.slice(0, 20)) {
    try {
      const inv = await draftInvoiceForBooking(b, all, authorEmail);
      if (inv) {
        all.push(inv);
        made.push(inv.number);
      }
    } catch (err) {
      console.error(`draft invoice skipped for ${b.bookingNumber}`, err);
    }
  }
  return made;
}
