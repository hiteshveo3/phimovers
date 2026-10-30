import { statusMeta, type LeadStatus } from "@/lib/leads/types";

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const meta = statusMeta(status);
  return <span className={`ad-badge st-${status}`}>{meta.label}</span>;
}
