import Link from "next/link";
import { Icon } from "./icons";

const steps = [
  {
    icon: "search",
    title: "Tell us the move",
    text: "Postcodes, property size and a few photos — WhatsApp us or use the quote form.",
  },
  {
    icon: "tag",
    title: "Get a clear price",
    text: "We confirm the van, crew and a fixed quote — usually within about an hour.",
  },
  {
    icon: "truck",
    title: "We do the heavy lifting",
    text: "Insured local crew on the day. Loading, transport and careful delivery.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="scroll-mt-24 border-y border-line bg-cream py-14 md:py-20"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#163300] dark:text-[#9fe870]">
            Simple process
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-content md:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            Three clear steps from enquiry to moving day — no complicated
            calculators, no surprises on the day.
          </p>
        </div>

        <ol className="relative mt-12 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16%] right-[16%] top-[2.75rem] hidden h-px bg-line sm:block"
          />

          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative rounded-2xl border border-line bg-surface p-5 text-left shadow-card md:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="relative z-[1] grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#9fe870] text-[#163300] ring-4 ring-cream">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold tracking-tight text-content">
                    {s.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#quote" className="btn bg-[#9fe870] px-5 text-[#163300]">
            Get my free quote
            <Icon name="arrowRight" className="h-4 w-4" />
          </a>
          <Link
            href="/client"
            className="btn border border-line bg-surface px-5 text-content"
          >
            Client login
          </Link>
        </div>
      </div>
    </section>
  );
}
