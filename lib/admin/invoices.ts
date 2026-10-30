"use client";

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";
import {
  appendEvents,
  blankInvoice,
  cleanInvoice,
  describeChanges,
  nextNumber,
  storedStatus,
  todayIso,
  type Invoice,
  type InvoiceFields,
} from "@/lib/admin/invoice-model";
import {
  demoInvoices,
  demoSetInvoices,
  demoSubscribeInvoices,
  isDemo,
} from "@/lib/admin/demo";

const COL = "invoices";

function demoSeed(): Invoice[] {
  const today = todayIso();
  const base = blankInvoice(today);
  const now = new Date().toISOString();
  return [
    {
      ...base,
      id: "demo-inv-1",
      number: `PHI-INV-${new Date().getFullYear()}-0001`,
      status: "sent",
      customer: {
        name: "Hassan Ali",
        business: "",
        address: "12 Park Road\nBromley BR1 3EE",
        email: "hassan.ali@example.com",
        phone: "07700 900106",
      },
      leadId: "demo06",
      lines: [
        { description: "House move, Luton van and 2 movers", qty: 4, unit: "hr", rate: 65 },
        { description: "Packing materials", qty: 1, unit: "job", rate: 45 },
      ],
      deposit: 40,
      payments: [{ date: today, amount: 40, method: "Card", reference: "Deposit" }],
      createdAt: now,
      updatedAt: now,
      events: [{ at: now, text: "Created as Sent" }],
    },
    {
      ...base,
      id: "demo-inv-2",
      number: `PHI-INV-${new Date().getFullYear()}-0002`,
      status: "draft",
      customer: {
        name: "Sophie Clarke",
        business: "",
        address: "",
        email: "sophie.c@example.com",
        phone: "07700 900107",
      },
      leadId: "demo07",
      lines: [{ description: "Sofa and furniture delivery", qty: 1, unit: "job", rate: 160 }],
      createdAt: now,
      updatedAt: now,
      events: [{ at: now, text: "Created as Draft" }],
    },
  ];
}

function mapInvoice(id: string, d: Record<string, unknown>): Invoice {
  const b = blankInvoice(todayIso());
  const cleaned = cleanInvoice({ ...b, ...d, status: d.status ?? "draft" });
  // A stored invoice that fails today's checks (older data) still has to open, so fall back to raw fields.
  const fields: InvoiceFields = cleaned.ok
    ? cleaned.value
    : ({ ...b, ...(d as Partial<InvoiceFields>) } as InvoiceFields);
  return {
    ...fields,
    id,
    number: String(d.number ?? ""),
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
    events: Array.isArray(d.events)
      ? (d.events as { at: string; text: string }[]).map((e) => ({
          at: String(e.at ?? ""),
          text: String(e.text ?? ""),
        }))
      : [],
  };
}

export function subscribeInvoices(
  onData: (rows: Invoice[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  if (isDemo()) {
    const push = () => onData([...demoInvoices<Invoice>(demoSeed)]);
    const t = setTimeout(push, 0);
    const off = demoSubscribeInvoices(push);
    return () => {
      clearTimeout(t);
      off();
    };
  }
  const db = getFirebaseDb();
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) =>
      onData(snap.docs.map((d) => mapInvoice(d.id, d.data() as Record<string, unknown>))),
    (err) => onError?.(err),
  );
}

/** All invoices, read once (for the automatic drafts made outside the invoices page). */
export async function listInvoicesOnce(): Promise<Invoice[]> {
  if (isDemo()) return [...demoInvoices<Invoice>(demoSeed)];
  const snap = await getDocs(collection(getFirebaseDb(), COL));
  return snap.docs.map((d) => mapInvoice(d.id, d.data() as Record<string, unknown>));
}

export type SaveResult =
  | { ok: true; invoice: Invoice }
  | { ok: false; problem: string };

/** Creates or updates an invoice. Status follows the money (paid when the balance reaches zero). */
export async function saveInvoice(
  fields: InvoiceFields,
  prev: Invoice | null,
  existingNumbers: string[],
  authorEmail?: string,
): Promise<SaveResult> {
  const cleaned = cleanInvoice(fields);
  if (!cleaned.ok) return { ok: false, problem: cleaned.problem };
  if (prev?.status === "void") return { ok: false, problem: "locked" };

  const value: InvoiceFields = {
    ...cleaned.value,
    status: storedStatus(cleaned.value),
  };
  const now = new Date().toISOString();
  const number =
    prev?.number ||
    nextNumber(new Date().getFullYear(), existingNumbers);
  const id =
    prev?.id ||
    (isDemo()
      ? `demo-inv-${Date.now()}`
      : doc(collection(getFirebaseDb(), COL)).id);
  const events = appendEvents(
    prev?.events ?? [],
    describeChanges(prev, value).map((t) =>
      authorEmail ? `${t} (${authorEmail})` : t,
    ),
    now,
  );
  const invoice: Invoice = {
    ...value,
    id,
    number,
    createdAt: prev?.createdAt || now,
    updatedAt: now,
    events,
  };

  if (isDemo()) {
    const list = demoInvoices<Invoice>(demoSeed);
    demoSetInvoices(
      prev ? list.map((i) => (i.id === id ? invoice : i)) : [invoice, ...list],
    );
    return { ok: true, invoice };
  }

  const { id: _id, ...data } = invoice;
  void _id;
  try {
    await setDoc(doc(getFirebaseDb(), COL, id), data);
  } catch {
    return { ok: false, problem: "unavailable" };
  }
  return { ok: true, invoice };
}

/** Cancels an invoice (kept for the records, never deleted). */
export async function voidInvoice(
  prev: Invoice,
  authorEmail?: string,
): Promise<SaveResult> {
  return saveInvoice({ ...prev, status: "void" }, prev, [], authorEmail);
}

async function idToken(): Promise<string> {
  if (isDemo()) return "demo";
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("Sign in again to continue.");
  return user.getIdToken();
}

/** Fetches the PDF from the staff-only API route (verifies the Firebase ID token on the server). */
export async function fetchInvoicePdf(inv: Invoice): Promise<Blob> {
  const token = await idToken();
  const res = await fetch("/api/admin/invoices/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ invoice: inv }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (res.status === 503)
      throw new Error(
        "PDFs need the Firebase service account (FIREBASE_SERVICE_ACCOUNT_JSON) on the server.",
      );
    if (res.status === 401 || res.status === 403)
      throw new Error("The server did not accept your staff sign-in. Sign in again.");
    throw new Error(
      data.error === "unavailable"
        ? "The PDF could not be built right now. Try again."
        : `The PDF could not be built (${data.error ?? res.status}).`,
    );
  }
  return res.blob();
}

export async function downloadInvoicePdf(inv: Invoice) {
  const blob = await fetchInvoicePdf(inv);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${inv.number}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function previewInvoicePdf(inv: Invoice) {
  const blob = await fetchInvoicePdf(inv);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
