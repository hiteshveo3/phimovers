"use client";

import { useEffect, useState } from "react";
import { saveAnnouncement, subscribeServiceSettings } from "@/lib/bookings/service";
import { NO_ANNOUNCEMENT, announcementLive, type Announcement } from "@/lib/bookings/types";

// The office announcement band (Alpha app's announcement_sheet): one line under the header on the website
// and in the app, e.g. holiday hours or a weather warning. Stored on serviceSettings/default.announcement,
// which anyone can read and any staff role can change (firestore.rules).

export default function AnnouncementEditor() {
  const [a, setA] = useState<Announcement>(NO_ANNOUNCEMENT);
  const [saved, setSaved] = useState<Announcement>(NO_ANNOUNCEMENT);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(
    () =>
      subscribeServiceSettings((s) => {
        const band = s.announcement ?? NO_ANNOUNCEMENT;
        setA(band);
        setSaved(band);
      }),
    [],
  );

  async function save(next: Announcement) {
    setBusy(true);
    setMsg("");
    try {
      if (next.href && !/^(\/[^\s]*|https:\/\/[^\s]+)$/.test(next.href.trim())) throw new Error("The link must start with / or https://");
      await saveAnnouncement(next);
      setMsg(next.on ? "Saved. The band shows within a minute." : "Saved. The band is off.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "That did not save.");
    } finally {
      setBusy(false);
    }
  }

  const changed = JSON.stringify(a) !== JSON.stringify(saved);

  return (
    <section className="ad-card" style={{ display: "grid", gap: 10 }}>
      <div>
        <h2>Announcement band</h2>
        <p className="ad-muted" style={{ margin: 0 }}>
          One short line under the header on the website and in the app.{" "}
          {announcementLive(saved) ? <b>Showing now.</b> : "Not showing."}
        </p>
      </div>
      <label className="ad-field">
        <span>Text (up to 200 characters)</span>
        <input className="ad-input" maxLength={200} value={a.text} onChange={(e) => setA({ ...a, text: e.target.value })} placeholder="Open as usual over the bank holiday" />
      </label>
      <div className="ad-two">
        <label className="ad-field">
          <span>Link (optional)</span>
          <input className="ad-input" value={a.href} onChange={(e) => setA({ ...a, href: e.target.value })} placeholder="/contact" />
        </label>
        <label className="ad-field">
          <span>Ends (optional)</span>
          <input
            className="ad-input"
            type="datetime-local"
            value={a.until ? a.until.slice(0, 16) : ""}
            onChange={(e) => setA({ ...a, until: e.target.value ? new Date(e.target.value).toISOString() : "" })}
          />
        </label>
      </div>
      <label className="ad-field">
        <span>Style</span>
        <select className="ad-select" value={a.tone} onChange={(e) => setA({ ...a, tone: e.target.value === "alert" ? "alert" : "info" })}>
          <option value="info">Information</option>
          <option value="alert">Warning</option>
        </select>
      </label>
      {msg && <p className="ad-banner info" style={{ margin: 0 }}>{msg}</p>}
      <div className="ad-head-actions">
        <button type="button" className="ad-btn lime" disabled={busy || !a.text.trim() || (!changed && a.on)} onClick={() => void save({ ...a, on: true })}>
          {saved.on ? "Save" : "Save and show"}
        </button>
        {saved.on && (
          <button type="button" className="ad-btn" disabled={busy} onClick={() => void save({ ...a, on: false })}>
            Turn off
          </button>
        )}
      </div>
    </section>
  );
}
