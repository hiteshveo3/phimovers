import HeroBg from "@/components/HeroBg";
import HeroContent from "@/components/HeroContent";

const variations = [
  { n: 1, title: "Green mesh gradient" },
  { n: 2, title: "Grid lines (faded)" },
  { n: 3, title: "Dot grid (faded)" },
  { n: 4, title: "Aurora blobs" },
  { n: 5, title: "Spotlight + fine grid" },
  { n: 6, title: "Mesh + grid (mix of 1 & 2)" },
];

export default function HeroVariationsPage() {
  return (
    <main className="bg-base">
      <div className="container-page py-10">
        <h1 className="text-2xl font-bold">Hero background variations</h1>
        <p className="mt-2 text-sm text-muted">
          Compare the 5 options below, then tell me the number to apply it to the
          real hero.
        </p>
      </div>

      {variations.map((v) => (
        <section
          key={v.n}
          className="section relative isolate overflow-hidden border-t border-line"
        >
          <div className="absolute left-4 top-4 z-20 rounded-pill bg-[#163300] px-3 py-1 text-xs font-bold text-[#9fe870]">
            Variation {v.n} — {v.title}
          </div>
          <HeroBg variant={v.n} />
          <HeroContent />
        </section>
      ))}
    </main>
  );
}
