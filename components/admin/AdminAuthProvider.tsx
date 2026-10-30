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
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { OWNER_EMAIL } from "@/lib/admin/claims";
import { roleOf, type StaffRole } from "@/lib/admin/roles";
import { DEMO_USER, isDemo } from "@/lib/admin/demo";

/** Where a browser the staff member chose to trust keeps its token (two-step sign-in, 30 days). */
export const TRUST_KEY = "phi-staff-trust";
/** Last activity in any tab, for the idle sign-out (Alpha's IDLE_MS). */
const SEEN_KEY = "phi-staff-seen";
export const IDLE_MINUTES = 30;
const IDLE_MS = IDLE_MINUTES * 60_000;

type PassState = "ok" | "needed" | "enrol";

/**
 * Two-step sign-in is mandatory (lib/admin/staff-2fa.ts): "enrol" when the token has no `mfa` yet (no
 * authenticator: the enrol screen), "needed" when its pass (`officeUntil`) ran out. A trusted browser
 * renews the pass on its own. Returns when the pass runs out.
 */
async function passState(user: User): Promise<{ state: PassState; until: number }> {
  const res = await user.getIdTokenResult();
  const until = typeof res.claims.officeUntil === "number" ? res.claims.officeUntil : 0;
  if (until > Date.now()) return { state: "ok", until };
  if (res.claims.mfa !== true) return { state: "enrol", until: 0 };
  let token = "";
  try {
    token = localStorage.getItem(TRUST_KEY) ?? "";
  } catch {
    /* storage blocked: ask for a code */
  }
  if (token) {
    const r = await fetch("/api/admin/2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
      body: JSON.stringify({ action: "trusted", token }),
    }).catch(() => null);
    if (r?.ok) {
      const fresh = await user.getIdTokenResult(true);
      return { state: "ok", until: Number(fresh.claims.officeUntil) || 0 };
    }
  }
  return { state: "needed", until: 0 };
}

/**
 * Asks the server to put the `staff` claim on an allowlisted account (the list is server only), then
 * decides from the token. The owner address counts only with a verified email, as in firestore.rules.
 */
async function staffCheck(user: User): Promise<{ staff: boolean; needVerify: boolean; role: StaffRole | null }> {
  let needVerify = false;
  try {
    const res = await fetch("/api/admin/sync-claims", {
      method: "POST",
      headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    });
    const data = (await res.json().catch(() => ({}))) as { refreshed?: boolean; needVerify?: boolean };
    if (data.refreshed) await user.getIdToken(true);
    needVerify = data.needVerify === true;
  } catch {
    /* Admin SDK optional until the service account is set: the token decides */
  }
  const res = await user.getIdTokenResult();
  const owner = user.email?.toLowerCase() === OWNER_EMAIL && res.claims.email_verified === true;
  const staff = res.claims.staff === true || owner;
  return { staff, needVerify, role: staff ? roleOf(res.claims, user.email) : null };
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
      return "This account isn’t allowed. Use a staff account or ask the owner to add you.";
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
    case "auth/requires-recent-login":
      return "Sign out and in again, then try once more.";
    default:
      return err instanceof Error ? err.message : "Something went wrong. Try again.";
  }
}

export type DenyReason = "" | "notStaff" | "verify";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  /** Development-only demo mode (sample data, no Firebase). */
  demo: boolean;
  staffDenied: boolean;
  /** Why the last account was turned away: not staff, or its email still needs verifying. */
  denyReason: DenyReason;
  /** owner / ops / finance (lib/admin/roles.ts); null while signed out. */
  role: StaffRole | null;
  /** Two-step sign-in still to do (a code from the authenticator app). */
  needsTwoStep: boolean;
  /** No authenticator yet: two-step sign-in is mandatory, so the enrol screen comes first. */
  needsEnrol: boolean;
  /** Call after a code was accepted (or an app was added): reloads the token's pass. */
  refreshPass: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [denyReason, setDenyReason] = useState<DenyReason>("");
  const [role, setRole] = useState<StaffRole | null>(null);
  const [demo, setDemo] = useState(false);
  const [pass, setPass] = useState<PassState>("ok");
  const [passUntil, setPassUntil] = useState(0);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (isDemo()) {
      setDemo(true);
      setRole("owner");
      setUser(DEMO_USER as unknown as User);
      setLoading(false);
      return;
    }
    if (!configured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        const check = await staffCheck(u);
        if (!check.staff) {
          if (check.needVerify) await sendEmailVerification(u).catch(() => undefined);
          setDenyReason(check.needVerify ? "verify" : "notStaff");
          setUser(null);
          setRole(null);
          await signOut(auth);
          setLoading(false);
          return;
        }
        setDenyReason("");
        setRole(check.role);
        const p = await passState(u).catch(() => ({ state: "needed" as const, until: 0 }));
        setPass(p.state);
        setPassUntil(p.until);
      } else {
        setPass("ok");
        setRole(null);
      }
      setUser(u);
      setLoading(false);
    });
  }, [configured]);

  // The pass runs out after a working day: ask again (or let a trusted browser renew it).
  useEffect(() => {
    if (!user || demo || !passUntil) return undefined;
    const t = setTimeout(() => {
      void passState(user).then((p) => {
        setPass(p.state);
        setPassUntil(p.until);
      });
    }, Math.max(1000, Math.min(passUntil - Date.now() + 1000, 2 ** 31 - 1)));
    return () => clearTimeout(t);
  }, [user, demo, passUntil]);

  // Idle sign-out after 30 minutes without a key, click or scroll in any dashboard tab.
  useEffect(() => {
    if (!user || demo) return undefined;
    const mark = () => {
      try {
        localStorage.setItem(SEEN_KEY, String(Date.now()));
      } catch {
        /* storage blocked: this tab's own clock below still works */
      }
      last = Date.now();
    };
    let last = Date.now();
    let wrote = 0;
    const onActivity = () => {
      if (Date.now() - wrote > 15_000) {
        wrote = Date.now();
        mark();
      } else last = Date.now();
    };
    mark();
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    const timer = window.setInterval(() => {
      let seen = last;
      try {
        seen = Math.max(seen, Number(localStorage.getItem(SEEN_KEY)) || 0);
      } catch {
        /* this tab only */
      }
      if (Date.now() - seen > IDLE_MS) void signOut(getFirebaseAuth());
    }, 60_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(timer);
    };
  }, [user, demo]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      configured,
      demo,
      staffDenied: denyReason !== "",
      denyReason,
      role,
      needsTwoStep: pass === "needed",
      needsEnrol: pass === "enrol",
      async refreshPass() {
        const u = getFirebaseAuth().currentUser;
        if (!u) return;
        await u.getIdToken(true);
        const p = await passState(u).catch(() => ({ state: "needed" as const, until: 0 }));
        setPass(p.state);
        setPassUntil(p.until);
      },
      async login(email, password) {
        setDenyReason("");
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        // The staff check runs in onAuthStateChanged and signs a non-staff account out again.
      },
      async loginWithGoogle() {
        setDenyReason("");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(getFirebaseAuth(), provider);
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
        if (demo) {
          window.location.href = "/";
          return;
        }
        await signOut(getFirebaseAuth());
      },
    }),
    [user, loading, configured, demo, denyReason, role, pass],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export default AdminAuthProvider;
