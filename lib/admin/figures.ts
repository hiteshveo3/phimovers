// Office figures for Overview and /admin/reports (Alpha's office_figures.dart / hm-pill), pure functions.
// Months and "today" are London time. Invoices are read only, through lib/admin/invoice-model.ts.

import type { Booking } from "@/lib/bookings/types";
import type { Lead } from "@/lib/leads/types";
import { balanceOf, displayStatus, isOpen, type Invoice } from "./invoice-model";

const TZ = "Europe/London";

/** YYYY-MM-DD in London. */
export function londonDay(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** YYYY-MM in London. */
export const londonMonth = (d: Date = new Date()) => londonDay(d).slice(0, 7);

/** "Good morning" / "Good afternoon" / "Good evening" by the London clock. */
export function greeting(d: Date = new Date()): string {
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(d));
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/** "Tuesday 21 October" in London. */
export const londonLongDate = (d: Date = new Date()) =>
  d.toLocaleDateString("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });

/** Money pills: what invoices still owe, how much of that is overdue, and payments this month. */
export function moneyFigures(invoices: Invoice[], today = londonDay()) {
  let owed = 0;
  let overdue = 0;
  let overdueCount = 0;
  let paidThisMonth = 0;
  const month = today.slice(0, 7);
  for (const inv of invoices) {
    const shown = displayStatus(inv, today);
    if (isOpen(shown)) owed += balanceOf(inv);
    if (shown === "overdue") {
      overdue += balanceOf(inv);
      overdueCount += 1;
    }
    if (inv.status !== "void") {
      for (const p of inv.payments) if (p.date.slice(0, 7) === month) paidThisMonth += p.amount;
    }
  }
  const r = (n: number) => Math.round(n * 100) / 100;
  return { owed: r(owed), overdue: r(overdue), overdueCount, paidThisMonth: r(paidThisMonth) };
}

const open = (b: Booking) => b.status !== "cancelled" && b.status !== "completed" && !b.archived;

/** The next jobs from today on, soonest first. */
export function comingUp(bookings: Booking[], count = 5, today = londonDay()): Booking[] {
  return bookings
    .filter((b) => open(b) && b.status !== "pending" && londonDay(new Date(b.scheduledDate)) >= today)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate) || a.scheduledTime.localeCompare(b.scheduledTime))
    .slice(0, count);
}

/** The last `n` months, oldest first, as YYYY-MM. */
export function lastMonths(n: number, now: Date = new Date()): string[] {
  const out: string[] = [];
  const [y, m] = londonMonth(now).split("-").map(Number);
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(y, m - 1 - i, 15));
    out.push(d.toISOString().slice(0, 7));
  }
  return out;
}

export type MonthRow = {
  month: string;
  /** Bookings marked paid that month (by paidAt), £. */
  bookingsPaid: number;
  /** Payments recorded on invoices that month (by payment date), £. Can overlap bookingsPaid. */
  invoicePayments: number;
  /** Jobs completed that month (by completedAt). */
  jobsDone: number;
  /** Leads received / of those, booked. */
  leads: number;
  leadsBooked: number;
};

/** Reports: revenue by paidAt, jobs per month and lead conversion (Alpha's reports_tab). */
export function monthlyReport(bookings: Booking[], leads: Lead[], invoices: Invoice[], months: string[]): MonthRow[] {
  const rows = new Map(months.map((m) => [m, { month: m, bookingsPaid: 0, invoicePayments: 0, jobsDone: 0, leads: 0, leadsBooked: 0 }]));
  for (const b of bookings) {
    if (b.paymentStatus === "paid" && b.paidAt) {
      const r = rows.get(londonMonth(new Date(b.paidAt)));
      if (r) r.bookingsPaid += b.totalPrice;
    }
    if (b.status === "completed" && b.completedAt) {
      const r = rows.get(londonMonth(new Date(b.completedAt)));
      if (r) r.jobsDone += 1;
    }
  }
  for (const inv of invoices) {
    if (inv.status === "void") continue;
    for (const p of inv.payments) {
      const r = rows.get(p.date.slice(0, 7));
      if (r) r.invoicePayments += p.amount;
    }
  }
  for (const l of leads) {
    const r = rows.get(londonMonth(new Date(l.createdAt)));
    if (!r) continue;
    r.leads += 1;
    if (l.status === "booked") r.leadsBooked += 1;
  }
  return months.map((m) => {
    const r = rows.get(m)!;
    return { ...r, bookingsPaid: Math.round(r.bookingsPaid * 100) / 100, invoicePayments: Math.round(r.invoicePayments * 100) / 100 };
  });
}

/* ---------- customers (Alpha's CustomerList) ---------- */

export type Customer = {
  key: string;
  name: string;
  phone: string;
  email: string;
  leads: number;
  bookings: number;
  /** £ of bookings marked paid. */
  paid: number;
  lastActivity: string;
  bookingIds: string[];
  leadIds: string[];
};

const phoneKey = (p: string) => p.replace(/\D/g, "").replace(/^44/, "0").replace(/^(?!0)/, "0");

/** One row per person: leads and bookings merged by phone, else email. */
export function mergeCustomers(leads: Lead[], bookings: Booking[]): Customer[] {
  const map = new Map<string, Customer>();
  const touch = (name: string, phone: string, email: string, at: string) => {
    const digits = phone.replace(/\D/g, "");
    const key = digits.length >= 6 ? `p:${phoneKey(phone)}` : email ? `e:${email.toLowerCase()}` : `n:${name.toLowerCase()}`;
    let c = map.get(key);
    if (!c) {
      c = { key, name, phone, email, leads: 0, bookings: 0, paid: 0, lastActivity: at, bookingIds: [], leadIds: [] };
      map.set(key, c);
    }
    if (at > c.lastActivity) {
      c.lastActivity = at;
      if (name) c.name = name;
    }
    if (!c.email && email) c.email = email;
    if (!c.phone && phone) c.phone = phone;
    return c;
  };
  for (const l of leads) {
    const c = touch(l.name, l.phone, l.email ?? "", l.updatedAt || l.createdAt);
    c.leads += 1;
    c.leadIds.push(l.id);
  }
  for (const b of bookings) {
    const c = touch(b.customerName, b.customerPhone, b.customerEmail, b.updatedAt || b.createdAt);
    c.bookings += 1;
    c.bookingIds.push(b.id);
    if (b.paymentStatus === "paid") c.paid += b.totalPrice;
  }
  return [...map.values()].sort((a, b) => b.lastActivity.localeCompare(a.lastActivity));
}
