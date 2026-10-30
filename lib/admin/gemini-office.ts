// Gemini for the staff dashboard, server side only. Two jobs:
//   officeAnswer(question)  answers staff's plain questions from the live leads, bookings and invoices
//   reminderText(invoice)   drafts a polite payment reminder staff can copy into their own email
// Gemini only ever sees what is built here (no chat transcripts), and nothing is saved by it.

import { getAdminDb } from "../firebase/admin";
import { answerText } from "../assistant/gemini";
import { BRAND, DEPOSIT, HELPER_RATE, HOURS_LONG, MIN_HOURS, PHONE_DISPLAY, RATES } from "../../kit/site-facts";
import { bankFromEnv } from "./invoice-assets";
import {
  balanceOf,
  blankInvoice,
  cleanInvoice,
  displayStatus,
  isOpen,
  longDate,
  money,
  totalsOf,
  type Invoice,
} from "./invoice-model";

const londonToday = () => new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });

const OFFICE_FACTS = `Facts you may use:
- Rates: ${RATES.map((r) => `${r.name} £${r.hourly} an hour`).join(", ")}. Each extra helper £${HELPER_RATE} an hour. ${MIN_HOURS}-hour minimum.
- The usual deposit to secure a booking is £${DEPOSIT}.
- Office hours: ${HOURS_LONG}.`;

const ANSWER_RULES = `You help the office team of ${BRAND}, a London removals company. They are not technical.
Answer simply, in short sentences.
Use only the data you are given. If the answer is not in it, say you do not have that information. Never invent names, prices, dates or amounts.
Reply in the language of the question: English gets English; Roman Urdu (Urdu in Latin letters) gets simple Roman Urdu. Keep names, amounts and invoice numbers exactly as written in the data.
Format: start with the direct answer in one sentence. For several items use lines that start with "- ". Put a name or an amount in **bold** only when it is the key fact. No headings, no tables, no HTML.
Keep it under 120 words unless the office asks for a full list.
${OFFICE_FACTS}`;

type Raw = Record<string, unknown>;
const str = (v: unknown) => (v == null ? "" : String(v));
const isoOf = (v: unknown) =>
  typeof v === "string"
    ? v
    : v && typeof v === "object" && "toDate" in v
      ? (v as { toDate: () => Date }).toDate().toISOString()
      : "";

export async function loadInvoices(): Promise<Invoice[]> {
  const snap = await getAdminDb().collection("invoices").get();
  const b = blankInvoice(londonToday());
  return snap.docs.map((d) => {
    const raw = d.data() as Raw;
    const c = cleanInvoice({ ...b, ...raw, status: raw.status ?? "draft" });
    const fields = c.ok ? c.value : ({ ...b, ...raw } as Invoice);
    return { ...fields, id: d.id, number: str(raw.number), createdAt: str(raw.createdAt), updatedAt: str(raw.updatedAt), events: [] };
  });
}

