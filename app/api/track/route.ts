import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isAdminSdkConfigured } from "@/lib/firebase/admin";
import {
  phonesMatch,
  type LeadStatus,
  type PublicLeadView,
} from "@/lib/leads/types";

export const runtime = "nodejs";

function publicView(data: Record<string, unknown>): PublicLeadView {
  const name = String(data.name ?? "Customer");
  return {
    trackCode: String(data.trackCode ?? ""),
    status: (data.status as LeadStatus) || "new",
    service: String(data.service ?? ""),
    from: String(data.from ?? ""),
    to: String(data.to ?? ""),
    date: data.date ? String(data.date) : undefined,
    quoteAmount: data.quoteAmount ? String(data.quoteAmount) : undefined,
    updatedAt: String(data.updatedAt ?? data.createdAt ?? ""),
    createdAt: String(data.createdAt ?? ""),
    nameFirst: name.split(/\s+/)[0] || name,
  };
}

export async function POST(req: NextRequest) {
  if (!isAdminSdkConfigured()) {
    return NextResponse.json(
      {
        error:
          "Tracking API needs FIREBASE_SERVICE_ACCOUNT_JSON on the server. Ask staff to finish setup.",
      },
      { status: 503 },
    );
  }

  let body: { code?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = String(body.code ?? "")
    .trim()
    .toUpperCase();
  const phone = String(body.phone ?? "").trim();

  if (code.length < 4 || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json(
      { error: "Enter your tracking code and the phone used on the quote." },
      { status: 400 },
    );
  }

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("leads")
      .where("trackCode", "==", code)
      .limit(5)
      .get();

    if (snap.empty) {
      return NextResponse.json(
        { error: "No quote found for that code." },
        { status: 404 },
      );
    }

    const match = snap.docs.find((d) =>
      phonesMatch(String(d.data().phone ?? ""), phone),
    );

    if (!match) {
      return NextResponse.json(
        { error: "Phone doesn’t match this tracking code." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      lead: publicView(match.data() as Record<string, unknown>),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not look up quote. Try again shortly." },
      { status: 500 },
    );
  }
}
