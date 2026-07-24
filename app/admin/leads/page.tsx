"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import CopyPhoneButton from "@/components/admin/CopyPhoneButton";
import EmptyState from "@/components/admin/EmptyState";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import SlaBadge from "@/components/admin/SlaBadge";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useLeads } from "@/components/admin/LeadsProvider";
import { Icon } from "@/components/icons";
import { bulkUpdateLeadStatus } from "@/lib/leads/service";
import { downloadCsv, exportLeadsCsv } from "@/lib/leads/stats";
import {
  formatLeadTime,
  hoursSince,
  LEAD_STATUSES,
  type LeadPriority,
  type LeadStatus,
} from "@/lib/leads/types";

const statusFilters: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All", value: "all" },
  ...LEAD_STATUSES.map((s) => ({ label: s.label, value: s.value })),
];

function LeadsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAdminAuth();
  const initialStatus =
    (searchParams.get("status") as LeadStatus | "all") || "all";
  const initialPriority =
    (searchParams.get("priority") as LeadPriority | "all") || "all";
  const initialAssignee = searchParams.get("assignee") || "all";

  const { leads, loading, error } = useLeads();
  const [q, setQ] = useState("");
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

  const me =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "";

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (priority !== "all") params.set("priority", priority);
    if (assignee !== "all") params.set("assignee", assignee);
    const qs = params.toString();
    router.replace(qs ? `/admin/leads?${qs}` : "/admin/leads", {
      scroll: false,
    });
  }, [status, priority, assignee, router]);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (priority !== "all" && l.priority !== priority) return false;
      if (assignee === "mine") {
        const a = (l.assignedTo ?? "").toLowerCase();
        const email = (user?.email ?? "").toLowerCase();
        if (!a || (!a.includes(me.toLowerCase()) && a !== email)) return false;
      }
      if (assignee === "unassigned" && l.assignedTo) return false;
      if (!query) return true;
      return (
        l.name.toLowerCase().includes(query) ||
        l.phone.toLowerCase().includes(query) ||
        l.service.toLowerCase().includes(query) ||
        l.from.toLowerCase().includes(query) ||
        l.to.toLowerCase().includes(query) ||
        (l.assignedTo ?? "").toLowerCase().includes(query)
      );
    });

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
  }, [leads, q, status, priority, assignee, me, user?.email]);

  const newIds = rows.filter((l) => l.status === "new").map((l) => l.id);

  function onExport() {
    downloadCsv(
      `phi-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      exportLeadsCsv(rows),
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
    try {
      await bulkUpdateLeadStatus(
        newIds,
        "contacted",
        user?.email ?? undefined,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="hidden lg:block">
          <p className="text-xs font-bold uppercase tracking-wide text-[#163300]">
            Inbox
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted">
            {loading ? "Loading…" : `${rows.length} showing`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {newIds.length > 0 && (
            <button
              type="button"
              onClick={markAllContacted}
              disabled={busy}
              className="btn border border-line bg-surface px-4 py-2.5 text-sm disabled:opacity-50"
            >
              Mark {newIds.length} contacted
            </button>
          )}
          <button
            type="button"
            onClick={onExport}
            disabled={rows.length === 0}
            className="btn border border-line bg-surface px-4 py-2.5 text-sm disabled:opacity-50"
          >
            <Icon name="doc" className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </header>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, postcode…"
          className="h-12 w-full rounded-2xl border border-line bg-surface pl-10 pr-3 text-base text-[#163300] outline-none ring-[#9fe870] focus:ring-2 lg:h-11 lg:rounded-xl lg:text-sm"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatus(f.value)}
            className={
              "shrink-0 rounded-pill px-3.5 py-2 text-sm font-semibold " +
              (status === f.value
                ? "bg-[#163300] text-[#9fe870]"
                : "border border-line bg-surface text-content")
            }
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            setPriority((p) => (p === "urgent" ? "all" : "urgent"))
          }
          className={
            "shrink-0 rounded-pill px-3.5 py-2 text-sm font-semibold " +
            (priority === "urgent"
              ? "bg-red-700 text-white"
              : "border border-line bg-surface text-content")
          }
        >
          Urgent
        </button>
        <button
          type="button"
          onClick={() =>
            setAssignee((a) => (a === "mine" ? "all" : "mine"))
          }
          className={
            "shrink-0 rounded-pill px-3.5 py-2 text-sm font-semibold " +
            (assignee === "mine"
              ? "bg-[#163300] text-[#9fe870]"
              : "border border-line bg-surface text-content")
          }
        >
          Mine
        </button>
        <button
          type="button"
          onClick={() =>
            setAssignee((a) => (a === "unassigned" ? "all" : "unassigned"))
          }
          className={
            "shrink-0 rounded-pill px-3.5 py-2 text-sm font-semibold " +
            (assignee === "unassigned"
              ? "bg-[#163300] text-[#9fe870]"
              : "border border-line bg-surface text-content")
          }
        >
          Unassigned
        </button>
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {loading && (
          <li className="px-4 py-10 text-center text-sm text-muted">
            Loading…
          </li>
        )}
        {!loading && rows.length === 0 && (
          <li>
            {leads.length === 0 ? (
              <EmptyState
                title="No leads yet"
                body="When someone submits the quote form, they’ll appear here live."
                actionHref="/#quote"
                actionLabel="Open quote form"
              />
            ) : (
              <EmptyState
                title="No matches"
                body="Try clearing filters or search."
                actionLabel="Clear filters"
                onAction={() => {
                  setQ("");
                  setStatus("all");
                  setPriority("all");
                  setAssignee("all");
                }}
              />
            )}
          </li>
        )}
        {rows.map((lead) => (
          <li key={lead.id}>
            <div className="flex items-stretch">
              <Link
                href={`/admin/leads/${lead.id}`}
                className="min-w-0 flex-1 px-4 py-4 active:bg-[#9fe870]/15 lg:hover:bg-[#9fe870]/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-bold">{lead.name}</p>
                      {lead.priority === "urgent" && (
                        <span className="rounded-pill bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{lead.phone}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <LeadStatusBadge status={lead.status} />
                    {lead.status === "new" && <SlaBadge lead={lead} />}
                  </div>
                </div>
                <p className="mt-2 text-sm text-content/80">
                  {lead.from} → {lead.to}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                  <span>
                    {lead.service}
                    {lead.quoteAmount ? ` · ${lead.quoteAmount}` : ""}
                    {lead.assignedTo ? ` · ${lead.assignedTo}` : ""}
                  </span>
                  <span>{formatLeadTime(lead.createdAt)}</span>
                </div>
              </Link>
              <div className="flex flex-col justify-center gap-1 border-l border-line px-2 py-2">
                <CopyPhoneButton
                  phone={lead.phone}
                  iconOnly
                  className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-[#f4f5f2] text-[#163300]"
                />
                <a
                  href={`tel:${lead.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870] text-[#163300]"
                  aria-label="Call"
                >
                  <Icon name="phone" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense
      fallback={
        <p className="py-10 text-center text-sm text-muted">Loading…</p>
      }
    >
      <LeadsInner />
    </Suspense>
  );
}
