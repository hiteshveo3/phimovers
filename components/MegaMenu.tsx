import { servicesMenu, type MegaLink } from "@/lib/data";
import { Icon } from "./icons";

function MenuItem({ item }: { item: MegaLink }) {
  return (
    <a
      href={item.href}
      className="group/item flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-cream"
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${item.color}1f`, color: item.color }}
      >
        <Icon name={item.icon} className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium text-content/85 group-hover/item:text-content">
        {item.label}
      </span>
    </a>
  );
}

export default function MegaMenu() {
  return (
    <div className="w-[680px] max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="flex gap-5">
        {servicesMenu.map((group, gi) => (
          <div
            key={group.title}
            className={
              "flex-1 " + (gi > 0 ? "border-l border-line pl-5" : "")
            }
          >
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-muted">
              {group.title}
            </p>
            <div className="flex gap-1">
              {group.columns.map((col, ci) => (
                <div key={ci} className="flex-1">
                  {col.map((item) => (
                    <MenuItem key={item.label} item={item} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
