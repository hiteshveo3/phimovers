"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import ClientBookingBadge from "@/components/client/ClientBookingBadge";
import { useClientAuth } from "@/components/client/ClientAuthProvider";
import { getFirebaseDb, getFirebaseStorageClient } from "@/lib/firebase/client";
import { createReview, mapBooking, validatePhotos } from "@/lib/bookings/service";
import { formatMoveDate, gbp, type Booking } from "@/lib/bookings/types";
import { ALL_SLOTS, BOOK_AHEAD_DAYS, addDays, dateBookable, formatDate, londonNow, slotLabel } from "@/lib/booking-flow/model";
import { dayOf } from "@/lib/booking-flow/slots";
import { CANCELLATION, DEPOSIT_TEXT, GOOGLE_REVIEW_URL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/kit/site-facts";
import { STATUS_NOTICE, stageOf, STAGES } from "@/components/client/booking-stage";

const card = "rounded-2xl border border-line bg-surface p-4";
const input = "w-full rounded-xl border border-line bg-white px-3 py-2.5";

type Extra = {
  changeRequest?: { date?: string | null; time?: string | null; scope?: string | null; status?: string } | null;
  cancelRequest?: { reason?: string; status?: string } | null;
  damageReports?: { text: string; at: string }[];
  priceEstimate?: boolean;
  scheduledDay?: string;
};
type Message = { id: string; from: string; text: string; at: string };

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted">{k}</span>
      <span className="text-right font-semibold">{v}</span>
    </div>
  );
}

