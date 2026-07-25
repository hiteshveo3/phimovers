import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAuth,
  isAdminSdkConfigured,
} from "@/lib/firebase/admin";
import { isMailConfigured, sendMail } from "@/lib/email/send";
import { passwordResetHtml } from "@/lib/email/passwordResetTemplate";
import { sitePasswordResetLink } from "@/lib/auth/passwordResetLink";

export const runtime = "nodejs";

type Audience = "client" | "staff";

const hits = new Map<string, { n: number; t: number }>();

function rateOk(key: string) {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now - row.t > 15 * 60 * 1000) {
    hits.set(key, { n: 1, t: now });
    return true;
  }
  if (row.n >= 5) return false;
  row.n += 1;
  return true;
}

/**
 * Custom branded password reset (Firebase Auth templates are locked).
 * Always returns generic success when the email is unknown (anti-enumeration).
 */
export async function POST(req: NextRequest) {
  if (!isAdminSdkConfigured()) {
    return NextResponse.json(
      {
        error:
          "Server auth not ready. FIREBASE_SERVICE_ACCOUNT_JSON is required.",
      },
      { status: 503 },
    );
  }
  if (!isMailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Email not configured. Add RESEND_API_KEY (recommended) or SMTP_* to env.",
      },
      { status: 503 },
    );
  }

  let body: { email?: string; audience?: Audience };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const audience: Audience =
    body.audience === "staff" ? "staff" : "client";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateOk(`${ip}:${email}`)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  }

  // Prefer www — matches live alias + Firebase authorized domains
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.phimovers.co.uk"
  ).replace(/\/$/, "");
  const continueUrl =
    audience === "staff" ? `${base}/admin/login` : `${base}/client/login`;

  const auth = getAdminAuth();

  let displayName: string | undefined;
  try {
    const user = await auth.getUserByEmail(email);
    displayName = user.displayName || undefined;
  } catch {
    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, a reset link is on its way.",
    });
  }

  try {
    const firebaseLink = await auth.generatePasswordResetLink(email, {
      url: continueUrl,
      handleCodeInApp: false,
    });
    const link = sitePasswordResetLink(firebaseLink, audience, base);
    await sendMail({
      to: email,
      subject: "Reset your Phi Movers password",
      html: passwordResetHtml({
        email,
        link,
        displayName,
        audience,
      }),
    });
    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, a reset link is on its way.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("forgot-password failed:", msg);
    // Safe, useful hint (no secrets)
    const hint = /SMTP|ECONN|auth|Invalid login|535|534/i.test(msg)
      ? "Mail server rejected the send. Check Zoho SMTP app password / host."
      : /FIREBASE|credential|private_key/i.test(msg)
        ? "Server Firebase credentials issue."
        : "Could not send reset email. Try again shortly.";
    return NextResponse.json({ error: hint }, { status: 500 });
  }
}
