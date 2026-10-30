"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { staffFetch } from "@/lib/admin/staff-fetch";
import { ROLE_LABEL, STAFF_ROLES, can, type StaffRole } from "@/lib/admin/roles";
import { useAdminAuth } from "./AdminAuthProvider";

// Settings > Staff (Alpha's listOfficeAdmins): who has staff access, their role and two-step state, read
// from Firebase Auth through /api/admin/staff. Owners add, change, remove and reset two-step sign-in.

type Row = {
  uid: string | null;
  email: string;
  role: StaffRole;
  active: boolean;
  disabled: boolean;
  twoStep: boolean;
  lastSignIn: string | null;
  owner: boolean;
};

const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "never";

export default function StaffPanel() {
  const { role, user, demo } = useAdminAuth();
  const owner = can(role, "staff");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>("ops");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const r = await staffFetch("/api/admin/staff");
    const d = (await r.json().catch(() => ({}))) as { staff?: Row[]; error?: string };
    if (r.ok) setRows(d.staff ?? []);
    else setError(r.status === 503 ? "The staff list needs the Firebase service account on the server." : d.error ?? "The staff list could not be loaded.");
  }, []);

  useEffect(() => {
    if (!demo) void load().catch(() => setError("The staff list could not be loaded."));
  }, [load, demo]);

  async function act(body: Record<string, unknown>, done?: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await staffFetch("/api/admin/staff", { method: "POST", body: JSON.stringify(body) });
      const d = (await r.json().catch(() => ({}))) as { error?: string; link?: string };
      if (!r.ok) throw new Error(d.error || "That did not work.");
      if (d.link) setNotice(`Account made. Send them this link to set a password (it works once): ${d.link}`);
      else if (done) setNotice(done);
      await load();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not work.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    if (await act({ action: "add", email, role: newRole }, `${email} is now staff.`)) setEmail("");
  }

  return (
    <section className="ad-card" style={{ display: "grid", gap: 12 }}>
      <div>
        <h2>Staff</h2>
        <p className="ad-muted" style={{ margin: 0 }}>
          Everyone who can open the dashboard. Each needs two-step sign-in. Owners see everything; Office runs
          leads, bookings and crew; Finance runs invoices, prices and reports.
        </p>
      </div>
      {demo && <p className="ad-muted ad-small">Not available in demo mode.</p>}
      {error && <p className="ad-banner err" style={{ margin: 0 }}>{error}</p>}
      {notice && <p className="ad-banner info" style={{ margin: 0, overflowWrap: "anywhere" }}>{notice}</p>}

      {rows && (
        <ul className="ad-set-list">
          {rows.map((r) => {
            const you = r.uid !== null && r.uid === user?.uid;
            return (
              <li key={r.email} style={{ flexWrap: "wrap", gap: 8 }}>
                <span style={{ display: "grid" }}>
                  <b>{r.email}{you ? " (you)" : ""}</b>
                  <span className="ad-muted ad-small">
                    {r.uid === null
                      ? "On the email list; not signed in yet"
                      : `${r.disabled ? "Disabled · " : ""}two-step ${r.twoStep ? "on" : "not set up"} · last sign-in ${day(r.lastSignIn)}`}
                  </span>
                </span>
                <span className="ad-head-actions" style={{ gap: 6 }}>
                  {owner && r.uid && !r.owner ? (
                    <select
                      className="ad-select"
                      aria-label={`Role for ${r.email}`}
                      value={r.role}
                      disabled={busy}
                      onChange={(e) => void act({ action: "role", uid: r.uid, role: e.target.value }, "Role changed.")}
                    >
                      {STAFF_ROLES.map((x) => (
                        <option key={x} value={x}>{ROLE_LABEL[x]}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{ROLE_LABEL[r.role]}</span>
                  )}
                  {owner && r.uid && !you && r.twoStep && (
                    <button
                      type="button"
                      className="ad-mini"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm(`Reset two-step sign-in for ${r.email}? They set up an app again at their next sign-in.`))
                          void act({ action: "reset2fa", uid: r.uid }, "Two-step sign-in reset. They are signed out everywhere.");
                      }}
                    >
                      Reset 2FA
                    </button>
                  )}
                  {owner && r.uid && !you && !r.owner && (
                    <button
                      type="button"
                      className="ad-mini"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm(`Remove ${r.email}? Their staff access ends now, every session is signed out and the account is disabled.`))
                          void act({ action: "remove", uid: r.uid }, `${r.email} was removed.`);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {owner && !demo && (
        <form onSubmit={add} className="ad-two">
          <input
            className="ad-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="new.person@email.com"
            aria-label="Email of the new staff member"
          />
          <div className="ad-inline">
            <select className="ad-select" aria-label="Role" value={newRole} onChange={(e) => setNewRole(e.target.value as StaffRole)}>
              {STAFF_ROLES.map((x) => (
                <option key={x} value={x}>{ROLE_LABEL[x]}</option>
              ))}
            </select>
            <button type="submit" className="ad-btn lime" disabled={busy}>Add</button>
          </div>
        </form>
      )}
      <p className="ad-muted ad-small" style={{ margin: 0 }}>
        The server-only ADMIN_EMAILS list also lets listed addresses in at their first sign-in (as Office), once
        their email is verified. Removing someone here stops that too.
      </p>
    </section>
  );
}
