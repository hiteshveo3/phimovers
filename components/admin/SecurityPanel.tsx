"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { staffFetch } from "@/lib/admin/staff-fetch";
import { useAdminAuth } from "./AdminAuthProvider";

// Settings card for two-step sign-in (as on Alpha Movers): authenticator apps, backup codes and trusted
// browsers. Everything goes through /api/admin/2fa; secrets never come back after setup.
// Two-step sign-in is mandatory: with `enrol` the card is the first-sign-in setup (components/admin/
// EnrolTwoStep.tsx), and the dashboard opens only after the backup codes were shown.

type Status = {
  enrolled: boolean;
  authenticators: { id: string; label: string; addedAt: number; lastUsedAt: number | null }[];
  backupCodesLeft: number;
  devices: { id: string; label: string; addedAt: number; lastUsedAt: number; expiresAt: number }[];
};
type Setup = { secret: string; qr: string; label: string };

const day = (ms: number | null) =>
  ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "never";

const ERRORS: Record<string, string> = {
  wrongCode: "That code did not work. Type the newest code from the app.",
  expired: "Setup took too long. Start again.",
  tooMany: "You already have the most apps allowed.",
  lastApp: "Two-step sign-in is required, so the last app cannot be removed. Add your new phone first, then remove this one.",
  notConfigured: "Two-step sign-in is not set up on the server yet (ASSISTANT_SECRET or the Firebase service account). Ask the owner.",
  "2fa": "Sign in again with your code first.",
  demo: "Not available in demo mode.",
};

