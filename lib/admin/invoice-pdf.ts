// The invoice as a PDF file, built on the server with pdf-lib (pure JavaScript, so it runs on Vercel too).
// Layout: "Ticket", the same design Alpha Movers uses: Figtree in Regular, Medium and SemiBold (no bold),
// the details on a ticket with a lime stub for the amount, the items, a dashed bank card beside the
// totals, payments, notes, a remittance slip to cut off, and a legal footer on every page.
// Totals always come from invoice-model.ts, never from the browser. Bank details come from env
// (invoice-assets.ts) and are left out when empty.

import fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  PageSizes,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import { COMPANY_NUMBER } from "../contact";
import { invoiceAssets, type InvoiceAssets, type InvoiceBank } from "./invoice-assets";
import {
  BUSINESS,
  DEFAULT_TERMS,
  STATUS_TEXT,
  balanceOf,
  displayStatus,
  lineTotal,
  longDate,
  money,
  paidOf,
  totalsOf,
  type Invoice,
  type InvoiceLine,
  type ShownStatus,
} from "./invoice-model";

/* ================================================================ colours */

const hex = (h: string): RGB =>
  rgb(
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255,
  );
const C = {
  ink: hex("#0f1a09"),
  body: hex("#27311f"),
  muted: hex("#5c6656"),
  faint: hex("#8a9184"),
  line: hex("#dbe4d1"),
  hair: hex("#e6ece0"),
  page: hex("#f6faef"),
  grey: hex("#eef5e5"),
  soft: hex("#e3f4d2"),
  lime: hex("#9fe870"), // the logo's own lime, so the mark sits on it without a visible square
  limeInk: hex("#34501a"), // muted text on lime
  deep: hex("#2f7a18"),
  white: hex("#ffffff"),
  amber: hex("#6b4d00"),
  amberSoft: hex("#fdf0c8"),
  red: hex("#8c1f1f"),
  redSoft: hex("#fae2e2"),
};

/* ================================================================ the drawing kit */

const W = PageSizes.A4[0];
const H = PageSizes.A4[1];
type Align = "left" | "right" | "center";
type Fonts = { r: PDFFont; m: PDFFont; s: PDFFont };
const FALLBACK: Record<string, string> = {
  "−": "-",
  "‐": "-",
  "‑": "-",
  "“": '"',
  "”": '"',
  "‘": "'",
  "’": "'",
  "…": "...",
  "\t": " ",
};

class Kit {
  page!: PDFPage;
  y = 0;
  bottom = 80;
  /** Starts a continuation page and returns where content may begin. */
  cont: () => number = () => H - 60;
  private sets = new Map<PDFFont, Set<number>>();

  constructor(
    readonly pdf: PDFDocument,
    readonly f: Fonts,
    readonly logo: PDFImage,
  ) {}

  addPage() {
    this.page = this.pdf.addPage(PageSizes.A4);
    return this.page;
  }

  /** Characters the font cannot draw become close stand-ins, then "?". */
  safe(s: string, font: PDFFont) {
    let set = this.sets.get(font);
    if (!set) {
      set = new Set(font.getCharacterSet());
      this.sets.set(font, set);
    }
    const ok = set;
    return Array.from(s.replace(/\r/g, ""))
      .map((ch) =>
        ok.has(ch.codePointAt(0) ?? 0) ? ch : FALLBACK[ch] ?? (ch === " " ? " " : "?"),
      )
      .join("");
  }

  w(s: string, size: number, font = this.f.r) {
    return font.widthOfTextAtSize(this.safe(s, font), size);
  }

  t(s: string, x: number, y: number, size = 10, font = this.f.r, color = C.body, align: Align = "left") {
    const str = this.safe(s, font);
    const width = font.widthOfTextAtSize(str, size);
    const at = align === "right" ? x - width : align === "center" ? x - width / 2 : x;
    this.page.drawText(str, { x: at, y, size, font, color });
    return width;
  }

  /** Small capitals label with letter spacing. */
  label(s: string, x: number, y: number, color = C.muted, align: Align = "left", size = 6.8, font = this.f.m) {
    const str = this.safe(s.toUpperCase(), font);
    const width = this.labelWidth(s, size, font);
    let cx = align === "right" ? x - width : align === "center" ? x - width / 2 : x;
    for (const ch of Array.from(str)) {
      this.page.drawText(ch, { x: cx, y, size, font, color });
      cx += font.widthOfTextAtSize(ch, size) + size * 0.12;
    }
    return width;
  }

