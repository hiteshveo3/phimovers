"use client";

import { useCallback, useEffect, useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { listMovers } from "@/lib/bookings/service";
import type { Mover } from "@/lib/bookings/types";

async function authedFetch(method: "POST" | "PATCH", body: object) {
  const token = await getFirebaseAuth().currentUser?.getIdToken();
  const res = await fetch("/api/admin/movers", {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    password?: string;
    email?: string;
  };
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function AdminMoversPage() {
  const [movers, setMovers] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  const load = useCallback(async () => {
    try {
      setMovers(await listMovers());
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the crew.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setCreated(null);
    try {
      const r = await authedFetch("POST", { name, email, phone });
      setCreated({ email: r.email ?? email, password: r.password ?? "" });
      setName("");
      setEmail("");
      setPhone("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add the mover.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(m: Mover) {
    setBusy(true);
    setError("");
    try {
      await authedFetch("PATCH", { uid: m.uid, status: m.status === "active" ? "suspended" : "active" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the mover.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Bookings</p>
          <h1>Crew</h1>
          <p className="ad-sub">Movers sign in to the Phi Movers app with the email below and see only their own jobs.</p>
        </div>
      </div>

      {error && (
        <p className="ad-banner err" role="alert">
          {error}
        </p>
      )}

      {created && (
        <div className="ad-banner info" role="status">
          <div>
            Mover created. Give them these sign-in details now; the password is not shown again.
            <br />
            <b>{created.email}</b> · password <b style={{ fontFamily: "monospace" }}>{created.password}</b>
          </div>
        </div>
      )}

      <div className="ad-cols even">
        <section className="ad-card">
          <h2>Add a mover</h2>
          <form onSubmit={add}>
            <label className="ad-field">
              <span>Full name</span>
              <input className="ad-input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
            </label>
            <label className="ad-field">
              <span>Email</span>
              <input className="ad-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="ad-field">
              <span>Phone</span>
              <input className="ad-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required minLength={6} />
            </label>
            <button type="submit" className="ad-btn lime" disabled={busy}>
              Create mover
            </button>
          </form>
        </section>

        <section className="ad-card">
          <h2>Crew</h2>
          {loading ? (
            <p className="ad-loading">Loading…</p>
          ) : movers.length === 0 ? (
            <p className="ad-muted">No movers yet.</p>
          ) : (
            <div className="ad-list">
              {movers.map((m) => (
                <div key={m.uid} className="ad-lead on-grey">
                  <div className="ad-lead-main">
                    <strong>
                      {m.name}
                      <span className={`ad-badge ${m.status === "active" ? "bk-confirmed" : "bk-cancelled"}`}>
                        {m.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </strong>
                    <span>
                      {m.email} · {m.phone}
                    </span>
                  </div>
                  <button type="button" className="ad-btn sm" disabled={busy} onClick={() => toggle(m)}>
                    {m.status === "active" ? "Suspend" : "Reactivate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
