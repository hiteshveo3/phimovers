"use client";

import { useState, type FormEvent } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, signOut, updatePassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { staffFetch } from "@/lib/admin/staff-fetch";
import { PASSWORD_MIN, passwordProblem } from "@/lib/auth/password-rule";
import { friendlyAuthError, useAdminAuth } from "./AdminAuthProvider";

// Settings: change password (Alpha's ChangePassword) and "Sign out everywhere" (Alpha's signOutOthers).
// Firebase ends the other sessions itself when the password changes; the route only sends the alert email.
// Google-only accounts change their password at Google, so the form is shown for email accounts only.

export default function AccountSecurity() {
  const { user, demo } = useAdminAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const hasPassword = Boolean(user?.providerData?.some((p) => p.providerId === "password"));

  async function change(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    const weak = passwordProblem(next);
    if (weak) return setError(weak);
    const u = getFirebaseAuth().currentUser;
    if (!u?.email) return setError("Sign in again first.");
    setBusy(true);
    try {
      await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, current));
      await updatePassword(u, next);
      await staffFetch("/api/admin/staff", { method: "POST", body: JSON.stringify({ action: "passwordChanged" }) }).catch(() => null);
      setCurrent("");
      setNext("");
      setNotice("Password changed. Other devices are signed out.");
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function everywhere() {
    if (!window.confirm("Sign out on every device, this one included?")) return;
    setBusy(true);
    try {
      await staffFetch("/api/admin/staff", { method: "POST", body: JSON.stringify({ action: "signOutAll" }) });
    } finally {
      await signOut(getFirebaseAuth()).catch(() => undefined);
      setBusy(false);
    }
  }

  if (demo) return null;

  return (
    <section className="ad-card" style={{ display: "grid", gap: 12 }}>
      <h2>Password and devices</h2>
      {error && <p className="ad-banner err" style={{ margin: 0 }}>{error}</p>}
      {notice && <p className="ad-banner info" style={{ margin: 0 }}>{notice}</p>}
      {hasPassword ? (
        <form onSubmit={change} style={{ display: "grid", gap: 10 }}>
          <label className="ad-field">
            <span>Current password</span>
            <input className="ad-input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </label>
          <label className="ad-field">
            <span>New password (at least {PASSWORD_MIN} characters, a letter and a number)</span>
            <input className="ad-input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={PASSWORD_MIN} />
          </label>
          <button type="submit" className="ad-btn" disabled={busy}>{busy ? "Saving…" : "Change password"}</button>
        </form>
      ) : (
        <p className="ad-muted" style={{ margin: 0 }}>You sign in with Google: change the password in your Google account.</p>
      )}
      <div>
        <button type="button" className="ad-btn" disabled={busy} onClick={() => void everywhere()}>
          Sign out everywhere
        </button>
        <p className="ad-muted ad-small" style={{ margin: "6px 0 0" }}>
          Ends every session of your account, on phones and other computers too. The dashboard also signs you
          out after 30 minutes without activity.
        </p>
      </div>
    </section>
  );
}
