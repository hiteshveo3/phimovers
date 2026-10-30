import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, isAdminSdkConfigured } from "@/lib/firebase/admin";
import { firebaseCaller } from "@/lib/booking-flow/auth";
import { normalizePhone } from "@/lib/users/types";

export const runtime = "nodejs";

/**
 * Attaches orphan quote requests (leads with no ownerUid) and guest bookings (customerId "") to the
 * signed-in customer, but only by a VERIFIED identity: the account's email when Firebase says it is
 * verified (Google sign-in, or a verified address), or the account's phone number when it signed in by
 * phone. A phone typed into the profile is never enough: anyone could type someone else's number.
 * The body is ignored; everything comes from the ID token.
 */
export async function POST(req: NextRequest) {
  if (!isAdminSdkConfigured()) {
    return NextResponse.json({ ok: false, error: "Admin SDK not configured" }, { status: 503 });
  }
  const caller = await firebaseCaller(req);
  if (!caller) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const email = caller.verifiedEmail;
  const phone = caller.verifiedPhone ? normalizePhone(caller.verifiedPhone) : "";
  if (!email && phone.length < 10) {
    return NextResponse.json({ ok: true, claimed: 0, bookings: 0, reason: "unverified" });
  }

  const emailMatches = (v: unknown) => Boolean(email && typeof v === "string" && v.trim().toLowerCase() === email);
  const phoneMatches = (v: unknown) => Boolean(phone.length >= 10 && typeof v === "string" && normalizePhone(v) === phone);

  try {
    const db = getAdminDb();
    const now = new Date().toISOString();
    const [leads, bookings] = await Promise.all([
      db.collection("leads").where("ownerUid", "==", null).limit(500).get(),
      db.collection("bookings").where("customerId", "==", "").limit(500).get(),
    ]);
    const batch = db.batch();
    let claimed = 0;
    let claimedBookings = 0;
    for (const d of leads.docs) {
      const data = d.data();
      if (data.ownerUid) continue;
      if (!emailMatches(data.email) && !phoneMatches(data.phone)) continue;
      batch.update(d.ref, { ownerUid: caller.uid, updatedAt: now });
      claimed++;
    }
    for (const d of bookings.docs) {
      const data = d.data();
      if (data.customerId) continue;
      if (!emailMatches(data.customerEmail) && !phoneMatches(data.customerPhone)) continue;
      batch.update(d.ref, { customerId: caller.uid, updatedAt: new Date() });
      claimedBookings++;
    }
    if (claimed + claimedBookings > 0) await batch.commit();
    return NextResponse.json({ ok: true, claimed, bookings: claimedBookings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Claim failed" }, { status: 500 });
  }
}
