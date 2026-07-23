import Link from "next/link";
import { WHATSAPP_HREF } from "@/lib/contact";
import { areasByRegion } from "@/lib/areas";
import { Icon } from "./icons";

const popular = [
  { label: "Camden", href: "/areas/camden" },
  { label: "Islington", href: "/areas/islington" },
  { label: "Hackney", href: "/areas/hackney" },
  { label: "Westminster", href: "/areas/westminster" },
  { label: "Croydon", href: "/areas/croydon" },
  { label: "Wandsworth", href: "/areas/wandsworth" },
];

export default function AreasMegaMenu() {
  const regions = areasByRegion();

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid lg:grid-cols-[1fr_280px]">
        <div className="p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
              Popular boroughs
            </p>
            <Link
              href="/areas"
              className="text-xs font-semibold text-[#163300] hover:underline"
            >
              View all areas →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {popular.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group/item flex items-center gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-cream"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#9fe870] text-[#163300]">
                  <Icon name="mapPin" className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[13px] font-medium leading-tight text-content/85 group-hover/item:text-content">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {regions.map((region) => (
              <div key={region.label}>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">
                  {region.label}
                </p>
                <ul className="space-y-0.5">
                  {region.areas.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/areas/${a.slug}`}
                        className="block rounded-lg px-2 py-1.5 text-[13px] font-medium text-content/80 transition-colors hover:bg-cream hover:text-content"
                      >
                        {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between bg-[#9fe870] p-6 text-[#163300]">
          <div>
            <span className="inline-flex rounded-pill bg-[#163300]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
              All 32 + City
            </span>
            <p className="mt-4 text-lg font-extrabold leading-snug">
              Moving in your borough?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#163300]/75">
              Fixed-price quotes for house removals, man &amp; van and more —
              usually within about one working hour.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-full bg-[#163300] px-5 text-[#9fe870] hover:bg-[#0e2400]"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Get a quote
            </a>
            <Link
              href="/areas"
              className="btn w-full border border-[#163300]/20 bg-white px-5 text-[#163300]"
            >
              Browse all areas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
