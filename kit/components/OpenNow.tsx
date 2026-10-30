'use client';

import { useEffect, useState } from 'react';
import { HOURS, HOURS_TEXT, isOpenNow } from '../site-facts';

/** 21 → "9pm", 7 → "7am". */
export const hourLabel = (h: number) => (h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`);

// Live office status in London time. The server renders the plain hours, so there is no mismatch.
export default function OpenNow({ className }: { className?: string }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const tick = () => setOpen(isOpenNow());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Lime stays a fill with an ink ring (house rule), grey when closed.
  const dot = open ? '#9fe870' : 'rgba(15,26,9,.18)';
  const text = open === null ? `Open ${HOURS_TEXT}` : open ? `Open now · until ${hourLabel(HOURS.close)}` : `Closed now · opens ${hourLabel(HOURS.open)}`;

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: 999, background: dot, boxSizing: 'border-box', border: '1.5px solid rgba(15,26,9,.55)', flex: 'none' }} />
      {text}
    </span>
  );
}
