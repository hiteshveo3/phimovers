"use client";

import { FormEvent, useEffect, useState } from "react";

const REASONS = [
  "Price too high",
  "Booked elsewhere",
  "Date changed / cancelled",
  "No reply",
  "Out of area",
  "Other",
];

export default function LostReasonSheet({
  open,
  onClose,
  onConfirm,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  busy?: boolean;
}) {
  const [pick, setPick] = useState(REASONS[0]);
  const [other, setOther] = useState("");

  useEffect(() => {
    if (!open) return;
    setPick(REASONS[0]);
    setOther("");
  }, [open]);

  if (!open) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const reason = pick === "Other" ? other.trim() || "Other" : pick;
    onConfirm(reason);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-t-3xl border border-line bg-surface p-5 shadow-lg sm:rounded-3xl"
      >
        <h2 className="text-lg font-extrabold text-[#163300]">Mark as lost</h2>
        <p className="mt-1 text-sm text-muted">Optional — helps win-rate insight.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setPick(r)}
              className={
                "rounded-pill px-3 py-2 text-sm font-semibold " +
                (pick === r
                  ? "bg-[#163300] text-[#9fe870]"
                  : "border border-line bg-[#f4f5f2]")
              }
            >
              {r}
            </button>
          ))}
        </div>
        {pick === "Other" && (
          <input
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="Reason…"
            className="mt-3 h-11 w-full rounded-xl border border-line bg-[#f6f6f4] px-3 text-sm text-[#163300] outline-none ring-[#9fe870] focus:ring-2"
            autoFocus
          />
        )}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn justify-center border border-line py-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="btn justify-center bg-[#163300] py-3 text-[#9fe870] disabled:opacity-50"
          >
            Confirm lost
          </button>
        </div>
      </form>
    </div>
  );
}
