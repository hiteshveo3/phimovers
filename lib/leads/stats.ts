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
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
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
