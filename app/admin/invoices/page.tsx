"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Add as AddIcon,
  ArrowLeft2 as BackIcon,
  DocumentDownload as DownloadIcon,
  Eye as EyeIcon,
  MagicStar as SparkIcon,
  Receipt21 as ReceiptIcon,
  SearchNormal1 as SearchIcon,
  Trash as TrashIcon,
} from "iconsax-reactjs";
import EmptyState from "@/components/admin/EmptyState";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useBookings } from "@/components/admin/BookingsProvider";
import { useLeads } from "@/components/admin/LeadsProvider";
import { Ico } from "@/kit/components/Ico";
import { BRAND } from "@/kit/site-facts";
import {
  BUSINESS,
  DEFAULT_DEPOSIT,
  STATUS_TEXT,
  balanceOf,
  blankInvoice,
  displayStatus,
  isOpen,
  lineTotal,
  longDate,
  money,
  paidOf,
  totalsOf,
  todayIso,
  type Invoice,
  type InvoiceFields,
  type InvoiceLine,
  type ShownStatus,
} from "@/lib/admin/invoice-model";
import {
  downloadInvoicePdf,
  previewInvoicePdf,
  saveInvoice,
  subscribeInvoices,
  voidInvoice,
} from "@/lib/admin/invoices";
import { draftsForCompletedBookings } from "@/lib/admin/invoice-auto";
import { staffFetch } from "@/lib/admin/staff-fetch";
import { moveDateKey, parseMoney } from "@/lib/leads/stats";
import type { Lead } from "@/lib/leads/types";

type Editing = InvoiceFields & {
  id: string;
  number: string;
  events: Invoice["events"];
  createdAt: string;
  updatedAt: string;
};
type Filter = "all" | "draft" | "open" | "overdue" | "paid" | "void";

const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["open", "Unpaid"],
  ["overdue", "Overdue"],
  ["paid", "Paid"],
  ["draft", "Draft"],
  ["void", "Cancelled"],
];
const PROBLEM: Record<string, string> = {
  customer: "Add the customer's name first.",
  lines: "Add at least one item with a description.",
  payment: "Each payment needs a date and an amount.",
  overpaid: "The payments add up to more than the invoice total.",
  email: "Check the customer's email address.",
  invalid: "Something in the invoice is not right. Check it and try again.",
  locked: "A cancelled invoice cannot be changed.",
  unavailable: "That did not work right now. Try again in a minute.",
};
const UNITS = ["job", "hr", "item", "box", "day"];

const toEditing = (i: Invoice): Editing => ({ ...i });
const fresh = (): Editing => ({
  ...blankInvoice(todayIso()),
  id: "",
  number: "",
  events: [],
  createdAt: "",
  updatedAt: "",
});

function fromLead(l: Lead): Editing {
  const rate = parseMoney(l.quoteAmount);
  return {
    ...fresh(),
    customer: {
      name: l.name,
      business: "",
      address: l.from,
      email: l.email ?? "",
      phone: l.phone,
    },
    leadId: l.id,
    jobRef: l.trackCode,
    moveDate: moveDateKey(l.date) ?? "",
    lines: [
      {
        description: `${l.service}: ${l.from} to ${l.to}`,
        qty: 1,
        unit: "job",
        rate,
      },
    ],
    internalNotes: `From lead ${l.id} (${l.propertySize}).`,
  };
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="iv-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatusPill({ s }: { s: ShownStatus }) {
  return <span className={`ad-badge iv-${s}`}>{STATUS_TEXT[s]}</span>;
}

