// POST (Bearer ID token, signed in within the last 10 minutes) -> deletes the customer's account:
// the sign-in, the profile and its saved addresses and settings, their notifications and their photos.
// Quote requests are anonymised (name, phone and email removed). Bookings that are still to happen stop
// the deletion (call the office first); finished or cancelled bookings are anonymised but kept, because
// records of work carried out are needed for the accounts. Same steps as /delete-account describes.

import { getStorage } from "firebase-admin/storage";
import { getAdminApp, getAdminAuth, getAdminDb, isAdminSdkConfigured } from "@/lib/firebase/admin";
import { jsonReply } from "@/lib/booking-flow/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE = ["pending", "confirmed", "accepted", "en_route", "in_progress"];

export async function POST(req: Request) {
  if (!isAdminSdkConfigured()) return jsonReply({ error: "unavailable" }, 503);
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return jsonReply({ error: "signin" }, 401);
  let uid = "";
  try {
    const decoded = await getAdminAuth().verifyIdToken(token, true);
    // A recent sign-in, so an unlocked phone left on a table cannot delete the account.
    if (Date.now() / 1000 - decoded.auth_time > 600) return jsonReply({ error: "recent" }, 403);
    if (decoded.staff === true) return jsonReply({ error: "staff" }, 403);
    uid = decoded.uid;
  } catch {
    return jsonReply({ error: "signin" }, 401);
  }

  const db = getAdminDb();
  const bookings = await db.collection("bookings").where("customerId", "==", uid).get();
  if (bookings.docs.some((d) => ACTIVE.includes(String(d.get("status"))))) return jsonReply({ error: "active" }, 409);

  try {
    const now = new Date();
    const writer = db.bulkWriter();
    for (const d of bookings.docs) {
      writer.update(d.ref, { customerName: "Deleted customer", customerPhone: "", customerEmail: "", customerPhoneNorm: "", customerDeletedAt: now, updatedAt: now });
    }
    const leads = await db.collection("leads").where("ownerUid", "==", uid).get();
    for (const d of leads.docs) {
      writer.update(d.ref, { name: "Deleted customer", phone: "", email: null, phoneNorm: "", ownerUid: null, customerDeletedAt: now.toISOString(), updatedAt: now.toISOString() });
    }
    const notes = await db.collection("notifications").where("userId", "==", uid).get();
    notes.docs.forEach((d) => writer.delete(d.ref));
    await writer.close();
    await db.recursiveDelete(db.collection("users").doc(uid));

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET?.trim() || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
    if (bucketName) {
      const bucket = getStorage(getAdminApp()).bucket(bucketName);
      await Promise.all([
        bucket.deleteFiles({ prefix: `profile_photos/${uid}/` }).catch(() => undefined),
        bucket.deleteFiles({ prefix: `request_photos/${uid}/` }).catch(() => undefined),
      ]);
    }
    await getAdminAuth().deleteUser(uid);
    return jsonReply({ ok: true });
  } catch (err) {
    console.error("account delete failed", err);
    return jsonReply({ error: "failed" }, 500);
  }
}
