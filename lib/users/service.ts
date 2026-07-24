"use client";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import {
  isProfileComplete,
  normalizePhone,
  type ClientProfile,
  type UserRole,
} from "./types";

const COL = "users";

function mapProfile(uid: string, data: Record<string, unknown>): ClientProfile {
  const name = String(data.name ?? "");
  const phone = String(data.phone ?? "");
  return {
    uid,
    email: String(data.email ?? ""),
    name,
    phone,
    phoneNorm: String(data.phoneNorm ?? normalizePhone(phone)),
    role: (data.role as UserRole) || "client",
    photoURL: data.photoURL ? String(data.photoURL) : undefined,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
    profileComplete: isProfileComplete({ name, phone }),
  };
}

export async function getUserProfile(uid: string): Promise<ClientProfile | null> {
  const snap = await getDoc(doc(getFirebaseDb(), COL, uid));
  if (!snap.exists()) return null;
  return mapProfile(uid, snap.data() as Record<string, unknown>);
}

export async function upsertUserProfile(input: {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role?: UserRole;
  photoURL?: string | null;
}): Promise<ClientProfile> {
  const db = getFirebaseDb();
  const ref = doc(db, COL, input.uid);
  const existing = await getDoc(ref);
  const now = new Date().toISOString();
  const phoneNorm = normalizePhone(input.phone);
  const payload = {
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    phoneNorm,
    role: input.role ?? "client",
    photoURL: input.photoURL || null,
    updatedAt: now,
    updatedAtServer: serverTimestamp(),
    ...(existing.exists()
      ? {}
      : { createdAt: now, createdAtServer: serverTimestamp() }),
  };
  await setDoc(ref, payload, { merge: true });
  return mapProfile(input.uid, {
    ...payload,
    createdAt: existing.exists()
      ? String((existing.data() as { createdAt?: string }).createdAt ?? now)
      : now,
  });
}

export async function updateUserProfile(
  uid: string,
  patch: { name?: string; phone?: string },
) {
  const data: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  if (patch.name != null) data.name = patch.name.trim();
  if (patch.phone != null) {
    data.phone = patch.phone.trim();
    data.phoneNorm = normalizePhone(patch.phone);
  }
  await updateDoc(doc(getFirebaseDb(), COL, uid), data);
}
