"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  Call as CallIcon,
  Category as BoardIcon,
  DocumentDownload as DownloadIcon,
  HamburgerMenu as ListIcon,
  SearchNormal1 as SearchIcon,
} from "iconsax-reactjs";
import CopyPhoneButton from "@/components/admin/CopyPhoneButton";
import EmptyState from "@/components/admin/EmptyState";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import LostReasonSheet from "@/components/admin/LostReasonSheet";
import SlaBadge from "@/components/admin/SlaBadge";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useLeads } from "@/components/admin/LeadsProvider";
import { Ico } from "@/kit/components/Ico";
import { bulkUpdateLeadStatus, updateLeadStatus } from "@/lib/leads/service";
import { downloadCsv, exportLeadsCsv, matchesLeadQuery } from "@/lib/leads/stats";
import {
  formatLeadTime,
  hoursSince,
  LEAD_STATUSES,
  type Lead,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/leads/types";

type View = "list" | "board";

const statusFilters: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All", value: "all" },
  ...LEAD_STATUSES.map((s) => ({ label: s.label, value: s.value })),
];
const FLOW: LeadStatus[] = ["new", "contacted", "quoted", "booked", "lost"];

function BoardCard({
  lead,
  busy,
  onMove,
}: {
  lead: Lead;
  busy: boolean;
  onMove: (lead: Lead, to: LeadStatus) => void;
}) {
  const i = FLOW.indexOf(lead.status);
  const prev = i > 0 && lead.status !== "lost" ? FLOW[i - 1] : null;
  const next = lead.status !== "lost" && i < 3 ? FLOW[i + 1] : null;
  const label = (s: LeadStatus) => LEAD_STATUSES.find((x) => x.value === s)?.label ?? s;
  return (
    <article className="ad-kcard">
      <div className="ad-kcard-top">
        <Link href={`/admin/leads/${lead.id}`} className="t">
          {lead.name}
        </Link>
        {lead.priority === "urgent" && <span className="ad-badge urgent">Urgent</span>}
      </div>
      <p>
        {lead.from} → {lead.to}
      </p>
      <p>
        {lead.service}
        {lead.quoteAmount ? ` · ${lead.quoteAmount}` : ""}
        {lead.date ? ` · ${lead.date}` : ""}
      </p>
      <p>
        {lead.phone} · {formatLeadTime(lead.createdAt)}
      </p>
      {lead.status === "new" && (
        <div>
          <SlaBadge lead={lead} />
        </div>
      )}
      <div className="ad-kcard-acts">
        <a href={`tel:${lead.phone}`} className="ad-mini" aria-label={`Call ${lead.name}`}>
          <Ico icon={CallIcon} size={14} />
        </a>
        {prev && (
          <button type="button" className="ad-mini" disabled={busy} onClick={() => onMove(lead, prev)}>
            ← {label(prev)}
          </button>
        )}
        {next && (
          <button type="button" className="ad-mini lime" disabled={busy} onClick={() => onMove(lead, next)}>
            {label(next)} →
          </button>
        )}
        {lead.status !== "lost" && lead.status !== "booked" && (
          <button type="button" className="ad-mini" disabled={busy} onClick={() => onMove(lead, "lost")}>
            Lost
          </button>
        )}
        {lead.status === "lost" && (
          <button type="button" className="ad-mini lime" disabled={busy} onClick={() => onMove(lead, "new")}>
            Reopen
          </button>
        )}
      </div>
    </article>
  );
}

