import { allServices, slugify, type ServiceItem } from "./data";

export type Area = {
  name: string;
  slug: string;
  /** Short SEO blurb used on area + combo pages */
  blurb: string;
  /** Nearby borough slugs for internal linking */
  nearby: string[];
};

const def = (name: string, blurb: string, nearby: string[]): Area => ({
  name,
  slug: slugify(name),
  blurb,
  nearby: nearby.map(slugify),
});

/** All 32 London boroughs — canonical area data for /areas and combos. */
export const areas: Area[] = [
  def("Barking & Dagenham", "East London borough with terraced streets, estate access and easy A13 links for house and flat moves.", ["Havering", "Redbridge", "Newham"]),
  def("Barnet", "North London’s largest borough — Victorian houses, new builds and busy high streets around Finchley and High Barnet.", ["Enfield", "Haringey", "Harrow", "Camden"]),
  def("Bexley", "South-east London with suburban houses, riverside flats and straightforward van access on most residential roads.", ["Greenwich", "Bromley", "Havering"]),
  def("Brent", "North-west London from Wembley to Willesden — flats, family homes and busy A-road corridors.", ["Harrow", "Ealing", "Camden", "Barnet"]),
  def("Bromley", "Large south-east borough with suburban roads, parking considerations and longer carry distances on some streets.", ["Bexley", "Lewisham", "Croydon", "Greenwich"]),
  def("Camden", "Central / north London — Georgian terraces, mansion blocks, tight streets and controlled parking near the centre.", ["Islington", "Westminster", "Haringey", "Barnet", "Brent"]),
  def("City of London", "The Square Mile — office-heavy moves, early-morning slots and strict loading rules around the City.", ["Tower Hamlets", "Westminster", "Islington", "Southwark", "Hackney"]),
  def("Croydon", "South London hub with high-rises, Victorian streets and strong demand for house removals and man & van.", ["Sutton", "Bromley", "Lambeth", "Merton"]),
  def("Ealing", "West London — family houses, mansion blocks and ULEZ-aware routes across Acton, Ealing and Southall.", ["Hounslow", "Brent", "Hammersmith & Fulham", "Hillingdon"]),
  def("Enfield", "North London borough with suburban houses, town-centre flats and good A10 access for larger vans.", ["Barnet", "Haringey", "Waltham Forest"]),
  def("Greenwich", "South-east London from riverside flats to suburban roads — stairs, lifts and permit streets are common.", ["Lewisham", "Bexley", "Tower Hamlets", "Southwark"]),
  def("Hackney", "East London favourite for flat and house moves — narrow streets, conversions and busy weekend slots.", ["Islington", "Tower Hamlets", "Waltham Forest", "City of London", "Newham"]),
  def("Hammersmith & Fulham", "West London terraces and mansion blocks with tight parking and strong evening / weekend demand.", ["Kensington & Chelsea", "Ealing", "Wandsworth", "Hounslow"]),
  def("Haringey", "North London from Tottenham to Muswell Hill — mixed housing stock and varied access for vans.", ["Enfield", "Islington", "Hackney", "Barnet", "Waltham Forest"]),
  def("Harrow", "North-west London suburban houses and flats with generally good road access for Luton vans.", ["Brent", "Barnet", "Hillingdon", "Ealing"]),
  def("Havering", "Outer east London — Romford and surrounds with suburban drives and longer inter-borough runs.", ["Barking & Dagenham", "Redbridge", "Bexley"]),
  def("Hillingdon", "West London including Uxbridge and Heathrow corridors — houses, flats and student-area moves.", ["Hounslow", "Ealing", "Harrow"]),
  def("Hounslow", "West London borough with terraces, new builds and airport-side routes for house and office moves.", ["Ealing", "Hillingdon", "Richmond upon Thames", "Hammersmith & Fulham"]),
  def("Islington", "North London classic — Victorian conversions, walk-ups and controlled parking near Angel and Highbury.", ["Camden", "Hackney", "Haringey", "City of London", "Tower Hamlets"]),
  def("Kensington & Chelsea", "Central / west London mansion blocks, basements and strict permit zones — plan access early.", ["Westminster", "Hammersmith & Fulham", "Wandsworth", "Brent"]),
  def("Kingston upon Thames", "South-west London riverside town with suburban streets and popular weekend house-move slots.", ["Richmond upon Thames", "Merton", "Sutton", "Wandsworth"]),
  def("Lambeth", "South London from Brixton to Waterloo — flats, terraces and busy A-roads into central London.", ["Southwark", "Wandsworth", "Croydon", "Westminster"]),
  def("Lewisham", "South-east London with Victorian houses, new builds and mixed parking rules across the borough.", ["Greenwich", "Southwark", "Bromley", "Tower Hamlets"]),
  def("Merton", "South-west London including Wimbledon — family houses, flats and careful driveway access.", ["Wandsworth", "Sutton", "Kingston upon Thames", "Croydon"]),
  def("Newham", "East London — Stratford high-rises, terraces and strong demand for flat and student moves.", ["Tower Hamlets", "Hackney", "Barking & Dagenham", "Redbridge", "Waltham Forest"]),
  def("Redbridge", "North-east London suburban houses and flats with typically straightforward van access.", ["Waltham Forest", "Newham", "Barking & Dagenham", "Havering", "Enfield"]),
  def("Richmond upon Thames", "South-west London leafy streets, period houses and riverside flats — protect floors and plan parking.", ["Kingston upon Thames", "Hounslow", "Wandsworth", "Hammersmith & Fulham"]),
  def("Southwark", "Central / south London — warehouse conversions, estates and tight streets near the river.", ["Lambeth", "Lewisham", "Tower Hamlets", "City of London", "Greenwich"]),
  def("Sutton", "South London suburban borough with family houses and generally good access for removals vans.", ["Croydon", "Merton", "Kingston upon Thames"]),
  def("Tower Hamlets", "East London docks and city-edge — high-rises, warehouse flats and strict loading bays.", ["Hackney", "City of London", "Newham", "Southwark", "Islington"]),
  def("Waltham Forest", "North-east London — Walthamstow terraces, flats and popular man & van routes.", ["Hackney", "Haringey", "Enfield", "Redbridge", "Newham"]),
  def("Wandsworth", "South-west London — popular for house removals, sofas and busy Saturday bookings.", ["Lambeth", "Merton", "Hammersmith & Fulham", "Richmond upon Thames", "Kensington & Chelsea"]),
  def("Westminster", "Central London — mansion blocks, porters, tight loading and early slots preferred.", ["Camden", "Kensington & Chelsea", "City of London", "Lambeth", "Islington"]),
];

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}

