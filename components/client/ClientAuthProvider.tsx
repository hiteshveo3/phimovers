"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { getUserProfile, upsertUserProfile } from "@/lib/users/service";
import {
  isProfileComplete,
  type ClientProfile,
} from "@/lib/users/types";

export function friendlyClientAuthError(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Sign in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "That email address doesn’t look right.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a minute, then try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Popup blocked — allow popups and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return err instanceof Error ? err.message : "Something went wrong.";
  }
}

type ClientAuthCtx = {
  user: User | null;
  profile: ClientProfile | null;
  loading: boolean;
  configured: boolean;
  needsProfile: boolean;
  refreshProfile: () => Promise<void>;
  register: (input: {
    name: string;
    phone: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  completeProfile: (name: string, phone: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<ClientAuthCtx | null>(null);

async function claimLeads(user: User, phone: string) {
  try {
    const token = await user.getIdToken();
    await fetch("/api/client/claim-leads", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });
  } catch {
    /* optional */
  }
}

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  const loadProfile = useCallback(async (u: User) => {
    const p = await getUserProfile(u.uid);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(getFirebaseAuth(), async (u) => {
      setUser(u);
      if (u) {
        try {
          await loadProfile(u);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, [configured, loadProfile]);

  const needsProfile =
    !!user && (!profile || !isProfileComplete(profile));

  const value = useMemo<ClientAuthCtx>(
    () => ({
      user,
      profile,
      loading,
      configured,
      needsProfile,
      async refreshProfile() {
        if (user) await loadProfile(user);
      },
      async register({ name, phone, email, password }) {
        const cred = await createUserWithEmailAndPassword(
          getFirebaseAuth(),
          email.trim(),
          password,
        );
        await updateProfile(cred.user, { displayName: name.trim() });
        const p = await upsertUserProfile({
          uid: cred.user.uid,
          email: cred.user.email ?? email,
          name,
          phone,
          role: "client",
        });
        setProfile(p);
        await claimLeads(cred.user, phone);
      },
      async login(email, password) {
        await signInWithEmailAndPassword(
          getFirebaseAuth(),
          email.trim(),
          password,
        );
      },
      async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const cred = await signInWithPopup(getFirebaseAuth(), provider);
        const existing = await getUserProfile(cred.user.uid);
        if (!existing) {
          await upsertUserProfile({
            uid: cred.user.uid,
            email: cred.user.email ?? "",
            name: cred.user.displayName ?? "",
            phone: "",
            role: "client",
            photoURL: cred.user.photoURL,
          });
        }
        await loadProfile(cred.user);
      },
      async completeProfile(name, phone) {
        if (!user) throw new Error("Not signed in");
        const p = await upsertUserProfile({
          uid: user.uid,
          email: user.email ?? "",
          name,
          phone,
          role: "client",
          photoURL: user.photoURL,
        });
        if (user.displayName !== name.trim()) {
          await updateProfile(user, { displayName: name.trim() });
        }
        setProfile(p);
        await claimLeads(user, phone);
      },
      async resetPassword(email) {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), audience: "client" }),
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
    [user, profile, loading, configured, needsProfile, loadProfile],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClientAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useClientAuth must be used within ClientAuthProvider");
  return ctx;
}

export default ClientAuthProvider;