function LeadsInner() {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const { user } = useAdminAuth();
  const initialStatus =
    (searchParams.get("status") as LeadStatus | "all") || "all";
  const initialPriority =
    (searchParams.get("priority") as LeadPriority | "all") || "all";
  const initialAssignee = searchParams.get("assignee") || "all";

  const { leads, loading, error } = useLeads();
  const [q, setQ] = useState("");
  const [view, setView] = useState<View>(
    searchParams.get("view") === "board" ? "board" : "list",
  );
  const [status, setStatus] = useState<LeadStatus | "all">(
    statusFilters.some((f) => f.value === initialStatus)
      ? initialStatus
      : "all",
  );
  const [priority, setPriority] = useState<LeadPriority | "all">(
    initialPriority === "urgent" ? "urgent" : "all",
  );
  const [assignee, setAssignee] = useState<"all" | "mine" | "unassigned">(
    initialAssignee === "mine" || initialAssignee === "unassigned"
      ? initialAssignee
      : "all",
  );
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [lostFor, setLostFor] = useState<Lead | null>(null);

  const me =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "";

  useEffect(() => {
    const params = new URLSearchParams();
    if (view === "list" && status !== "all") params.set("status", status);
    if (priority !== "all") params.set("priority", priority);
    if (assignee !== "all") params.set("assignee", assignee);
    if (view === "board") params.set("view", "board");
    const qs = params.toString();
    router.replace(qs ? `/admin/leads?${qs}` : "/admin/leads", {
      scroll: false,
    });
  }, [status, priority, assignee, view, router]);

  // Everything except the status filter, shared by the list and the board.
  const matching = useMemo(() => {
    return leads.filter((l) => {
      if (priority !== "all" && l.priority !== priority) return false;
      if (assignee === "mine") {
        const a = (l.assignedTo ?? "").toLowerCase();
        const email = (user?.email ?? "").toLowerCase();
        if (!a || (!a.includes(me.toLowerCase()) && a !== email)) return false;
      }
      if (assignee === "unassigned" && l.assignedTo) return false;
      return matchesLeadQuery(l, q);
    });
  }, [leads, q, priority, assignee, me, user?.email]);

  const rows = useMemo(() => {
    let list = matching.filter((l) => status === "all" || l.status === status);
    if (status === "new" || status === "all") {
      list = [...list].sort((a, b) => {
        const aNew = a.status === "new" ? 0 : 1;
        const bNew = b.status === "new" ? 0 : 1;
        if (aNew !== bNew) return aNew - bNew;
        if (a.status === "new" && b.status === "new") {
          return hoursSince(b.createdAt) - hoursSince(a.createdAt);
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }
    return list;
  }, [matching, status]);

  const shown = view === "board" ? matching : rows;
  const newIds = shown.filter((l) => l.status === "new").map((l) => l.id);

  function onExport() {
    downloadCsv(
      `phi-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      exportLeadsCsv(shown),
    );
  }

  async function markAllContacted() {
    if (newIds.length === 0) return;
    if (
      !window.confirm(
        `Mark ${newIds.length} new lead${newIds.length === 1 ? "" : "s"} as contacted?`,
      )
    )
      return;
    setBusy(true);
    setActionError("");
    try {
      await bulkUpdateLeadStatus(
        newIds,
        "contacted",
        user?.email ?? undefined,
      );
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function move(lead: Lead, to: LeadStatus) {
    if (to === "lost") {
      setLostFor(lead);
      return;
    }
    setBusy(true);
    setActionError("");
    try {
      await updateLeadStatus(lead.id, to, undefined, user?.email ?? undefined);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function confirmLost(reason: string) {
    const lead = lostFor;
    setLostFor(null);
    if (!lead) return;
    setBusy(true);
    setActionError("");
    try {
      await updateLeadStatus(lead.id, "lost", reason, user?.email ?? undefined);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  const clear = () => {
    setQ("");
    setStatus("all");
    setPriority("all");
    setAssignee("all");
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: matching.length };
    for (const l of matching) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [matching]);

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Inbox</p>
          <h1>Leads</h1>
          <p className="ad-sub">
            {loading ? "Loading…" : `${shown.length} showing of ${leads.length}`}
          </p>
        </div>
        <div className="ad-head-actions">
          <div className="ad-seg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
              <Ico icon={ListIcon} size={18} />
              List
            </button>
            <button type="button" aria-pressed={view === "board"} onClick={() => setView("board")}>
              <Ico icon={BoardIcon} size={18} />
              Board
            </button>
          </div>
          {newIds.length > 0 && (
            <button type="button" onClick={markAllContacted} disabled={busy} className="ad-btn">
              Mark {newIds.length} contacted
            </button>
          )}
          <button type="button" onClick={onExport} disabled={shown.length === 0} className="ad-btn">
            <Ico icon={DownloadIcon} size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {(error || actionError) && (
        <p className="ad-banner" role="alert" style={{ margin: 0 }}>
          {error || actionError}
        </p>
      )}

      <div className="ad-search">
        <Ico icon={SearchIcon} size={18} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, email, postcode, service…"
          className="ad-input"
          aria-label="Search leads"
        />
      </div>

      <div className="ad-chips">
        {view === "list" &&
          statusFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              className="ad-chip"
              aria-pressed={status === f.value}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
              <small>{counts[f.value] ?? 0}</small>
            </button>
          ))}
        <button
          type="button"
          className="ad-chip red"
          aria-pressed={priority === "urgent"}
          onClick={() => setPriority((p) => (p === "urgent" ? "all" : "urgent"))}
        >
          Urgent
        </button>
        <button
          type="button"
          className="ad-chip"
          aria-pressed={assignee === "mine"}
          onClick={() => setAssignee((a) => (a === "mine" ? "all" : "mine"))}
        >
          Mine
        </button>
        <button
          type="button"
          className="ad-chip"
          aria-pressed={assignee === "unassigned"}
          onClick={() => setAssignee((a) => (a === "unassigned" ? "all" : "unassigned"))}
        >
          Unassigned
        </button>
      </div>

      {view === "board" ? (
        loading ? (
          <p className="ad-loading">Loading…</p>
        ) : (
          <div className="ad-board" aria-label="Lead pipeline board">
            {FLOW.map((st) => {
              const col = matching.filter((l) => l.status === st);
              const meta = LEAD_STATUSES.find((x) => x.value === st)!;
              return (
                <section key={st} className="ad-col" aria-label={meta.label}>
                  <div className="ad-col-h">
                    <b>
                      <i className={`c-${st}`} />
                      {meta.label}
                    </b>
                    <span>{col.length}</span>
                  </div>
                  {col.length === 0 && <p className="ad-col-empty">Nothing here.</p>}
                  {col.map((l) => (
                    <BoardCard key={l.id} lead={l} busy={busy} onMove={move} />
                  ))}
                </section>
              );
            })}
          </div>
        )
      ) : (
        <div className="ad-list">
          {loading && <p className="ad-loading">Loading…</p>}
          {!loading && rows.length === 0 && (
            <div className="ad-card">
              {leads.length === 0 ? (
                <EmptyState
                  title="No leads yet"
                  body="When someone submits the quote form, they appear here live."
                  actionHref="/contact#quote"
                  actionLabel="Open the quote form"
                />
              ) : (
                <EmptyState
                  title="No matches"
                  body="Try clearing the filters or the search."
                  actionLabel="Clear filters"
                  onAction={clear}
                />
              )}
            </div>
          )}
          {rows.map((lead) => (
            <div key={lead.id} className="ad-lead-row">
              <Link href={`/admin/leads/${lead.id}`} className="ad-lead">
                <div className="ad-lead-main">
                  <strong>
                    {lead.name}
                    {lead.priority === "urgent" && <span className="ad-badge urgent">Urgent</span>}
                  </strong>
                  <span>{lead.phone}</span>
                  <span>
                    {lead.from} → {lead.to}
                  </span>
                  <span>
                    {lead.service}
                    {lead.quoteAmount ? ` · ${lead.quoteAmount}` : ""}
                    {lead.assignedTo ? ` · ${lead.assignedTo}` : ""} · {formatLeadTime(lead.createdAt)}
                  </span>
                </div>
                <div className="ad-lead-side">
                  <LeadStatusBadge status={lead.status} />
                  {lead.status === "new" && <SlaBadge lead={lead} />}
                </div>
              </Link>
              <div className="ad-kcard-acts">
                <a href={`tel:${lead.phone}`} className="ad-mini lime" aria-label={`Call ${lead.name}`}>
                  <Ico icon={CallIcon} size={14} />
                  Call
                </a>
                <CopyPhoneButton phone={lead.phone} label="Copy" />
                {lead.status === "new" && (
                  <button type="button" className="ad-mini" disabled={busy} onClick={() => move(lead, "contacted")}>
                    Mark contacted
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <LostReasonSheet
        open={Boolean(lostFor)}
        busy={busy}
        onClose={() => setLostFor(null)}
        onConfirm={confirmLost}
      />
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<p className="ad-loading">Loading…</p>}>
      <LeadsInner />
    </Suspense>
  );
}
