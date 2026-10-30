"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Calendar2 as BookingIcon, CloseCircle as CloseIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { playLeadChime } from "@/lib/admin/sound";
import { formatMoveDate, type Booking } from "@/lib/bookings/types";
import { useBookings } from "./BookingsProvider";

// The new-lead chime and pop-up (NewLeadToast), for booking requests from the site and the app. Bookings
// already there when the dashboard opens never ring; only ones that arrive while it is open.

export default function NewBookingToast() {
  const { bookings, loading } = useBookings();
  const seen = useRef<Set<string> | null>(null);
  const [toast, setToast] = useState<Booking | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!seen.current) {
      seen.current = new Set(bookings.map((b) => b.id));
      return;
    }
    const fresh = bookings.find((b) => !seen.current!.has(b.id) && b.status === "pending");
    bookings.forEach((b) => seen.current!.add(b.id));
    if (fresh) {
      setToast(fresh);
      playLeadChime();
    }
  }, [bookings, loading]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 10000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  return (
    <div className="ad-toast" role="status" aria-live="polite" style={{ bottom: "calc(200px + env(safe-area-inset-bottom))" }}>
      <i>
        <Ico icon={BookingIcon} size={20} />
      </i>
      <div style={{ minWidth: 0, flex: 1 }}>
        <small>New booking request</small>
        <b>{toast.customerName}</b>
        <span>
          {toast.serviceName} · {formatMoveDate(toast.scheduledDate)}
        </span>
        <Link href={`/admin/bookings/${toast.id}`} onClick={() => setToast(null)}>
          Open booking
        </Link>
      </div>
      <button type="button" onClick={() => setToast(null)} aria-label="Dismiss">
        <Ico icon={CloseIcon} size={20} />
      </button>
    </div>
  );
}
