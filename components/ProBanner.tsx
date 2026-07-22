import Badge from "./Badge";

// Change this (1-10) to switch the badge style.
const BADGE_VARIANT = 10;

export default function ProBanner() {
  return (
    <section className="container-page">
      <div className="relative overflow-hidden rounded-[24px] bg-[#9fe870] px-6 py-10 text-ink md:px-12 md:py-14">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <Badge variant={BADGE_VARIANT} label="Free Survey & Quote" />
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Book a free home survey and get a fixed-price quote from our expert
              movers
            </h2>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3">
            <div className="text-sm text-ink/70">
              <span className="text-2xl font-bold text-ink">No obligation</span> · 60-second quote
            </div>
            <a href="#pricing" className="btn bg-black text-white hover:bg-[#1a1a1a]">
              Book Free Survey
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
