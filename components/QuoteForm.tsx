"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";
import { WHATSAPP_HREF, PHONE_HREF, PHONE_DISPLAY } from "@/lib/contact";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { createLead } from "@/lib/leads/service";

const sizes = [
  "Studio / bedsits",
  "1-bed flat",
  "2-bed flat / small house",
  "3-bed house",
  "4-bed+ house",
  "Not sure yet",
];

export default function QuoteForm({
  serviceTitle = "House Removals",
}: {
  serviceTitle?: string;
}) {
  const pathname = usePathname();
  const [step, setStep] = useState<1 | 2>(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [size, setSize] = useState(sizes[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [trackCode, setTrackCode] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const canContinue = from.trim().length >= 2 && to.trim().length >= 2;

  const openWhatsApp = (code?: string) => {
    const msg = [
      `Hi Phi Movers — quote request for ${serviceTitle}`,
      `From: ${from.trim()}`,
      `To: ${to.trim()}`,
      `Date: ${date || "flexible"}`,
      `Property: ${size}`,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      code ? `Track code: ${code}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `${WHATSAPP_HREF}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const submit = async () => {
    setError("");
    if (honeypot.trim()) {
      setDone(true);
      return;
    }
    setBusy(true);
    try {
      let code = "";
      if (isFirebaseConfigured()) {
        const created = await createLead({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          from: from.trim(),
          to: to.trim(),
          date: date || undefined,
          propertySize: size,
          service: serviceTitle,
          source: pathname || "/",
          priority: (() => {
            if (!date) return "normal";
            const move = new Date(date + "T12:00:00");
            if (Number.isNaN(move.getTime())) return "normal";
            const hours = (move.getTime() - Date.now()) / 36e5;
            return hours >= 0 && hours <= 48 ? "urgent" : "normal";
          })(),
        });
        code = created.trackCode;
        setTrackCode(code);
      }
      setDone(true);
      openWhatsApp(code || undefined);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save — you can still WhatsApp us.",
      );
      openWhatsApp();
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div
        id="quote"
        className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 md:p-6"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-lg font-extrabold text-content">
          Request sent
        </p>
        <p className="mt-1 text-sm text-muted">
          We&apos;ve logged your details
          {isFirebaseConfigured() ? " in our dashboard" : ""} and opened
          WhatsApp so you can send photos if you like. We usually reply within
          about an hour.
        </p>
        {trackCode && (
          <div className="mt-4 rounded-xl border border-line bg-[#f4f5f2] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Your tracking code
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-widest text-[#163300]">
              {trackCode}
            </p>
            <a
              href={`/track`}
              className="mt-2 inline-flex text-sm font-bold text-[#163300] underline underline-offset-2"
            >
              Open customer dashboard →
            </a>
          </div>
        )}
        <a
          href={PHONE_HREF}
          className="btn mt-5 bg-[#9fe870] px-5 text-[#163300]"
        >
          <Icon name="phone" className="h-4 w-4" />
          Or call {PHONE_DISPLAY}
        </a>
      </div>
    );
  }

  return (
    <div
      id="quote"
      className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 md:p-6"
    >
      <p className="text-lg font-extrabold text-content">
        Get my free fixed quote
      </p>
      <p className="mt-1 text-sm text-muted">
        Start in under a minute. We usually reply within about one working hour
        — no obligation, no card required.
      </p>

      {step === 1 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-content">Moving from</span>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. N1 2AB"
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none ring-[#9fe870] focus:ring-2"
              autoComplete="postal-code"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-content">Moving to</span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. SW11 1AA"
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none ring-[#9fe870] focus:ring-2"
              autoComplete="postal-code"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-content">Preferred date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none ring-[#9fe870] focus:ring-2"
            />
          </label>
          <div className="sm:col-span-2">
            <span className="block text-sm font-semibold text-content">
              Property size
            </span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={
                    "rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors " +
                    (size === s
                      ? "bg-[#9fe870] text-[#163300]"
                      : "border border-line bg-cream text-content hover:bg-[#9fe870]/25")
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => setStep(2)}
            className="btn col-span-full mt-1 w-full justify-center bg-[#9fe870] px-5 text-[#163300] hover:bg-[#86d957] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
          >
            Continue
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-semibold text-content">Your name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none ring-[#9fe870] focus:ring-2"
              autoComplete="name"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-content">Phone</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07…"
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none ring-[#9fe870] focus:ring-2"
              autoComplete="tel"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-content">Email (optional)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm outline-none ring-[#9fe870] focus:ring-2"
              autoComplete="email"
            />
          </label>
          {/* Honeypot — bots fill this; humans never see it */}
          <label className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
            Company
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
          {error && (
            <p className="col-span-full text-sm font-medium text-amber-800">
              {error}
            </p>
          )}
          <div className="col-span-full mt-1 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn w-full justify-center btn-light px-5 sm:w-auto"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!name.trim() || !phone.trim() || busy}
              onClick={submit}
              className="btn w-full flex-1 justify-center bg-[#9fe870] px-5 text-[#163300] hover:bg-[#86d957] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              {busy ? "Sending…" : "Send quote request"}
            </button>
          </div>
          <p className="col-span-full text-xs text-muted">
            Or call{" "}
            <a
              href={PHONE_HREF}
              className="font-semibold text-[#163300] hover:underline"
            >
              {PHONE_DISPLAY}
            </a>{" "}
            — your details stay private and there&apos;s no card required to
            enquire.
          </p>
        </div>
      )}
    </div>
  );
}
