"use client";

import { useEffect, useState } from "react";
import { DocumentDownload as DownloadIcon, Messages2 as ChatsIcon, SearchNormal1 as SearchIcon } from "iconsax-reactjs";
import EmptyState from "@/components/admin/EmptyState";
import { Ico } from "@/kit/components/Ico";
import { staffFetch } from "@/lib/admin/staff-fetch";

// Website chats with "Ask Phi" (as on Alpha Movers): read them here, or download them all as JSON.
// The data comes from the staff-only /api/admin/chats route.

const CHATS = "/api/admin/chats";

type Msg = { role: "customer" | "phi"; at: string; text: string; quote?: string };
type Conv = {
  id: string;
  updatedAt: string;
  customer: { id: string; name?: string | null } | null;
  firstQuestion: string;
  customerMessages: number;
  quotes: string[];
  messages: Msg[];
};
type Chats = {
  storage: string;
  totals: { customers: number; conversations: number; customerMessages: number; quotesShown: number };
  conversations: Conv[];
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function AdminChatsPage() {
  const [chats, setChats] = useState<Chats | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    staffFetch(CHATS)
      .then(async (r) => {
        if (!r.ok) throw new Error(r.status === 503 ? "Chats need the Firebase service account on the server." : "The chats could not be loaded.");
        setChats((await r.json()) as Chats);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "The chats could not be loaded."));
  }, []);

  async function download(anon: boolean) {
    setBusy(anon ? "anon" : "all");
    try {
      const r = await staffFetch(`${CHATS}?download=1${anon ? "&anon=1" : ""}`);
      if (!r.ok) throw new Error("The download did not work. Try again.");
      const name = /filename="([^"]+)"/.exec(r.headers.get("Content-Disposition") ?? "")?.[1] ?? "phi-movers-chats.json";
      const url = URL.createObjectURL(await r.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The download did not work.");
    } finally {
      setBusy("");
    }
  }

  const term = q.trim().toLowerCase();
  const shown = (chats?.conversations ?? []).filter(
    (c) => !term || [c.customer?.name, c.firstQuestion, ...c.messages.map((m) => m.text)].join(" ").toLowerCase().includes(term),
  );

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Office</p>
          <h1>Website chats</h1>
          <p className="ad-sub">What customers asked the &ldquo;Ask Phi&rdquo; assistant.</p>
        </div>
        {chats && chats.conversations.length > 0 && (
          <div className="ad-head-actions">
            <button type="button" className="ad-btn lime" disabled={!!busy} onClick={() => void download(false)}>
              <Ico icon={DownloadIcon} size={18} />
              {busy === "all" ? "Preparing…" : "Download all"}
            </button>
            <button type="button" className="ad-btn" disabled={!!busy} onClick={() => void download(true)}>
              {busy === "anon" ? "Preparing…" : "Download without names"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="ad-banner">{error}</div>}
      {!chats && !error && <p className="ad-muted">Loading…</p>}

      {chats && (
        <>
          <div className="ad-kpis">
            {(
              [
                ["Chats", chats.totals.conversations],
                ["Customer messages", chats.totals.customerMessages],
                ["Visitors", chats.totals.customers],
                ["Prices shown", chats.totals.quotesShown],
              ] as [string, number][]
            ).map(([label, n]) => (
              <div key={label} className="ad-kpi">
                <b>{n}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="ad-muted ad-small" style={{ margin: 0 }}>
            The download is for analysis. Without names still keeps what people typed, so treat it with care.
          </p>

          {chats.conversations.length === 0 ? (
            <EmptyState icon={ChatsIcon} title="No chats yet" body="Conversations with Ask Phi on the website show here." />
          ) : (
            <>
              <div className="ad-search">
                <Ico icon={SearchIcon} size={18} />
                <input className="ad-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or a word" aria-label="Search chats" />
              </div>
              <div className="ad-list">
                {shown.map((c) => (
                  <details key={c.id} className="ad-card">
                    <summary style={{ cursor: "pointer", display: "grid", gap: 4 }}>
                      <strong style={{ overflowWrap: "anywhere" }}>{c.firstQuestion || "Chat"}</strong>
                      <span className="ad-muted ad-small">
                        {c.customer?.name || "No name given"} · {when(c.updatedAt)} · {c.customerMessages} message{c.customerMessages === 1 ? "" : "s"}
                        {c.quotes.length ? ` · ${c.quotes.length} price${c.quotes.length === 1 ? "" : "s"} shown` : ""}
                      </span>
                    </summary>
                    <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                      {c.messages.map((m, i) => (
                        <div
                          key={i}
                          style={{
                            justifySelf: m.role === "customer" ? "end" : "start",
                            maxWidth: "88%",
                            padding: "10px 14px",
                            borderRadius: 16,
                            background: m.role === "customer" ? "var(--ink)" : "var(--grey)",
                            color: m.role === "customer" ? "#fff" : "var(--ink)",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          <span style={{ display: "block", fontSize: 12, opacity: 0.7, marginBottom: 2 }}>
                            {m.role === "customer" ? c.customer?.name || "Customer" : "Phi"} · {when(m.at)}
                          </span>
                          {m.text}
                          {m.quote && <span style={{ display: "block", marginTop: 6, fontWeight: 600 }}>{m.quote}</span>}
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
                {shown.length === 0 && <p className="ad-muted">No chats match that search.</p>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
