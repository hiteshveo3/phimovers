"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { WHATSAPP_HREF, PHONE_HREF, PHONE_DISPLAY } from "@/lib/contact";

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
  const [step, setStep] = useState<1 | 2>(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [size, setSize] = useState(sizes[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const canContinue = from.trim().length >= 2 && to.trim().length >= 2;

  const openWhatsApp = () => {
    const msg = [
      `Hi Phi Movers — quote request for ${serviceTitle}`,
      `From: ${from.trim()}`,
      `To: ${to.trim()}`,
      `Date: ${date || "flexible"}`,
      `Property: ${size}`,
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `${WHATSAPP_HREF}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      id="quote"
      className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 md:p-6"
    >
      <p className="text-lg font-extrabold text-content">Get my free fixed quote</p>
      <p className="mt-1 text-sm text-muted">
        Start in under a minute. We usually reply within about one working hour —
        no obligation, no card required.
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
              disabled={!name.trim() || !phone.trim()}
              onClick={openWhatsApp}
              className="btn w-full flex-1 justify-center bg-[#9fe870] px-5 text-[#163300] hover:bg-[#86d957] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Send quote request
            </button>
          </div>
          <p className="col-span-full text-xs text-muted">
            Or call{" "}
            <a href={PHONE_HREF} className="font-semibold text-[#163300] hover:underline">
              {PHONE_DISPLAY}
            </a>{" "}
            — your details stay private and there’s no card required to enquire.
          </p>
        </div>
      )}
    </div>
  );
}
