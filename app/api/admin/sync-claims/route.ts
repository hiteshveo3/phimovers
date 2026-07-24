import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAuth,
  isAdminSdkConfigured,
} from "@/lib/firebase/admin";
import { isAllowlistedStaffEmail } from "@/lib/admin/claims";

export const runtime = "nodejs";

/** Verifies Firebase ID token; if email is staff allowlist, sets custom claim { staff: true }. */
export async function POST(req: NextRequest) {
  if (!isAdminSdkConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Admin SDK not configured",
        hint: "Add FIREBASE_SERVICE_ACCOUNT_JSON to .env.local and Vercel.",
      },
      { status: 503 },
    );
  }

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email ?? null;

    if (!isAllowlistedStaffEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Not on staff allowlist" },
        { status: 403 },
      );
    }

    if (decoded.staff === true) {
      return NextResponse.json({ ok: true, already: true });
    }

    await auth.setCustomUserClaims(decoded.uid, {
      staff: true,
    });

    return NextResponse.json({ ok: true, refreshed: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
