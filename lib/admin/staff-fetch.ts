"use client";

import { getFirebaseAuth } from "@/lib/firebase/client";
import { isDemo } from "@/lib/admin/demo";

/** fetch() for the staff-only API routes: adds the Firebase ID token they verify on the server. */
export async function staffFetch(url: string, init: RequestInit = {}): Promise<Response> {
  let token = "demo";
  if (!isDemo()) {
    const user = getFirebaseAuth().currentUser;
    if (!user) throw new Error("Sign in again to continue.");
    token = await user.getIdToken();
  }
  return fetch(url, {
    ...init,
    headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers, Authorization: `Bearer ${token}` },
  });
}
