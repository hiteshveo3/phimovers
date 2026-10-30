"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CloseCircle as CloseIcon, Sms as MailIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
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
    <div className="ad-toast" role="status" aria-live="polite">
      <i>
        <Ico icon={MailIcon} size={20} />
      </i>
      <div style={{ minWidth: 0, flex: 1 }}>
        <small>New lead</small>
        <b>{toast.name}</b>
        <span>
          {toast.service} · {toast.from} → {toast.to}
          {toast.priority === "urgent" ? " · Urgent" : ""}
        </span>
        <Link href={`/admin/leads/${toast.id}`} onClick={dismissToast}>
          Open lead
        </Link>
      </div>
      <button type="button" onClick={dismissToast} aria-label="Dismiss">
        <Ico icon={CloseIcon} size={20} />
      </button>
    </div>
  );
}