async function officeContext() {
  const db = getAdminDb();
  const [bookingSnap, leadSnap, invoices] = await Promise.all([
    db.collection("bookings").orderBy("createdAt", "desc").limit(300).get(),
    db.collection("leads").orderBy("createdAt", "desc").limit(200).get(),
    loadInvoices(),
  ]);
  const today = londonToday();
  const month = today.slice(0, 7);

  const bookings: Raw[] = bookingSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Raw) }));
  const upcoming = bookings
    .filter((b) => b.status !== "cancelled" && b.status !== "completed")
    .filter((b) => !isoOf(b.scheduledDate) || isoOf(b.scheduledDate).slice(0, 10) >= today)
    .sort((a, b) => (isoOf(a.scheduledDate) || "9999").localeCompare(isoOf(b.scheduledDate) || "9999"))
    .slice(0, 25);
  const jobLine = (b: Raw) => {
    const date = isoOf(b.scheduledDate).slice(0, 10);
    return `- ${str(b.bookingNumber)}: ${str(b.customerName) || "no name"}, ${str(b.serviceName) || "removal"}, ${date ? longDate(date) : "date to be agreed"}${b.scheduledTime ? `, ${str(b.scheduledTime)}` : ""}, from ${str(b.addressLine) || "not given"}, phone ${str(b.customerPhone) || "not given"}, status ${str(b.status)}, crew ${str(b.moverName) || "not assigned"}, price ${Number(b.totalPrice) > 0 ? money(Number(b.totalPrice)) : "not set"}, payment ${str(b.paymentStatus)}`;
  };

  const leads = leadSnap.docs.map((d) => d.data() as Raw);
  const newLeads = leads.filter((l) => l.status === "new");
  const leadLine = (l: Raw) => `- ${str(l.name) || "no name"}, ${str(l.service)}, ${str(l.from)} to ${str(l.to)}, move ${str(l.date) || "date not given"}, phone ${str(l.phone) || "not given"}`;

  const owed = invoices.filter((i) => isOpen(displayStatus(i, today)));
  const overdue = owed.filter((i) => displayStatus(i, today) === "overdue");
  const paidMonth = invoices.flatMap((i) => i.payments.filter((p) => p.date.startsWith(month)));
  const sum = (xs: Invoice[]) => xs.reduce((s, i) => s + balanceOf(i), 0);
  const invLine = (i: Invoice) =>
    `- ${i.number}: ${i.customer.name || "no name"}, total ${money(totalsOf(i).total)}, still owed ${money(balanceOf(i))}, due ${i.dueDate || "not set"}, phone ${i.customer.phone || "not given"}`;

  return [
    `Today is ${longDate(today)}.`,
    `New leads waiting for a reply: ${newLeads.length}. Booking requests to confirm: ${bookings.filter((b) => b.status === "pending").length}. Completed jobs: ${bookings.filter((b) => b.status === "completed").length}.`,
    newLeads.length ? `New leads:\n${newLeads.slice(0, 20).map(leadLine).join("\n")}` : "",
    "",
    "Upcoming jobs (not cancelled, not completed):",
    upcoming.length ? upcoming.map(jobLine).join("\n") : "- none",
    "",
    `Invoices not fully paid: ${owed.length}, still owed ${money(sum(owed))}.`,
    owed.length ? `Unpaid invoices:\n${owed.map(invLine).join("\n")}` : "",
    overdue.length ? `Overdue invoices (${overdue.length}, ${money(sum(overdue))} still owed):\n${overdue.map(invLine).join("\n")}` : "Overdue invoices: none.",
    `Payments received this month: ${paidMonth.length}, ${money(paidMonth.reduce((s, p) => s + p.amount, 0))}.`,
    `Draft invoices: ${invoices.filter((i) => i.status === "draft").length}.`,
  ].join("\n");
}

export async function officeAnswer(question: string, history: { q: string; a: string }[] = []): Promise<string> {
  const data = await officeContext();
  const earlier = history.length ? `Conversation so far:\n${history.map((h) => `Q: ${h.q}\nA: ${h.a}`).join("\n")}\n\n` : "";
  return answerText(ANSWER_RULES, `Office data:\n${data}\n\n${earlier}Question: ${question}`);
}

export async function reminderText(inv: Invoice): Promise<string> {
  const bank = bankFromEnv();
  const pay = bank.accountNumber
    ? `bank transfer to ${bank.accountName}, sort code ${bank.sortCode}, account number ${bank.accountNumber}`
    : bank.text
      ? `bank transfer (${bank.text.replace(/\n/g, ", ")})`
      : "the payment details on the invoice";
  const prompt = `Write a short, polite payment reminder email. Use these facts and nothing else.
Customer name: ${inv.customer.name || "there"}
Invoice number: ${inv.number}
Amount still due: ${money(balanceOf(inv))}
Due date: ${inv.dueDate ? longDate(inv.dueDate) : "not set"}
Payment: ${pay}. Ask them to quote the invoice number as the reference.
Also say: if they have already paid, they can ignore this message. They can call ${PHONE_DISPLAY} with any question.
Sign off as "${BRAND}".
Start with one line "Subject: ..." then a blank line, then the email. Under 110 words. Plain English.`;
  return answerText(`You write short, clear, friendly business emails for ${BRAND}, a London removals company.`, prompt);
}