/** Copies text; the hidden-textarea route covers browsers without the async clipboard. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement("textarea");
    t.value = text;
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand("copy");
    t.remove();
    return ok;
  }
}

export default function ClientBookingDetailPage() {
  const id = useParams<{ id: string }>()?.id ?? "";
  const { user } = useClientAuth();
  const [b, setB] = useState<Booking | null | undefined>(undefined);
  const [extra, setExtra] = useState<Extra>({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [panel, setPanel] = useState<"" | "change" | "cancel" | "damage">("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [scope, setScope] = useState("");
  const [reason, setReason] = useState("");
  const [damage, setDamage] = useState("");
  const [damagePhotos, setDamagePhotos] = useState<File[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [bank, setBank] = useState<{ label: string; value: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(
    () =>
      onSnapshot(
        doc(getFirebaseDb(), "bookings", id),
        (s) => {
          if (!s.exists()) return setB(null);
          const raw = s.data() as Record<string, unknown>;
          setB(mapBooking(s.id, raw));
          setExtra(raw as Extra);
        },
        (e) => {
          setError(e.message);
          setB(null);
        },
      ),
    [id],
  );

  async function api(method: "GET" | "POST", payload?: Record<string, unknown>) {
    if (!user) throw new Error("Please sign in again.");
    const r = await fetch(method === "GET" ? `/api/client/bookings?bookingId=${id}` : "/api/client/bookings", {
      method,
      headers: { Authorization: `Bearer ${await user.getIdToken()}`, ...(payload ? { "Content-Type": "application/json" } : {}) },
      body: payload ? JSON.stringify({ bookingId: id, ...payload }) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(r.status === 409 ? "This booking can no longer be changed online. Please call us." : r.status === 429 ? "Too many requests. Please wait a few minutes." : "That did not work. Please try again, or call us.");
    return j;
  }

  const loadMessages = () => api("GET").then((j) => setMessages(j.messages ?? [])).catch(() => undefined);
  useEffect(() => {
    if (user && b) void loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, b?.id]);

  useEffect(() => {
    if (!user || !b || b.status !== "completed" || b.paymentStatus === "paid") return;
    user.getIdToken().then((t) => fetch("/api/client/bank", { headers: { Authorization: `Bearer ${t}` } })).then((r) => r.json()).then((j) => setBank(j.rows ?? [])).catch(() => undefined);
  }, [user, b]);

  async function run(fn: () => Promise<void>, ok?: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      if (ok) setNotice(ok);
      setPanel("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not work. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (b === undefined) return <div className="space-y-3" aria-busy="true"><div className="h-24 animate-pulse rounded-2xl bg-stone-200" /><div className="h-40 animate-pulse rounded-2xl bg-stone-200" /></div>;
  if (b === null) {
    return (
      <div className={card}>
        <p className="text-sm">{error || "Booking not found."}</p>
        <Link href="/client/bookings" className="mt-2 inline-block font-bold underline">Back to my bookings</Link>
      </div>
    );
  }
  const booking = b;
  const cancelled = booking.status === "cancelled";
  const today = londonNow().date;
  const day = dayOf(booking.scheduledDate, extra.scheduledDay) ?? "";
  const stage = stageOf(booking.status, day, today);
  const open = ["pending", "confirmed", "accepted"].includes(booking.status);
  const changePending = Boolean(extra.changeRequest?.status === "received" || booking.moveRequestedAt);
  const days = Array.from({ length: BOOK_AHEAD_DAYS + 1 }, (_, i) => addDays(today, i)).filter((x) => dateBookable(x));

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted">
            <Link href="/client/bookings">My bookings</Link> · {booking.bookingNumber}{" "}
            <button type="button" className="underline" onClick={async () => setCopied(await copyText(booking.bookingNumber))} aria-live="polite">
              {copied ? "Copied" : "Copy reference"}
            </button>
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">{booking.serviceName}</h1>
          <p className="text-sm text-muted">{formatMoveDate(booking.scheduledDate)} {booking.scheduledTime}</p>
        </div>
        <ClientBookingBadge status={booking.status} />
      </header>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
      {notice && <p className="rounded-xl bg-[#9fe870]/25 px-4 py-3 text-sm text-[#163300]" role="status">{notice}</p>}

      {!cancelled && (
        <section className={card} aria-label="Progress">
          <ol className="grid grid-cols-4 gap-1 text-center text-[11px] font-semibold">
            {STAGES.map((s, i) => (
              <li key={s} className={i <= stage ? "text-[#163300]" : "text-muted"} aria-current={i === stage ? "step" : undefined}>
                <span className={"mx-auto mb-1 block h-2 rounded-full " + (i <= stage ? "bg-[#9fe870]" : "bg-stone-200")} />
                {s}
              </li>
            ))}
          </ol>
          {booking.moverName && <p className="mt-3 text-sm">Your crew lead: <b>{booking.moverName}</b></p>}
        </section>
      )}
      <p className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-line">{STATUS_NOTICE[booking.status]}</p>
      {cancelled && booking.cancelReason && <p className="text-sm text-muted">Reason: {booking.cancelReason}</p>}
      {changePending && !cancelled && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <b>Change request received.</b>{" "}
          {[extra.changeRequest?.date && `New date ${formatDate(extra.changeRequest.date)}`, !extra.changeRequest?.date && booking.moveRequestedFrom && `New date ${formatMoveDate(booking.moveRequestedFrom)}`, extra.changeRequest?.time && `start ${extra.changeRequest.time}`, extra.changeRequest?.scope].filter(Boolean).join(", ")}. We will confirm whether we can do it.
        </p>
      )}
      {extra.cancelRequest?.status === "received" && !cancelled && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900"><b>Cancellation request received.</b> We will call you to confirm.</p>}

      <section className={card}>
        <Row k="From" v={`${booking.addressLine}${booking.fromFloor ? ` (${booking.fromFloor}${booking.fromLift ? ", lift" : ""})` : ""}`} />
        {booking.toAddressLine && <Row k="To" v={`${booking.toAddressLine}${booking.toFloor ? ` (${booking.toFloor}${booking.toLift ? ", lift" : ""})` : ""}`} />}
        {booking.moversCount > 0 && <Row k="Crew / hours" v={`${booking.moversCount} crew · ${booking.hours} h`} />}
        {booking.selectedAddons.length > 0 && <Row k="Extras" v={booking.selectedAddons.map((a) => a.name).join(", ")} />}
        <Row k={extra.priceEstimate ? "Estimated total" : "Total"} v={booking.totalPrice > 0 ? gbp(booking.totalPrice) : "Priced on a call"} />
        <Row k="Payment" v={booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "refunded" ? "Refunded" : "Not paid yet"} />
      </section>

      {bank.length > 0 && (
        <section className={card}>
          <h2 className="mb-1 text-sm font-extrabold">Pay by bank transfer</h2>
          <p className="mb-2 text-sm text-muted">Use {booking.bookingNumber} as the payment reference.</p>
          {bank.map((r, i) => <Row key={i} k={r.label} v={r.value} />)}
        </section>
      )}

      {booking.requestPhotos.length > 0 && (
        <section className={card}>
          <h2 className="mb-2 text-sm font-extrabold">Your photos</h2>
          <div className="grid grid-cols-3 gap-2">
            {booking.requestPhotos.map((u) => (
              <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="Your photo" className="aspect-square w-full rounded-xl object-cover" /></a>
            ))}
          </div>
        </section>
      )}

      {open && (
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-expanded={panel === "change"} onClick={() => setPanel(panel === "change" ? "" : "change")} className="rounded-full bg-[#163300] px-5 py-2.5 text-sm font-bold text-[#9fe870]">Change date, time or job</button>
          <button type="button" aria-expanded={panel === "cancel"} onClick={() => setPanel(panel === "cancel" ? "" : "cancel")} className="rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-bold text-red-800">Cancel this booking</button>
        </div>
      )}

      {panel === "change" && (
        <section className={card} aria-label="Ask for a change">
          <h2 className="mb-2 text-sm font-extrabold">Ask for a change</h2>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm font-semibold">New date
              <select className={input} value={newDate} onChange={(e) => setNewDate(e.target.value)}>
                <option value="">Keep the date</option>
                {days.map((x) => <option key={x} value={x}>{formatDate(x, "short")}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">New start
              <select className={input} value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                <option value="">Keep the time</option>
                {ALL_SLOTS.map((t) => <option key={t} value={t}>{slotLabel(t)}</option>)}
              </select>
            </label>
          </div>
          <label className="mt-2 block text-sm font-semibold">Anything else changing? (more items, another address…)
            <textarea rows={2} className={input} value={scope} onChange={(e) => setScope(e.target.value)} />
          </label>
          <p className="mt-2 text-xs text-muted">{CANCELLATION.slice(1, 3).join(" · ")}</p>
          <button type="button" disabled={busy || (!newDate && !newTime && scope.trim().length < 5)} className="mt-3 rounded-full bg-[#9fe870] px-5 py-2.5 font-bold text-[#163300] disabled:opacity-50"
            onClick={() => run(() => api("POST", { action: "change", date: newDate, time: newTime, scope }), "Change request received. We will confirm whether we can do it.")}>
            Send change request
          </button>
        </section>
      )}

      {panel === "cancel" && (
        <section className={card} role="dialog" aria-label="Cancel this booking">
          <h2 className="mb-2 text-sm font-extrabold">Cancel this booking?</h2>
          <ul className="mb-2 list-disc space-y-1 pl-5 text-sm">{CANCELLATION.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="mb-2 text-sm text-muted">{booking.status === "pending" ? "Your request is not confirmed yet, so it is cancelled straight away." : "Your booking is confirmed: we will call you to cancel it under the terms above."}</p>
          <label className="block text-sm font-semibold">Why are you cancelling? (optional)
            <input className={input} value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setPanel("")} className="rounded-full border border-line px-5 py-2.5 text-sm font-bold">Keep my booking</button>
            <button type="button" disabled={busy} className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              onClick={() => run(() => api("POST", { action: "cancel", reason }), booking.status === "pending" ? "Your booking is cancelled." : "Cancellation request received. We will call you.")}>
              {booking.status === "pending" ? "Cancel booking" : "Ask to cancel"}
            </button>
          </div>
        </section>
      )}

      {booking.status === "completed" && (
        <section className={card}>
          <h2 className="mb-2 text-sm font-extrabold">How did we do?</h2>
          {GOOGLE_REVIEW_URL && <p className="mb-2 text-sm"><a className="font-bold underline" href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">Leave us a Google review</a>. It helps other Londoners choose.</p>}
          {reviewed ? (
            <p className="text-sm">Thank you for your review.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" role="radio" aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-checked={rating === n} onClick={() => setRating(n)} className={"text-3xl " + (n <= rating ? "text-amber-500" : "text-stone-300")}>★</button>
                ))}
              </div>
              <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us about your move" className={input} />
              <button type="button" disabled={busy} className="rounded-full bg-[#9fe870] px-5 py-2.5 font-bold text-[#163300]" onClick={() => run(async () => { await createReview(booking, rating, comment); setReviewed(true); })}>Send review</button>
            </div>
          )}
        </section>
      )}

      {(booking.status === "completed" || booking.status === "in_progress") && (
        <section className={card}>
          <h2 className="mb-1 text-sm font-extrabold">Something damaged?</h2>
          {(extra.damageReports?.length ?? 0) > 0 && <p className="mb-2 text-sm">We have your report from {new Date(extra.damageReports![extra.damageReports!.length - 1].at).toLocaleDateString("en-GB")}. We will be in touch.</p>}
          {panel !== "damage" ? (
            <button type="button" className="text-sm font-bold underline" onClick={() => setPanel("damage")}>Report damage</button>
          ) : (
            <div className="space-y-2">
              <textarea rows={3} className={input} placeholder="What was damaged, and where?" value={damage} onChange={(e) => setDamage(e.target.value)} />
              <input type="file" accept="image/*" multiple className="block text-sm" onChange={(e) => setDamagePhotos(Array.from(e.target.files ?? []).slice(0, 6))} />
              <button type="button" disabled={busy || damage.trim().length < 10 || Boolean(validatePhotos(damagePhotos))} className="rounded-full bg-[#163300] px-5 py-2.5 text-sm font-bold text-[#9fe870] disabled:opacity-50"
                onClick={() => run(async () => {
                  const urls: string[] = [];
                  const paths: string[] = [];
                  for (const [i, f] of damagePhotos.entries()) {
                    const path = `request_photos/${user!.uid}/${booking.id}/damage_${Date.now()}_${i}.${(f.name.split(".").pop() || "jpg").replace(/[^a-z0-9]/gi, "")}`;
                    const r = storageRef(getFirebaseStorageClient(), path);
                    await uploadBytes(r, f, { contentType: f.type });
                    urls.push(await getDownloadURL(r));
                    paths.push(path);
                  }
                  await api("POST", { action: "damage", text: damage, photos: { urls, paths } });
                  setDamage("");
                  setDamagePhotos([]);
                }, "Thank you. We have your report and will be in touch.")}>
                Send report
              </button>
            </div>
          )}
        </section>
      )}

      <section className={card} aria-label="Messages with the office">
        <h2 className="mb-2 text-sm font-extrabold">Messages about this booking</h2>
        {messages.length === 0 ? <p className="text-sm text-muted">Write to the office here. We reply here or by phone.</p> : (
          <ul className="mb-3 space-y-2">
            {messages.map((m) => (
              <li key={m.id} className={"max-w-[85%] rounded-2xl px-3 py-2 text-sm " + (m.from === "customer" ? "ml-auto bg-[#9fe870]/40" : "bg-stone-100")}>
                {m.text}
                <span className="mt-0.5 block text-[11px] text-muted">{m.from === "customer" ? "You" : "Phi Movers"} · {m.at ? new Date(m.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input className={input} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" aria-label="Message" />
          <button type="button" disabled={busy || !message.trim()} className="rounded-full bg-[#163300] px-4 text-sm font-bold text-[#9fe870] disabled:opacity-50"
            onClick={() => run(async () => { await api("POST", { action: "message", text: message }); setMessage(""); await loadMessages(); })}>Send</button>
        </div>
      </section>

      <p className="pb-4 text-center text-xs text-muted">
        {DEPOSIT_TEXT} Questions? <a href={PHONE_TEL} className="underline">Call {PHONE_DISPLAY}</a> or{" "}
        <a className="underline" href={whatsappLink(`Hi Phi Movers, a question about booking ${booking.bookingNumber}.`)} target="_blank" rel="noopener noreferrer">WhatsApp us</a> and quote {booking.bookingNumber}.
      </p>
    </div>
  );
}
