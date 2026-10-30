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
    <div className="ad-sheet" role="dialog" aria-modal="true" aria-label="Mark as lost">
      <button type="button" className="bg" aria-label="Close" onClick={onClose} />
      <form onSubmit={submit} className="ad-sheet-panel">
        <div>
          <h2>Mark as lost</h2>
          <p className="ad-sub">Optional. It helps the conversion numbers.</p>
        </div>
        <div className="ad-chips" style={{ flexWrap: "wrap", margin: 0, padding: 0 }}>
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              className="ad-chip"
              aria-pressed={pick === r}
              onClick={() => setPick(r)}
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
            className="ad-input"
            autoFocus
          />
        )}
        <div className="ad-two">
          <button type="button" onClick={onClose} className="ad-btn">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="ad-btn dark">
            Confirm lost
          </button>
        </div>
      </form>
    </div>
  );
}