/** On-screen preview of the invoice. The PDF (server-built) adds the bank details when configured. */
function Preview({ inv, today }: { inv: Editing; today: string }) {
  const totals = totalsOf(inv);
  const paid = paidOf(inv.payments);
  const balance = balanceOf(inv);
  const shown = displayStatus(inv, today);
  const depositDue =
    inv.deposit > 0 ? Math.max(0, Math.min(inv.deposit, totals.total) - paid) : 0;
  return (
    <article className="inv-doc" aria-label="Invoice preview">
      <div className="hd">
        <div>
          <h4>{BRAND}</h4>
          <small>Removals across London</small>
        </div>
        <div style={{ textAlign: "right" }}>
          <h4>INVOICE</h4>
          <small>{inv.number || "Number is set when you save"}</small>
          <StatusPill s={shown} />
        </div>
      </div>
      <div className="two" style={{ display: "grid", gap: 12, marginTop: 14, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <small style={{ color: "var(--ink-60)", fontWeight: 700 }}>BILLED TO</small>
          <div style={{ fontWeight: 600 }}>{inv.customer.name || "Customer name"}</div>
          {inv.customer.business && <div>{inv.customer.business}</div>}
          {inv.customer.address && <div style={{ whiteSpace: "pre-wrap" }}>{inv.customer.address}</div>}
          {inv.customer.phone && <div>{inv.customer.phone}</div>}
          {inv.customer.email && <div style={{ overflowWrap: "anywhere" }}>{inv.customer.email}</div>}
        </div>
        <div>
          {([["Issued", longDate(inv.issueDate)], ["Due", longDate(inv.dueDate)], ["Move date", longDate(inv.moveDate)], ["Job", inv.jobRef]] as [string, string][])
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div className="dl" key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th className="n">Qty</th>
            <th className="n">Rate</th>
            <th className="n">Amount</th>
          </tr>
        </thead>
        <tbody>
          {inv.lines
            .filter((l) => l.description || l.rate || l.qty)
            .map((l, i) => (
              <tr key={i}>
                <td>{l.description || "—"}</td>
                <td className="n">
                  {l.qty}
                  {l.unit && l.unit !== "job" ? ` ${l.unit}` : ""}
                </td>
                <td className="n">{money(l.rate)}</td>
                <td className="n">
                  <b>{money(lineTotal(l))}</b>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12 }}>
        <div className="dl">
          <span>Subtotal</span>
          <span>{money(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="dl">
            <span>Discount</span>
            <span>-{money(totals.discount)}</span>
          </div>
        )}
        {inv.vat && (
          <div className="dl">
            <span>VAT ({inv.vatRate}%)</span>
            <span>{money(totals.vat)}</span>
          </div>
        )}
        <div className="dl">
          <span>Total</span>
          <b>{money(totals.total)}</b>
        </div>
        {paid > 0 && (
          <div className="dl">
            <span>Paid</span>
            <span>-{money(paid)}</span>
          </div>
        )}
      </div>
      <div className="due">
        <span>{inv.status === "void" ? "Cancelled" : balance > 0 ? "Balance due" : "Paid in full"}</span>
        <b>{money(inv.status === "void" ? 0 : Math.max(0, balance))}</b>
      </div>
      {depositDue > 0 && balance > 0 && (
        <p className="note">
          Deposit to secure the booking: <b>{money(depositDue)}</b>. The rest is due after the move.
        </p>
      )}
      {inv.terms && <p className="note">{inv.terms}</p>}
      {inv.customerNotes && <p className="note">{inv.customerNotes}</p>}
      <p className="note" style={{ marginBottom: 0 }}>
        {BUSINESS.name} · {BUSINESS.phone} · {BUSINESS.email}
      </p>
    </article>
  );
}

function InvoicesInner() {
  const router = useRouter();
  const params = useSearchParams()!;
  const { user } = useAdminAuth();
  const { leads } = useLeads();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Editing | null>(null);
  const [baseline, setBaseline] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState<{ tone: "err" | "info"; text: string } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [reminder, setReminder] = useState<string | null>(null);
  const [pay, setPay] = useState({ amount: "", method: "Card", reference: "" });
  const handledLead = useRef("");
  const today = todayIso();
  const author = user?.email ?? undefined;

  useEffect(() => {
    try {
      return subscribeInvoices(
        (rows) => {
          setInvoices(rows);
          setLoading(false);
          setLoadError("");
        },
        (err) => {
          setLoadError(err.message);
          setLoading(false);
        },
      );
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load invoices");
      setLoading(false);
    }
  }, []);

  // Jobs completed in the app since the last visit get their draft invoice here (lib/admin/invoice-auto.ts).
  const { bookings, loading: bookingsLoading } = useBookings();
  const swept = useRef(false);
  useEffect(() => {
    if (swept.current || loading || loadError || bookingsLoading) return;
    swept.current = true;
    void draftsForCompletedBookings(bookings, invoices, author).then((made) => {
      if (made.length)
        setMessage({ tone: "info", text: `Draft ${made.length === 1 ? "invoice" : "invoices"} made for completed jobs: ${made.join(", ")}. Check and send.` });
    });
  }, [loading, loadError, bookingsLoading, bookings, invoices, author]);

  // /admin/invoices?lead=<id> starts an invoice from that lead.
  const leadParam = params.get("lead") || "";
  useEffect(() => {
    if (!leadParam || handledLead.current === leadParam || leads.length === 0) return;
    const l = leads.find((x) => x.id === leadParam);
    handledLead.current = leadParam;
    if (!l) return;
    const next = fromLead(l);
    setEditing(next);
    setBaseline(JSON.stringify(next));
    router.replace("/admin/invoices", { scroll: false });
  }, [leadParam, leads, router]);

  const dirty = editing ? JSON.stringify(editing) !== baseline : false;

  const withStatus = useMemo(
    () =>
      invoices.map((i) => ({ inv: i, shown: displayStatus(i, today) })),
    [invoices, today],
  );
  const stats = useMemo(() => {
    const open = withStatus.filter((x) => isOpen(x.shown));
    const month = today.slice(0, 7);
    const paidMonth = invoices.reduce(
      (n, i) =>
        n +
        i.payments.filter((p) => p.date.startsWith(month)).reduce((s, p) => s + p.amount, 0),
      0,
    );
    return {
      outstanding: open.reduce((n, x) => n + Math.max(0, balanceOf(x.inv)), 0),
      overdue: withStatus.filter((x) => x.shown === "overdue").length,
      paidMonth,
      drafts: withStatus.filter((x) => x.shown === "draft").length,
    };
  }, [withStatus, invoices, today]);

  const rows = withStatus.filter(({ inv, shown }) => {
    if (filter === "open" && !isOpen(shown)) return false;
    if (filter !== "all" && filter !== "open" && shown !== filter) return false;
    const s = q.trim().toLowerCase();
    return (
      !s ||
      [inv.number, inv.customer.name, inv.customer.business, inv.customer.email, inv.jobRef].some((v) =>
        v.toLowerCase().includes(s),
      )
    );
  });

  function open(inv: Editing) {
    setEditing(inv);
    setBaseline(JSON.stringify(inv));
    setMessage(null);
    setPreviewOpen(false);
    window.scrollTo(0, 0);
  }

  function close() {
    if (dirty && !window.confirm("Discard your changes to this invoice?")) return;
    setEditing(null);
    setMessage(null);
    setReminder(null);
  }

  function set<K extends keyof Editing>(key: K, value: Editing[K]) {
    setEditing((e) => (e ? { ...e, [key]: value } : e));
  }
  function setLine(i: number, patch: Partial<InvoiceLine>) {
    setEditing((e) =>
      e ? { ...e, lines: e.lines.map((l, j) => (j === i ? { ...l, ...patch } : l)) } : e,
    );
  }

  async function save(status: "draft" | "sent" | "keep") {
    if (!editing) return;
    setBusy("save");
    setMessage(null);
    const next: Editing = {
      ...editing,
      status: status === "keep" ? (editing.status === "draft" ? "sent" : editing.status) : status,
    };
    const prev = editing.id ? (invoices.find((i) => i.id === editing.id) ?? null) : null;
    const res = await saveInvoice(
      next,
      prev,
      invoices.map((i) => i.number),
      author,
    );
    setBusy("");
    if (!res.ok) {
      setMessage({ tone: "err", text: PROBLEM[res.problem] ?? PROBLEM.invalid });
      return;
    }
    const saved = toEditing(res.invoice);
    setEditing(saved);
    setBaseline(JSON.stringify(saved));
    setMessage({ tone: "info", text: `Saved ${saved.number}.` });
  }

  async function onPdf(kind: "download" | "preview") {
    if (!editing) return;
    if (!editing.number) {
      setMessage({ tone: "err", text: "Save the invoice first so it has a number." });
      return;
    }
    setBusy(kind);
    setMessage(null);
    try {
      const inv: Invoice = { ...editing, createdAt: editing.createdAt, updatedAt: editing.updatedAt };
      if (kind === "download") await downloadInvoicePdf(inv);
      else await previewInvoicePdf(inv);
    } catch (e) {
      setMessage({ tone: "err", text: e instanceof Error ? e.message : PROBLEM.unavailable });
    } finally {
      setBusy("");
    }
  }

  // Gemini drafts a payment reminder from the saved invoice; staff copy it into their own email.
  async function onReminder() {
    if (!editing?.id) return;
    setBusy("reminder");
    setMessage(null);
    try {
      const r = await staffFetch("/api/admin/invoices/reminder", { method: "POST", body: JSON.stringify({ id: editing.id }) });
      const data = (await r.json().catch(() => ({}))) as { text?: string };
      if (!r.ok || !data.text) throw new Error(r.status === 503 ? "The AI reminder needs GEMINI_API_KEY and the Firebase service account on the server." : "The reminder could not be written. Try again.");
      setReminder(data.text);
    } catch (e) {
      setMessage({ tone: "err", text: e instanceof Error ? e.message : PROBLEM.unavailable });
    } finally {
      setBusy("");
    }
  }

  async function onVoid() {
    if (!editing?.id) return;
    if (!window.confirm("Cancel this invoice? It stays on record but nothing will be due.")) return;
    const prev = invoices.find((i) => i.id === editing.id);
    if (!prev) return;
    setBusy("void");
    const res = await voidInvoice(prev, author);
    setBusy("");
    if (!res.ok) {
      setMessage({ tone: "err", text: PROBLEM[res.problem] ?? PROBLEM.invalid });
      return;
    }
    const saved = toEditing(res.invoice);
    setEditing(saved);
    setBaseline(JSON.stringify(saved));
  }

  function addPayment(amount: number) {
    if (!editing || !(amount > 0)) return;
    set("payments", [
      ...editing.payments,
      { date: today, amount, method: pay.method.trim(), reference: pay.reference.trim() },
    ]);
    setPay({ amount: "", method: pay.method, reference: "" });
  }

  /* ----------------------------- editor ----------------------------- */
  if (editing) {
    const totals = totalsOf(editing);
    const paid = paidOf(editing.payments);
    const balance = balanceOf(editing);
    const locked = editing.status === "void";
    const shown = displayStatus(editing, today);
    const disabled = locked || Boolean(busy);

    return (
      <div className="ad iv">
        <div className="ad-head">
          <div>
            <button type="button" className="ad-link" onClick={close} style={{ marginLeft: -4 }}>
              <Ico icon={BackIcon} size={18} />
              Invoices
            </button>
            <h1>{editing.number || "New invoice"}</h1>
            <p className="ad-sub">
              <StatusPill s={shown} /> {editing.customer.name ? ` ${editing.customer.name}` : ""}
            </p>
          </div>
          <div className="ad-head-actions">
            <button type="button" className="ad-btn" disabled={Boolean(busy)} onClick={() => onPdf("download")}>
              <Ico icon={DownloadIcon} size={18} />
              {busy === "download" ? "Building…" : "Download PDF"}
            </button>
            <button type="button" className="ad-btn" disabled={Boolean(busy)} onClick={() => onPdf("preview")}>
              <Ico icon={EyeIcon} size={18} />
              Open PDF
            </button>
            {editing.id && isOpen(shown) && (
              <button type="button" className="ad-btn" disabled={Boolean(busy)} onClick={() => void onReminder()}>
                <Ico icon={SparkIcon} size={18} />
                {busy === "reminder" ? "Writing…" : "Draft reminder"}
              </button>
            )}
          </div>
        </div>

        {message && (
          <p className={"ad-banner" + (message.tone === "err" ? " err" : " info")} role="status" style={{ margin: 0 }}>
            {message.text}
          </p>
        )}
        {reminder && (
          <div className="ad-card" style={{ display: "grid", gap: 10 }}>
            <b>Payment reminder (drafted by AI, check before sending)</b>
            <textarea className="ad-textarea" readOnly value={reminder} rows={9} />
            <div className="ad-head-actions">
              <button type="button" className="ad-btn lime" onClick={() => void navigator.clipboard.writeText(reminder).catch(() => undefined)}>
                Copy
              </button>
              {editing.customer.email && (
                <a className="ad-btn" href={`mailto:${editing.customer.email}?subject=${encodeURIComponent((/^Subject:\s*(.*)$/m.exec(reminder)?.[1] ?? `Invoice ${editing.number}`).trim())}&body=${encodeURIComponent(reminder.replace(/^Subject:.*\n+/, ""))}`}>
                  Open in email
                </a>
              )}
              <button type="button" className="ad-btn" onClick={() => setReminder(null)}>
                Close
              </button>
            </div>
          </div>
        )}
        {locked && (
          <p className="ad-banner" style={{ margin: 0 }}>
            This invoice was cancelled. It is kept for the records and cannot be changed.
          </p>
        )}

        <div className="iv-grid">
          <div className="iv" style={{ paddingBottom: 100 }}>
            <Card title="Customer">
              <Field label="Name">
                <input className="ad-input" value={editing.customer.name} disabled={locked} onChange={(e) => set("customer", { ...editing.customer, name: e.target.value })} autoComplete="off" />
              </Field>
              <div className="ad-two">
                <Field label="Phone">
                  <input className="ad-input" inputMode="tel" value={editing.customer.phone} disabled={locked} onChange={(e) => set("customer", { ...editing.customer, phone: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input className="ad-input" type="email" value={editing.customer.email} disabled={locked} onChange={(e) => set("customer", { ...editing.customer, email: e.target.value })} />
                </Field>
              </div>
              <Field label="Business (optional)">
                <input className="ad-input" value={editing.customer.business} disabled={locked} onChange={(e) => set("customer", { ...editing.customer, business: e.target.value })} />
              </Field>
              <Field label="Address">
                <textarea className="ad-textarea" rows={2} value={editing.customer.address} disabled={locked} onChange={(e) => set("customer", { ...editing.customer, address: e.target.value })} />
              </Field>
            </Card>

            <Card title="Items">
              <div style={{ display: "grid", gap: 12 }}>
                {editing.lines.map((l, i) => (
                  <div key={i} className="iv-line">
                    <Field label={`Item ${i + 1}`}>
                      <input className="ad-input" value={l.description} disabled={locked} placeholder="e.g. House move, Luton van and 2 movers" onChange={(e) => setLine(i, { description: e.target.value })} />
                    </Field>
                    <div className="ad-two" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                      <Field label="Qty">
                        <input className="ad-input" type="number" min={0} step="0.5" inputMode="decimal" value={l.qty} disabled={locked} onChange={(e) => setLine(i, { qty: Number(e.target.value) })} />
                      </Field>
                      <Field label="Unit">
                        <select className="ad-select" value={l.unit} disabled={locked} onChange={(e) => setLine(i, { unit: e.target.value })}>
                          {[...new Set([...UNITS, l.unit].filter(Boolean))].map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Rate (£)">
                        <input className="ad-input" type="number" min={0} step="0.01" inputMode="decimal" value={l.rate} disabled={locked} onChange={(e) => setLine(i, { rate: Number(e.target.value) })} />
                      </Field>
                    </div>
                    <div className="iv-line-top" style={{ justifyContent: "space-between" }}>
                      <b>{money(lineTotal(l))}</b>
                      {editing.lines.length > 1 && !locked && (
                        <button type="button" className="ad-mini" onClick={() => set("lines", editing.lines.filter((_, j) => j !== i))}>
                          <Ico icon={TrashIcon} size={14} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {!locked && (
                  <button type="button" className="ad-btn" onClick={() => set("lines", [...editing.lines, { description: "", qty: 1, unit: "job", rate: 0 }])}>
                    <Ico icon={AddIcon} size={18} />
                    Add an item
                  </button>
                )}
              </div>
            </Card>

            <Card title="Price options">
              <div className="ad-two">
                <Field label="Discount">
                  <div className="ad-inline">
                    <input className="ad-input" type="number" min={0} step="0.01" inputMode="decimal" value={editing.discount.value} disabled={locked} onChange={(e) => set("discount", { ...editing.discount, value: Number(e.target.value) })} />
                    <select className="ad-select" style={{ maxWidth: 96 }} value={editing.discount.type} disabled={locked} onChange={(e) => set("discount", { ...editing.discount, type: e.target.value === "percent" ? "percent" : "amount" })}>
                      <option value="amount">£</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </Field>
                <Field label="Move date">
                  <input className="ad-input" type="date" value={editing.moveDate} disabled={locked} onChange={(e) => set("moveDate", e.target.value)} />
                </Field>
              </div>
              <label className="ad-check">
                <input type="checkbox" checked={editing.vat} disabled={locked} onChange={(e) => set("vat", e.target.checked)} />
                Add VAT ({editing.vatRate}%)
              </label>
              <label className="ad-check">
                <input type="checkbox" checked={editing.deposit > 0} disabled={locked} onChange={(e) => set("deposit", e.target.checked ? DEFAULT_DEPOSIT : 0)} />
                Ask for a {money(DEFAULT_DEPOSIT)} deposit to secure the booking
              </label>
              {editing.deposit > 0 && (
                <Field label="Deposit amount (£)">
                  <input className="ad-input" type="number" min={0} step="1" inputMode="decimal" value={editing.deposit} disabled={locked} onChange={(e) => set("deposit", Number(e.target.value))} />
                </Field>
              )}
              <div className="iv-money" style={{ marginTop: 10 }}>
                <div>
                  <span>Subtotal</span>
                  <b>{money(totals.subtotal)}</b>
                </div>
                {totals.discount > 0 && (
                  <div>
                    <span>Discount</span>
                    <b>-{money(totals.discount)}</b>
                  </div>
                )}
                {editing.vat && (
                  <div>
                    <span>VAT</span>
                    <b>{money(totals.vat)}</b>
                  </div>
                )}
              </div>
              <div className="iv-total" style={{ marginTop: 10 }}>
                <span>Total</span>
                <b>{money(totals.total)}</b>
              </div>
            </Card>

            <Card title="Dates and notes">
              <div className="ad-two">
                <Field label="Issued">
                  <input className="ad-input" type="date" value={editing.issueDate} disabled={locked} onChange={(e) => set("issueDate", e.target.value)} />
                </Field>
                <Field label="Due">
                  <input className="ad-input" type="date" value={editing.dueDate} disabled={locked} onChange={(e) => set("dueDate", e.target.value)} />
                </Field>
              </div>
              <Field label="Payment terms">
                <input className="ad-input" value={editing.terms} disabled={locked} onChange={(e) => set("terms", e.target.value)} />
              </Field>
              <Field label="Job reference">
                <input className="ad-input" value={editing.jobRef} disabled={locked} onChange={(e) => set("jobRef", e.target.value)} />
              </Field>
              <Field label="Note for the customer (printed on the PDF)">
                <textarea className="ad-textarea" value={editing.customerNotes} disabled={locked} onChange={(e) => set("customerNotes", e.target.value)} />
              </Field>
              <Field label="Internal notes (never printed)">
                <textarea className="ad-textarea" value={editing.internalNotes} disabled={locked} onChange={(e) => set("internalNotes", e.target.value)} />
              </Field>
            </Card>

            <Card title="Payments">
              <div style={{ display: "grid", gap: 10 }}>
                {editing.payments.length === 0 && <p className="ad-muted" style={{ margin: 0 }}>No payments yet.</p>}
                {editing.payments.map((p, i) => (
                  <div key={i} className="iv-pay">
                    <span>
                      <b>{money(p.amount)}</b> · {longDate(p.date)}
                      {p.method ? ` · ${p.method}` : ""}
                      {p.reference ? ` · ${p.reference}` : ""}
                    </span>
                    {!locked && (
                      <button type="button" className="ad-mini" onClick={() => set("payments", editing.payments.filter((_, j) => j !== i))}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {!locked && (
                  <>
                    <div className="ad-two">
                      <Field label="Amount (£)">
                        <input className="ad-input" type="number" min={0} step="0.01" inputMode="decimal" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} placeholder={balance > 0 ? String(balance) : ""} />
                      </Field>
                      <Field label="Method">
                        <select className="ad-select" value={pay.method} onChange={(e) => setPay({ ...pay, method: e.target.value })}>
                          {["Card", "Bank transfer", "Cash"].map((m) => (
                            <option key={m}>{m}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="ad-head-actions">
                      <button type="button" className="ad-btn lime" disabled={!(Number(pay.amount) > 0)} onClick={() => addPayment(Number(pay.amount))}>
                        Record payment
                      </button>
                      {editing.deposit > 0 && paid < editing.deposit && (
                        <button type="button" className="ad-btn" onClick={() => addPayment(Math.min(editing.deposit - paid, Math.max(0, balance)))}>
                          Deposit received ({money(editing.deposit - paid)})
                        </button>
                      )}
                      {balance > 0 && paid > 0 && (
                        <button type="button" className="ad-btn" onClick={() => addPayment(balance)}>
                          Paid in full ({money(balance)})
                        </button>
                      )}
                    </div>
                  </>
                )}
                <div className="iv-money">
                  <div>
                    <span>Paid</span>
                    <b>{money(paid)}</b>
                  </div>
                  <div>
                    <span>Balance</span>
                    <b>{money(Math.max(0, balance))}</b>
                  </div>
                </div>
              </div>
            </Card>

            {editing.events.length > 0 && (
              <Card title="History">
                <ul className="iv-hist">
                  {[...editing.events].reverse().map((e, i) => (
                    <li key={i}>
                      {e.text}
                      <small>{new Date(e.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {editing.id && !locked && (
              <button type="button" className="ad-btn danger block" disabled={Boolean(busy)} onClick={onVoid}>
                Cancel this invoice
              </button>
            )}
          </div>

          <aside className={"iv-preview" + (previewOpen ? " is-open" : "")} aria-label="Preview">
            <div className={previewOpen ? "iv-preview-modal" : ""}>
              <div className="iv-preview-top">
                <b>Preview</b>
                <button type="button" className="ad-btn sm" onClick={() => setPreviewOpen(false)}>
                  Close
                </button>
              </div>
              <Preview inv={editing} today={today} />
            </div>
          </aside>
        </div>

        {!locked && (
          <div className="iv-bar ad-noprint">
            {editing.status === "draft" || !editing.id ? (
              <>
                <button type="button" className="ad-btn" disabled={disabled} onClick={() => save("draft")}>
                  {busy === "save" ? "Saving…" : "Save draft"}
                </button>
                <button type="button" className="ad-btn lime" disabled={disabled} onClick={() => save("sent")}>
                  Save as sent
                </button>
              </>
            ) : (
              <>
                <button type="button" className="ad-btn lime" disabled={disabled || !dirty} onClick={() => save("keep")}>
                  {busy === "save" ? "Saving…" : dirty ? "Save changes" : "Saved"}
                </button>
                <button type="button" className="ad-btn" disabled={disabled} onClick={() => save("draft")}>
                  Back to draft
                </button>
              </>
            )}
            <button type="button" className="ad-btn lg-hide" style={{ gridColumn: "1 / -1" }} onClick={() => setPreviewOpen(true)}>
              <Ico icon={EyeIcon} size={18} />
              Preview invoice
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ------------------------------ list ------------------------------ */
  return (
    <div className="ad iv">
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Money</p>
          <h1>Invoices</h1>
          <p className="ad-sub">Raise an invoice from a lead, send the PDF, record payments.</p>
        </div>
        <div className="ad-head-actions">
          <button type="button" className="ad-btn lime" onClick={() => open(fresh())}>
            <Ico icon={AddIcon} size={18} />
            New invoice
          </button>
        </div>
      </div>

      {loadError && (
        <p className="ad-banner" role="alert" style={{ margin: 0 }}>
          {loadError}
        </p>
      )}

      <div className="iv-stats">
        <button type="button" className="iv-stat" onClick={() => setFilter("open")}>
          <b>{money(stats.outstanding)}</b>
          <span>Outstanding</span>
        </button>
        <button type="button" className="iv-stat" onClick={() => setFilter("overdue")}>
          <b>{stats.overdue}</b>
          <span>Overdue</span>
        </button>
        <button type="button" className="iv-stat" onClick={() => setFilter("paid")}>
          <b>{money(stats.paidMonth)}</b>
          <span>Received this month</span>
        </button>
        <button type="button" className="iv-stat" onClick={() => setFilter("draft")}>
          <b>{stats.drafts}</b>
          <span>Drafts</span>
        </button>
      </div>

      <div className="ad-search">
        <Ico icon={SearchIcon} size={18} />
        <input type="search" className="ad-input" placeholder="Search number, customer, email…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search invoices" />
      </div>
      <div className="ad-chips">
        {FILTERS.map(([f, label]) => (
          <button key={f} type="button" className="ad-chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="ad-loading">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="ad-card">
          <EmptyState
            icon={ReceiptIcon}
            title={invoices.length === 0 ? "No invoices yet" : "No matches"}
            body={invoices.length === 0 ? "Create one from a lead, or start a blank invoice." : "Try another filter or search."}
            actionLabel={invoices.length === 0 ? "New invoice" : "Clear filters"}
            onAction={() => (invoices.length === 0 ? open(fresh()) : (setFilter("all"), setQ("")))}
          />
        </div>
      ) : (
        <div className="ad-list">
          {rows.map(({ inv, shown }) => (
            <button key={inv.id} type="button" className="iv-item" onClick={() => open(toEditing(inv))}>
              <div>
                <strong>{inv.customer.name || "No name"}</strong>
                <br />
                <small>
                  {inv.number} · {longDate(inv.issueDate)}
                  {inv.dueDate && isOpen(shown) ? ` · due ${longDate(inv.dueDate)}` : ""}
                </small>
              </div>
              <span className="amt">{money(totalsOf(inv).total)}</span>
              <div className="row2">
                <StatusPill s={shown} />
                {isOpen(shown) && <small>{money(Math.max(0, balanceOf(inv)))} to pay</small>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminInvoicesPage() {
  return (
    <Suspense fallback={<p className="ad-loading">Loading…</p>}>
      <InvoicesInner />
    </Suspense>
  );
}
