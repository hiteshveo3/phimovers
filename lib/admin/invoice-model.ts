// Invoices for the staff dashboard. Constants and pure functions only: the dashboard (browser), the PDF
// API route and the PDF builder (server) all import this file, so it must not use anything Node-only.
// VAT is OFF by default, a GBP 40 deposit is optional, and
// bank details are never hard-coded (they come from the INVOICE_BANK_DETAILS env on the server).

import { ADDRESS, BRAND, COMPANY_NAME, DEPOSIT, EMAIL, PHONE_DISPLAY } from "../../kit/site-facts";

export const INVOICE_STATUSES = ["draft", "sent", "paid", "void"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
/** What staff see: "paid", "part" and "overdue" are worked out from payments and dates. */
export type ShownStatus = InvoiceStatus | "part" | "overdue";
export const STATUS_TEXT: Record<ShownStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  void: "Cancelled",
  overdue: "Overdue",
  part: "Part paid",
};

export type InvoiceLine = {
  description: string;
  qty: number;
  unit: string;
  rate: number;
};
export type InvoiceCustomer = {
  name: string;
  business: string;
  address: string;
  email: string;
  phone: string;
};
export type Payment = {
  date: string;
  amount: number;
  method: string;
  reference: string;
};
export type InvoiceEvent = { at: string; text: string };

export type InvoiceFields = {
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  terms: string;
  customer: InvoiceCustomer;
  /** Lead this invoice was raised from (optional). */
  leadId: string;
  jobRef: string;
  /** Booking number (PHI-XXXXXX) this invoice bills, set on drafts made when a job is completed. */
  bookingRef: string;
  moveDate: string;
  lines: InvoiceLine[];
  discount: { type: "amount" | "percent"; value: number };
  /** VAT is off by default; when on, `vatRate` percent is added to the net total. */
  vat: boolean;
  vatRate: number;
  /** Deposit asked for up front (0 = none). The usual one is GBP 40. */
  deposit: number;
  customerNotes: string;
  internalNotes: string;
  payments: Payment[];
};
export type Invoice = InvoiceFields & {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  events: InvoiceEvent[];
};

export const BUSINESS = {
  name: COMPANY_NAME,
  brand: BRAND,
  address: ADDRESS,
  phone: PHONE_DISPLAY,
  email: EMAIL,
};
export const DEFAULT_DEPOSIT = DEPOSIT;
export const DEFAULT_VAT_RATE = 20;
export const DEFAULT_TERMS = "Payment due within 7 days of the move.";
export const NUMBER_PREFIX = "PHI-INV";
export const MAX_LINES = 30;
export const MAX_PAYMENTS = 20;
const MAX_EVENTS = 60;

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const money = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export function lineTotal(l: InvoiceLine) {
  return round2(Math.max(0, l.qty) * Math.max(0, l.rate));
}

type Money = Pick<InvoiceFields, "lines" | "discount" | "vat" | "vatRate">;

export function totalsOf(inv: Money) {
  const subtotal = round2(inv.lines.reduce((sum, l) => sum + lineTotal(l), 0));
  const off =
    inv.discount.type === "percent"
      ? round2((subtotal * Math.min(100, Math.max(0, inv.discount.value))) / 100)
      : Math.min(subtotal, Math.max(0, inv.discount.value));
  const net = round2(subtotal - off);
  const vat = inv.vat ? round2((net * Math.max(0, inv.vatRate)) / 100) : 0;
  return { subtotal, discount: round2(off), net, vat, total: round2(net + vat) };
}

export const paidOf = (payments: Payment[]) =>
  round2(payments.reduce((s, p) => s + p.amount, 0));
export const balanceOf = (inv: Money & Pick<InvoiceFields, "payments">) =>
  round2(totalsOf(inv).total - paidOf(inv.payments));

/** The status staff see. Void and draft are fixed; the rest follows the money and the due date. */
export function displayStatus(
  inv: Money & Pick<Invoice, "status" | "dueDate" | "payments">,
  today: string,
): ShownStatus {
  if (inv.status === "void" || inv.status === "draft") return inv.status;
  const total = totalsOf(inv).total;
  if (total > 0 && balanceOf(inv) <= 0) return "paid";
  if (paidOf(inv.payments) > 0) return "part";
  return inv.status === "sent" && inv.dueDate && inv.dueDate < today
    ? "overdue"
    : "sent";
}

/** Whether the invoice is still owed money. */
export const isOpen = (s: ShownStatus) =>
  s === "sent" || s === "part" || s === "overdue";

/** What gets stored: sent or paid, decided by the balance. */
export function storedStatus(
  inv: Money & Pick<InvoiceFields, "status" | "payments">,
): InvoiceStatus {
  if (inv.status === "void" || inv.status === "draft") return inv.status;
  const total = totalsOf(inv).total;
  return total > 0 && balanceOf(inv) <= 0 ? "paid" : "sent";
}

export const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

/** Dates as people read them: 14 Oct 2026. */
export function longDate(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const todayIso = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** PHI-INV-2026-0001, one more than the highest number already used that year. */
export function nextNumber(year: number, existing: string[]) {
  const re = new RegExp(`^${NUMBER_PREFIX}-(\\d{4})-(\\d+)$`);
  const top = existing.reduce((max, n) => {
    const m = re.exec(n);
    return m && Number(m[1]) === year ? Math.max(max, Number(m[2])) : max;
  }, 0);
  return `${NUMBER_PREFIX}-${year}-${String(top + 1).padStart(4, "0")}`;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// eslint-disable-next-line no-control-regex
const CTRL = /[\u0000-\u001f]/g;
const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(CTRL, " ").trim().slice(0, max) : "";
const multi = (v: unknown, max: number) =>
  typeof v === "string"
    ? v.replace(/\r/g, "").replace(/[\u0000-\u0009\u000b-\u001f]/g, " ").trim().slice(0, max)
    : "";
const date = (v: unknown) => (typeof v === "string" && DATE.test(v) ? v : "");
const amount = (v: unknown, max: number) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(0, round2(n))) : 0;
};

