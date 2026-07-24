"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { subscribeClientLeads } from "@/lib/leads/service";
import type { Lead } from "@/lib/leads/types";
import { useClientAuth } from "./ClientAuthProvider";

type Ctx = {
  leads: Lead[];
  loading: boolean;
  error: string;
};

const LeadsCtx = createContext<Ctx | null>(null);

export function ClientLeadsProvider({ children }: { children: ReactNode }) {
  const { user, needsProfile } = useClientAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || needsProfile) {
      setLeads([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    return subscribeClientLeads(
      user.uid,
      (rows) => {
        setLeads(rows);
        setLoading(false);
        setError("");
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
  }, [user, needsProfile]);

  const value = useMemo(
    () => ({ leads, loading, error }),
    [leads, loading, error],
  );

  return <LeadsCtx.Provider value={value}>{children}</LeadsCtx.Provider>;
}

export function useClientLeads() {
  const ctx = useContext(LeadsCtx);
  if (!ctx) throw new Error("useClientLeads must be used within ClientLeadsProvider");
  return ctx;
}
