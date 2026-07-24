import { NextRequest, NextResponse } from "next/server";
import {
  getAdminAuth,
  getAdminDb,
  isAdminSdkConfigured,
} from "@/lib/firebase/admin";
import { normalizePhone } from "@/lib/users/types";

export const runtime = "nodejs";

/** Attach orphan leads (no ownerUid) whose phone matches the client. */
export async function POST(req: NextRequest) {
  if (!isAdminSdkConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin SDK not configured" },
      { status: 503 },
    );
  }

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    const body = (await req.json()) as { phone?: string };
    const phoneNorm = normalizePhone(String(body.phone ?? ""));
    if (phoneNorm.length < 10) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }

    const db = getAdminDb();
    const snap = await db.collection("leads").limit(200).get();
    let claimed = 0;
    const batch = db.batch();
    for (const d of snap.docs) {
      const data = d.data();
      if (data.ownerUid) continue;
      const leadPhone = normalizePhone(String(data.phone ?? ""));
      if (!leadPhone) continue;
      const match =
        leadPhone === phoneNorm ||
        leadPhone.endsWith(phoneNorm) ||
        phoneNorm.endsWith(leadPhone);
      if (!match) continue;
      batch.update(d.ref, {
        ownerUid: decoded.uid,
        updatedAt: new Date().toISOString(),
      });
      claimed++;
    }
    if (claimed > 0) await batch.commit();
    return NextResponse.json({ ok: true, claimed });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Claim failed" }, { status: 500 });
  }
}
