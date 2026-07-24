"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { subscribeLeads } from "@/lib/leads/service";
import type { Lead } from "@/lib/leads/types";
import { useAdminAuth } from "./AdminAuthProvider";

type LeadsCtx = {
  leads: Lead[];
  loading: boolean;
  error: string;
  toast: Lead | null;
  dismissToast: () => void;
};

const Ctx = createContext<LeadsCtx | null>(null);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const { user } = useAdminAuth();
  const pathname = usePathname();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<Lead | null>(null);
  const known = useRef<Set<string> | null>(null);
  const skipToast = pathname === "/admin/login";

  useEffect(() => {
    if (!user || !isFirebaseConfigured() || skipToast) {
      setLoading(false);
      return;
    }
    try {
      return subscribeLeads(
        (rows) => {
          if (known.current === null) {
            known.current = new Set(rows.map((r) => r.id));
          } else {
            const fresh = rows.find(
              (r) => r.status === "new" && !known.current!.has(r.id),
            );
            if (fresh) setToast(fresh);
            known.current = new Set(rows.map((r) => r.id));
          }
          setLeads(rows);
          setLoading(false);
          setError("");
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
      setLoading(false);
    }
  }, [user, skipToast]);

  const value = useMemo(
    () => ({
      leads,
      loading,
      error,
      toast,
      dismissToast: () => setToast(null),
    }),
    [leads, loading, error, toast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLeads() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLeads must be used within LeadsProvider");
  return ctx;
}

export default LeadsProvider;
