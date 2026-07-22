import { categories } from "@/lib/data";
import SectionHeader from "./SectionHeader";
import ServiceCard from "./ServiceCard";

export default function CategoryGrid() {
  return (
    <section id="services" className="section">
      <div className="container-page">
        <SectionHeader title="Our services" moreLabel="See all services" />

        {/* Cards rest aligned with the page content (px gutter) and bleed to
            the edges as you scroll. */}
        <div className="no-scrollbar -mx-5 mt-2 flex snap-x gap-4 overflow-x-auto px-5 pb-3 md:-mx-8 md:px-8">
          {categories.map((c) => (
            <div key={c.title} className="w-56 shrink-0 snap-start">
              <ServiceCard variant={1} c={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
