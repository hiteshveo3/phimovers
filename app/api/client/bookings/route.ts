// What a signed-in customer can ask about their own booking, checked here with the Admin SDK (the
// browser rules only allow a pending cancel and a date request, so everything richer comes through here):
//   POST { action: 'change', bookingId, date?, time?, scope? }  ask for another date, start time or job
//   POST { action: 'cancel', bookingId, reason? }               cancel (pending) or ask to cancel (confirmed)
//   POST { action: 'damage', bookingId, text, photos? }         report damage after the job
//   POST { action: 'message', bookingId, text }                 write to the office about this booking
//   GET  ?bookingId=                                            the booking's messages with the office
// Every request tells the office (dashboard bell + email). The office decides; nothing here moves a date.

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb, isAdminSdkConfigured } from "@/lib/firebase/admin";
import { firebaseCaller } from "@/lib/booking-flow/auth";
import { clientIp, jsonReply, readBody, tooMany } from "@/lib/booking-flow/server";
import { ALL_SLOTS, appTimeLabel, dateBookable, formatDate, slotLabel } from "@/lib/booking-flow/model";
import { SITE_URL, buttons, esc, frame, officeEmail, rows, send, textRows, type Row } from "@/lib/email/layout";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPEN = ["pending", "confirmed", "accepted"];
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b-\u001f<>]/g, " ").trim().slice(0, max) : "");

async function ownBooking(req: Request, bookingId: string) {
  const caller = await firebaseCaller(req);
  if (!caller) return { error: jsonReply({ error: "signin" }, 401) } as const;
  if (!/^[A-Za-z0-9]{8,40}$/.test(bookingId)) return { error: jsonReply({ error: "invalid" }, 400) } as const;
  const ref = getAdminDb().collection("bookings").doc(bookingId);
  const snap = await ref.get();
  if (!snap.exists || snap.get("customerId") !== caller.uid) return { error: jsonReply({ error: "notfound" }, 404) } as const;
  return { caller, ref, b: snap.data() as Record<string, unknown> } as const;
}

async function tellOffice(bookingId: string, b: Record<string, unknown>, title: string, list: Row[]) {
  const number = String(b.bookingNumber ?? "");
  await getAdminDb().collection("adminAlerts").add({
    type: "change_request",
    bookingId,
    bookingNumber: number,
    title,
    body: `${String(b.customerName ?? "")} · ${number}`,
    read: false,
    createdAt: new Date().toISOString(),
  }).catch(() => undefined);
  const all: Row[] = [{ label: "Booking", value: number }, { label: "Customer", value: String(b.customerName ?? "") }, { label: "Phone", value: String(b.customerPhone ?? ""), href: `tel:${String(b.customerPhone ?? "").replace(/[^\d+]/g, "")}` }, ...list];
  await send(officeEmail(), `${title} – ${number}`, frame(esc(title), "From the customer portal. Reply to the customer, then update the booking in the dashboard.", `${buttons([["Open bookings", `${SITE_URL}/admin/bookings`]], "0 0 20px")}${rows(all)}`, `${title} · ${number}`), textRows(all), { replyTo: String(b.customerEmail ?? "") || undefined }).catch((e) => console.error("office email failed", e));
}

export async function GET(req: Request) {
  if (!isAdminSdkConfigured()) return jsonReply({ error: "unavailable" }, 503);
  const own = await ownBooking(req, new URL(req.url).searchParams.get("bookingId") ?? "");
  if ("error" in own) return own.error;
  const snap = await own.ref.collection("messages").orderBy("at", "asc").limit(200).get();
  return jsonReply({ messages: snap.docs.map((d) => ({ id: d.id, from: d.get("from"), text: d.get("text"), at: (d.get("at") as Timestamp | undefined)?.toDate().toISOString() ?? "" })) });
}

