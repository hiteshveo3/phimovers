import { isStaffEmail } from "@/lib/admin/staff";

/**
 * The owner's address: always staff, always the owner role, and the one address firestore.rules and
 * storage.rules accept before the `staff` claim is on the token (and only with a verified email).
 * Keep it the same in both rules files.
 */
export const OWNER_EMAIL = "phimoves@gmail.com";

/** Kept for older imports: the owner address. The rest of the list is server only (lib/admin/staff.ts). */
export const BOOTSTRAP_STAFF_EMAILS = [OWNER_EMAIL];

export const isOwnerEmail = (email: string | null | undefined) =>
  Boolean(email && email.trim().toLowerCase() === OWNER_EMAIL);

/** The owner address or an address on the server-only staff list. Callers must also check `email_verified`. */
export function isAllowlistedStaffEmail(email: string | null | undefined) {
  if (!email) return false;
  return isOwnerEmail(email) || isStaffEmail(email);
}
