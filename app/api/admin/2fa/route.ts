import { NextRequest, NextResponse } from "next/server";
import { DEMO_UID, requireStaff } from "@/lib/admin/require-staff";
import { env } from "@/lib/assistant/env";
import { begin, confirm, isEnrolled, newCodes, removeApp, revokeDevice, status, trusted, verify, type Result } from "@/lib/admin/staff-2fa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Two-step sign-in for the staff dashboard (lib/admin/staff-2fa.ts). Staff only, Firebase ID token in
 * `Authorization: Bearer`. GET returns the status. POST actions:
 *   verify       { code | backup, trust?, label? }  a code from an authenticator app or a backup code
 *   trusted      { token }                          a browser trusted earlier
 *   begin        { label? }                         starts adding an authenticator app (QR code)
 *   confirm      { code }                           finishes it; the first one returns ten backup codes
 *   removeApp    { id }                             the last one cannot be removed (2FA is mandatory)
 *   newCodes                                        a new set of backup codes
 *   revokeDevice { id }                             stops trusting a browser
 * verify and trusted work before the pass. begin and confirm work without a pass only while the staff
 * member has no authenticator yet (first enrolment); every other action needs the pass.
 * The Android app can use the same route with its Firebase ID token (see docs/ADMIN_DASHBOARD.md).
 */

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function reply(r: Result) {
  if (r.ok) return NextResponse.json(r, { headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ error: r.error }, { status: r.status ?? 400 });
}

const seenOf = (req: NextRequest) => ({
  ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || undefined,
  ua: req.headers.get("user-agent") ?? undefined,
});

export async function GET(req: NextRequest) {
  const who = await requireStaff(req, { needPass: false });
  if (!who.ok) return NextResponse.json({ error: who.error }, { status: who.status });
  if (who.uid === DEMO_UID) {
    return NextResponse.json({ enrolled: true, required: true, authenticators: [], backupCodesLeft: 0, devices: [], locked: false });
  }
  try {
    return NextResponse.json(await status({ uid: who.uid, email: who.email }), { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("2fa status failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!env.secret) return NextResponse.json({ error: "notConfigured" }, { status: 503 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const action = str(body?.action, 20);
  const who = await requireStaff(req, { needPass: false });
  if (!who.ok) return NextResponse.json({ error: who.error }, { status: who.status });
  if (who.uid === DEMO_UID) return NextResponse.json({ error: "demo" }, { status: 400 });
  const w = { uid: who.uid, email: who.email };
  const seen = seenOf(req);

  try {
    if (!who.pass && action !== "verify" && action !== "trusted") {
      // Without a pass only the first enrolment is open.
      const enrolling = action === "begin" || action === "confirm";
      if (!enrolling || (await isEnrolled(who.uid))) return NextResponse.json({ error: "2fa" }, { status: 401 });
    }
    switch (action) {
      case "verify":
        return reply(await verify(w, { code: str(body?.code, 12), backup: str(body?.backup, 20), trust: body?.trust === true, label: str(body?.label, 80) }, seen));
      case "trusted":
        return reply(await trusted(w, str(body?.token, 80), seen));
      case "begin":
        return reply(await begin(w, str(body?.label, 40)));
      case "confirm":
        return reply(await confirm(w, str(body?.code, 12), seen));
      case "removeApp":
        return reply(await removeApp(w, str(body?.id, 20)));
      case "newCodes":
        return reply(await newCodes(w));
      case "revokeDevice":
        return reply(await revokeDevice(w, str(body?.id, 40)));
      default:
        return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
  } catch (err) {
    console.error("2fa action failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
