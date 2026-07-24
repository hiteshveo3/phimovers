/**
 * Client / staff user profile (Firestore `users/{uid}`).
 * Same shape for Flutter later — keep fields stable.
 */
export type UserRole = "client" | "staff";

export type ClientProfile = {
  uid: string;
  email: string;
  name: string;
  phone: string;
  /** Digits-only E.164-ish for matching leads */
  phoneNorm: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  /** Profile complete when name + phone present */
  profileComplete: boolean;
};

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^0/, "44");
}

export function isProfileComplete(
  p: Pick<ClientProfile, "name" | "phone"> | null | undefined,
) {
  if (!p) return false;
  return p.name.trim().length > 1 && normalizePhone(p.phone).length >= 10;
}
