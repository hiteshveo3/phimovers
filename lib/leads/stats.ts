import type { Lead } from "./types";
import { isSameDay, startOfWeek } from "./types";

export function leadStats(leads: Lead[]) {
  const today = leads.filter((l) => isSameDay(l.createdAt));
  const weekStart = startOfWeek();
  const week = leads.filter((l) => new Date(l.createdAt) >= weekStart);
  const byStatus = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    quoted: leads.filter((l) => l.status === "quoted").length,
    booked: leads.filter((l) => l.status === "booked").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };
  const closed = byStatus.booked + byStatus.lost;
  const winRate =
    closed === 0 ? 0 : Math.round((byStatus.booked / closed) * 100);
  const urgentNew = leads.filter(
    (l) => l.status === "new" && l.priority === "urgent",
  ).length;
  const needsReply = byStatus.new;

  return {
    total: leads.length,
    today: today.length,
    week: week.length,
    byStatus,
    winRate,
    urgentNew,
    needsReply,
    bookedToday: today.filter((l) => l.status === "booked").length,
  };
}

export function exportLeadsCsv(leads: Lead[]): string {
  const headers = [
    "id",
    "createdAt",
    "status",
    "priority",
    "name",
    "phone",
    "email",
    "from",
    "to",
    "date",
    "propertySize",
    "service",
    "quoteAmount",
    "assignedTo",
    "source",
  ];
  // Quoted, and a leading = + - @ (or tab / CR) is defused with an apostrophe so a spreadsheet never runs
  // a customer's text as a formula (same rule as lib/admin/csv.ts).
  const esc = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
  const rows = leads.map((l) =>
    [
      l.id,
      l.createdAt,
      l.status,
      l.priority,
      l.name,
      l.phone,
      l.email ?? "",
      l.from,
      l.to,
      l.date ?? "",
      l.propertySize,
      l.service,
      l.quoteAmount ?? "",
      l.assignedTo ?? "",
      l.source,
    ]
      .map((c) => esc(String(c)))
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/* Dashboard helpers                                                   */
/* ------------------------------------------------------------------ */

/** "£1,250", "1250.50", "approx £300" -> number (0 when there is no figure). */
export function parseMoney(v: string | undefined | null): number {
  if (!v) return 0;
  const m = String(v).replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

export function formatGbp(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Local yyyy-mm-dd key for a Date. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * The preferred move date is free text from the quote form (usually yyyy-mm-dd).
 * Returns a local yyyy-mm-dd key, or null when it cannot be read.
 */
export function moveDateKey(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const uk = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
  if (uk) {
    const y = uk[3].length === 2 ? 2000 + Number(uk[3]) : Number(uk[3]);
    return `${y}-${pad(Number(uk[2]))}-${pad(Number(uk[1]))}`;
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : dayKey(new Date(t));
}

export function dateFromKey(key: string): Date {
  return new Date(`${key}T12:00:00`);
}

/** Leads created per day for the last `days` days (oldest first, today last). */
export function leadsPerDay(leads: Lead[], days: number) {
  const out: { key: string; label: string; count: number; booked: number }[] =
    [];
  const index = new Map<string, number>();
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    index.set(key, out.length);
    out.push({
      key,
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      count: 0,
      booked: 0,
    });
  }
  for (const l of leads) {
    const i = index.get(dayKey(new Date(l.createdAt)));
    if (i === undefined) continue;
    out[i].count += 1;
    if (l.status === "booked") out[i].booked += 1;
  }
  return out;
}

function tally(values: string[], limit: number) {
  const m = new Map<string, number>();
  for (const v of values) {
    const k = v.trim();
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

/** Page the quote came from ("/" -> "Home page"). */
export function sourceLabel(source: string): string {
  const s = (source || "/").split("?")[0].split("#")[0] || "/";
  if (s === "/" || s === "") return "Home page";
  return s.replace(/\/$/, "");
}

export function dashboardStats(leads: Lead[], days: 14 | 30 = 14) {
  const base = leadStats(leads);
  const open = leads.filter((l) => l.status !== "lost" && l.status !== "booked");
  const quotedLeads = leads.filter((l) => l.status === "quoted");
  const bookedLeads = leads.filter((l) => l.status === "booked");
  const quotedValue = quotedLeads.reduce(
    (n, l) => n + parseMoney(l.quoteAmount),
    0,
  );
  const bookedValue = bookedLeads.reduce(
    (n, l) => n + parseMoney(l.quoteAmount),
    0,
  );
  const awaiting = leads
    .filter((l) => l.status === "new")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  const conversion =
    leads.length === 0
      ? 0
      : Math.round((base.byStatus.booked / leads.length) * 100);
  return {
    ...base,
    open: open.length,
    quotedValue,
    bookedValue,
    quotedCount: quotedLeads.length,
    awaiting,
    oldestAwaiting: awaiting[0],
    conversion,
    series: leadsPerDay(leads, days),
    topSources: tally(leads.map((l) => sourceLabel(l.source)), 5),
    topServices: tally(leads.map((l) => l.service), 5),
  };
}

/** Booked leads (plus optionally quoted) with their move date, grouped for the calendar. */
export function jobsByDate(leads: Lead[], includeQuoted = false) {
  const wanted = (l: Lead) =>
    l.status === "booked" || (includeQuoted && l.status === "quoted");
  const dated = new Map<string, Lead[]>();
  const undated: Lead[] = [];
  for (const l of leads.filter(wanted)) {
    const key = moveDateKey(l.date);
    if (!key) {
      undated.push(l);
      continue;
    }
    dated.set(key, [...(dated.get(key) ?? []), l]);
  }
  return { dated, undated };
}

/** Monday-based week days (yyyy-mm-dd keys) for the week containing `ref`, shifted by `offset` weeks. */
export function weekKeys(offset = 0, ref = new Date()): string[] {
  const start = startOfWeek(ref);
  start.setDate(start.getDate() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return dayKey(d);
  });
}

/** Free-text search across the useful lead fields. */
export function matchesLeadQuery(l: Lead, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    l.name,
    l.phone,
    l.email ?? "",
    l.service,
    l.from,
    l.to,
    l.assignedTo ?? "",
    l.trackCode,
    l.propertySize,
  ].some((v) => v.toLowerCase().includes(q));
}
