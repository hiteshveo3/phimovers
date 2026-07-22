import { features } from "@/lib/data";

export default function FeatureGrid() {
  return (
    <section id="how" className="section">
      <div className="container-page">
        <h2 className="section-title mb-8">Why choose SwiftMove?</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col rounded-card border border-line bg-surface p-6 transition-colors duration-200 hover:border-[#163300]/40"
            >
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{f.body}</p>
              <a href="#" className="link-more mt-5">
                {f.cta}
                <span aria-hidden>→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
