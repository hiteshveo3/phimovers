// Staff accounts from Firebase Auth (Alpha's listOfficeAdmins / office-account.ts), server side only.
// Staff are the accounts with the `staff` custom claim; the role is `staffRole` (lib/admin/roles.ts).
// "Remove" clears those claims, marks the account `staffRemoved` (so sync-claims never gives the claim back
// from the email list), revokes its tokens and disables it. Everything here is owner-only at the route.

import { getAdminAuth } from "../firebase/admin";
import { getStaffEmails } from "./staff";
import { OWNER_EMAIL, isOwnerEmail } from "./claims";
import { roleOf, type StaffRole } from "./roles";
import { alert, forget, type Who } from "./staff-2fa";

export type StaffRow = {
  uid: string | null;
  email: string;
  role: StaffRole;
  /** Has the claim (null: only on the email list, no account or not signed in yet). */
  active: boolean;
  disabled: boolean;
  twoStep: boolean;
  lastSignIn: string | null;
  owner: boolean;
};

const STAFF_KEYS = ["staff", "staffRole", "mfa", "officeUntil", "staffRemoved"];

function withoutStaff(claims: Record<string, unknown>) {
  const next = { ...claims };
  for (const k of STAFF_KEYS) delete next[k];
  return next;
}

/** Every account with the staff claim, plus listed addresses that have not signed in yet. */
export async function listStaff(): Promise<StaffRow[]> {
  const auth = getAdminAuth();
  const rows: StaffRow[] = [];
  let page: string | undefined;
  do {
    const res = await auth.listUsers(1000, page);
    for (const u of res.users) {
      const c = (u.customClaims ?? {}) as Record<string, unknown>;
      const owner = isOwnerEmail(u.email);
      if (c.staff !== true && !owner) continue;
      rows.push({
        uid: u.uid,
        email: (u.email ?? "").toLowerCase(),
        role: roleOf(c, u.email),
        active: c.staff === true || owner,
        disabled: u.disabled,
        twoStep: c.mfa === true,
        lastSignIn: u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime).toISOString() : null,
        owner,
      });
    }
    page = res.pageToken;
  } while (page);
  const known = new Set(rows.map((r) => r.email));
  for (const email of [OWNER_EMAIL, ...getStaffEmails()]) {
    if (known.has(email)) continue;
    known.add(email);
    rows.push({ uid: null, email, role: email === OWNER_EMAIL ? "owner" : "ops", active: false, disabled: false, twoStep: false, lastSignIn: null, owner: email === OWNER_EMAIL });
  }
  return rows.sort((a, b) => Number(b.owner) - Number(a.owner) || a.email.localeCompare(b.email));
}

/**
 * Makes an address staff with a role. An existing account gets the claims (and is enabled again); a new
 * address gets an account with no password, and the owner hands over the set-password link returned here.
 */
export async function addStaff(email: string, role: StaffRole, by: Who): Promise<{ uid: string; link?: string }> {
  const auth = getAdminAuth();
  const address = email.trim().toLowerCase();
  let uid: string;
  let link: string | undefined;
  try {
    uid = (await auth.getUserByEmail(address)).uid;
  } catch (err) {
    if ((err as { code?: string }).code !== "auth/user-not-found") throw err;
    uid = (await auth.createUser({ email: address, emailVerified: false })).uid;
    link = await auth.generatePasswordResetLink(address);
  }
  const user = await auth.getUser(uid);
  const claims = { ...(user.customClaims ?? {}) } as Record<string, unknown>;
  delete claims.staffRemoved;
  await auth.setCustomUserClaims(uid, { ...claims, staff: true, staffRole: role });
  if (user.disabled) await auth.updateUser(uid, { disabled: false });
  await alert({ uid, email: address }, `Staff access (${role}) was given by ${by.email ?? "an owner"}`);
  return { uid, link };
}

export async function setRole(uid: string, role: StaffRole, by: Who) {
  const auth = getAdminAuth();
  const user = await auth.getUser(uid);
  if (isOwnerEmail(user.email) && role !== "owner") throw Object.assign(new Error("The owner address always stays owner."), { status: 400 });
  const claims = (user.customClaims ?? {}) as Record<string, unknown>;
  if (claims.staff !== true) throw Object.assign(new Error("Not a staff account."), { status: 404 });
  await auth.setCustomUserClaims(uid, { ...claims, staffRole: role });
  await alert({ uid, email: user.email ?? null }, `Staff role changed to ${role} by ${by.email ?? "an owner"}`);
}

/**
 * Removes staff access: claims cleared, `staffRemoved` set, two-step record deleted, every session ended
 * and the account disabled (Alpha's office-account removal). The owner address cannot be removed.
 */
export async function removeStaff(uid: string, by: Who) {
  const auth = getAdminAuth();
  const user = await auth.getUser(uid);
  if (isOwnerEmail(user.email)) throw Object.assign(new Error("The owner account cannot be removed."), { status: 400 });
  if (uid === by.uid) throw Object.assign(new Error("You cannot remove yourself."), { status: 400 });
  const claims = withoutStaff((user.customClaims ?? {}) as Record<string, unknown>);
  await auth.setCustomUserClaims(uid, { ...claims, staffRemoved: true });
  await forget(uid);
  await auth.revokeRefreshTokens(uid);
  await auth.updateUser(uid, { disabled: true });
  await alert({ uid, email: user.email ?? null }, `Staff access was removed by ${by.email ?? "an owner"} and the account was disabled`);
}

/** "Sign out everywhere": every refresh token of this account stops working (this browser too). */
export async function signOutEverywhere(who: Who) {
  await getAdminAuth().revokeRefreshTokens(who.uid);
  await alert(who, "Signed out on every device");
}
