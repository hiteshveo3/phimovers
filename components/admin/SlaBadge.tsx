import { slaLabel, type Lead } from "@/lib/leads/types";

export default function SlaBadge({ lead }: { lead: Lead }) {
  const sla = slaLabel(lead);
  const tone =
    sla.tone === "late"
      ? "bg-red-100 text-red-800"
      : sla.tone === "warn"
        ? "bg-amber-100 text-amber-900"
        : "bg-[#9fe870]/35 text-[#163300]";
  return (
    <span
      className={
        "inline-flex rounded-pill px-2 py-0.5 text-[10px] font-bold " + tone
      }
    >
      {sla.label}
    </span>
  );
}