export function getNearbyAreas(slug: string, count = 6): Area[] {
  const area = getAreaBySlug(slug);
  if (!area) return areas.filter((a) => a.slug !== slug).slice(0, count);
  const nearby = area.nearby
    .map((s) => getAreaBySlug(s))
    .filter((a): a is Area => Boolean(a));
  if (nearby.length >= count) return nearby.slice(0, count);
  const rest = areas.filter(
    (a) => a.slug !== slug && !nearby.some((n) => n.slug === a.slug)
  );
  return [...nearby, ...rest].slice(0, count);
}

/** Full area × service matrix — every borough × every service (1000+ pages). */
export function allAreaServiceParams(): { borough: string; service: string }[] {
  const params: { borough: string; service: string }[] = [];
  for (const a of areas) {
    for (const s of allServices) {
      params.push({ borough: a.slug, service: s.slug });
    }
  }
  return params;
}

export function comboHref(boroughSlug: string, serviceSlug: string) {
  return `/areas/${boroughSlug}/${serviceSlug}`;
}

export function areaHref(boroughSlug: string) {
  return `/areas/${boroughSlug}`;
}

/** Display names list (backward compatible with older pages). */
export const londonBoroughNames = areas.map((a) => a.name);

export function servicesForArea(): ServiceItem[] {
  return allServices;
}

/** Region groups for scannable area directories (no coloured chips). */
export const areaRegions: { label: string; slugs: string[] }[] = [
  {
    label: "Central",
    slugs: [
      "city-of-london",
      "westminster",
      "camden",
      "islington",
      "kensington-and-chelsea",
      "southwark",
    ],
  },
  {
    label: "North",
    slugs: ["barnet", "enfield", "haringey", "harrow", "brent"],
  },
  {
    label: "East",
    slugs: [
      "hackney",
      "tower-hamlets",
      "newham",
      "waltham-forest",
      "redbridge",
      "barking-and-dagenham",
      "havering",
    ],
  },
  {
    label: "South",
    slugs: [
      "lambeth",
      "wandsworth",
      "lewisham",
      "greenwich",
      "croydon",
      "bromley",
      "bexley",
      "merton",
      "sutton",
      "kingston-upon-thames",
      "richmond-upon-thames",
    ],
  },
  {
    label: "West",
    slugs: [
      "hammersmith-and-fulham",
      "ealing",
      "hounslow",
      "hillingdon",
    ],
  },
];

export function areasByRegion(): { label: string; areas: Area[] }[] {
  return areaRegions.map((r) => ({
    label: r.label,
    areas: r.slugs
      .map((s) => getAreaBySlug(s))
      .filter((a): a is Area => Boolean(a)),
  }));
}
