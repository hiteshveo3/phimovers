"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { Icon } from "@/components/icons";

const field =
  "mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-[#f6f6f4] px-3.5 py-3.5 text-base font-medium text-[#163300] outline-none ring-[#9fe870] placeholder:font-normal placeholder:text-[#9ca3af] focus:ring-2";

function friendlyResetError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  switch (code) {
    case "auth/expired-action-code":
      return "This reset link has expired. Request a new one from the login page.";
    case "auth/invalid-action-code":
      return "This reset link is invalid or already used. Request a new one.";
    case "auth/weak-password":
      return "Choose a stronger password (at least 6 characters).";
    default:
      return "Couldn’t update your password. Try again or request a new link.";
  }
}

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const oobCode = params.get("oobCode")?.trim() || "";
  const nextPath = useMemo(() => {
    const raw = params.get("next")?.trim() || "/client/login";
    return raw.startsWith("/") ? raw : "/client/login";
  }, [params]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!isFirebaseConfigured()) {
        setError("Sign-in isn’t configured on this site yet.");
        setChecking(false);
        return;
      }
      if (!oobCode) {
        setError("Missing reset code. Open the link from your email again.");
        setChecking(false);
        return;
      }
      try {
        const mail = await verifyPasswordResetCode(getFirebaseAuth(), oobCode);
        if (!cancelled) setEmail(mail);
      } catch (err) {
        if (!cancelled) setError(friendlyResetError(err));
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [oobCode]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don’t match. Re-enter both fields.");
      return;
    }
    setBusy(true);
    try {
      await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
      setDone(true);
      window.setTimeout(() => router.replace(nextPath), 1600);
    } catch (err) {
      setError(friendlyResetError(err));
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
            {done ? "Password updated" : "Choose a new password"}
          </h1>
          <p className="mt-1.5 text-sm text-[#4b5563]">
            {done
              ? "Taking you to sign in…"
              : email
                ? `For ${email}`
                : "Phi Movers account"}
          </p>
        </div>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-none sm:p-6">
          {checking ? (
            <p className="text-sm text-[#6b7280]">Checking your reset link…</p>
          ) : done ? (
            <div className="space-y-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#9fe870] text-[#163300]">
                <Icon name="check" className="h-6 w-6" />
              </div>
              <p className="text-sm leading-relaxed text-[#374151]">
                Your password is saved. You can sign in with the new one.
              </p>
              <Link
                href={nextPath}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#163300] px-5 text-sm font-bold text-[#9fe870]"
              >
                Continue to sign in
              </Link>
            </div>
          ) : error && !email ? (
            <div className="space-y-4">
              <p className="rounded-xl bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
                {error}
              </p>
              <Link
                href={nextPath}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#163300] px-5 text-sm font-bold text-[#9fe870]"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {error ? (
                <p className="rounded-xl bg-[#fef2f2] px-3 py-2.5 text-sm text-[#b91c1c]">
                  {error}
                </p>
              ) : null}

              <label className="block text-sm font-semibold">
                New password
                <div className="relative">
                  <input
                    className={`${field} pr-16`}
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6b7280]"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <label className="block text-sm font-semibold">
                Confirm password
                <div className="relative">
                  <input
                    className={`${field} pr-16`}
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6b7280]"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={busy}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#163300] px-5 text-sm font-bold text-[#9fe870] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save new password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#f4f5f2] text-sm text-[#6b7280]">
          Loading…
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
