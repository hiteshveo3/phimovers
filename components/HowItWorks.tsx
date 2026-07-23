import { Icon } from "./icons";

const steps = [
  {
    icon: "search",
    title: "Tell us the move",
    text: "Postcodes, property size and a few photos — WhatsApp or the form below.",
  },
  {
    icon: "tag",
    title: "Get a fixed price",
    text: "We confirm the van, crew and a clear quote — usually within about an hour.",
  },
  {
    icon: "truck",
    title: "We do the heavy lifting",
    text: "Insured local crew on the day. Loading, transport and careful delivery.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-content md:text-3xl">
          How it works
        </h2>
        <p className="mt-3 text-sm text-muted md:text-base">
          Three simple steps from enquiry to moving day — no complicated
          calculators.
        </p>
      </div>
      <ol className="mt-10 grid gap-8 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="text-center sm:text-left">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#9fe870] text-[#163300]">
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#163300]">
              Step {i + 1}
            </p>
            <h3 className="mt-1 text-lg font-bold text-content">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
