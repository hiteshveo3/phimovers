"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  friendlyClientAuthError,
  useClientAuth,
} from "@/components/client/ClientAuthProvider";
import { Icon } from "@/components/icons";

type Mode = "login" | "register" | "forgot" | "sent";

const field =
  "mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-[#f6f6f4] px-3.5 py-3.5 text-base font-medium text-[#163300] outline-none ring-[#9fe870] placeholder:text-[#9ca3af] focus:ring-2";

export default function ClientLoginPage() {
  const {
    login,
    register,
    loginWithGoogle,
    resetPassword,
    configured,
  } = useClientAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!configured) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "forgot") {
        if (!email.trim()) {
          setError("Enter your email first.");
          return;
        }
        await resetPassword(email.trim());
        setMode("sent");
        return;
      }
      if (mode === "register") {
        if (name.trim().length < 2) {
          setError("Please enter your full name.");
          return;
        }
        if (phone.replace(/\D/g, "").length < 10) {
          setError("Please enter a valid UK mobile number.");
          return;
        }
        await register({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
        });
        return;
      }
      await login(email.trim(), password);
    } catch (err) {
      setError(friendlyClientAuthError(err));
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
      setError(friendlyClientAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f5f2] text-[#163300]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(159,232,112,0.45), transparent 55%)",
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-7 text-center">
          <img
            src="/logo.png"
            alt="Phi Movers"
            className="no-grayscale mx-auto h-14 w-14 rounded-2xl object-cover ring-2 ring-[#9fe870]/60"
          />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
            {mode === "register"
              ? "Create your account"
              : mode === "forgot" || mode === "sent"
                ? "Reset password"
                : "Welcome back"}
          </h1>
          <p className="mt-1.5 text-sm text-[#4b5563]">
            {mode === "register"
              ? "Name and phone required — track quotes and bookings in one place"
              : mode === "sent"
                ? "Check your inbox for the reset link"
                : "Your Phi Movers client dashboard"}
          </p>
        </div>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 sm:p-6">
          {mode === "sent" ? (
            <div className="space-y-4">
              <p className="text-sm text-[#374151]">
                If an account exists for {email}, a reset link is on its way.
                After resetting, come back here to sign in.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="btn w-full justify-center bg-[#9fe870] py-3.5 text-[#163300]"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {(mode === "login" || mode === "register") && (
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
                </>
              )}

              <form onSubmit={onSubmit} className="space-y-3.5">
                {mode === "register" && (
                  <>
                    <label className="block text-sm font-semibold">
                      Full name *
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={field}
                        autoComplete="name"
                      />
                    </label>
                    <label className="block text-sm font-semibold">
                      Mobile phone *
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07…"
                        className={field}
                        autoComplete="tel"
                      />
                    </label>
                  </>
                )}

                <label className="block text-sm font-semibold">
                  Email
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                    autoComplete="email"
                  />
                </label>

                {mode !== "forgot" && (
                  <label className="block text-sm font-semibold">
                    <span className="flex items-center justify-between">
                      Password
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode("forgot");
                            setError("");
                          }}
                          className="text-xs font-bold underline underline-offset-2"
                        >
                          Forgot?
                        </button>
                      )}
                    </span>
                    <span className="relative mt-1.5 block">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={field + " pr-12"}
                        autoComplete={
                          mode === "register"
                            ? "new-password"
                            : "current-password"
                        }
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6b7280]"
                      >
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </span>
                  </label>
                )}

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="btn w-full justify-center bg-[#9fe870] py-3.5 text-[#163300] disabled:opacity-60"
                >
                  {busy
                    ? "Please wait…"
                    : mode === "forgot"
                      ? "Send reset link"
                      : mode === "register"
                        ? "Create account"
                        : "Sign in"}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-[#4b5563]">
                {mode === "login" && (
                  <>
                    New here?{" "}
                    <button
                      type="button"
                      className="font-bold text-[#163300] underline"
                      onClick={() => {
                        setMode("register");
                        setError("");
                      }}
                    >
                      Create account
                    </button>
                  </>
                )}
                {mode === "register" && (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="font-bold text-[#163300] underline"
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                    >
                      Sign in
                    </button>
                  </>
                )}
                {mode === "forgot" && (
                  <button
                    type="button"
                    className="font-bold text-[#163300] underline"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                  >
                    ← Back to sign in
                  </button>
                )}
              </p>
            </>
          )}
        </div>

        <Link
          href="/"
          className="mt-6 text-center text-sm font-semibold text-[#4b5563] hover:text-[#163300]"
        >
          ← Back to website
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
