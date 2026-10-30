import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { DEMO_UID, requireStaff } from "@/lib/admin/require-staff";
import { isStaffRole } from "@/lib/admin/roles";
import { addStaff, listStaff, removeStaff, setRole, signOutEverywhere } from "@/lib/admin/staff-accounts";
import { alert, resetFor } from "@/lib/admin/staff-2fa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Staff accounts (lib/admin/staff-accounts.ts). GET lists them (any staff). POST actions:
 *   add       { email, role }   owner: gives the staff claim and role (creates the account if needed)
 *   role      { uid, role }     owner: changes a role
 *   remove    { uid }           owner: clears the claim, revokes tokens, disables the account
 *   reset2fa  { uid }           owner: two-step recovery for someone else (they enrol again)
 *   signOutAll                  anyone: ends every session of their own account (this one too)
 *   passwordChanged             anyone: the alert email after a password change in Settings
 */

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function GET(req: NextRequest) {
  const who = await requireStaff(req);
  if (!who.ok) return fail(who.error, who.status);
  if (who.uid === DEMO_UID) return NextResponse.json({ staff: [], you: who.uid, role: who.role });
  try {
    return NextResponse.json({ staff: await listStaff(), you: who.uid, role: who.role }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("staff list failed", err);
    return fail("unavailable", 503);
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const action = str(body?.action, 20);
  const self = action === "signOutAll" || action === "passwordChanged";
  const who = await requireStaff(req, self ? {} : { perm: "staff" });
  if (!who.ok) return fail(who.error, who.status);
  if (who.uid === DEMO_UID) return fail("demo");
  const by = { uid: who.uid, email: who.email };

  try {
    switch (action) {
      case "add": {
        const email = str(body?.email, 200).toLowerCase();
        const role = body?.role;
        if (!/^\S+@\S+\.\S+$/.test(email) || !isStaffRole(role)) return fail("A valid email and role are needed.");
        return NextResponse.json({ ok: true, ...(await addStaff(email, role, by)) }, { headers: { "Cache-Control": "no-store" } });
      }
      case "role": {
        const role = body?.role;
        if (!isStaffRole(role)) return fail("Unknown role.");
        await setRole(str(body?.uid, 128), role, by);
        return NextResponse.json({ ok: true });
      }
      case "remove":
        await removeStaff(str(body?.uid, 128), by);
        return NextResponse.json({ ok: true });
      case "reset2fa": {
        const uid = str(body?.uid, 128);
        if (uid === who.uid) return fail("Use a backup code to reset your own two-step sign-in.");
        const target = await getAdminAuth().getUser(uid);
        await resetFor({ uid, email: target.email ?? null }, by);
        return NextResponse.json({ ok: true });
      }
      case "signOutAll":
        await signOutEverywhere(by);
        return NextResponse.json({ ok: true });
      case "passwordChanged":
        // Firebase itself ends the other sessions when the password changes (this browser gets new tokens);
        // here only the alert goes out.
        await alert(by, "The password was changed; other devices were signed out");
        return NextResponse.json({ ok: true });
      default:
        return fail("invalid");
    }
  } catch (err) {
    const status = (err as { status?: number }).status;
    if (status) return fail((err as Error).message, status);
    if ((err as { code?: string }).code === "auth/user-not-found") return fail("No such account.", 404);
    console.error("staff action failed", err);
    return fail("That did not work. Try again.", 500);
  }
}