  labelWidth(s: string, size = 6.8, font = this.f.m) {
    const str = this.safe(s.toUpperCase(), font);
    return Array.from(str).reduce(
      (n, ch) => n + font.widthOfTextAtSize(ch, size) + size * 0.12,
      -size * 0.12,
    );
  }

  wrap(s: string, size: number, width: number, font = this.f.r): string[] {
    const out: string[] = [];
    for (const raw of this.safe(s || "", font).split("\n")) {
      let cur = "";
      for (const word of raw.split(/\s+/).filter(Boolean)) {
        const next = cur ? `${cur} ${word}` : word;
        if (font.widthOfTextAtSize(next, size) <= width) {
          cur = next;
          continue;
        }
        if (cur) out.push(cur);
        let chunk = word;
        while (font.widthOfTextAtSize(chunk, size) > width && chunk.length > 1) {
          let cut = chunk.length - 1;
          while (cut > 1 && font.widthOfTextAtSize(chunk.slice(0, cut), size) > width) cut -= 1;
          out.push(chunk.slice(0, cut));
          chunk = chunk.slice(cut);
        }
        cur = chunk;
      }
      if (cur) out.push(cur);
    }
    return out;
  }

  line(x0: number, y0: number, x1: number, y1: number, color = C.line, thickness = 0.6, dash?: number[]) {
    this.page.drawLine({
      start: { x: x0, y: y0 },
      end: { x: x1, y: y1 },
      thickness,
      color,
      ...(dash ? { dashArray: dash } : {}),
    });
  }

  rule(x0: number, x1: number, y: number, color = C.line, thickness = 0.6, dash?: number[]) {
    this.line(x0, y, x1, y, color, thickness, dash);
  }

  /** A box given its top-left corner. Rounded corners can be chosen one by one: [tl, tr, br, bl]. */
  box(
    x: number,
    top: number,
    w: number,
    h: number,
    o: { fill?: RGB; stroke?: RGB; r?: number | [number, number, number, number]; sw?: number; dash?: number[] } = {},
  ) {
    const [a, b, c, d] = Array.isArray(o.r) ? o.r : [o.r ?? 0, o.r ?? 0, o.r ?? 0, o.r ?? 0];
    const path = `M ${a} 0 H ${w - b} Q ${w} 0 ${w} ${b} V ${h - c} Q ${w} ${h} ${w - c} ${h} H ${d} Q 0 ${h} 0 ${h - d} V ${a} Q 0 0 ${a} 0 Z`;
    this.page.drawSvgPath(path, {
      x,
      y: top,
      ...(o.fill ? { color: o.fill } : {}),
      ...(o.stroke ? { borderColor: o.stroke, borderWidth: o.sw ?? 0.8 } : {}),
      ...(o.dash ? { borderDashArray: o.dash } : {}),
    });
  }

  /** The logo square with rounded corners, masked with the colour behind it. */
  mark(x: number, top: number, size: number, behind: RGB) {
    this.page.drawImage(this.logo, { x, y: top - size, width: size, height: size });
    const r = size * 0.24;
    const corner = (cx: number, cy: number, sx: number, sy: number) => {
      this.page.drawSvgPath(`M 0 0 L ${sx * r} 0 Q 0 0 0 ${sy * r} Z`, { x: cx, y: cy, color: behind });
    };
    corner(x, top, 1, 1);
    corner(x + size, top, -1, 1);
    corner(x + size, top - size, -1, -1);
    corner(x, top - size, 1, -1);
  }

  pill(text: string, x: number, top: number, bg: RGB, fg: RGB, h = 17) {
    const w = this.labelWidth(text, 7) + 20;
    this.box(x, top, w, h, { fill: bg, r: h / 2 });
    this.label(text, x + 10, top - h / 2 - 2.5, fg, "left", 7);
    return w;
  }

  ensure(h: number) {
    if (this.y - h < this.bottom) {
      this.y = this.cont();
      return true;
    }
    return false;
  }
}

/* ================================================================ facts */

type Facts = {
  inv: Invoice;
  shown: ShownStatus;
  status: string;
  lines: InvoiceLine[];
  totals: ReturnType<typeof totalsOf>;
  paid: number;
  due: number;
  depositDue: number;
  isVoid: boolean;
  settled: boolean;
  headline: string;
  headAmount: string;
  customer: string[];
  bank: [string, string][];
  bankName: string;
  slip: [string, string][];
};

