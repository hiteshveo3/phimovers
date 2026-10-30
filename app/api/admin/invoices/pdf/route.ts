import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin/require-staff";
import { cleanInvoice, todayIso, type Invoice } from "@/lib/admin/invoice-model";
import { bankFromEnv } from "@/lib/admin/invoice-assets";
import { invoicePdf } from "@/lib/admin/invoice-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NUMBER_OK = /^[A-Za-z0-9-]{3,32}$/;

/**
 * Staff only. POST { invoice } with `Authorization: Bearer <Firebase ID token>`.
 * The token is verified with the Admin SDK (staff claim or allowlisted email). Totals and status are
 * recomputed on the server from the cleaned fields, so the browser can't forge them.
 * Bank details come from the server-only INVOICE_BANK_* env (omitted when empty).
 */
export async function POST(req: NextRequest) {
  const who = await requireStaff(req);
  if (!who.ok) {
    return NextResponse.json({ error: who.error }, { status: who.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const raw = (body as { invoice?: Record<string, unknown> } | null)?.invoice;
  const cleaned = cleanInvoice(raw);
  if (!cleaned.ok) {
    return NextResponse.json({ error: cleaned.problem }, { status: 422 });
  }
  const number = String(raw?.number ?? "").trim();
  if (!NUMBER_OK.test(number)) {
    return NextResponse.json({ error: "number" }, { status: 422 });
  }

  const now = new Date().toISOString();
  const invoice: Invoice = {
    ...cleaned.value,
    id: "",
    number,
    createdAt: now,
    updatedAt: now,
    events: [],
  };

  try {
    const bytes = await invoicePdf(invoice, todayIso(), bankFromEnv());
    const inline = req.nextUrl.searchParams.get("inline") === "1";
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${number}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("invoice pdf failed", e);
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }
}
