"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  friendlyAuthError,
  useAdminAuth,
} from "@/components/admin/AdminAuthProvider";
import { ShieldTick as ShieldIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { BRAND } from "@/kit/site-facts";

type Mode = "login" | "forgot" | "sent";

export default function AdminLoginPage() {
  const {
    login,
    loginWithGoogle,
    resetPassword,
    configured,
    denyReason,
  } = useAdminAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!configured) return null;

  const gateMessage =
    denyReason === "verify"
      ? "Confirm your email address first: we have sent a link to your inbox. Then sign in again."
      : denyReason === "notStaff"
        ? "That account is not a staff account. Ask the owner to add you in Settings > Staff."
        : error;

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onForgot(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter the email for your staff account.");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setMode("sent");
    } catch (err) {
      setError(friendlyAuthError(err));
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
          <h1>
            {mode === "login"
              ? "Staff sign in"
              : mode === "forgot"
                ? "Reset password"
                : "Check your email"}
          </h1>
          <p className="lead">
            {mode === "login"
              ? "Authorised staff only."
              : mode === "forgot"
                ? "We will send a secure reset link to your inbox."
                : `If an account exists for ${email}, a reset link is on its way.`}
          </p>
        </div>

        <div className="ad-card">
          {mode === "sent" ? (
            <div style={{ display: "grid", gap: 14 }}>
              <p className="ad-muted" style={{ margin: 0 }}>
                Open the email and follow the link. Then come back here to sign
                in with your new password.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="ad-btn lime block"
              >
                Back to sign in
              </button>
            </div>
          ) : mode === "forgot" ? (
            <form onSubmit={onForgot} style={{ display: "grid", gap: 14 }}>
              <label className="ad-field">
                <span>Work email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ad-input as-input"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </label>
              {gateMessage && (
                <p role="alert" className="ad-banner err" style={{ margin: 0 }}>
                  {gateMessage}
                </p>
              )}
              <button type="submit" disabled={busy} className="ad-btn lime block">
                {busy ? "Sending…" : "Send reset link"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="ad-btn quiet block"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              <button
                type="button"
                disabled={busy}
                onClick={onGoogle}
                className="ad-btn block"
              >
                <GoogleMark />
                Continue with Google
              </button>

              <div className="as-sep">or email</div>

              <form onSubmit={onLogin} style={{ display: "grid", gap: 14 }}>
                <label className="ad-field">
                  <span>Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ad-input as-input"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </label>

                <label className="ad-field">
                  <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    Password
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                      }}
                      className="ad-link"
                      style={{ minHeight: 0, fontSize: 13.5 }}
                    >
                      Forgot password?
                    </button>
                  </span>
                  <span className="as-pass">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="ad-input as-input"
                      style={{ paddingRight: 70 }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </span>
                </label>

                {gateMessage && (
                  <p role="alert" className="ad-banner err" style={{ margin: 0 }}>
                    {gateMessage}
                  </p>
                )}

                <button type="submit" disabled={busy} className="ad-btn lime block">
                  {busy ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="as-foot">
          <Ico icon={ShieldIcon} size={16} />
          Protected with Firebase Auth and a code from your authenticator app. Only
          staff accounts can open leads. Never share your password.
        </p>

        <Link href="/" className="ad-btn quiet" style={{ justifySelf: "center" }}>
          Back to website
        </Link>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.5 29.4 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.6-.2-3.1-.5-4.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.5 29.4 4.5 24 4.5c-7.7 0-14.4 4.3-17.7 10.2z"
      />
      <path
        fill="#4CAF50"
        d="M24 45.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.9 26.7 38 24 38c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 41.1 16.2 45.5 24 45.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.1 44.5 32 44.5 25c0-1.6-.2-3.1-.5-4.5z"
      />
    </svg>
  );
}
