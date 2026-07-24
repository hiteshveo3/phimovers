"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "@/components/icons";
import { playLeadChime } from "@/lib/admin/sound";
import { useLeads } from "./LeadsProvider";

export default function NewLeadToast() {
  const { toast, dismissToast } = useLeads();

  useEffect(() => {
    if (!toast) return;
    playLeadChime();
    const t = setTimeout(dismissToast, 10000);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div className="fixed inset-x-3 bottom-20 z-[60] mx-auto max-w-md lg:bottom-6 lg:right-6 lg:left-auto lg:mx-0">
      <div className="rounded-2xl border border-[#163300]/10 bg-[#163300] p-4 text-[#9fe870]">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
            <Icon name="mail" className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9fe870]/80">
              New lead
            </p>
            <p className="truncate font-bold text-white">{toast.name}</p>
            <p className="truncate text-xs text-[#9fe870]/75">
              {toast.service} · {toast.from} → {toast.to}
              {toast.priority === "urgent" ? " · Urgent" : ""}
            </p>
            <Link
              href={`/admin/leads/${toast.id}`}
              onClick={dismissToast}
              className="mt-2 inline-flex text-sm font-bold text-[#9fe870] underline underline-offset-2"
            >
              Open lead
            </Link>
          </div>
          <button
            type="button"
            onClick={dismissToast}
            className="text-[#9fe870]/70 hover:text-[#9fe870]"
            aria-label="Dismiss"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
