"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { subscribeBookings } from "@/lib/bookings/service";
import type { Booking } from "@/lib/bookings/types";
import { useAdminAuth } from "./AdminAuthProvider";

type Ctx = {
  /** Every booking but the archived ones (soft-deleted; lib/bookings/service.ts archiveBooking). */
  bookings: Booking[];
  /** Archived bookings, for the "Archived" filter. */
  archived: Booking[];
  loading: boolean;
  error: string;
  /** New, unconfirmed requests (the number staff must act on). */
  pending: number;
  /** Customers who asked for another date. */
  changeRequests: number;
};

const BookingsCtx = createContext<Ctx | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const { user, demo } = useAdminAuth();
  const pathname = usePathname();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const skip = pathname === "/admin/login";

  useEffect(() => {
    // Demo mode has no Firebase behind it, so there are no bookings to load.
    if (!user || demo || !isFirebaseConfigured() || skip) {
      setLoading(false);
      return;
    }
    try {
      return subscribeBookings(
        (rows) => {
          setBookings(rows);
          setLoading(false);
          setError("");
        },
        (e) => {
          setError(e.message);
          setLoading(false);
        },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load bookings");
      setLoading(false);
    }
  }, [user, demo, skip]);

  const value = useMemo<Ctx>(() => {
    const live = bookings.filter((b) => !b.archived);
    return {
      bookings: live,
      archived: bookings.filter((b) => b.archived),
      loading,
      error,
      pending: live.filter((b) => b.status === "pending").length,
      changeRequests: live.filter(
        (b) => b.moveRequestedAt && b.status !== "cancelled" && b.status !== "completed",
      ).length,
    };
  }, [bookings, loading, error]);

  return <BookingsCtx.Provider value={value}>{children}</BookingsCtx.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsCtx);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}

export default BookingsProvider;
