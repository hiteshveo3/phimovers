type Audience = "client" | "staff";

/**
 * Firebase generatePasswordResetLink points at firebaseapp.com.
 * Rewrite to our branded page so users set a password on phimovers.co.uk.
 */
export function sitePasswordResetLink(
  firebaseLink: string,
  audience: Audience,
  siteBase: string,
) {
  const base = siteBase.replace(/\/$/, "");
  try {
    const u = new URL(firebaseLink);
    const oobCode = u.searchParams.get("oobCode");
    if (!oobCode) return firebaseLink;
    const next =
      audience === "staff" ? "/admin/login" : "/client/login";
    const out = new URL(`${base}/auth/reset-password`);
    out.searchParams.set("oobCode", oobCode);
    out.searchParams.set("next", next);
    return out.toString();
  } catch {
    return firebaseLink;
  }
}
