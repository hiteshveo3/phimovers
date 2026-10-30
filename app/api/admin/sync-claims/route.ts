import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAuth,
  isAdminSdkConfigured,
} from "@/lib/firebase/admin";
import { isAllowlistedStaffEmail, isOwnerEmail } from "@/lib/admin/claims";
import { sameOrigin } from "@/lib/admin/require-staff";

export const runtime = "nodejs";

/**
 * Verifies the Firebase ID token. An account that already has the `staff` claim is fine as it is; an
 * address on the owner/staff list with a verified email gets `{ staff: true }` (and `staffRole: owner` for
 * the owner). An unverified address gets `needVerify` (the sign-in page sends a verification email).
 * An account removed in Settings > Staff (`staffRemoved`) never gets the claim back from here.
 * Claims are only ever taken away by "Remove" (/api/admin/staff).
 */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Cross-site request refused" }, { status: 403 });
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

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token, true);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const auth = getAdminAuth();
    const email = decoded.email ?? null;

    if (decoded.staff === true) {
      return NextResponse.json({ ok: true, already: true });
    }
    if (decoded.staffRemoved === true || !isAllowlistedStaffEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Not on staff allowlist" },
        { status: 403 },
      );
    }
    if (decoded.email_verified !== true) {
      return NextResponse.json(
        { ok: false, needVerify: true, error: "Verify your email address first." },
        { status: 403 },
      );
    }

    // Keep the other claims (the two-step sign-in pass lives there too).
    const current = (await auth.getUser(decoded.uid)).customClaims ?? {};
    await auth.setCustomUserClaims(decoded.uid, {
      ...current,
      staff: true,
      ...(isOwnerEmail(email) ? { staffRole: "owner" } : {}),
    });

    return NextResponse.json({ ok: true, refreshed: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not update the account." }, { status: 500 });
  }
}
