import LogoMarquee from "./LogoMarquee";

export default function Stats() {
  return (
    <section id="reviews" className="container-page">
      <div className="rounded-[24px] border border-line bg-cream px-6 py-12 text-center md:px-12">
        <h2 className="mx-auto max-w-2xl text-2xl font-bold md:text-3xl">
          Your local London movers
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Families and businesses across every London borough choose Phi Movers
          for careful, reliable and fully insured removals.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          <div>
            <div className="text-4xl font-extrabold">32</div>
            <div className="mt-1 text-xs text-muted">London boroughs covered</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold">100%</div>
            <div className="mt-1 text-xs text-muted">Fully insured moves</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold">7 days</div>
            <div className="mt-1 text-xs text-muted">A week availability</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold">£0</div>
            <div className="mt-1 text-xs text-muted">Hidden fees</div>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <LogoMarquee />
        </div>
      </div>
    </section>
  );
}