function factsOf(inv: Invoice, today: string, bank: InvoiceBank): Facts {
  const shown = displayStatus(inv, today);
  const totals = totalsOf(inv);
  const paid = paidOf(inv.payments);
  const isVoid = inv.status === "void";
  const due = isVoid ? 0 : Math.max(0, balanceOf(inv));
  const settled = !isVoid && totals.total > 0 && due <= 0;
  const depositDue =
    inv.deposit > 0 && !isVoid ? Math.max(0, Math.min(inv.deposit, totals.total) - paid) : 0;
  const bic = bank.bic && bank.intermediaryBic ? `${bank.bic} (intermediary ${bank.intermediaryBic})` : bank.bic;
  const structured = ([
    ["Account name", bank.accountName],
    ["Sort code", bank.sortCode],
    ["Account number", bank.accountNumber],
    ["IBAN", bank.iban],
    ["BIC", bic],
  ] as [string, string][]).filter(([, v]) => v);
  const freeText = structured.length
    ? []
    : bank.text.split(/\n|;/).map((s) => s.trim()).filter(Boolean).map((s) => ["", s] as [string, string]);
  const rows = [...structured, ...freeText];
  return {
    inv,
    shown,
    status: STATUS_TEXT[shown],
    lines: inv.lines.filter((l) => l.description || l.rate || l.qty),
    totals,
    paid,
    due,
    depositDue,
    isVoid,
    settled,
    headline: isVoid ? "Cancelled" : settled ? "Paid in full" : paid > 0 ? "Balance due" : "Amount due",
    headAmount: money(isVoid ? 0 : settled ? totals.total : due),
    customer: [inv.customer.business, ...inv.customer.address.split("\n"), inv.customer.phone, inv.customer.email]
      .map((s) => (s ?? "").trim())
      .filter(Boolean),
    bank: rows.length ? [...rows, ["Reference", inv.number]] : [],
    bankName: bank.bank,
    slip:
      bank.accountNumber || bank.iban
        ? ([
            ["Invoice", inv.number],
            ["Amount", money(due)],
            ["Pay to", bank.accountName],
            ["Sort code", bank.sortCode],
            ["Account", bank.accountNumber],
          ] as [string, string][]).filter(([, v]) => v)
        : [],
  };
}

const num = (n: number) => String(n);
function unitText(l: InvoiceLine) {
  const u = (l.unit || "hr").trim();
  if (l.qty === 1) return u;
  if (u === "hr") return "hrs";
  return /(s|x|ch|sh)$/.test(u) ? `${u}es` : `${u}s`;
}
const isFixed = (l: InvoiceLine) => l.unit === "job" && l.qty === 1;
const qtyText = (l: InvoiceLine) => (isFixed(l) ? "1" : `${num(l.qty)} ${unitText(l)}`);
const rateText = (l: InvoiceLine) => (isFixed(l) ? money(l.rate) : `${money(l.rate)}/${(l.unit || "hr").trim()}`);

const TAGLINE = "Removals and man and van, London";
const WEBSITE = "phimovers.co.uk";
const THANKS = `Thank you for choosing ${BUSINESS.brand}.`;
/** Under the bank details, so customers know to check a change of account by phone. */
const SAFE_NOTE = `Our bank details never change by email. To check, call ${BUSINESS.phone}.`;
/** The legal footer line: name, where registered, number, registered office. */
const LEGAL = COMPANY_NUMBER
  ? `${BUSINESS.name}, registered in England & Wales, company no. ${COMPANY_NUMBER}. Registered office: ${BUSINESS.address}.`
  : `${BUSINESS.name}. ${BUSINESS.address}.`;

/** Totals rows: [label, value, emphasis]. */
function totalsRows(x: Facts): [string, string, boolean][] {
  const t = x.totals;
  const rows: [string, string, boolean][] = [["Subtotal", money(t.subtotal), false]];
  if (t.discount > 0)
    rows.push([
      x.inv.discount.type === "percent" ? `Discount (${x.inv.discount.value}%)` : "Discount",
      `-${money(t.discount)}`,
      false,
    ]);
  if (x.inv.vat) {
    if (t.discount > 0) rows.push(["Net", money(t.net), false]);
    rows.push([`VAT (${x.inv.vatRate}%)`, money(t.vat), false]);
  }
  rows.push(["Total", money(t.total), true]);
  if (x.paid > 0) rows.push(["Paid", `-${money(x.paid)}`, false]);
  return rows;
}

/* ================================================================ sections */

