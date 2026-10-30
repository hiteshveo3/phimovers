// Who may become staff, server side only. The list is ADMIN_EMAILS (comma separated, never sent to the
// browser). NEXT_PUBLIC_ADMIN_EMAILS is still read as a fallback so an existing deploy keeps working, but it
// is public: move the addresses to ADMIN_EMAILS and empty it.
//
// Fails closed: an empty list lets nobody join from the list (development included, because dev and live
// share one Firebase project). The owner address (lib/admin/claims.ts) and `staff` claims already given,
// or given in Settings > Staff, still work.

export function getStaffEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim() || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isStaffEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getStaffEmails().includes(email.trim().toLowerCase());
}

/** True when an allowlist is set (Settings shows it). */
export function staffGateEnabled() {
  return getStaffEmails().length > 0;
}