export type CleanResult =
  | { ok: true; value: InvoiceFields }
  | { ok: false; problem: string };

/** Checks and tidies what the browser sent. Totals and status are never taken from the browser. */
export function cleanInvoice(raw: unknown): CleanResult {
  if (!raw || typeof raw !== "object") return { ok: false, problem: "invalid" };
  const r = raw as Record<string, unknown>;
  const c = (r.customer ?? {}) as Record<string, unknown>;
  const d = (r.discount ?? {}) as Record<string, unknown>;
  const status = INVOICE_STATUSES.includes(r.status as InvoiceStatus)
    ? (r.status as InvoiceStatus)
    : "draft";

  const lines: InvoiceLine[] = (Array.isArray(r.lines) ? r.lines : [])
    .slice(0, MAX_LINES)
    .map((l) => {
      const x = (l ?? {}) as Record<string, unknown>;
      return {
        description: text(x.description, 200),
        qty: amount(x.qty, 999),
        unit: text(x.unit, 20),
        rate: amount(x.rate, 100000),
      };
    })
    .filter((l) => l.description || l.rate > 0 || l.qty > 0);

  const payments: Payment[] = (Array.isArray(r.payments) ? r.payments : [])
    .slice(0, MAX_PAYMENTS)
    .map((p) => {
      const x = (p ?? {}) as Record<string, unknown>;
      return {
        date: date(x.date),
        amount: amount(x.amount, 1000000),
        method: text(x.method, 60),
        reference: text(x.reference, 80),
      };
    })
    .filter((p) => p.amount > 0 || p.date);

  const customer: InvoiceCustomer = {
    name: text(c.name, 120),
    business: text(c.business, 120),
    address: multi(c.address, 300),
    email: text(c.email, 120).toLowerCase(),
    phone: text(c.phone, 30),
  };
  if (customer.email && !EMAIL_RE.test(customer.email))
    return { ok: false, problem: "email" };

  const value: InvoiceFields = {
    status,
    issueDate: date(r.issueDate),
    dueDate: date(r.dueDate),
    terms: text(r.terms, 160),
    customer,
    leadId: text(r.leadId, 80),
    jobRef: text(r.jobRef, 60),
    bookingRef: text(r.bookingRef, 20).toUpperCase(),
    moveDate: date(r.moveDate),
    lines,
    discount: {
      type: d.type === "percent" ? "percent" : "amount",
      value: amount(d.value, 100000),
    },
    vat: r.vat === true,
    vatRate: amount(r.vatRate, 100) || DEFAULT_VAT_RATE,
    deposit: amount(r.deposit, 100000),
    customerNotes: multi(r.customerNotes, 1000),
    internalNotes: multi(r.internalNotes, 2000),
    payments,
  };

  if (!value.issueDate) return { ok: false, problem: "invalid" };
  if (payments.some((p) => !p.date || p.amount <= 0))
    return { ok: false, problem: "payment" };
  if (status !== "draft" && status !== "void") {
    if (!customer.name) return { ok: false, problem: "customer" };
    if (!lines.some((l) => l.description)) return { ok: false, problem: "lines" };
  }
  const total = totalsOf(value).total;
  if (paidOf(payments) > total + 0.005) return { ok: false, problem: "overpaid" };
  return { ok: true, value };
}

/** Short history lines for what changed on a save. */
export function describeChanges(
  prev: Invoice | null,
  next: InvoiceFields,
): string[] {
  const nextStatus = storedStatus(next);
  if (!prev) return [`Created as ${STATUS_TEXT[nextStatus]}`];
  const out: string[] = [];
  if (prev.status !== next.status && next.status === "void") out.push("Cancelled");
  else if (prev.status !== nextStatus) out.push(`Now ${STATUS_TEXT[nextStatus]}`);
  next.payments
    .slice(prev.payments.length)
    .forEach((p) =>
      out.push(
        `Payment of ${money(p.amount)} recorded${p.method ? ` by ${p.method}` : ""}`,
      ),
    );
  if (prev.payments.length > next.payments.length) out.push("A payment was removed");
  const sig = (i: InvoiceFields) =>
    JSON.stringify([i.lines, i.discount, i.customer, i.issueDate, i.dueDate, i.vat, i.vatRate, i.deposit]);
  if (sig(prev) !== sig(next)) out.push("Details changed");
  return out;
}

export function appendEvents(
  prev: InvoiceEvent[],
  lines: string[],
  at: string,
): InvoiceEvent[] {
  return [...prev, ...lines.map((t) => ({ at, text: t }))].slice(-MAX_EVENTS);
}

/** A blank invoice for the form, dated today and due in seven days. */
export function blankInvoice(today: string): InvoiceFields {
  return {
    status: "draft",
    issueDate: today,
    dueDate: addDays(today, 7),
    terms: DEFAULT_TERMS,
    customer: { name: "", business: "", address: "", email: "", phone: "" },
    leadId: "",
    jobRef: "",
    bookingRef: "",
    moveDate: "",
    lines: [{ description: "", qty: 1, unit: "job", rate: 0 }],
    discount: { type: "amount", value: 0 },
    vat: false,
    vatRate: DEFAULT_VAT_RATE,
    deposit: 0,
    customerNotes: "",
    internalNotes: "",
    payments: [],
  };
}
