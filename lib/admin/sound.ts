"use client";

import { useEffect, useState } from "react";

const KEY = "phi-admin-sound";

export function isLeadSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(KEY);
  return v !== "0";
}

export function setLeadSoundEnabled(on: boolean) {
  localStorage.setItem(KEY, on ? "1" : "0");
}

/** Short soft beep — no audio file needed. */
export function playLeadChime() {
  if (typeof window === "undefined" || !isLeadSoundEnabled()) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.04;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    o.stop(ctx.currentTime + 0.26);
    setTimeout(() => ctx.close(), 400);
  } catch {
    /* autoplay / unsupported */
  }
}

export function useLeadSoundPref() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    setEnabled(isLeadSoundEnabled());
  }, []);
  function toggle() {
    const next = !isLeadSoundEnabled();
    setLeadSoundEnabled(next);
    setEnabled(next);
  }
  return { enabled, toggle };
}
