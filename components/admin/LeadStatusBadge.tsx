import { statusMeta, type LeadStatus } from "@/lib/leads/types";

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const meta = statusMeta(status);
  return (
    <span
      className={
        "inline-flex shrink-0 rounded-pill px-2.5 py-0.5 text-xs font-bold " +
        meta.color
      }
    >
      {meta.label}
    </span>
  );
}
