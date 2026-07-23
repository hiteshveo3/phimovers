import { Icon } from "./icons";

export const badgeLabels: Record<number, string> = {
  1: "Dark pill · green text",
  2: "Dark pill · white text",
  3: "Outline pill",
  4: "White pill",
  5: "Leading line",
  6: "Dot indicator",
  7: "Soft tint pill",
  8: "Underlined text",
  9: "Icon chip",
  10: "Glass pill",
};

const base = "text-[11px] font-bold uppercase tracking-[0.15em]";

export default function Badge({
  variant = 1,
  label,
  icon = "calendar",
}: {
  variant?: number;
  label: string;
  icon?: string;
}) {
  switch (variant) {
    case 1:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill bg-[#163300] px-3 py-1 text-[#9fe870] ${base}`}
        >
          <Icon name={icon} className="h-3.5 w-3.5" />
          {label}
        </span>
      );

    case 2:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill bg-[#163300] px-3 py-1 text-white ${base}`}
        >
          <Icon name={icon} className="h-3.5 w-3.5" />
          {label}
        </span>
      );

    case 3:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill border-2 border-[#163300] px-3 py-1 text-[#163300] ${base}`}
        >
          <Icon name={icon} className="h-3.5 w-3.5" />
          {label}
        </span>
      );

    case 4:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill bg-white px-3 py-1 text-[#163300] shadow-sm ${base}`}
        >
          <Icon name={icon} className="h-3.5 w-3.5" />
          {label}
        </span>
      );

    case 5:
      return (
        <span className={`inline-flex items-center gap-2.5 text-[#163300] ${base}`}>
          <span className="h-px w-7 bg-[#163300]" />
          {label}
        </span>
      );

    case 6:
      return (
        <span className={`inline-flex items-center gap-2 text-[#163300] ${base}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#163300]" />
          {label}
        </span>
      );

    case 7:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill bg-[#163300]/12 px-3 py-1 text-[#163300] ${base}`}
        >
          <Icon name={icon} className="h-3.5 w-3.5" />
          {label}
        </span>
      );

    case 8:
      return (
        <span
          className={`text-[#163300] underline decoration-2 underline-offset-4 ${base}`}
        >
          {label}
        </span>
      );

    case 9:
      return (
        <span className={`inline-flex items-center gap-2 text-[#163300] ${base}`}>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#163300] text-[#9fe870]">
            <Icon name={icon} className="h-3.5 w-3.5" />
          </span>
          {label}
        </span>
      );

    case 10:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill bg-white/30 px-3 py-1 text-[#163300] backdrop-blur ${base}`}
        >
          <Icon name={icon} className="h-3.5 w-3.5" />
          {label}
        </span>
      );

    default:
      return <span className={base}>{label}</span>;
  }
}
