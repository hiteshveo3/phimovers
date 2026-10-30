"use client";

import { useState, type FormEvent } from "react";
import { ShieldTick as ShieldIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { BRAND } from "@/kit/site-facts";
import { staffFetch } from "@/lib/admin/staff-fetch";
import { TRUST_KEY, useAdminAuth } from "./AdminAuthProvider";

// The second step of the staff sign-in (as on Alpha Movers): a six-digit code from an authenticator app,
// or one backup code. "Trust this browser" skips the step here for 30 days.

const ERRORS: Record<string, string> = {
  wrongCode: "That code did not work. Check the app and try the newest code.",
  locked: "Too many wrong codes. Sign-in is paused for an hour and the office has been told.",
  unavailable: "The check is not available right now. Try again in a minute.",
};

function browserLabel() {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iPhone" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : "";
  return os ? `${browser} on ${os}` : browser;
}

export default function TwoStep() {
  const { user, logout, refreshPass } = useAdminAuth();
  const [backup, setBackup] = useState(false);
  const [code, setCode] = useState("");
  const [trust, setTrust] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await staffFetch("/api/admin/2fa", {
        method: "POST",
        body: JSON.stringify({ action: "verify", ...(backup ? { backup: code } : { code }), trust, label: browserLabel() }),
      });
      const data = (await r.json().catch(() => ({}))) as { error?: string; trustToken?: string };
      if (!r.ok) throw new Error(ERRORS[data.error ?? ""] ?? ERRORS.unavailable);
      if (data.trustToken) {
        try {
          localStorage.setItem(TRUST_KEY, data.trustToken);
        } catch {
          /* not kept: the code is asked again next time */
        }
      }
      await refreshPass();
    } catch (err) {
      setError(err instanceof Error ? err.message : ERRORS.unavailable);
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="as-page">
      <div className="as-box">
        <div>
          <span className="as-brand">
            <b><img src="/brand/phi-movers-icon-192.png" alt="" width={26} height={26} style={{ display: 'inline-block', width: 26, height: 26, borderRadius: 8, marginRight: 8, verticalAlign: 'middle' }} />{BRAND}</b>
            <small>Staff</small>
          </span>
          <h1>Two-step sign-in</h1>
          <p className="lead">
            {backup
              ? "Type one of your backup codes. Each code works once."
              : "Open your authenticator app and type the six-digit code for Phi Movers."}
          </p>
        </div>
        <form className="ad-card" onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <label className="ad-field">
            <span>{backup ? "Backup code" : "Code"}</span>
            <input
              className="ad-input as-input"
              value={code}
              onChange={(e) => setCode(backup ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode={backup ? "text" : "numeric"}
              autoComplete="one-time-code"
              placeholder={backup ? "XXXX-XXXX" : "123456"}
              autoFocus
              required
              style={{ fontSize: 22, letterSpacing: "0.2em", textAlign: "center" }}
            />
          </label>
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 15 }}>
            <input type="checkbox" checked={trust} onChange={(e) => setTrust(e.target.checked)} />
            Trust this browser for 30 days
          </label>
          {error && (
            <p role="alert" className="ad-banner err" style={{ margin: 0 }}>
              {error}
            </p>
          )}
          <button type="submit" className="ad-btn lime block" disabled={busy || (!backup && code.length !== 6)}>
            {busy ? "Checking…" : "Continue"}
          </button>
          <button
            type="button"
            className="ad-btn quiet block"
            onClick={() => {
              setBackup((b) => !b);
              setCode("");
              setError("");
            }}
          >
            {backup ? "Use the authenticator app" : "Use a backup code instead"}
          </button>
        </form>
        <p className="ad-muted ad-small" style={{ margin: 0 }}>
          Lost your phone and your backup codes? Ask the owner to reset your two-step sign-in in Settings &gt; Staff.
        </p>
        <p className="as-foot">
          <Ico icon={ShieldIcon} size={16} />
          Signed in as {user?.email}.{" "}
          <button type="button" className="ad-link" style={{ minHeight: 0 }} onClick={() => void logout()}>
            Sign out
          </button>
        </p>
      </div>
    </div>
  );
}
