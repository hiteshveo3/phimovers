"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  CloseCircle as LostIcon,
  Clock as ClockIcon,
  Flash as FlashIcon,
  Moneys as MoneyIcon,
  Sms as MailIcon,
  TickCircle as TickIcon,
  TrendUp as TrendIcon,
} from "iconsax-reactjs";
import EmptyState from "@/components/admin/EmptyState";
import LeadRow from "@/components/admin/LeadRow";
import SlaBadge from "@/components/admin/SlaBadge";
import { useLeads } from "@/components/admin/LeadsProvider";
import { OfficeAssistant, useOfficeAI } from "@/components/admin/OfficeAssistant";
import { Ico } from "@/kit/components/Ico";
import { dashboardStats, formatGbp } from "@/lib/leads/stats";
import { LEAD_STATUSES } from "@/lib/leads/types";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useBookings } from "@/components/admin/BookingsProvider";
import { BookingStatusBadge } from "@/components/admin/BookingBadge";
import { can } from "@/lib/admin/roles";
import { subscribeInvoices } from "@/lib/admin/invoices";
import type { Invoice } from "@/lib/admin/invoice-model";
import { comingUp, greeting, londonLongDate, moneyFigures } from "@/lib/admin/figures";
import { formatMoveDate } from "@/lib/bookings/types";

const PIPE_ORDER = ["new", "contacted", "quoted", "booked", "lost"] as const;

