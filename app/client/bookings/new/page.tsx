"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { useClientAuth } from "@/components/client/ClientAuthProvider";
import { getFirebaseDb, getFirebaseStorageClient } from "@/lib/firebase/client";
import { validatePhotos } from "@/lib/bookings/service";
import {
  ALL_SLOTS,
  EXTRAS,
  FLOORS,
  HEAVY_ITEMS,
  HELPERS_MAX,
  HOURS_MAX,
  HOURS_MIN,
  PARKING,
  PROPERTY_SIZES,
  SERVICES,
  TEAMS,
  emptyDraft,
  firstOpening,
  formatDate,
  isTwoVans,
  londonNow,
  addDays,
  BOOK_AHEAD_DAYS,
  oneAddress,
  quote,
  slotLabel,
  slotOpen,
  stepOfError,
  suggestion,
  teamLabel,
  validateAll,
  type Draft,
  type Errors,
  type TeamId,
} from "@/lib/booking-flow/model";
import { DEPOSIT_TEXT, BOOKING_POLICIES } from "@/kit/site-facts";
import { timeFits } from "@/lib/booking-flow/slots";

// Signed-in customers book here. The form sends a draft to /api/booking/submit, the same route as the
// public /book page: the server prices it from the rate card, claims a booking number and the time in
// one transaction and emails both sides. Photos are uploaded first under request_photos/{uid}/{id}/.

const input =
  "w-full rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none focus:border-[#163300]";
const label = "mb-1.5 block text-sm font-semibold";
const card = "space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5";
const errText = "mt-1 text-sm text-red-700";

const SLOT_TAKEN = "That time has just been booked. Please pick another time.";

