"use client";

import { FormEvent, useState } from "react";
import {
  friendlyClientAuthError,
  useClientAuth,
} from "@/components/client/ClientAuthProvider";
import { Icon } from "@/components/icons";

const field =
  "mt-1.5 w-full rounded-xl border border-[#e5e7eb] bg-[#f6f6f4] px-3.5 py-3.5 text-base font-medium text-[#163300] outline-none ring-[#9fe870] focus:ring-2";

export default function CompleteProfilePage() {
  const { user, profile, completeProfile, logout } = useClientAuth();
  const [name, setName] = useState(profile?.name || user?.displayName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Name is required.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("A valid mobile number is required.");
      return;
    }
    setBusy(true);
    try {
      await completeProfile(name.trim(), phone.trim());
    } catch (err) {
      setError(friendlyClientAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <h1 className="text-xl font-extrabold text-[#163300]">
          Finish your profile
        </h1>
        <p className="mt-1.5 text-sm text-[#4b5563]">
          We need your name and phone so we can link your quotes and contact
          you about your move.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
          <label className="block text-sm font-semibold text-[#163300]">
            Full name *
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
              autoComplete="name"
            />
          </label>
          <label className="block text-sm font-semibold text-[#163300]">
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
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn w-full justify-center bg-[#9fe870] py-3.5 text-[#163300] disabled:opacity-60"
          >
            {busy ? "Saving…" : "Continue to dashboard"}
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </form>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-4 w-full text-center text-sm font-semibold text-[#4b5563]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
