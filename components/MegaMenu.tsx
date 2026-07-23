import { WHATSAPP_HREF } from "@/lib/contact";
import { servicesMenu } from "@/lib/data";
import { Icon } from "./icons";

const services = servicesMenu[0].columns.flat();

export default function MegaMenu() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      <div className="grid grid-cols-[1fr_300px]">
        {/* Services grid */}
        <div className="p-6">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-muted">
            Our services
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {services.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group/item flex items-center gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-cream"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#9fe870]/25 text-[#163300] transition-colors group-hover/item:bg-[#9fe870]">
                  <Icon name={item.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[13px] font-medium leading-tight text-content/85 group-hover/item:text-content">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* CTA card */}
        <div className="flex flex-col justify-between bg-[#9fe870] p-6">
          <div>
            <span className="inline-flex rounded-pill bg-[#163300]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#163300]">
              Free home survey
            </span>
            <p className="mt-4 text-lg font-extrabold leading-snug text-[#163300]">
              Not sure which service you need?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#163300]/70">
              Get a free survey and a fixed-price quote — we usually reply within
              about one working hour across all 32 London boroughs.
            </p>
          </div>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-5 w-full bg-[#163300] px-5 text-[#9fe870] hover:bg-[#0e2400]"
          >
            Get a quote
            <Icon name="arrowRight" className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
