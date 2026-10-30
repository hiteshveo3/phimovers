import { slaLabel, type Lead } from "@/lib/leads/types";

export default function SlaBadge({ lead }: { lead: Lead }) {
  const sla = slaLabel(lead);
  return <span className={`ad-badge sla-${sla.tone}`}>{sla.label}</span>;
}
