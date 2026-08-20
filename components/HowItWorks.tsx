import { Icon } from "./icons";
import { WHATSAPP_HREF, CALL_HREF, CALL_LABEL } from "@/lib/contact";

const steps = [
  {
    icon: "search",
    title: "Tell us the move",
    text: "Postcodes, property size and dates — message us on WhatsApp or call our London desk.",
  },
  {
    icon: "tag",
    title: "Get a clear price",
    text: "We confirm the right van size, crew number and a fixed quote — usually within about an hour.",
  },
  {
    icon: "truck",
    title: "We do the heavy lifting",
    text: "Insured local crew on the day. Loading, transport and careful delivery with zero moving surprises.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="scroll-mt-24 border-y border-line bg-surface py-16 md:py-24"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mb-3">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-content md:text-4xl">
            How Phi Movers works
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted md:text-lg">
            Three clear steps from enquiry to moving day — no complicated
            calculators, no hidden fees, and no moving-day surprises.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="group relative rounded-3xl border border-[#e2ebd9] bg-[#f5f8f3] p-7 text-left shadow-sm transition-all duration-300 hover:border-accent hover:shadow-md dark:border-white/10 dark:bg-white/5 md:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-lg font-black text-ink shadow-sm">
                  {i + 1}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  Step 0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold tracking-tight text-content">
                {s.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {s.text}
              </p>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
