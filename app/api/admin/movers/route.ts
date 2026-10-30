import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { requireStaff } from "@/lib/admin/require-staff";
import { normalizePhone } from "@/lib/users/types";
import { passwordProblem } from "@/lib/auth/password-rule";

export const runtime = "nodejs";

function tempPassword() {
  // 12 chars, readable, no look-alikes; always with a letter and a number (lib/auth/password-rule.ts).
  const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (;;) {
    const out = Array.from(randomBytes(12), (b) => alphabet[b % alphabet.length]).join("");
    if (!passwordProblem(out)) return out;
  }
}

/** Staff only: create a mover (crew) account. users/{uid}.role = "mover". */
export async function POST(req: NextRequest) {
  const check = await requireStaff(req, { perm: "crew" });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  let body: { name?: string; email?: string; phone?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = (body.phone ?? "").trim();
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 6) {
    return NextResponse.json(
      { error: "Name, a valid email and a phone number are required." },
      { status: 400 },
    );
  }
  const password = body.password?.trim() || tempPassword();
  const weak = passwordProblem(password);
  if (weak) {
    return NextResponse.json({ error: weak }, { status: 400 });
  }

  try {
    const auth = getAdminAuth();
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });
    const now = new Date().toISOString();
    await getAdminDb()
      .collection("users")
      .doc(user.uid)
      .set({
        uid: user.uid,
        email,
        name,
        phone,
        phoneNorm: normalizePhone(phone),
        role: "mover",
        status: "active",
        skills: [],
        notificationsEnabled: true,
        fcmTokens: [],
        createdAt: now,
        updatedAt: now,
      });
    return NextResponse.json({
      ok: true,
      uid: user.uid,
      email,
      // Shown once to the admin so they can hand it to the mover.
      password,
    });
  } catch (e) {
    const code = (e as { code?: string }).code ?? "";
    if (code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "There is already an account with that email." },
        { status: 409 },
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Could not create the mover." }, { status: 500 });
  }
}

/** Staff only: suspend or reactivate a mover (also disables their sign-in). */
export async function PATCH(req: NextRequest) {
  const check = await requireStaff(req, { perm: "crew" });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  let body: { uid?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const uid = body.uid ?? "";
  const status = body.status === "suspended" ? "suspended" : body.status === "active" ? "active" : "";
  if (!uid || !status) {
    return NextResponse.json({ error: "uid and status required" }, { status: 400 });
  }
  try {
    const ref = getAdminDb().collection("users").doc(uid);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.role !== "mover") {
      return NextResponse.json({ error: "Not a mover" }, { status: 404 });
    }
    await getAdminAuth().updateUser(uid, { disabled: status === "suspended" });
    await ref.update({ status, updatedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not update the mover." }, { status: 500 });
  }
}
