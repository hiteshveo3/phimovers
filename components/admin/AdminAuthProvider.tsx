"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { isStaffEmail, staffGateEnabled } from "@/lib/admin/staff";

async function syncStaffClaims(user: User) {
  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/admin/sync-claims", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = (await res.json()) as { refreshed?: boolean };
      if (data.refreshed) await user.getIdToken(true);
    }
  } catch {
    /* Admin SDK optional until service account is set */
  }
}

export function friendlyAuthError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn’t look right.";
    case "auth/user-disabled":
      return "This account isn’t allowed. Use a staff email or ask the owner to add you.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a minute, then try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Popup blocked — allow popups for this site and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    case "auth/missing-email":
      return "Enter your email address first.";
    default:
      return err instanceof Error ? err.message : "Something went wrong. Try again.";
  }
}

type AuthCtx = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  staffDenied: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [staffDenied, setStaffDenied] = useState(false);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (u) => {
      if (u && staffGateEnabled() && !isStaffEmail(u.email)) {
        setStaffDenied(true);
        setUser(null);
        await signOut(auth);
        setLoading(false);
        return;
      }
      setStaffDenied(false);
      setUser(u);
      setLoading(false);
      if (u) void syncStaffClaims(u);
    });
  }, [configured]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      configured,
      staffDenied,
      async login(email, password) {
        setStaffDenied(false);
        const cred = await signInWithEmailAndPassword(
          getFirebaseAuth(),
          email,
          password,
        );
        if (staffGateEnabled() && !isStaffEmail(cred.user.email)) {
          await signOut(getFirebaseAuth());
          setStaffDenied(true);
          throw Object.assign(new Error("Not an authorised staff email."), {
            code: "auth/user-disabled",
          });
        }
        await syncStaffClaims(cred.user);
      },
      async loginWithGoogle() {
        setStaffDenied(false);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const cred = await signInWithPopup(getFirebaseAuth(), provider);
        if (staffGateEnabled() && !isStaffEmail(cred.user.email)) {
          await signOut(getFirebaseAuth());
          setStaffDenied(true);
          throw Object.assign(new Error("Not an authorised staff email."), {
            code: "auth/user-disabled",
          });
        }
        await syncStaffClaims(cred.user);
      },
      async resetPassword(email) {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), audience: "staff" }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || "Could not send reset email.");
        }
      },
      async logout() {
        await signOut(getFirebaseAuth());
      },
    }),
    [user, loading, configured, staffDenied],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export default AdminAuthProvider;
