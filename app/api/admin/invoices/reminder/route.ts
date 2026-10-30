import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin/require-staff";
import { loadInvoices, reminderText } from "@/lib/admin/gemini-office";
import { env } from "@/lib/assistant/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Staff only. POST { id } returns { text }: Gemini drafts a payment reminder for staff to copy into
 * their own email. Nothing is sent. The invoice is read on the server, never taken from the browser.
 */
export async function POST(req: NextRequest) {
  const who = await requireStaff(req);
  if (!who.ok) return NextResponse.json({ error: who.error }, { status: who.status });
  if (!env.geminiKey) return NextResponse.json({ error: "notConfigured" }, { status: 503 });

  const body = (await req.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id.slice(0, 80) : "";
  if (!id) return NextResponse.json({ error: "invalid" }, { status: 400 });

  try {
    const found = (await loadInvoices()).find((i) => i.id === id);
    if (!found) return NextResponse.json({ error: "notFound" }, { status: 404 });
    return NextResponse.json({ text: await reminderText(found) }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("invoice reminder failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