export async function POST(req: Request) {
  if (!isAdminSdkConfigured()) return jsonReply({ error: "unavailable" }, 503);
  if (await tooMany(`portal:ip:${clientIp(req)}`, 30, 900)) return jsonReply({ error: "limited" }, 429);
  const body = await readBody<Record<string, unknown>>(req, 8_000);
  if (!body) return jsonReply({ error: "invalid" }, 400);
  const own = await ownBooking(req, String(body.bookingId ?? ""));
  if ("error" in own) return own.error;
  const { ref, b, caller } = own;
  const status = String(b.status ?? "");
  const now = Timestamp.now();

  switch (body.action) {
    case "change": {
      if (!OPEN.includes(status)) return jsonReply({ error: "closed" }, 409);
      const date = clean(body.date, 10);
      const time = clean(body.time, 5);
      const scope = clean(body.scope, 600);
      if (date && !dateBookable(date)) return jsonReply({ error: "date" }, 400);
      if (time && !ALL_SLOTS.includes(time)) return jsonReply({ error: "time" }, 400);
      if (!date && !time && scope.length < 5) return jsonReply({ error: "empty" }, 400);
      const [y, m, d] = (date || "2000-01-01").split("-").map(Number);
      await ref.update({
        moveRequestedAt: now,
        ...(date ? { moveRequestedFrom: Timestamp.fromMillis(Date.UTC(y, m - 1, d, 12)) } : {}),
        changeRequest: { date: date || null, time: time ? appTimeLabel(time) : null, scope: scope || null, at: now, status: "received" },
        updatedAt: now,
      });
      await tellOffice(ref.id, b, "Customer asked for a change", [
        ...(date ? [{ label: "New date", value: formatDate(date) }] : []),
        ...(time ? [{ label: "New start", value: slotLabel(time) }] : []),
        ...(scope ? [{ label: "Job change", value: scope }] : []),
      ]);
      return jsonReply({ ok: true });
    }
    case "cancel": {
      const reason = clean(body.reason, 300) || "Cancelled by customer";
      if (status === "pending") {
        await ref.update({ status: "cancelled", cancelledAt: now, cancelReason: reason, updatedAt: now });
        await tellOffice(ref.id, b, "Booking cancelled by customer", [{ label: "Reason", value: reason }]);
        return jsonReply({ ok: true, cancelled: true });
      }
      if (!OPEN.includes(status)) return jsonReply({ error: "closed" }, 409);
      await ref.update({ cancelRequest: { reason, at: now, status: "received" }, updatedAt: now });
      await tellOffice(ref.id, b, "Customer asked to cancel", [{ label: "Reason", value: reason }]);
      return jsonReply({ ok: true, requested: true });
    }
    case "damage": {
      if (!["in_progress", "completed"].includes(status)) return jsonReply({ error: "closed" }, 409);
      const text = clean(body.text, 2000);
      if (text.length < 10) return jsonReply({ error: "empty" }, 400);
      const prefix = `request_photos/${caller.uid}/${ref.id}/`;
      const photos = (body.photos ?? {}) as { urls?: unknown; paths?: unknown };
      const paths = Array.isArray(photos.paths) ? photos.paths.filter((p): p is string => typeof p === "string" && p.startsWith(prefix)).slice(0, 6) : [];
      const urls = Array.isArray(photos.urls) ? photos.urls.filter((u): u is string => typeof u === "string" && u.startsWith("https://firebasestorage.googleapis.com/")).slice(0, paths.length) : [];
      await ref.update({ damageReports: FieldValue.arrayUnion({ text, photos: urls, paths, at: now.toDate().toISOString() }), updatedAt: now });
      await tellOffice(ref.id, b, "Damage reported", [{ label: "Report", value: text }, ...urls.map((u, i) => ({ label: `Photo ${i + 1}`, value: "Open", href: u }))]);
      return jsonReply({ ok: true });
    }
    case "message": {
      const text = clean(body.text, 2000);
      if (!text) return jsonReply({ error: "empty" }, 400);
      await ref.collection("messages").add({ from: "customer", uid: caller.uid, text, at: now, read: false });
      await ref.update({ lastMessageAt: now, unreadForOffice: FieldValue.increment(1) });
      await tellOffice(ref.id, b, "New message from a customer", [{ label: "Message", value: text }]);
      return jsonReply({ ok: true });
    }
    default:
      return jsonReply({ error: "invalid" }, 400);
  }
}
