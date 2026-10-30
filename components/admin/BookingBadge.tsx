import { bookingStatusMeta, type BookingStatus, type PaymentStatus } from "@/lib/bookings/types";

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const m = bookingStatusMeta(status);
  return <span className={`ad-badge ${m.tone}`}>{m.label}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const label = status === "paid" ? "Paid" : status === "refunded" ? "Refunded" : "Unpaid";
  const tone = status === "paid" ? "bk-paid" : status === "refunded" ? "bk-cancelled" : "bk-unpaid";
  return <span className={`ad-badge ${tone}`}>{label}</span>;
}
