// CSV for the office (Alpha's downloadCustomers): every cell quoted, and a cell that starts with = + - @
// (or a tab / carriage return) gets a leading apostrophe, so Excel and Sheets never run it as a formula
// (CSV formula injection). Shared by the leads, bookings and customers exports.

import type { Booking } from "@/lib/bookings/types";

export function csvCell(v: unknown): string {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: unknown[][]): string {
  return [headers.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\r\n");
}

/** Bookings export (the bookings page; point 347). */
export function exportBookingsCsv(bookings: Booking[]): string {
  return toCsv(
    [
      "bookingNumber", "createdAt", "moveDate", "time", "status", "paymentStatus", "paymentMethod", "paidAt",
      "totalPrice", "priceIsEstimate", "customerName", "customerPhone", "customerEmail", "service", "from", "to",
      "mover", "archived",
    ],
    bookings.map((b) => [
      b.bookingNumber, b.createdAt, b.scheduledDate.slice(0, 10), b.scheduledTime, b.status, b.paymentStatus,
      b.paymentMethod, b.paidAt ?? "", b.totalPrice.toFixed(2), b.priceIsEstimate ? "yes" : "no", b.customerName,
      b.customerPhone, b.customerEmail, b.serviceName, b.addressLine, b.toAddressLine, b.moverName ?? "",
      b.archived ? "yes" : "no",
    ]),
  );
}

/** A dated file name, e.g. phi-bookings-2026-10-21.csv. */
export const csvName = (what: string) => `phi-${what}-${new Date().toISOString().slice(0, 10)}.csv`;

/** Customers export (/admin/customers; point 346). */
export function exportCustomersCsv(rows: import("./figures").Customer[]): string {
  return toCsv(
    ["name", "phone", "email", "leads", "bookings", "paid", "lastActivity"],
    rows.map((c) => [c.name, c.phone, c.email, c.leads, c.bookings, c.paid.toFixed(2), c.lastActivity]),
  );
}
