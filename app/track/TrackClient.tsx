"use client";

import { useEffect, useState } from "react";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/kit/site-facts";
import { formatDate, maskMobile } from "@/lib/booking-flow/model";
import type { TrackView } from "@/lib/booking-flow/track";

// Find a booking (PHI-XXXXXX) or a quote request (six-character reference) with the phone number it was
// made with. No account needed; a device that verified its email on /book also lists everything made
// with that address. Signed-in customers have the full portal at /client.

const STAGES = ["Received", "Confirmed", "On the day", "Done"] as const;

function stageOf(v: TrackView, today: string): number {
  if (v.kind === "quote") return v.status === "booked" ? 1 : 0;
  if (v.status === "cancelled") return -1;
  if (v.status === "completed") return 3;
  if (v.status === "pending") return 0;
  return v.date && v.date <= today ? 2 : 1;
}

const NOTICE: Record<string, string> = {
  pending: "We have your request. We call you to confirm the van, the crew, the time and the price.",
  confirmed: "Your booking is confirmed. Need to change it? Call us or reply to your confirmation email.",
  accepted: "Your crew has accepted the job.",
  en_route: "Your crew is on the way.",
  in_progress: "Your move is under way.",
  completed: "All done. Thank you for moving with Phi Movers.",
  cancelled: "This booking is cancelled. Call us if that is a surprise.",
  new: "We have your quote request and will be in touch with a fixed price.",
  contacted: "We have been in touch about your quote.",
  quoted: "Your quote is ready. Call or WhatsApp us to book it.",
  booked: "Your quote became a booking.",
  lost: "This quote request is closed. Ask us for a new one any time.",
};

function Card({ v }: { v: TrackView }) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
  const stage = stageOf(v, today);
  return (
    <article className="space-y-3 rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">{v.kind === "booking" ? "Booking" : "Quote request"}</p>
          <p className="text-2xl font-extrabold tracking-tight">{v.reference}</p>
        </div>
        <span className="rounded-full bg-[#9fe870] px-2.5 py-1 text-xs font-bold text-[#163300]">{v.statusLabel}</span>
      </div>
      {v.kind === "booking" && stage >= 0 && (
        <ol className="grid grid-cols-4 gap-1" aria-label="Progress">
          {STAGES.map((s, i) => (
            <li key={s} className="text-center text-[11px] font-semibold" aria-current={i === stage ? "step" : undefined}>
              <span className={"mb-1 block h-1.5 rounded-full " + (i <= stage ? "bg-[#9fe870]" : "bg-[#163300]/10")} />
              {s}
            </li>
          ))}
        </ol>
      )}
      <p className="text-sm">{NOTICE[v.status] ?? ""}</p>
      <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 text-sm">
        <dt className="text-muted">Service</dt><dd>{v.service || "—"}</dd>
        {v.date && <><dt className="text-muted">Date</dt><dd>{formatDate(v.date)}{v.time ? `, ${v.time}` : ""}</dd></>}
        {v.from && <><dt className="text-muted">From</dt><dd>{v.from}</dd></>}
        {v.to && <><dt className="text-muted">To</dt><dd>{v.to}</dd></>}
        {v.total !== null && <><dt className="text-muted">{v.priceEstimate ? "Estimate" : "Price"}</dt><dd>£{v.total}</dd></>}
        {v.quoteAmount && <><dt className="text-muted">Your quote</dt><dd>{v.quoteAmount}</dd></>}
        {v.paymentStatus && v.kind === "booking" && <><dt className="text-muted">Payment</dt><dd>{v.paymentStatus === "paid" ? "Paid" : "Not paid yet"}</dd></>}
      </dl>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
        <a className="underline" href={whatsappLink(`Hi Phi Movers, a question about ${v.reference}.`)} target="_blank" rel="noopener noreferrer">WhatsApp us about {v.reference}</a>
        <a className="underline" href={PHONE_TEL}>Call {PHONE_DISPLAY}</a>
      </p>
    </article>
  );
}

export default function TrackClient() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState<TrackView[]>([]);
  const [mine, setMine] = useState<{ email: string; items: TrackView[] } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) setReference(ref.toUpperCase().slice(0, 12));
    fetch("/api/booking/mine")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.email && setMine({ email: j.email, items: j.items ?? [] }))
      .catch(() => undefined);
  }, []);

  async function find(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!reference.trim()) return setError("Enter the reference from your email or confirmation screen.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Enter the phone number you booked with.");
    setBusy(true);
    try {
      const r = await fetch("/api/booking/mine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference, phone }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) setItems(j.items ?? []);
      else if (r.status === 404) setError("We could not find that reference with that phone number. Check both, or call us.");
      else if (r.status === 429) setError("Too many searches. Please wait a few minutes, or call us.");
      else setError(`Tracking is not available right now. Please call ${PHONE_DISPLAY}.`);
    } catch {
      setError("Please check your connection and try again.");
    }
    setBusy(false);
  }

  const input = "w-full rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none focus:border-[#163300]";

  return (
    <main className="mx-auto max-w-xl space-y-5 px-4 py-10">
      <a href="/" className="inline-flex items-center gap-2.5 text-lg font-extrabold"><img src="/brand/phi-movers-icon-192.png" alt="" width={30} height={30} className="h-[30px] w-[30px] rounded-[9px]" />Phi Movers</a>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Track a booking or quote</h1>
        <p className="mt-1 text-sm text-muted">Use the reference from your email and the phone number you gave us. Have an account? <a href="/client" className="font-bold underline">Open My Phi</a>.</p>
      </header>
      <form onSubmit={find} noValidate className="space-y-3 rounded-2xl border border-line bg-surface p-5">
        <div>
          <label htmlFor="ref" className="mb-1.5 block text-sm font-semibold">Reference</label>
          <input id="ref" className={input} placeholder="PHI-7KQ2MD or 7KQ2MD" value={reference} onChange={(e) => setReference(e.target.value.toUpperCase().slice(0, 12))} autoComplete="off" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">Phone number</label>
          <input id="phone" className={input} type="tel" inputMode="tel" autoComplete="tel" placeholder="07XXX XXXXXX" value={phone} onChange={(e) => setPhone(maskMobile(e.target.value))} />
        </div>
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-[#9fe870] px-5 py-3.5 font-extrabold text-[#163300] disabled:opacity-50">{busy ? "Finding…" : "Find it"}</button>
      </form>
      <div aria-live="polite" className="space-y-3">{items.map((v) => <Card key={v.reference} v={v} />)}</div>
      {mine && mine.items.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold">Made with {mine.email}</h2>
          {mine.items.map((v) => <Card key={`m-${v.reference}`} v={v} />)}
        </section>
      )}
    </main>
  );
}
