// Staff roles (as in Alpha Movers' permissions matrix). The role is the `staffRole` custom claim, set by an
// owner in Settings > Staff (/api/admin/staff). The owner address is always "owner". Staff who have the
// `staff` claim but no role yet count as "ops": they run leads, bookings and crew, but not money settings.
// Crew ("mover") are not staff: they use the app with users/{uid}.role == 'mover'.
// Safe on both sides (no env, no Firebase).

import { OWNER_EMAIL } from "./claims";

export const STAFF_ROLES = ["owner", "ops", "finance"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const ROLE_LABEL: Record<StaffRole, string> = {
  owner: "Owner",
  ops: "Office",
  finance: "Finance",
};

export type Permission =
  | "leads"
  | "bookings"
  | "crew"
  | "chats"
  | "invoices"
  | "prices"
  | "reports"
  | "staff";

const MATRIX: Record<StaffRole, Permission[]> = {
  owner: ["leads", "bookings", "crew", "chats", "invoices", "prices", "reports", "staff"],
  ops: ["leads", "bookings", "crew", "chats"],
  finance: ["bookings", "invoices", "prices", "reports"],
};

export const isStaffRole = (v: unknown): v is StaffRole =>
  typeof v === "string" && (STAFF_ROLES as readonly string[]).includes(v);

/** The role from token claims (and the email, for the owner). */
export function roleOf(claims: Record<string, unknown>, email?: string | null): StaffRole {
  if (email && email.trim().toLowerCase() === OWNER_EMAIL) return "owner";
  return isStaffRole(claims.staffRole) ? claims.staffRole : "ops";
}

export const can = (role: StaffRole | null | undefined, perm: Permission) =>
  Boolean(role && MATRIX[role].includes(perm));
