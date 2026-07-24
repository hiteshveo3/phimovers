"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  friendlyAuthError,
  useAdminAuth,
} from "@/components/admin/AdminAuthProvider";
import { Icon } from "@/components/icons";

type Mode = "login" | "forgot" | "sent";

const field =
  "admin-login-field mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-[#f6f6f4] px-3.5 py-3.5 text-base font-medium text-[#163300] outline-none ring-[#9fe870] placeholder:font-normal placeholder:text-[#9ca3af] focus:ring-2";

export default function AdminLoginPage() {
  const {
    login,
    loginWithGoogle,
    resetPassword,
    configured,
    staffDenied,
  } = useAdminAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!configured) return null;

  const gateMessage = staffDenied
    ? "That Google/email account isn’t on the staff allowlist. Ask the owner to add your email to NEXT_PUBLIC_ADMIN_EMAILS."
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
    <div className="relative min-h-screen overflow-hidden bg-[#f4f5f2] text-[#163300]">
      {/* Soft brand atmosphere — no white-on-white */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(159,232,112,0.45), transparent 55%), linear-gradient(180deg, #eef6e4 0%, #f4f5f2 40%, #f4f5f2 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-7 text-center">
          <img
            src="/logo.png"
            alt="Phi Movers"
            className="no-grayscale mx-auto h-14 w-14 rounded-2xl object-cover ring-2 ring-[#9fe870]/60"
          />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#163300]">
            {mode === "login"
              ? "Staff sign in"
              : mode === "forgot"
                ? "Reset password"
                : "Check your email"}
          </h1>
          <p className="mt-1.5 text-sm text-[#4b5563]">
            {mode === "login"
              ? "Phi Movers admin — authorised staff only"
              : mode === "forgot"
                ? "We’ll send a secure reset link to your inbox"
                : `If an account exists for ${email}, a reset link is on its way.`}
          </p>
        </div>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-none sm:p-6">
          {mode === "sent" ? (
            <div className="space-y-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#9fe870] text-[#163300]">
                <Icon name="mail" className="h-6 w-6" />
              </div>
              <p className="text-sm leading-relaxed text-[#374151]">
                Open the email and follow the link. Then come back here to sign
                in with your new password.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="btn w-full justify-center bg-[#9fe870] py-3.5 text-[#163300] hover:bg-[#86d957]"
              >
                Back to sign in
              </button>
            </div>
          ) : mode === "forgot" ? (
            <form onSubmit={onForgot} className="space-y-4">
              <label className="block text-sm font-semibold text-[#163300]">
                Work email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                  placeholder="you@company.com"
                  autoComplete="email"
                  style={{ color: "#163300", WebkitTextFillColor: "#163300" }}
                />
              </label>
              {gateMessage && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800"
                >
                  {gateMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="btn w-full justify-center bg-[#9fe870] py-3.5 text-[#163300] hover:bg-[#86d957] disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send reset link"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="w-full text-center text-sm font-semibold text-[#4b5563] hover:text-[#163300]"
              >
                ← Back to sign in
              </button>
            </form>
          ) : (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onGoogle}
                className="btn w-full justify-center border border-[#e5e7eb] bg-white py-3.5 text-[#163300] hover:bg-[#f6f6f4] disabled:opacity-60"
              >
                <GoogleMark />
                Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e5e7eb]" />
                <span className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                  or email
                </span>
                <div className="h-px flex-1 bg-[#e5e7eb]" />
              </div>

              <form onSubmit={onLogin} className="space-y-4">
                <label className="block text-sm font-semibold text-[#163300]">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                    placeholder="you@company.com"
                    autoComplete="email"
                    style={{ color: "#163300", WebkitTextFillColor: "#163300" }}
                  />
                </label>

                <label className="block text-sm font-semibold text-[#163300]">
                  <span className="flex items-center justify-between gap-2">
                    Password
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                      }}
                      className="text-xs font-bold text-[#163300] underline underline-offset-2"
                    >
                      Forgot password?
                    </button>
                  </span>
                  <span className="relative mt-1.5 block">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={field + " pr-12"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      style={{
                        color: "#163300",
                        WebkitTextFillColor: "#163300",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6b7280] hover:text-[#163300]"
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </span>
                </label>

                {gateMessage && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800"
                  >
                    {gateMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="btn w-full justify-center bg-[#9fe870] py-3.5 text-[#163300] hover:bg-[#86d957] disabled:opacity-60"
                >
                  {busy ? "Signing in…" : "Sign in"}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-[#e5e7eb] bg-white/80 px-4 py-3">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-[#4b5563]">
            <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#163300]" />
            Protected with Firebase Auth. Only staff accounts can open leads.
            Never share your password.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 text-center text-sm font-semibold text-[#4b5563] hover:text-[#163300]"
        >
          ← Back to website
        </Link>
      </div>

      {/* Autofill contrast fix (Chrome often paints white text) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .admin-login-field:-webkit-autofill,
        .admin-login-field:-webkit-autofill:hover,
        .admin-login-field:-webkit-autofill:focus {
          -webkit-text-fill-color: #163300 !important;
          caret-color: #163300;
          box-shadow: 0 0 0 1000px #f6f6f4 inset !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `,
        }}
      />
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
