import { bookingStatusMeta, type BookingStatus } from "@/lib/bookings/types";

const TONE: Record<string, string> = {
  "bk-pending": "bg-[#9fe870] text-[#163300]",
  "bk-confirmed": "bg-[#163300]/10 text-[#163300]",
  "bk-live": "bg-amber-100 text-amber-900",
  "bk-done": "bg-[#163300] text-[#9fe870]",
  "bk-cancelled": "bg-stone-200 text-stone-600",
};

export default function ClientBookingBadge({ status }: { status: BookingStatus }) {
  const m = bookingStatusMeta(status);
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${TONE[m.tone]}`}>
      {m.label}
    </span>
  );
}
