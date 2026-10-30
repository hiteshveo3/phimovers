"use client";

import Link from "next/link";
import { useState } from "react";
import { Call as CallIcon, TickCircle as TickIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { updateLeadStatus } from "@/lib/leads/service";
import { formatLeadTime, type Lead } from "@/lib/leads/types";
import { useAdminAuth } from "./AdminAuthProvider";
import CopyPhoneButton from "./CopyPhoneButton";
import LeadStatusBadge from "./LeadStatusBadge";
import SlaBadge from "./SlaBadge";

/** One lead with the quick actions staff need: call, mark contacted, open. */
export default function LeadRow({ lead }: { lead: Lead }) {
  const { user } = useAdminAuth();
  const [busy, setBusy] = useState(false);

  async function markContacted() {
    setBusy(true);
    try {
      await updateLeadStatus(lead.id, "contacted", undefined, user?.email ?? undefined);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ad-lead-row">
      <Link href={`/admin/leads/${lead.id}`} className="ad-lead">
        <div className="ad-lead-main">
          <strong>
            {lead.name}
            {lead.priority === "urgent" && <span className="ad-badge urgent">Urgent</span>}
          </strong>
          <span>
            {lead.from} → {lead.to}
          </span>
          <span>
            {lead.service}
            {lead.quoteAmount ? ` · ${lead.quoteAmount}` : ""} · {formatLeadTime(lead.createdAt)}
          </span>
        </div>
        <div className="ad-lead-side">
          <LeadStatusBadge status={lead.status} />
          {lead.status === "new" && <SlaBadge lead={lead} />}
        </div>
      </Link>
      <div className="ad-kcard-acts">
        <a href={`tel:${lead.phone}`} className="ad-mini lime" aria-label={`Call ${lead.name}`}>
          <Ico icon={CallIcon} size={16} />
          Call
        </a>
        {lead.status === "new" && (
          <button type="button" className="ad-mini" disabled={busy} onClick={markContacted}>
            <Ico icon={TickIcon} size={16} />
            Mark contacted
          </button>
        )}
        <CopyPhoneButton phone={lead.phone} label="Copy number" />
        <Link href={`/admin/leads/${lead.id}`} className="ad-mini">
          Open
        </Link>
      </div>
    </div>
  );
}
