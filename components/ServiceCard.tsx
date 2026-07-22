import type { Category } from "@/lib/data";
import { Icon } from "./icons";

export const serviceLabels: Record<number, string> = {
  1: "Solid green",
  2: "White + border",
  3: "Dark forest",
  4: "Icon watermark",
  5: "Outline",
  6: "Circle icon + arrow",
  7: "Top accent",
  8: "Gradient",
  9: "Centered minimal",
  10: "Bottom label bar",
};

export default function ServiceCard({
  variant = 1,
  c,
}: {
  variant?: number;
  c: Category;
}) {
  switch (variant) {
    case 1:
      return (
        <div className="flex h-full flex-col rounded-card bg-[#9fe870] p-5 text-[#163300]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#163300]/10 text-[#163300]">
            <Icon name={c.icon} className="h-5 w-5" />
          </span>
          <div className="mt-4">
            <h3 className="text-sm font-bold">{c.title}</h3>
            <p className="mt-0.5 text-xs text-[#163300]/70">{c.subtitle}</p>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="flex h-full flex-col rounded-card border border-line bg-surface p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
            <Icon name={c.icon} className="h-5 w-5" />
          </span>
          <div className="mt-auto pt-8">
            <h3 className="text-sm font-bold text-content">{c.title}</h3>
            <p className="mt-0.5 text-xs text-muted">{c.subtitle}</p>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex h-full flex-col rounded-card bg-[#163300] p-5 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-[#9fe870]">
            <Icon name={c.icon} className="h-5 w-5" />
          </span>
          <div className="mt-auto pt-8">
            <h3 className="text-sm font-bold">{c.title}</h3>
            <p className="mt-0.5 text-xs text-white/60">{c.subtitle}</p>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-card bg-[#9fe870] p-5 text-[#163300]">
          <Icon
            name={c.icon}
            className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-[#163300]/10"
          />
          <div className="relative">
            <h3 className="text-sm font-bold">{c.title}</h3>
            <p className="mt-0.5 text-xs text-[#163300]/70">{c.subtitle}</p>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="flex h-full flex-col rounded-card border-2 border-[#163300]/25 p-5 text-[#163300]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
            <Icon name={c.icon} className="h-5 w-5" />
          </span>
          <div className="mt-auto pt-8">
            <h3 className="text-sm font-bold">{c.title}</h3>
            <p className="mt-0.5 text-xs text-[#163300]/60">{c.subtitle}</p>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="group/card flex h-full flex-col rounded-card bg-[#9fe870] p-5 text-[#163300]">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#163300] text-[#9fe870]">
            <Icon name={c.icon} className="h-5 w-5" />
          </span>
          <div className="mt-auto flex items-end justify-between pt-8">
            <div>
              <h3 className="text-sm font-bold">{c.title}</h3>
              <p className="mt-0.5 text-xs text-[#163300]/70">{c.subtitle}</p>
            </div>
            <span className="-translate-x-1 text-lg opacity-0 transition-all group-hover/card:translate-x-0 group-hover/card:opacity-100">
              →
            </span>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface">
          <div className="h-1.5 bg-[#9fe870]" />
          <div className="flex flex-1 flex-col p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#9fe870]/25 text-[#163300]">
              <Icon name={c.icon} className="h-5 w-5" />
            </span>
            <div className="mt-auto pt-8">
              <h3 className="text-sm font-bold text-content">{c.title}</h3>
              <p className="mt-0.5 text-xs text-muted">{c.subtitle}</p>
            </div>
          </div>
        </div>
      );

    case 8:
      return (
        <div className="flex h-full flex-col rounded-card bg-gradient-to-br from-[#c2f59c] to-[#6fce46] p-5 text-[#163300]">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/40 text-[#163300]">
            <Icon name={c.icon} className="h-5 w-5" />
          </span>
          <div className="mt-auto pt-8">
            <h3 className="text-sm font-bold">{c.title}</h3>
            <p className="mt-0.5 text-xs text-[#163300]/70">{c.subtitle}</p>
          </div>
        </div>
      );

    case 9:
      return (
        <div className="flex h-full flex-col items-center justify-center rounded-card bg-[#9fe870] p-5 text-center text-[#163300]">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#163300]/10 text-[#163300]">
            <Icon name={c.icon} className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-sm font-bold">{c.title}</h3>
        </div>
      );

    case 10:
      return (
        <div className="flex h-full flex-col overflow-hidden rounded-card bg-[#9fe870]">
          <div className="flex flex-1 items-center justify-center p-6 text-[#163300]">
            <Icon name={c.icon} className="h-10 w-10" />
          </div>
          <div className="bg-[#163300] p-4 text-white">
            <h3 className="text-sm font-bold">{c.title}</h3>
            <p className="mt-0.5 text-xs text-white/60">{c.subtitle}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
