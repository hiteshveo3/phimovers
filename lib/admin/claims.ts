import { getStaffEmails } from "@/lib/admin/staff";

/** Bootstrap staff emails baked into rules fallback — keep in sync with env. */
export const BOOTSTRAP_STAFF_EMAILS = [
  "phimoves@gmail.com",
  ...getStaffEmails(),
].map((e) => e.toLowerCase());

export function isAllowlistedStaffEmail(email: string | null | undefined) {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  const list = new Set(BOOTSTRAP_STAFF_EMAILS);
  return list.has(e);
}
