import type { NextRequest } from "next/server";
import { getAdminAuth, isAdminSdkConfigured } from "@/lib/firebase/admin";
import { isAllowlistedStaffEmail } from "@/lib/admin/claims";
import { can, roleOf, type Permission, type StaffRole } from "@/lib/admin/roles";

export type StaffCheck =
  | { ok: true; email: string | null; uid: string; role: StaffRole; enrolled: boolean; pass: boolean }
  | { ok: false; status: number; error: string };

/** The demo user's id (development only); routes use it to skip Firebase. */
export const DEMO_UID = "demo-user";

/**
 * Development demo mode (NEXT_PUBLIC_ADMIN_DEMO=1). Never in production, whatever the variable says:
 * scripts/admin-selftest.mjs checks this guard.
 */
export const demoAllowed = (nodeEnv = process.env.NODE_ENV, flag = process.env.NEXT_PUBLIC_ADMIN_DEMO) =>
  nodeEnv !== "production" && flag === "1";

/**
 * A POST/PATCH/DELETE from another site is refused (Alpha's sameOrigin). Requests without an Origin header
 * (the Android app, curl) pass: they cannot carry a browser's sign-in anyway, the Bearer token is the check.
 */
export function sameOrigin(req: NextRequest): boolean {
  if (req.method === "GET" || req.method === "HEAD") return true;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Server-only. Verifies the Firebase ID token in `Authorization: Bearer <token>` with the Admin SDK (revoked
 * tokens are refused, so "Remove staff" and "Sign out everywhere" take effect at once) and requires the
 * `staff` claim, or the owner / an allowlisted address with a verified email.
 *
 * Two-step sign-in is mandatory: every staff token needs the pass (`officeUntil` still running) that
 * lib/admin/staff-2fa.ts puts on it. `needPass: false` is only for /api/admin/2fa, so a staff member
 * without an authenticator can still enrol and an enrolled one can type a code.
 * `perm` also checks the role (lib/admin/roles.ts).
 */
export async function requireStaff(
  req: NextRequest,
  { needPass = true, perm }: { needPass?: boolean; perm?: Permission } = {},
): Promise<StaffCheck> {
  if (demoAllowed()) {
    return { ok: true, email: "demo@phimovers.test", uid: DEMO_UID, role: "owner", enrolled: true, pass: true };
  }
  if (!sameOrigin(req)) return { ok: false, status: 403, error: "Cross-site request refused" };
  if (!isAdminSdkConfigured()) {
    return { ok: false, status: 503, error: "Admin SDK not configured" };
  }
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return { ok: false, status: 401, error: "Missing token" };
  try {
    const decoded = await getAdminAuth().verifyIdToken(token, true);
    const email = decoded.email ?? null;
    const staff =
      decoded.staff === true ||
      (decoded.email_verified === true && isAllowlistedStaffEmail(email));
    if (!staff) return { ok: false, status: 403, error: "Staff only" };
    const pass = typeof decoded.officeUntil === "number" && decoded.officeUntil > Date.now();
    if (needPass && !pass) return { ok: false, status: 401, error: "2fa" };
    const role = roleOf(decoded as Record<string, unknown>, email);
    if (perm && !can(role, perm)) return { ok: false, status: 403, error: "Not allowed for your role" };
    return { ok: true, email, uid: decoded.uid, role, enrolled: decoded.mfa === true, pass };
  } catch {
    return { ok: false, status: 401, error: "Invalid token" };
  }
}