export default function NewBookingPage() {
  const router = useRouter();
  const { user, profile } = useClientAuth();
  const [d, setD] = useState<Draft>(() => {
    const first = firstOpening();
    return { ...emptyDraft(), service: "house", kind: "flat", size: "1bed", team: "transit", helpers: 1, hours: 3, date: first?.date ?? "", time: first?.time ?? "" };
  });
  const [method, setMethod] = useState<"bank_transfer" | "cash" | "card">("bank_transfer");
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [taken, setTaken] = useState<string[]>([]);

  useEffect(() => {
    setD((x) => ({
      ...x,
      name: x.name || profile?.name || user?.displayName || "",
      phone: x.phone || profile?.phone || "",
      email: x.email || user?.email || "",
      consent: x.consent,
    }));
  }, [profile, user]);

  useEffect(() => {
    if (!d.date) return;
    let live = true;
    fetch(`/api/booking/slots?date=${d.date}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => live && setTaken(Array.isArray(j?.taken) ? j.taken : []))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [d.date]);

  const set = (p: Partial<Draft>) => setD((x) => ({ ...x, ...p }));
  const svc = SERVICES.find((s) => s.id === d.service);
  const hourly = svc?.mode === "hourly" && !isTwoVans(d);
  const q = quote(d);
  const photoProblem = useMemo(() => validatePhotos(photos), [photos]);
  const today = londonNow().date;
  const days = useMemo(() => Array.from({ length: BOOK_AHEAD_DAYS + 1 }, (_, i) => addDays(today, i)).filter((x) => ALL_SLOTS.some((t) => slotOpen(x, t))), [today]);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  function pickService(id: string) {
    const next = { ...d, service: id as Draft["service"] };
    const sg = suggestion(next);
    set({ service: next.service, ...(sg ? { team: sg.team, helpers: sg.helpers, hours: sg.hours } : {}) });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (photoProblem) return setError(photoProblem);
    const draft = { ...d, consent: true };
    const problems = validateAll(draft);
    if (d.time && !timeFits(d.time, hourly ? d.hours : HOURS_MIN, taken)) problems.time = SLOT_TAKEN;
    setErrors(problems);
    if (Object.keys(problems).length) {
      setError("Some details need another look. They are marked below.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // A fresh booking id (no write), so the photos sit in the folder the booking will point at.
      const bookingId = doc(collection(getFirebaseDb(), "bookings")).id;
      const urls: string[] = [];
      const paths: string[] = [];
      for (const [i, file] of photos.entries()) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `request_photos/${user.uid}/${bookingId}/${Date.now()}_${i}.${ext}`;
        const r = storageRef(getFirebaseStorageClient(), path);
        await uploadBytes(r, file, { contentType: file.type });
        urls.push(await getDownloadURL(r));
        paths.push(path);
      }
      const res = await fetch("/api/booking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({ draft, source: "portal", bookingId, photos: { urls, paths }, paymentMethod: method }),
      });
      const j = (await res.json().catch(() => ({}))) as { id?: string; error?: string; errors?: Errors };
      if (res.ok && j.id) {
        router.replace(`/client/bookings/${j.id}`);
        return;
      }
      if (res.status === 409) {
        setErrors({ time: SLOT_TAKEN });
        set({ time: "" });
        setError(SLOT_TAKEN);
      } else if (res.status === 400 && j.errors) {
        setErrors(j.errors);
        setError(`Please check: ${Object.keys(j.errors).map(stepOfError).filter((v, i, a) => a.indexOf(v) === i).join(", ")}.`);
      } else if (res.status === 429) {
        setError("Too many booking requests from this connection. Please wait a few minutes or call us.");
      } else {
        setError("We could not send your booking. Please try again, or call us and we will book it for you.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not send your booking. Please try again.");
    }
    setBusy(false);
  }

  const profileMissing = !profile?.name || !profile?.phone;
  const err = (k: string) => (errors[k] ? <p className={errText} role="alert">{errors[k]}</p> : null);

  const stopFields = (which: "from" | "to") => {
    const s = d[which];
    const put = (p: Partial<Draft["from"]>) => set({ [which]: { ...s, ...p } } as Partial<Draft>);
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor={`${which}-pc`}>Postcode</label>
            <input id={`${which}-pc`} className={input} value={s.postcode} onChange={(e) => put({ postcode: e.target.value.toUpperCase().slice(0, 10) })} aria-invalid={Boolean(errors[`${which}.postcode`])} />
            {err(`${which}.postcode`)}
          </div>
          <div>
            <label className={label} htmlFor={`${which}-floor`}>Floor</label>
            <select id={`${which}-floor`} className={input} value={s.floor} onChange={(e) => put({ floor: e.target.value, lift: e.target.value === "Ground" ? "" : s.lift })} aria-invalid={Boolean(errors[`${which}.floor`])}>
              <option value="">Choose</option>
              {FLOORS.map((f) => <option key={f}>{f}</option>)}
            </select>
            {err(`${which}.floor`)}
          </div>
        </div>
        <div>
          <label className={label} htmlFor={`${which}-line`}>House or flat number and street</label>
          <input id={`${which}-line`} className={input} value={s.line} onChange={(e) => put({ line: e.target.value })} aria-invalid={Boolean(errors[`${which}.line`])} />
          {err(`${which}.line`)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {s.floor && s.floor !== "Ground" ? (
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" className="h-5 w-5 accent-[#163300]" checked={s.lift === "yes"} onChange={(e) => put({ lift: e.target.checked ? "yes" : "no" })} />
              Lift available
            </label>
          ) : <span />}
          <select aria-label="Parking" className={input} value={s.parking} onChange={(e) => put({ parking: e.target.value })}>
            <option value="">Parking: not sure yet</option>
            {PARKING.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-2xl space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">Book a move</h1>
        <p className="mt-1 text-sm text-muted">Tell us what you need. We call you to confirm the van, the crew, the time and the price.</p>
      </header>

      {profileMissing && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Add your name and phone number in{" "}
          <Link href="/client/account" className="font-bold underline">Account</Link>{" "}
          first so the crew can reach you.
        </p>
      )}

      <section className={card}>
        <h2 className="font-extrabold">The job</h2>
        <div>
          <label className={label} htmlFor="svc">Service</label>
          <select id="svc" className={input} value={d.service} onChange={(e) => pickService(e.target.value)}>
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.from}</option>)}
          </select>
        </div>
        {svc?.property && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="kind">Property</label>
              <select id="kind" className={input} value={d.kind} onChange={(e) => set({ kind: e.target.value as Draft["kind"] })}>
                <option value="flat">Flat</option>
                <option value="house">House</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="size">Size</label>
              <select id="size" className={input} value={d.size} onChange={(e) => { const next = { ...d, size: e.target.value as Draft["size"] }; const sg = suggestion(next); set({ size: next.size, ...(sg ? { team: sg.team, helpers: sg.helpers, hours: sg.hours } : {}) }); }}>
                {PROPERTY_SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
        )}
        {hourly ? (
          <>
            <div>
              <span className={label}>Van and crew</span>
              <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Van and crew">
                {TEAMS.map((t) => (
                  <button key={t.id} type="button" role="radio" aria-checked={d.team === t.id} onClick={() => set({ team: t.id as TeamId, helpers: t.helpers })}
                    className={"rounded-xl border px-3 py-3 text-left " + (d.team === t.id ? "border-[#163300] bg-[#9fe870]/30" : "border-line bg-white")}>
                    <b className="block">{t.name}</b>
                    <span className="text-xs text-muted">{t.suits}</span>
                  </button>
                ))}
              </div>
              {err("team")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label} htmlFor="helpers">Helpers with the driver</label>
                <select id="helpers" className={input} value={d.helpers} onChange={(e) => set({ helpers: Number(e.target.value) })}>
                  {Array.from({ length: HELPERS_MAX + 1 }, (_, n) => <option key={n} value={n}>{n === 0 ? "Driver only" : `${n} helper${n > 1 ? "s" : ""}`}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="hours">Hours (min {HOURS_MIN})</label>
                <select id="hours" className={input} value={d.hours} onChange={(e) => set({ hours: Number(e.target.value) })}>
                  {Array.from({ length: (HOURS_MAX - HOURS_MIN) * 2 + 1 }, (_, i) => HOURS_MIN + i / 2).map((h) => <option key={h} value={h}>{h} hours</option>)}
                </select>
              </div>
            </div>
            <div>
              <span className={label}>Extras (priced on the call)</span>
              <div className="flex flex-wrap gap-2">
                {EXTRAS.map((x) => (
                  <button key={x} type="button" aria-pressed={d.extras.includes(x)} onClick={() => set({ extras: toggle(d.extras, x) })}
                    className={"rounded-full border px-3.5 py-2 text-sm font-semibold " + (d.extras.includes(x) ? "border-[#163300] bg-[#163300] text-[#9fe870]" : "border-line bg-white")}>{x}</button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className={label} htmlFor="desc">Describe the job (we price it on a short call)</label>
            <textarea id="desc" rows={3} className={input} value={d.description} onChange={(e) => set({ description: e.target.value })} aria-invalid={Boolean(errors.description)} />
            {err("description")}
          </div>
        )}
      </section>

      <section className={card}>
        <h2 className="font-extrabold">When</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="date">Date</label>
            <select id="date" className={input} value={d.date} onChange={(e) => set({ date: e.target.value, time: "" })} aria-invalid={Boolean(errors.date)}>
              {days.map((x) => <option key={x} value={x}>{formatDate(x, "short")}</option>)}
            </select>
            {err("date")}
          </div>
          <div>
            <label className={label} htmlFor="time">Start time (London)</label>
            <select id="time" className={input} value={d.time} onChange={(e) => set({ time: e.target.value })} aria-invalid={Boolean(errors.time)}>
              <option value="">Choose</option>
              {ALL_SLOTS.filter((t) => slotOpen(d.date, t)).map((t) => (
                <option key={t} value={t} disabled={!timeFits(t, hourly ? d.hours : HOURS_MIN, taken)}>{slotLabel(t)}{timeFits(t, hourly ? d.hours : HOURS_MIN, taken) ? "" : " (booked)"}</option>
              ))}
            </select>
            {err("time")}
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-extrabold">{oneAddress(d) ? "Address" : "Pick-up"}</h2>
        {stopFields("from")}
        {!oneAddress(d) && (
          <>
            <h2 className="pt-2 font-extrabold">Drop-off</h2>
            {stopFields("to")}
          </>
        )}
      </section>

      <section className={card}>
        <h2 className="font-extrabold">The load</h2>
        <div>
          <span className={label}>Heavy or awkward items</span>
          <div className="flex flex-wrap gap-2">
            {HEAVY_ITEMS.map((h) => (
              <button key={h} type="button" aria-pressed={d.items.includes(h)} onClick={() => set({ items: toggle(d.items, h) })}
                className={"rounded-full border px-3.5 py-2 text-sm font-semibold " + (d.items.includes(h) ? "border-[#163300] bg-[#163300] text-[#9fe870]" : "border-line bg-white")}>{h}</button>
            ))}
          </div>
        </div>
        <div>
          <label className={label} htmlFor="notes">Anything else we should know?</label>
          <textarea id="notes" rows={3} className={input} value={d.notes} onChange={(e) => set({ notes: e.target.value })} />
        </div>
        <div>
          <label className={label} htmlFor="photos">Photos of the items or access (optional, up to 6)</label>
          <input id="photos" type="file" accept="image/*" multiple className="block w-full text-sm" onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, 6))} />
          {photos.length > 0 && <p className="mt-1 text-xs text-muted">{photos.length} photo{photos.length > 1 ? "s" : ""} selected</p>}
          {photoProblem && <p className="mt-1 text-xs text-red-700">{photoProblem}</p>}
        </div>
      </section>

      <section className={card}>
        <h2 className="font-extrabold">Payment</h2>
        <p className="text-sm text-muted">{DEPOSIT_TEXT}</p>
        <select className={input} value={method} onChange={(e) => setMethod(e.target.value as typeof method)} aria-label="How you would like to pay the balance">
          <option value="bank_transfer">Bank transfer</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
          {BOOKING_POLICIES.map((p) => <li key={p}>{p}</li>)}
        </ul>
        {errors.name || errors.phone || errors.email ? (
          <p className={errText}>{[errors.name, errors.phone, errors.email].filter(Boolean).join(" ")} Update them in <Link href="/client/account" className="font-bold underline">Account</Link>.</p>
        ) : null}
      </section>

      <div className="sticky bottom-20 z-10 rounded-2xl border border-line bg-surface p-4 shadow-lg lg:bottom-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-muted">{q.kind === "estimate" ? `Estimated total${d.team ? ` · ${teamLabel(d.team as TeamId, d.helpers)}` : ""}` : "Price"}</span>
          <b className="text-2xl" aria-live="polite">{q.totalText}</b>
        </div>
        {error && <p className="mb-2 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={busy || profileMissing || Boolean(photoProblem)} className="w-full rounded-full bg-[#9fe870] px-5 py-3.5 text-base font-extrabold text-[#163300] disabled:opacity-50">
          {busy ? "Sending…" : "Request booking"}
        </button>
        <p className="mt-2 text-center text-xs text-muted">
          By sending you agree to the <a href="/terms" className="underline">booking terms</a>. We confirm availability and the final price by phone or message.
        </p>
      </div>
    </form>
  );
}
