// POST { leadId, decision: 'accept' | 'decline', note? } (signed-in owner) -> records the customer's answer
// to a quote the office sent (status "quoted"), for 7 days after it was sent. Accepting tells the office
// (bell + email) and the portal sends the customer to /book with the move filled in to pick a time; the
// office turns it into the confirmed booking. Written to optional lead fields (customerDecision).

import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, isAdminSdkConfigured } from "@/lib/firebase/admin";
import { firebaseCaller } from "@/lib/booking-flow/auth";
import { jsonReply, readBody } from "@/lib/booking-flow/server";
import { SITE_URL, buttons, esc, frame, officeEmail, rows, send, textRows } from "@/lib/email/layout";
import { QUOTE_DAYS, quotedAt } from "@/lib/quote/decision";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAdminSdkConfigured()) return jsonReply({ error: "unavailable" }, 503);
  const caller = await firebaseCaller(req);
  if (!caller) return jsonReply({ error: "signin" }, 401);
  const body = await readBody<{ leadId?: string; decision?: string; note?: string }>(req, 4_000);
  const id = String(body?.leadId ?? "");
  const decision = body?.decision === "accept" ? "accepted" : body?.decision === "decline" ? "declined" : "";
  if (!/^[A-Za-z0-9]{8,40}$/.test(id) || !decision) return jsonReply({ error: "invalid" }, 400);
  const ref = getAdminDb().collection("leads").doc(id);
  const snap = await ref.get();
  const l = snap.data() as Record<string, unknown> | undefined;
  if (!l || l.ownerUid !== caller.uid) return jsonReply({ error: "notfound" }, 404);
  if (l.status !== "quoted" || !l.quoteAmount) return jsonReply({ error: "closed" }, 409);
  const sent = quotedAt(l.activity, l.updatedAt);
  if (sent && Date.now() - Date.parse(sent) > QUOTE_DAYS * 86_400_000) return jsonReply({ error: "expired" }, 410);

  const now = new Date().toISOString();
  const note = typeof body?.note === "string" ? body.note.replace(/[<>]/g, " ").trim().slice(0, 500) : "";
  await ref.update({
    customerDecision: { decision, at: now, note: note || null },
    updatedAt: now,
    activity: FieldValue.arrayUnion({ id: `a_${Date.now()}`, at: now, type: "quote", text: `Customer ${decision} the quote${note ? `: ${note}` : ""}` }),
  });
  const list = [
    { label: "Reference", value: String(l.trackCode ?? "") },
    { label: "Customer", value: String(l.name ?? "") },
    { label: "Phone", value: String(l.phone ?? ""), href: `tel:${String(l.phone ?? "").replace(/[^\d+]/g, "")}` },
    { label: "Quote", value: String(l.quoteAmount ?? "") },
    ...(note ? [{ label: "Note", value: note }] : []),
  ];
  await send(officeEmail(), `Quote ${decision} – ${l.trackCode}`, frame(`Quote ${esc(decision)}`, decision === "accepted" ? "Call the customer to book the date." : "The customer declined this quote.", `${buttons([["Open the lead", `${SITE_URL}/admin/leads/${id}`]], "0 0 20px")}${rows(list)}`), textRows(list), { replyTo: typeof l.email === "string" ? l.email : undefined }).catch(() => undefined);
  return jsonReply({ ok: true, decision });
}
