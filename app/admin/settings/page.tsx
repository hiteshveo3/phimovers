"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useLeads } from "@/components/admin/LeadsProvider";
import { CALL_LABEL, EMAIL, SITE_URL } from "@/lib/contact";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import {
  getStaffEmails,
  staffGateEnabled,
} from "@/lib/admin/staff";
import { useLeadSoundPref } from "@/lib/admin/sound";
import { downloadCsv, exportLeadsCsv } from "@/lib/leads/stats";

export default function AdminSettingsPage() {
  const { user, logout, configured } = useAdminAuth();
  const { leads } = useLeads();
  const staffList = getStaffEmails();
  const gateOn = staffGateEnabled();
  const sound = useLeadSoundPref();
  const appCheck = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY?.trim(),
  );

  function onExportAll() {
    downloadCsv(
      `phi-leads-all-${new Date().toISOString().slice(0, 10)}.csv`,
      exportLeadsCsv(leads),
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 lg:space-y-6">
      <header className="hidden lg:block">
        <p className="text-xs font-bold uppercase tracking-wide text-[#163300]">
          Config
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
          Settings
        </h1>
      </header>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Icon name="user" className="h-4 w-4 text-[#163300]" />
          Account
        </h2>
        <p className="mt-3 text-sm text-muted">
          Signed in as{" "}
          <span className="font-semibold text-content">
            {user?.email ?? "—"}
          </span>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => logout()}
            className="btn justify-center border border-line bg-[#f4f5f2] py-3"
          >
            <Icon name="lock" className="h-4 w-4" />
            Sign out
          </button>
          <Link
            href="/"
            className="btn justify-center border border-line bg-surface py-3"
          >
            <Icon name="arrowLeft" className="h-4 w-4" />
            Website
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Icon name="shield" className="h-4 w-4 text-[#163300]" />
          Staff allowlist
        </h2>
        <p className="mt-2 text-sm text-muted">
          {gateOn
            ? "Only these emails can open the dashboard (after Firebase Auth)."
            : "Gate off — any signed-in Firebase user can access. Set NEXT_PUBLIC_ADMIN_EMAILS in .env.local to lock it down."}
        </p>
        {gateOn ? (
          <ul className="mt-3 space-y-1.5">
            {staffList.map((e) => (
              <li
                key={e}
                className="rounded-xl bg-[#f4f5f2] px-3 py-2 text-sm font-semibold text-[#163300]"
              >
                {e}
              </li>
            ))}
          </ul>
        ) : (
          <pre className="mt-3 overflow-x-auto rounded-xl bg-[#163300] px-3 py-3 text-xs text-[#9fe870]">
            {`NEXT_PUBLIC_ADMIN_EMAILS=you@email.com,other@email.com`}
          </pre>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Icon name="doc" className="h-4 w-4 text-[#163300]" />
          Data
        </h2>
        <p className="mt-2 text-sm text-muted">
          Download all {leads.length} leads as CSV for backup or sheets.
        </p>
        <button
          type="button"
          onClick={onExportAll}
          disabled={leads.length === 0}
          className="btn mt-4 w-full justify-center border border-line bg-[#f4f5f2] py-3 disabled:opacity-50 sm:w-auto sm:px-5"
        >
          Export all leads
        </button>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Icon name="alert" className="h-4 w-4 text-[#163300]" />
          Alerts
        </h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">New lead sound</p>
            <p className="text-xs text-muted">Soft chime when a quote arrives</p>
          </div>
          <button
            type="button"
            onClick={sound.toggle}
            className={
              "rounded-pill px-4 py-2 text-sm font-bold " +
              (sound.enabled
                ? "bg-[#9fe870] text-[#163300]"
                : "border border-line bg-[#f4f5f2] text-muted")
            }
          >
            {sound.enabled ? "On" : "Off"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Icon name="phone" className="h-4 w-4 text-[#163300]" />
          Public contact
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-3 border-b border-line pb-3">
            <dt className="text-muted">Site</dt>
            <dd className="font-semibold">{SITE_URL}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-line pb-3">
            <dt className="text-muted">Phone</dt>
            <dd className="font-semibold">{CALL_LABEL}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Email</dt>
            <dd className="font-semibold">{EMAIL}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <Icon name="check" className="h-4 w-4 text-[#163300]" />
          Security status
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between gap-3">
            <span className="text-muted">Firebase</span>
            <span className="font-semibold">
              {configured || isFirebaseConfigured()
                ? "Connected"
                : "Not configured"}
            </span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-muted">Staff gate</span>
            <span className="font-semibold">{gateOn ? "On" : "Off"}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-muted">Quote → Firestore</span>
            <span className="font-semibold">Public create</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-muted">Lead read/update</span>
            <span className="font-semibold">Staff claim</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-muted">App Check key</span>
            <span className="font-semibold">{appCheck ? "Set" : "Not set"}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-muted">Customer track</span>
            <span className="font-semibold">
              <a href="/track" className="underline underline-offset-2">
                /track
              </a>
            </span>
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Ops guide:{" "}
          <code className="text-content">docs/FIREBASE_OPS.md</code> — service
          account, App Check, email templates, rules.
        </p>
      </section>
    </div>
  );
}