function items(k: Kit, x: Facts, x0: number, x1: number) {
  const size = 10;
  const qtyR = x1 - 160;
  const rateR = x1 - 82;
  const descX = x0 + 12;
  const descW = qtyR - 46 - descX;
  const amountR = x1 - 12;
  const head = () => {
    const ly = k.y;
    k.box(x0, ly + 9, x1 - x0, 24, { fill: C.grey, r: 7 });
    const hy = ly - 6.5;
    k.label("Description", descX, hy);
    k.label("Qty", qtyR, hy, C.muted, "right");
    k.label("Rate", rateR, hy, C.muted, "right");
    k.label("Amount", amountR, hy, C.muted, "right");
    k.y = ly - 34;
  };
  head();
  for (const l of x.lines) {
    const desc = k.wrap(l.description || "-", size, descW);
    if (k.ensure(desc.length * (size + 3.5) + 13)) head();
    const top = k.y;
    desc.forEach((d, j) => k.t(d, descX, top - j * (size + 3.5), size, k.f.r, C.ink));
    k.t(qtyText(l), qtyR, top, size - 0.5, k.f.r, C.muted, "right");
    k.t(rateText(l), rateR, top, size - 0.5, k.f.r, C.muted, "right");
    k.t(money(lineTotal(l)), amountR, top, size, k.f.m, C.ink, "right");
    const bottom = top - desc.length * (size + 3.5);
    k.rule(x0, x1, bottom - 2, C.hair, 0.5);
    k.y = bottom - 13;
  }
}

function bankRows(k: Kit, x: Facts, left: number, right: number, top: number, step: number) {
  let y = top;
  for (const [label, value] of x.bank) {
    if (!label) {
      k.t(value, left, y, 8.5, k.f.r, C.ink);
    } else {
      k.t(label, left, y, 8.5, k.f.r, C.muted);
      k.t(value, right, y, 8.5, k.f.m, label === "Reference" ? C.deep : C.ink, "right");
    }
    y -= step;
  }
}

function paymentsBlock(k: Kit, x: Facts, x0: number, x1: number) {
  if (!x.inv.payments.length) return;
  k.ensure(30 + x.inv.payments.length * 18);
  k.label("Payments received", x0, k.y);
  k.y -= 16;
  for (const p of x.inv.payments) {
    k.ensure(18);
    k.t(longDate(p.date), x0, k.y, 9.5, k.f.r, C.ink);
    k.t(p.method || "", x0 + (x1 - x0) * 0.26, k.y, 9.5, k.f.r, C.muted);
    k.t(p.reference || "", x0 + (x1 - x0) * 0.5, k.y, 9.5, k.f.r, C.muted);
    k.t(money(p.amount), x1, k.y, 9.5, k.f.m, C.ink, "right");
    k.rule(x0, x1, k.y - 6, C.hair, 0.5);
    k.y -= 18;
  }
  k.y -= 10;
}

function notesBlock(k: Kit, x: Facts, x0: number, x1: number) {
  if (!x.inv.customerNotes) return;
  const lines = k.wrap(x.inv.customerNotes, 9.5, x1 - x0);
  k.ensure(22 + Math.min(lines.length, 4) * 13.5);
  k.label("Notes", x0, k.y);
  k.y -= 15;
  for (const l of lines) {
    k.ensure(14);
    k.t(l, x0, k.y, 9.5, k.f.r, C.muted);
    k.y -= 13.5;
  }
}

/* ================================================================ the ticket */