export default function SecurityPanel({ enrol = false }: { enrol?: boolean }) {
  const { refreshPass, demo } = useAdminAuth();
  const [status, setStatus] = useState<Status | null>(null);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [label, setLabel] = useState("");
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const r = await staffFetch("/api/admin/2fa");
    if (r.ok) setStatus((await r.json()) as Status);
    else setError(r.status === 503 ? ERRORS.notConfigured : "Security settings could not be loaded.");
  }, []);

  useEffect(() => {
    void load().catch(() => setError("Security settings could not be loaded."));
  }, [load]);

  // Enrolled already (say the page was reloaded before the codes were confirmed): open the dashboard.
  useEffect(() => {
    if (enrol && status?.enrolled && !codes) void refreshPass();
  }, [enrol, status, codes, refreshPass]);

  async function act(body: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const r = await staffFetch("/api/admin/2fa", { method: "POST", body: JSON.stringify(body) });
      const data = (await r.json().catch(() => ({}))) as Record<string, unknown> & { error?: string };
      if (!r.ok) throw new Error(ERRORS[data.error ?? ""] ?? "That did not work. Try again.");
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not work.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function start() {
    const d = await act({ action: "begin", label });
    if (d) setSetup(d as unknown as Setup);
  }

  async function finish(e: FormEvent) {
    e.preventDefault();
    const d = await act({ action: "confirm", code });
    if (!d) return;
    setSetup(null);
    setCode("");
    setLabel("");
    const fresh = Array.isArray(d.backupCodes) ? (d.backupCodes as string[]) : null;
    if (fresh) setCodes(fresh);
    // On the enrol screen the dashboard opens when the codes are saved (savedCodes), not before.
    if (!(enrol && fresh)) await refreshPass();
    await load();
  }

  async function savedCodes() {
    setCodes(null);
    if (enrol) await refreshPass();
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this authenticator app?")) return;
    if (await act({ action: "removeApp", id })) await load();
  }

  async function renewCodes() {
    if (!window.confirm("Make ten new backup codes? The old ones stop working.")) return;
    const d = await act({ action: "newCodes" });
    if (d && Array.isArray(d.backupCodes)) setCodes(d.backupCodes as string[]);
    await load();
  }

  async function revoke(id: string) {
    if (await act({ action: "revokeDevice", id })) await load();
  }

  const only = status?.authenticators.length === 1;

  return (
    <section className="ad-card" style={{ display: "grid", gap: 14 }}>
      <div>
        <h2>{enrol ? "Set up your authenticator app" : "Two-step sign-in"}</h2>
        <p className="ad-muted" style={{ margin: 0 }}>
          {enrol
            ? "Staff accounts need a code from an authenticator app at sign-in, so a stolen password alone cannot open leads, bookings and invoices. It takes a minute."
            : status?.enrolled
              ? "On (required for staff). After your password, the dashboard asks for a code from your authenticator app."
              : "Required for staff. Set up an authenticator app now."}
        </p>
      </div>

      {demo && <p className="ad-muted ad-small">Not available in demo mode.</p>}
      {error && <p className="ad-banner err" style={{ margin: 0 }}>{error}</p>}

      {codes && (
        <div className="ad-banner info" style={{ display: "grid", gap: 10 }}>
          <b>Your backup codes. Save them now: they are shown only once. Each one signs you in once if you lose your phone.</b>
          <code style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 16 }}>
            {codes.map((c) => <span key={c}>{c}</span>)}
          </code>
          <div className="ad-head-actions">
            <button type="button" className="ad-btn" onClick={() => void navigator.clipboard.writeText(codes.join("\n")).catch(() => undefined)}>Copy</button>
            <button type="button" className="ad-btn lime" onClick={() => void savedCodes()}>{enrol ? "I saved them, open the dashboard" : "I saved them"}</button>
          </div>
        </div>
      )}

      {!enrol && status && status.authenticators.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          <b>Authenticator apps</b>
          {status.authenticators.map((a) => (
            <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
              <span>
                {a.label}
                <span className="ad-muted ad-small"> · added {day(a.addedAt)} · last used {day(a.lastUsedAt)}</span>
              </span>
              <button
                type="button"
                className="ad-mini"
                disabled={busy || only}
                title={only ? "Add another app before removing this one" : undefined}
                onClick={() => void remove(a.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <p className="ad-muted ad-small" style={{ margin: 0 }}>
            Backup codes left: {status.backupCodesLeft}.{" "}
            <button type="button" className="ad-link" style={{ minHeight: 0 }} disabled={busy} onClick={() => void renewCodes()}>Make new codes</button>
          </p>
        </div>
      )}

      {!enrol && status && status.devices.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          <b>Trusted browsers</b>
          {status.devices.map((d) => (
            <div key={d.id} style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
              <span>
                {d.label}
                <span className="ad-muted ad-small"> · last used {day(d.lastUsedAt)} · until {day(d.expiresAt)}</span>
              </span>
              <button type="button" className="ad-mini" disabled={busy} onClick={() => void revoke(d.id)}>Stop trusting</button>
            </div>
          ))}
        </div>
      )}

      {setup ? (
        <form onSubmit={finish} style={{ display: "grid", gap: 12 }}>
          <p style={{ margin: 0 }}>Scan this with Google Authenticator, Microsoft Authenticator or 1Password, then type the code it shows.</p>
          <div style={{ width: 200, height: 200, background: "#fff", padding: 8, borderRadius: 12 }} dangerouslySetInnerHTML={{ __html: setup.qr }} />
          <p className="ad-muted ad-small" style={{ margin: 0, overflowWrap: "anywhere" }}>
            Can&rsquo;t scan? Enter this key: <code>{setup.secret}</code>
          </p>
          <input className="ad-input" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="123456" required />
          <div className="ad-head-actions">
            <button type="submit" className="ad-btn lime" disabled={busy || code.length !== 6}>{busy ? "Checking…" : "Confirm"}</button>
            <button type="button" className="ad-btn" onClick={() => setSetup(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        status && !demo && !codes && (!enrol || !status.enrolled) && (
          <div className="ad-two">
            <input className="ad-input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Name, e.g. My phone" maxLength={40} />
            <button type="button" className="ad-btn lime" disabled={busy} onClick={() => void start()}>
              {status.enrolled ? "Add another app" : "Set up an authenticator app"}
            </button>
          </div>
        )
      )}
    </section>
  );
}
