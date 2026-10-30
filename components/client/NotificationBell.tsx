"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { markNotificationRead, subscribeMyNotifications } from "@/lib/bookings/service";
import type { BookingNotification } from "@/lib/bookings/types";
import { useClientAuth } from "./ClientAuthProvider";

// The customer's inbox: the notices the office and the server write to notifications/{id} (booking
// confirmed, crew assigned, price updated…). A bell with the unread count; opening an item marks it read.

function when(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
}

export default function NotificationBell({ align = "right" }: { align?: "left" | "right" }) {
  const { user } = useClientAuth();
  const [rows, setRows] = useState<BookingNotification[]>([]);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    return subscribeMyNotifications(user.uid, (r) => setRows(r.slice(0, 30)), () => setRows([]));
  }, [user]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const unread = rows.filter((r) => !r.isRead).length;

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" strokeLinejoin="round" />
          <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-[#163300] px-1 text-[11px] font-bold leading-[18px] text-[#9fe870]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className={"absolute z-50 mt-2 max-h-[70vh] w-[min(88vw,340px)] overflow-auto rounded-2xl border border-line bg-surface p-2 shadow-lg " + (align === "right" ? "right-0" : "left-0")}
        >
          {rows.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">No notifications yet. Updates about your bookings appear here.</p>
          ) : (
            <ul className="divide-y divide-line">
              {rows.map((n) => {
                const body = (
                  <>
                    <p className={"text-sm " + (n.isRead ? "font-semibold" : "font-extrabold")}>{n.title}</p>
                    <p className="text-sm text-muted">{n.body}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{when(n.createdAt)}</p>
                  </>
                );
                const read = () => {
                  if (!n.isRead) void markNotificationRead(n.id).catch(() => undefined);
                  setOpen(false);
                };
                return (
                  <li key={n.id} className={"rounded-xl px-3 py-2.5 " + (n.isRead ? "" : "bg-[#9fe870]/15")}>
                    {n.bookingId ? (
                      <Link href={`/client/bookings/${n.bookingId}`} onClick={read} className="block">{body}</Link>
                    ) : (
                      <button type="button" onClick={read} className="block w-full text-left">{body}</button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
