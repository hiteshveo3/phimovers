"use client";

import Link from "next/link";
import {
  ArrowLeft2 as BackIcon,
  DocumentDownload as DownloadIcon,
  Logout as LogoutIcon,
} from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import SecurityPanel from "@/components/admin/SecurityPanel";
import StaffPanel from "@/components/admin/StaffPanel";
import AccountSecurity from "@/components/admin/AccountSecurity";
import { ROLE_LABEL } from "@/lib/admin/roles";
import { useLeads } from "@/components/admin/LeadsProvider";
import { CALL_LABEL, EMAIL, SITE_URL } from "@/lib/contact";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { useLeadSoundPref } from "@/lib/admin/sound";
import { downloadCsv, exportLeadsCsv } from "@/lib/leads/stats";

export default function AdminSettingsPage() {
  const { user, logout, configured, demo, role } = useAdminAuth();
  const { leads } = useLeads();
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
    <div className="ad" style={{ maxWidth: 760 }}>
      <div>
        <p className="ad-eyebrow">Config</p>
        <h1>Settings</h1>
      </div>

      <section className="ad-card">
        <h2>Account</h2>
        <p className="ad-muted" style={{ margin: "0 0 14px" }}>
          Signed in as{" "}
          <strong style={{ color: "var(--ink)" }}>{user?.email ?? "—"}</strong>
          {role ? ` · ${ROLE_LABEL[role]}` : ""}
        </p>
        <div className="ad-two">
          <button type="button" onClick={() => logout()} className="ad-btn">
            <Ico icon={LogoutIcon} size={18} />
            Sign out
          </button>
          <Link href="/" className="ad-btn">
            <Ico icon={BackIcon} size={18} />
            Website
          </Link>
        </div>
      </section>

      <SecurityPanel />

      <AccountSecurity />

      <section className="ad-card">
        <h2>Alerts</h2>
        <div className="ad-switch">
          <div>
            <p style={{ fontWeight: 600 }}>New lead sound</p>
            <p className="ad-muted ad-small">A soft chime and a pop-up when a quote arrives.</p>
          </div>
          <button
            type="button"
            onClick={sound.toggle}
            className={"ad-btn" + (sound.enabled ? " lime" : "")}
            role="switch"
            aria-checked={sound.enabled}
          >
            {sound.enabled ? "On" : "Off"}
          </button>
        </div>
      </section>

      <StaffPanel />

      <section className="ad-card">
        <h2>Data</h2>
        <p className="ad-muted" style={{ margin: "0 0 14px" }}>
          Download all {leads.length} leads as CSV for backup or a spreadsheet.
        </p>
        <button
          type="button"
          onClick={onExportAll}
          disabled={leads.length === 0}
          className="ad-btn"
        >
          <Ico icon={DownloadIcon} size={18} />
          Export all leads
        </button>
      </section>

      <section className="ad-card">
        <h2>Public contact</h2>
        <ul className="ad-set-list">
          <li>
            <span>Site</span>
            <b>{SITE_URL}</b>
          </li>
          <li>
            <span>Phone</span>
            <b>{CALL_LABEL}</b>
          </li>
          <li>
            <span>Email</span>
            <b>{EMAIL}</b>
          </li>
        </ul>
      </section>

      <section className="ad-card">
        <h2>Security status</h2>
        <ul className="ad-set-list">
          <li>
            <span>Firebase</span>
            <b>{demo ? "Demo mode" : configured || isFirebaseConfigured() ? "Connected" : "Not configured"}</b>
          </li>
          <li>
            <span>Staff access</span>
            <b>Staff claim + two-step sign-in</b>
          </li>
          <li>
            <span>Quote to Firestore</span>
            <b>Public create</b>
          </li>
          <li>
            <span>Leads and invoices</span>
            <b>Staff claim only</b>
          </li>
          <li>
            <span>Invoice PDFs</span>
            <b>Server-verified staff token</b>
          </li>
          <li>
            <span>App Check key</span>
            <b>{appCheck ? "Set" : "Not set"}</b>
          </li>
          <li>
            <span>Client portal</span>
            <b>
              <a href="/client" style={{ textDecoration: "underline" }}>
                /client
              </a>
            </b>
          </li>
        </ul>
        <p className="ad-muted ad-small" style={{ margin: "12px 0 0" }}>
          Ops guide: <code>docs/FIREBASE_OPS.md</code> and{" "}
          <code>docs/ADMIN_DASHBOARD.md</code> (invoice bank details, rules).
        </p>
      </section>
    </div>
  );
}
