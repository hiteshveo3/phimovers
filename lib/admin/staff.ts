/** Comma-separated staff emails. Empty = any signed-in user (dev). */
export function getStaffEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isStaffEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = getStaffEmails();
  if (list.length === 0) return true;
  return list.includes(email.trim().toLowerCase());
}

export function staffGateEnabled() {
  return getStaffEmails().length > 0;
}
