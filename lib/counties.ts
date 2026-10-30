import { slugify } from "./data";
import { towns, type Town } from "./towns";

/**
 * County hub pages at /removals/county/{slug}: they group our town pages and
 * target county searches ("removals dorset", "home removals leicestershire").
 * Built for counties with three or more town pages, plus the keyword-backed
 * counties below.
 */
export type County = { name: string; slug: string; region: string; towns: Town[]; intro: string; keyword: string };

const KEYWORD_COUNTIES: Record<string, { keyword: string; intro: string }> = {
  Hertfordshire: {
    keyword: "house clearances Hertfordshire",
    intro:
      "House removals and house clearances across Hertfordshire — from Watford, St Albans and Hemel Hempstead to Hertford, Stevenage and the Lea Valley towns. Most of the county is under an hour from London, so moves and clearances here fit easily into a single day, priced up front.",
  },
  Dorset: {
    keyword: "removals Dorset",
    intro:
      "Removals in Dorset cover everything from Bournemouth and Poole flats to cottages and farmhouses inland around Dorchester and Bridport. Coastal towns get busy in summer and many rural lanes are narrow, so we plan van size and timing for each address before moving day.",
  },
  Devon: {
    keyword: "removals Devon",
    intro:
      "Removals in Devon usually mean a long-distance day from London, with Exeter, Plymouth, Torquay and the smaller market towns all well over 150 miles away. We plan the route, the crew’s day and any overnight stop up front, so the price you agree is the price you pay.",
  },
  Bedfordshire: {
    keyword: "removals Luton Bedfordshire",
    intro:
      "Removals in Bedfordshire are a short run from London up the M1 — Luton, Dunstable and Leighton Buzzard are all within an easy day’s move. We handle house moves, man and van jobs and clearances across the county.",
  },
  Oxfordshire: {
    keyword: "man with a van Oxfordshire removals",
    intro:
      "Man with a van and full removals across Oxfordshire, from student lets and period houses in Oxford to family homes in Didcot and the market towns. Central Oxford has strict access rules, so we plan loading points in advance.",
  },
  Leicestershire: {
    keyword: "home removals Leicestershire",
    intro:
      "Home removals across Leicestershire — Leicester itself, Loughborough, Hinckley and Coalville. Around 100 miles from London via the M1, most moves fit comfortably into a single day.",
  },
  Cornwall: {
    keyword: "man and van Cornwall",
    intro:
      "Man and van and removals to and from Cornwall, from Truro and Falmouth to Penzance. It’s a long journey from London, so we plan every Cornwall move as a long-distance job with realistic timings.",
  },
};

const byCounty = new Map<string, Town[]>();
for (const t of towns) byCounty.set(t.county, [...(byCounty.get(t.county) ?? []), t]);

function genericIntro(name: string, list: Town[]): string {
  const near = Math.min(...list.map((t) => t.miles).filter((m) => m > 0));
  const names = list.slice(0, 4).map((t) => t.name).join(", ");
  return `Removals across ${name}, including ${names}. Phi Movers is based in London${Number.isFinite(near) ? `, around ${near} miles from the nearest ${name} town we cover` : ""}, and quotes every ${name} move at a fixed price that already includes travel and mileage.`;
}

export const counties: County[] = [...byCounty.entries()]
  .filter(([name, list]) => list.length >= 3 || KEYWORD_COUNTIES[name])
  .map(([name, list]) => ({
    name,
    slug: slugify(name),
    region: list[0].region,
    towns: [...list].sort((a, b) => a.name.localeCompare(b.name)),
    intro: KEYWORD_COUNTIES[name]?.intro ?? genericIntro(name, list),
    keyword: KEYWORD_COUNTIES[name]?.keyword ?? `removals ${name}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getCounty(slug: string): County | undefined {
  return counties.find((c) => c.slug === slug);
}

/** Link to a county page, or null when that county has no page. */
export function countyHref(name: string): string | null {
  const slug = slugify(name);
  return counties.some((c) => c.slug === slug) ? `/removals/county/${slug}` : null;
}