function LeadsChart({
  series,
}: {
  series: { key: string; label: string; count: number; booked: number }[];
}) {
  const W = 640;
  const H = 200;
  const pad = { l: 28, r: 6, t: 10, b: 24 };
  const max = Math.max(4, ...series.map((s) => s.count));
  const top = Math.ceil(max / 2) * 2;
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const slot = iw / series.length;
  const bw = Math.max(4, Math.min(26, slot * 0.62));
  const y = (v: number) => pad.t + ih - (v / top) * ih;
  const every = series.length > 16 ? 5 : 2;
  const total = series.reduce((n, s) => n + s.count, 0);

  return (
    <svg
      className="ad-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Leads per day, ${total} in the last ${series.length} days`}
    >
      {[0, top / 2, top].map((v) => (
        <g key={v}>
          <line className="grid" x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} />
          <text x={pad.l - 6} y={y(v) + 4} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      {series.map((s, i) => {
        const x = pad.l + slot * i + (slot - bw) / 2;
        const h = (s.count / top) * ih;
        const hb = (s.booked / top) * ih;
        return (
          <g key={s.key}>
            <title>{`${s.label}: ${s.count} lead${s.count === 1 ? "" : "s"}${s.booked ? `, ${s.booked} booked` : ""}`}</title>
            <rect className="bar" x={x} y={y(s.count)} width={bw} height={Math.max(h, s.count ? 2 : 0)} rx={Math.min(6, bw / 2)} />
            {s.booked > 0 && (
              <rect className="bar-booked" x={x} y={y(s.booked) + 0} width={bw} height={Math.max(hb, 2)} rx={Math.min(6, bw / 2)} />
            )}
            {(series.length - 1 - i) % every === 0 && (
              <text x={x + bw / 2} y={H - 6} textAnchor="middle">
                {s.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Rank({ rows, empty }: { rows: { label: string; count: number }[]; empty: string }) {
  if (rows.length === 0) return <p className="ad-muted">{empty}</p>;
  const max = rows[0].count;
  return (
    <ul className="ad-rank">
      {rows.map((r) => (
        <li key={r.label}>
          <div>
            <span>{r.label}</span>
            <span>{r.count}</span>
          </div>
          <u>
            <b style={{ width: `${Math.max(6, (r.count / max) * 100)}%` }} />
          </u>
        </li>
      ))}
    </ul>
  );
}

export default function AdminOverviewPage() {
  const { leads, loading } = useLeads();
  const { bookings } = useBookings();
  const { role, user } = useAdminAuth();
  const money = can(role, "invoices");
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const ai = useOfficeAI();

  // Money pills read the invoices (read only) for roles that may see them.
  useEffect(() => {
    if (!money) return undefined;
    try {
      return subscribeInvoices(setInvoices, () => setInvoices(null));
    } catch {
      return undefined;
    }
  }, [money]);
  const pills = useMemo(() => (invoices ? moneyFigures(invoices) : null), [invoices]);
  const next = useMemo(() => comingUp(bookings, 5), [bookings]);
  const [hello, setHello] = useState({ text: "Dashboard", date: "" });
  useEffect(() => {
    // Client clock only (London), so the server render never disagrees.
    const first = (user?.displayName ?? "").split(" ")[0];
    setHello({ text: `${greeting()}${first ? `, ${first}` : ""}`, date: londonLongDate() });
  }, [user]);
  const [days, setDays] = useState<14 | 30>(14);
  const s = useMemo(() => dashboardStats(leads, days), [leads, days]);
  const recent = leads.slice(0, 6);
  const dash = (v: string | number) => (loading ? "…" : v);
  const oldest = s.oldestAwaiting;
  const pipeTotal = Math.max(1, leads.length);

  const kpis = [
    { label: "New today", value: s.today, sub: "Leads received today", href: "/admin/leads", icon: FlashIcon },
    { label: "This week", value: s.week, sub: "Since Monday", href: "/admin/leads", icon: CalendarIcon },
    {
      label: "Awaiting reply",
      value: s.needsReply,
      href: "/admin/leads?status=new",
      icon: ClockIcon,
      warn: s.needsReply > 0 && oldest && Date.now() - new Date(oldest.createdAt).getTime() > 4 * 36e5,
      sub: oldest ? <SlaBadge lead={oldest} /> : "All caught up",
    },
    { label: "Quoted value", value: formatGbp(s.quotedValue), sub: `${s.quotedCount} open quote${s.quotedCount === 1 ? "" : "s"}`, href: "/admin/leads?status=quoted", icon: MoneyIcon },
    { label: "Booked", value: s.byStatus.booked, sub: s.bookedValue ? `${formatGbp(s.bookedValue)} confirmed` : "Confirmed jobs", href: "/admin/leads?status=booked", icon: TickIcon, dark: true },
    { label: "Lost", value: s.byStatus.lost, sub: "Closed, not won", href: "/admin/leads?status=lost", icon: LostIcon },
    { label: "Conversion", value: `${s.conversion}%`, sub: `${s.winRate}% of closed leads won`, href: "/admin/leads?status=booked", icon: TrendIcon },
    { label: "Urgent new", value: s.urgentNew, sub: "Moving within 48 hours", href: "/admin/leads?status=new&priority=urgent", icon: MailIcon, warn: s.urgentNew > 0 },
  ];

  return (
    <div className="ad">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Overview{hello.date ? ` · ${hello.date}` : ""}</p>
          <h1>{hello.text}</h1>
          <p className="ad-sub">Live from the website, the app and the quote form.</p>
        </div>
        <div className="ad-head-actions">
          <Link href="/admin/leads?status=new" className="ad-btn lime">
            Reply queue{s.needsReply ? ` (${s.needsReply})` : ""}
          </Link>
          <Link href="/admin/invoices" className="ad-btn">
            Invoices
          </Link>
        </div>
      </div>

      <div className="ad-kpis" aria-label="Quick actions">
        {[
          ...(money ? [{ href: "/admin/invoices", label: "New invoice", sub: "Bill a job" }] : []),
          { href: "/admin/jobs", label: "Jobs", sub: "The week ahead" },
          ...(money ? [{ href: "/admin/invoices", label: "Unpaid", sub: pills ? `${formatGbp(pills.owed)} owed` : "Invoices to chase" }] : []),
          { href: "/admin/customers", label: "Customers", sub: "Everyone in one list" },
        ].map((t) => (
          <Link key={t.label} href={t.href} className="ad-kpi">
            <b style={{ fontSize: 18 }}>{t.label}</b>
            <small>{t.sub}</small>
          </Link>
        ))}
      </div>

      {money && pills && (
        <div className="ad-chips" aria-label="Money">
          <Link href="/admin/invoices" className="ad-chip">Owed <b>{formatGbp(pills.owed)}</b></Link>
          <Link href="/admin/invoices" className="ad-chip" style={pills.overdue > 0 ? { background: "var(--amber)", color: "var(--amber-ink)" } : undefined}>
            Overdue <b>{formatGbp(pills.overdue)}</b>{pills.overdueCount ? ` (${pills.overdueCount})` : ""}
          </Link>
          <Link href="/admin/reports" className="ad-chip">Paid this month <b>{formatGbp(pills.paidThisMonth)}</b></Link>
        </div>
      )}

      <section className="ad-card" aria-labelledby="next-h">
        <div className="ad-card-head">
          <h2 id="next-h">Coming up</h2>
          <Link href="/admin/jobs" className="ad-link">Calendar</Link>
        </div>
        {next.length === 0 ? (
          <p className="ad-muted" style={{ margin: 0 }}>No confirmed jobs ahead.</p>
        ) : (
          <div className="ad-list">
            {next.map((b) => (
              <div key={b.id} className="ad-lead-row" style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <Link href={`/admin/bookings/${b.id}`} style={{ display: "grid", minWidth: 0 }}>
                  <b>{formatMoveDate(b.scheduledDate)}{b.scheduledTime ? ` · ${b.scheduledTime}` : ""} · {b.customerName}</b>
                  <span className="ad-muted ad-small">{b.addressLine} → {b.toAddressLine} · {b.moverName ?? "no crew yet"}</span>
                </Link>
                <span className="ad-head-actions" style={{ gap: 6 }}>
                  <BookingStatusBadge status={b.status} />
                  <a className="ad-btn sm lime" href={`tel:${b.customerPhone}`}>Call</a>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <OfficeAssistant ai={ai} />

      <div className="ad-kpis">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className={"ad-kpi" + (k.warn ? " warn" : "") + (k.dark ? " dark" : "")}
          >
            <i>
              <Ico icon={k.icon} size={22} />
            </i>
            <b>{dash(k.value)}</b>
            <span>{k.label}</span>
            <small>{k.sub}</small>
          </Link>
        ))}
      </div>

      <section className="ad-card" aria-labelledby="pipe-h">
        <div className="ad-card-head">
          <h2 id="pipe-h">Pipeline</h2>
          <span className="ad-muted ad-small">{leads.length} leads in total</span>
        </div>
        <div className="ad-pipe" role="img" aria-label="Leads by status">
          {PIPE_ORDER.map((st) => {
            const n = s.byStatus[st];
            if (!n) return null;
            return (
              <Link
                key={st}
                href={`/admin/leads?status=${st}`}
                className={`c-${st}`}
                style={{ flex: n / pipeTotal }}
                title={`${st}: ${n}`}
                aria-label={`${st}: ${n}`}
              />
            );
          })}
        </div>
        <div className="ad-legend">
          {PIPE_ORDER.map((st) => (
            <Link key={st} href={`/admin/leads?status=${st}`}>
              <b>{dash(s.byStatus[st])}</b>
              <span>
                <i className={`c-${st}`} />
                {LEAD_STATUSES.find((x) => x.value === st)?.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="ad-cols">
        <section className="ad-card" aria-labelledby="chart-h">
          <div className="ad-card-head">
            <h2 id="chart-h">Leads over time</h2>
            <div className="ad-seg" role="group" aria-label="Range">
              {([14, 30] as const).map((d) => (
                <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)}>
                  {d} days
                </button>
              ))}
            </div>
          </div>
          <LeadsChart series={s.series} />
          <p className="ad-muted ad-small" style={{ margin: "8px 0 0" }}>
            Lime bars are leads received; dark bars are the ones that became bookings.
          </p>
        </section>

        <div className="ad" style={{ alignContent: "start" }}>
          <section className="ad-card" aria-labelledby="src-h">
            <h2 id="src-h">Top pages and sources</h2>
            <Rank rows={s.topSources} empty="No leads yet." />
          </section>
          <section className="ad-card" aria-labelledby="svc-h">
            <h2 id="svc-h">Top services</h2>
            <Rank rows={s.topServices} empty="No leads yet." />
          </section>
        </div>
      </div>

      <section className="ad-card" aria-labelledby="recent-h">
        <div className="ad-card-head">
          <h2 id="recent-h">Recent leads</h2>
          <Link href="/admin/leads" className="ad-link">
            See all
          </Link>
        </div>
        {loading && <p className="ad-loading">Loading…</p>}
        {!loading && recent.length === 0 && (
          <EmptyState
            title="No leads yet"
            body="Website quotes land here in real time, with a chime."
            actionHref="/contact#quote"
            actionLabel="Try the quote form"
          />
        )}
        <div className="ad-list">
          {recent.map((l) => (
            <LeadRow key={l.id} lead={l} />
          ))}
        </div>
      </section>
    </div>
  );
}