function ticket(k: Kit, x: Facts) {
  const M = 44;
  const R = W - M;
  const CW = R - M;
  k.bottom = 92;
  k.cont = () => {
    k.addPage();
    k.mark(M, H - 36, 24, C.white);
    k.t(BUSINESS.brand, M + 32, H - 53, 11, k.f.s, C.ink);
    k.t(`Invoice ${x.inv.number}, continued`, R, H - 53, 9, k.f.r, C.muted, "right");
    return H - 92;
  };

  k.addPage();
  k.mark(M, H - 42, 36, C.white);
  k.t(BUSINESS.brand, M + 46, H - 58, 14.5, k.f.s, C.ink);
  k.t(TAGLINE, M + 46, H - 72, 8.5, k.f.r, C.muted);
  k.t("Invoice", R, H - 60, 22, k.f.s, C.ink, "right");
  k.t(x.inv.number, R, H - 75, 9.5, k.f.m, C.muted, "right");

  // The ticket: details on the left, the amount on a lime stub, a perforation between.
  const T = H - 104;
  const STUB = 168;
  const SX = R - STUB;
  const LX = M + 22;
  const JX = LX + (SX - M - 44) / 2 + 10;
  // Billed to grows with the customer's lines; the job reference sits beside it when there is one.
  const colW = x.inv.jobRef ? JX - LX - 14 : SX - 22 - LX;
  const nameLines = k.wrap(x.inv.customer.name || "Customer", 14, colW, k.f.s).slice(0, 3);
  const detail = x.customer.flatMap((s) => k.wrap(s, 9, colW)).slice(0, 6);
  const jobLines = x.inv.jobRef ? k.wrap(x.inv.jobRef, 12, SX - 22 - JX, k.f.m).slice(0, 4) : [];
  const nameEnd = 46 + (nameLines.length - 1) * 16;
  const lastY = detail.length ? nameEnd + 15 + (detail.length - 1) * 11 : nameEnd + 15;
  const jobEnd = 46 + Math.max(0, jobLines.length - 1) * 14;
  const gap = Math.max(0, lastY + 19 - 80, jobEnd + 19 - 80);
  const TH = 156 + gap;
  k.box(M, T, CW, TH, { fill: C.page, stroke: C.line, r: 16 });
  k.box(SX, T, STUB, TH, { fill: x.isVoid ? C.grey : C.lime, r: [0, 16, 16, 0] });
  k.line(SX, T - 14, SX, T - TH + 14, C.ink, 0.7, [3, 3]);
  k.page.drawCircle({ x: SX, y: T, size: 9, color: C.white });
  k.page.drawCircle({ x: SX, y: T - TH, size: 9, color: C.white });

  k.label("Billed to", LX, T - 26);
  nameLines.forEach((l, i) => k.t(l, LX, T - 46 - i * 16, 14, k.f.s, C.ink));
  detail.forEach((l, i) => k.t(l, LX, T - nameEnd - 15 - i * 11, 9, k.f.r, C.muted));
  if (jobLines.length) {
    k.label("Job", JX, T - 26);
    jobLines.forEach((l, i) => k.t(l, JX, T - 46 - i * 14, 12, k.f.m, C.ink));
  }
  k.rule(LX, SX - 22, T - 80 - gap, C.line, 0.6);
  const grid: [string, string][] = [
    ["Issued", longDate(x.inv.issueDate)],
    ["Due", longDate(x.inv.dueDate) || "After the move"],
    ["Move date", longDate(x.inv.moveDate) || "-"],
  ];
  const gw = (SX - 22 - LX) / 3;
  grid.forEach(([a, b], i) => {
    k.label(a, LX + i * gw, T - 104 - gap);
    k.t(b, LX + i * gw, T - 122 - gap, 10.5, k.f.m, C.ink);
  });
  const fg = x.shown === "overdue" ? C.red : x.shown === "part" ? C.amber : C.ink;
  k.pill(x.status, LX, T - 132 - gap, C.white, fg);

  const SX0 = SX + 22;
  let amountSize = 24;
  while (amountSize > 14 && k.w(x.headAmount, amountSize, k.f.s) > STUB - 44) amountSize -= 1;
  k.label(x.headline, SX0, T - 26, C.limeInk);
  k.t(x.headAmount, SX0, T - 60, amountSize, k.f.s, C.ink);
  k.t(x.settled ? "Paid on" : x.isVoid ? "" : "Pay by", SX0, T - 88, 8.5, k.f.r, C.limeInk);
  const paidOn = x.inv.payments[x.inv.payments.length - 1]?.date ?? "";
  k.t(
    x.isVoid ? "" : x.settled ? longDate(paidOn) : longDate(x.inv.dueDate) || "After the move",
    SX0,
    T - 102,
    11,
    k.f.m,
    C.ink,
  );
  if (x.depositDue > 0) k.t(`Deposit ${money(x.depositDue)} now`, SX0, T - 118, 8.5, k.f.m, C.limeInk);
  k.t(`Ref. ${x.inv.number}`, SX0, T - TH + 20, 8, k.f.r, C.limeInk);
  k.y = T - TH - 36;

  items(k, x, M, R);

  const rows = totalsRows(x);
  k.ensure(Math.max(170, rows.length * 19 + 80));
  const top = k.y - 2;
  const bw = 254;
  // Nothing to pay on a cancelled or settled invoice, so no bank card there.
  const showBank = !x.isVoid && !x.settled && x.bank.length > 0;
  const payNote = x.inv.terms || DEFAULT_TERMS;
  const bankH = showBank ? 36 + x.bank.length * 12 + 34 : 0;
  if (showBank) {
    k.box(M, top + 10, bw, bankH, { stroke: C.ink, dash: [3, 3], r: 12, sw: 0.7 });
    k.label(x.bankName ? `Pay by bank transfer  ·  ${x.bankName}` : "Pay by bank transfer", M + 16, top - 10);
    bankRows(k, x, M + 16, M + bw - 16, top - 28, 12);
    k.t(k.wrap(payNote, 8, bw - 32)[0] ?? "", M + 16, top + 10 - bankH + 25, 8, k.f.r, C.muted);
    k.t(SAFE_NOTE, M + 16, top + 10 - bankH + 14, 6.5, k.f.r, C.muted);
  }

  const tx = R - 200;
  let ty = top;
  for (const [a, b, strong] of rows) {
    k.t(a, tx, ty, strong ? 10.5 : 9.5, strong ? k.f.m : k.f.r, strong ? C.ink : C.muted);
    k.t(b, R, ty, strong ? 10.5 : 9.5, strong ? k.f.m : k.f.r, C.ink, "right");
    ty -= 19;
  }
  k.box(tx - 12, ty + 8, R - tx + 12, 36, { fill: x.isVoid ? C.grey : C.lime, r: 18 });
  k.t(x.isVoid ? "Cancelled" : x.settled ? "Paid in full" : "Balance due", tx, ty - 14.5, 10.5, k.f.m, C.ink);
  k.t(money(x.due), R - 12, ty - 15, 14, k.f.s, C.ink, "right");
  if (x.depositDue > 0) {
    ty -= 46;
    k.t("Deposit to secure the booking", tx, ty, 9.5, k.f.r, C.muted);
    k.t(money(x.depositDue), R, ty, 9.5, k.f.m, C.ink, "right");
  }
  k.y = Math.min(top + 10 - bankH, ty - 28) - 28;

  paymentsBlock(k, x, M, R);
  notesBlock(k, x, M, R);

  // Remittance slip to cut off and keep with the bank transfer.
  if (!x.isVoid && x.due > 0 && x.slip.length) {
    // Fixed just above the footer; only moves to a new page when the content reaches it.
    const sy = 128;
    if (k.y < sy + 14) k.y = k.cont();
    k.rule(M, R, sy, C.ink, 0.6, [4, 3]);
    k.t("Cut here and keep with your bank transfer", R, sy + 5, 7, k.f.r, C.faint, "right");
    k.label("Remittance", M, sy - 18);
    const at = [0, 122, 204, 372, 456];
    x.slip.forEach(([a, b], i) => {
      k.t(a, M + at[i], sy - 35, 8, k.f.r, C.muted);
      k.t(b, M + at[i], sy - 49, 9.5, k.f.m, C.ink);
    });
  }

  const pages = k.pdf.getPages();
  pages.forEach((p, i) => {
    k.page = p;
    k.rule(M, R, 62, C.line, 0.6);
    k.t(THANKS, M, 46, 9, k.f.m, C.ink);
    k.t(`${BUSINESS.phone}  ·  ${BUSINESS.email}  ·  ${WEBSITE}`, R, 46, 7.5, k.f.r, C.faint, "right");
    k.t(LEGAL, M, 32, 6.5, k.f.r, C.faint);
    if (pages.length > 1) k.t(`Page ${i + 1} of ${pages.length}`, R, 32, 7.5, k.f.r, C.faint, "right");
  });
}

/* ================================================================ entry point */

export async function renderInvoicePdf(
  inv: Invoice,
  today: string,
  bank: InvoiceBank,
  assets: InvoiceAssets,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const [r, m, s] = await Promise.all([
    pdf.embedFont(assets.regular, { subset: true }),
    pdf.embedFont(assets.medium, { subset: true }),
    pdf.embedFont(assets.semibold, { subset: true }),
  ]);
  const logo = await pdf.embedPng(assets.logo);
  pdf.setTitle(`Invoice ${inv.number}`);
  pdf.setAuthor(BUSINESS.name);
  pdf.setCreator(`${BUSINESS.brand} staff dashboard`);
  ticket(new Kit(pdf, { r, m, s }, logo), factsOf(inv, today, bank));
  return pdf.save();
}

export async function invoicePdf(inv: Invoice, today: string, bank: InvoiceBank): Promise<Uint8Array> {
  return renderInvoicePdf(inv, today, bank, await invoiceAssets());
}
