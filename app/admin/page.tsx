"use client";

import Link from "next/link";
import EmptyState from "@/components/admin/EmptyState";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import SlaBadge from "@/components/admin/SlaBadge";
import { useLeads } from "@/components/admin/LeadsProvider";
import { Icon } from "@/components/icons";
import { leadStats } from "@/lib/leads/stats";
import { formatLeadTime } from "@/lib/leads/types";

export default function AdminOverviewPage() {
  const { leads, loading, error } = useLeads();
  const s = leadStats(leads);
  const recent = leads.slice(0, 8);
  const urgent = leads.filter(
    (l) => l.status === "new" && l.priority === "urgent",
  );

  const cards = [
    {
      label: "Need reply",
      value: s.needsReply,
      hint: "Open new leads",
      href: "/admin/leads?status=new",
      icon: "mail",
    },
    {
      label: "Today",
      value: s.today,
      hint: "Leads received today",
      href: "/admin/leads",
      icon: "calendar",
    },
    {
      label: "This week",
      value: s.week,
      hint: "Mon–now",
      href: "/admin/leads",
      icon: "dashboard",
    },
    {
      label: "Win rate",
      value: `${s.winRate}%`,
      hint: `${s.byStatus.booked} booked / ${s.byStatus.lost} lost`,
      href: "/admin/leads?status=booked",
      icon: "check",
    },
  ];

  return (
    <div className="space-y-5 lg:space-y-8">
      <header className="hidden lg:flex lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#163300]">
            Overview
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Live pipeline from website quotes.
          </p>
        </div>
        <Link
          href="/admin/leads?status=new"
          className="btn bg-[#9fe870] px-4 py-2.5 text-[#163300]"
        >
          Reply queue
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </header>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      {urgent.length > 0 && (
        <Link
          href="/admin/leads?priority=urgent"
          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900"
        >
          <Icon name="alert" className="h-5 w-5 shrink-0" />
          {urgent.length} urgent lead{urgent.length === 1 ? "" : "s"} waiting
          <Icon name="arrowRight" className="ml-auto h-4 w-4" />
        </Link>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-line bg-surface p-4 active:bg-[#9fe870]/20 lg:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold text-muted lg:text-sm">
                {c.label}
              </p>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#9fe870]/35 text-[#163300]">
                <Icon name={c.icon} className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight lg:text-3xl">
              {loading ? "—" : c.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted">{c.hint}</p>
          </Link>
        ))}
      </section>

      <div className="grid grid-cols-5 gap-1 overflow-hidden rounded-2xl border border-line bg-line lg:hidden">
        {(
          [
            ["New", s.byStatus.new],
            ["Talk", s.byStatus.contacted],
            ["Quote", s.byStatus.quoted],
            ["Book", s.byStatus.booked],
            ["Lost", s.byStatus.lost],
          ] as const
        ).map(([label, n]) => (
          <div key={label} className="bg-surface px-1 py-3 text-center">
            <p className="text-lg font-extrabold text-[#163300]">
              {loading ? "—" : n}
            </p>
            <p className="text-[10px] font-semibold text-muted">{label}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 lg:px-5">
          <h2 className="text-sm font-bold lg:text-base">Recent leads</h2>
          <Link
            href="/admin/leads"
            className="text-sm font-semibold text-[#163300]"
          >
            See all
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {loading && (
            <li className="px-4 py-8 text-center text-sm text-muted">
              Loading…
            </li>
          )}
          {!loading && recent.length === 0 && (
            <li>
              <EmptyState
                title="No leads yet"
                body="Website quotes land here in real time."
                actionHref="/#quote"
                actionLabel="Try quote form"
              />
            </li>
          )}
          {recent.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="block px-4 py-3.5 active:bg-[#9fe870]/15 lg:hover:bg-[#9fe870]/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-bold">{lead.name}</p>
                      {lead.priority === "urgent" && (
                        <span className="rounded-pill bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {lead.from} → {lead.to} · {lead.service}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <LeadStatusBadge status={lead.status} />
                    {lead.status === "new" && <SlaBadge lead={lead} />}
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  {formatLeadTime(lead.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
