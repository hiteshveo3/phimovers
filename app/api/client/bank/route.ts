// GET (signed-in customer) -> the bank transfer details from the INVOICE_BANK_* settings, for the
// "how to pay" card on a completed, unpaid booking. Empty fields are left out; nothing when none is set.

import { firebaseCaller } from "@/lib/booking-flow/auth";
import { jsonReply } from "@/lib/booking-flow/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELDS: [string, string][] = [
  ["Bank", "INVOICE_BANK_NAME"],
  ["Account name", "INVOICE_BANK_ACCOUNT_NAME"],
  ["Sort code", "INVOICE_BANK_SORT_CODE"],
  ["Account number", "INVOICE_BANK_ACCOUNT_NUMBER"],
  ["IBAN", "INVOICE_BANK_IBAN"],
  ["BIC", "INVOICE_BANK_BIC"],
];

export async function GET(req: Request) {
  if (!(await firebaseCaller(req))) return jsonReply({ error: "signin" }, 401);
  const rows = FIELDS.map(([label, key]) => ({ label, value: process.env[key]?.trim() ?? "" })).filter((r) => r.value);
  const free = process.env.INVOICE_BANK_DETAILS?.trim() ?? "";
  return jsonReply({ rows: rows.length ? rows : free ? free.split(/\r?\n/).filter(Boolean).map((v) => ({ label: "", value: v })) : [] });
}
