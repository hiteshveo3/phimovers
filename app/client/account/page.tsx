"use client";

import { FormEvent, useState } from "react";
import {
  friendlyClientAuthError,
  useClientAuth,
} from "@/components/client/ClientAuthProvider";
import { Icon } from "@/components/icons";

const field =
  "mt-1.5 h-11 w-full rounded-xl border border-line bg-[#f6f6f4] px-3 text-sm text-[#163300] outline-none ring-[#9fe870] focus:ring-2";

export default function ClientAccountPage() {
  const { profile, user, completeProfile, logout, resetPassword } =
    useClientAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    setBusy(true);
    try {
      await completeProfile(name.trim(), phone.trim());
      setMsg("Saved.");
    } catch (err) {
      setError(friendlyClientAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!user?.email) return;
    setError("");
    setMsg("");
    setBusy(true);
    try {
      await resetPassword(user.email);
      setMsg("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(friendlyClientAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <header className="hidden lg:block">
        <h1 className="text-3xl font-extrabold tracking-tight">Account</h1>
      </header>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Icon name="user" className="h-4 w-4" />
          Profile
        </h2>
        <p className="mt-1 text-sm text-muted">{user?.email}</p>
        <form onSubmit={onSave} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold">
            Full name *
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
            />
          </label>
          <label className="block text-sm font-semibold">
            Mobile phone *
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={field}
            />
          </label>
          {error && (
            <p className="text-sm font-medium text-red-800">{error}</p>
          )}
          {msg && (
            <p className="text-sm font-medium text-emerald-800">{msg}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn w-full justify-center bg-[#9fe870] py-3 text-[#163300] disabled:opacity-60"
          >
            Save changes
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="text-base font-bold">Security</h2>
        <button
          type="button"
          disabled={busy}
          onClick={onReset}
          className="btn mt-3 w-full justify-center border border-line py-3"
        >
          <Icon name="lock" className="h-4 w-4" />
          Email password reset link
        </button>
        <button
          type="button"
          onClick={() => logout()}
          className="btn mt-2 w-full justify-center border border-line bg-[#f4f5f2] py-3"
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
