// Central content for the Phi Movers site (London-only, all 32 boroughs): the one list of services.
// Prices for van and crew live in kit/site-facts.ts; FAQ answers come from lib/page-faqs.ts.

import { getFaqsForPath } from "./page-faqs";

// All-green brand palette (no blue, no orange).
export const palette = [
  "#163300", // forest green
  "#166534", // emerald green
  "#2e6b12", // green
  "#116530", // emerald
  "#4c9a2a", // lime green
  "#1e5631", // deep green
  "#245501", // olive green
  "#3a7d44", // sage green
];
const pc = (i: number) => palette[i % palette.length];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type Category = {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  color: string;
};

export type ServiceItem = {
  title: string;
  desc: string;
  price: string;
  icon: string;
  image: string;
  href: string;
  slug: string;
};
export type ServiceCategory = {
  id: string;
  title: string;
  intro: string;
  items: ServiceItem[];
};

/** Marketing-friendly price label: "from £299" -> "Starting from £299". */
export const priceLabel = (price: string): string => {
  const p = price.trim();
  if (/^from\s+/i.test(p)) return p.replace(/^from\s+/i, "Starting from ");
  if (/^custom/i.test(p)) return "Custom quote";
  if (/^free$/i.test(p)) return "Free";
  if (p.startsWith("+")) return `Add-on from ${p.slice(1).trim()}`;
  return p;
};

// Photos that exist in /public/services. Every other service borrows the closest one until it has its own,
// so no card or hero is ever left with a blank placeholder.
const SERVICE_PHOTOS = new Set([
  "appliance-delivery", "flat-removals", "full-packing-service", "furniture-delivery", "house-clearance",
  "house-removals", "long-distance-removals", "man-and-van", "office-removals", "secure-storage",
  "single-item-delivery", "sofa-delivery", "student-moves", "studio-moves",
]);

const PHOTO_FALLBACKS: Array<[RegExp, string]> = [
  [/part-load|long-distance|international|european/, "long-distance-removals"],
  [/bed|mattress|sofa|hoist/, "sofa-delivery"],
  [/marketplace|single/, "single-item-delivery"],
  [/appliance/, "appliance-delivery"],
  [/office|server|retail|shop|warehouse/, "office-removals"],
  [/storage/, "secure-storage"],
  [/pack|crate|material/, "full-packing-service"],
  [/clear|clean|survey/, "house-clearance"],
  [/furniture|ikea|assembly|piano|antique|fine-art/, "furniture-delivery"],
  [/flat|studio/, "flat-removals"],
  [/house|home/, "house-removals"],
];

const servicePhoto = (slug: string): string => {
  if (SERVICE_PHOTOS.has(slug)) return `/services/${slug}.jpg`;
  const match = PHOTO_FALLBACKS.find(([re]) => re.test(slug));
  return `/services/${match ? match[1] : "man-and-van"}.jpg`;
};

const svc = (
  title: string,
  desc: string,
  price: string,
  icon: string,
  seed: string,
  image?: string
): ServiceItem => {
  const slug = slugify(title);
  return {
    title,
    desc,
    price,
    icon,
    image: image ?? servicePhoto(slug),
    href: `/services/${slug}`,
    slug,
  };
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "home",
    title: "House & residential moves",
    intro:
      "From a studio to a family house — fully insured, fixed-price moves across every London borough.",
    items: [
      svc("House Removals", "House moves of any size, packed and protected door to door.", "Fixed quote", "home", "svc-house-removals", "/services/house-removals.jpg"),
      svc("Flat Removals", "Flat and apartment moves with stairs, lifts and tight access handled.", "from £249", "home", "svc-flat-removals"),
      svc("Studio Moves", "Fast, affordable studio flat moves across London.", "from £199", "home", "svc-studio-moves"),
      svc("Man & Van", "Small moves and single items, charged by the hour.", "from £50/hr", "truck", "svc-man-van"),
      svc("Student Moves", "Budget-friendly moves for halls, flats and shared houses.", "from £50/hr", "user", "svc-student"),
      svc("House Clearance", "Clear and dispose of unwanted items responsibly.", "from £120", "cart", "svc-clearance"),
      svc("Long Distance Removals", "London to anywhere in the UK — planned routes, fixed quotes and one crew door to door.", "custom quote", "truck", "svc-long-distance"),
      svc("Part Load Removals", "Share van space on a London–UK route and pay only for the space you use.", "custom quote", "truck", "svc-part-load"),
    ],
  },
  {
    id: "furniture",
    title: "Sofa, furniture & single items",
    intro:
      "Sofas, beds, appliances and one-off deliveries — carefully carried and placed where you want them.",
    items: [
      svc("Sofa Delivery", "Sofa collection and delivery with stairs and tight access covered.", "from £55", "sofa", "svc-sofa"),
      svc("Bed & Mattress Delivery", "Beds and mattresses collected, protected and placed in-room.", "from £50", "sofa", "svc-bed-mattress"),
      svc("Appliance Delivery", "Fridges, washers and white goods delivered and positioned.", "from £50", "cube", "svc-appliance"),
      svc("Single Item Delivery", "One item, one van — marketplace and store collections.", "from £50", "box", "svc-single-item"),
      svc("Furniture Delivery", "Furniture and flat-pack delivery across London.", "from £50", "sofa", "svc-furniture"),
      svc("Furniture Assembly", "Dismantle and reassemble beds, wardrobes and more.", "from £60", "wrench", "svc-assembly"),
      svc("Marketplace Collection & Delivery", "eBay, Gumtree and Facebook Marketplace buys collected from the seller and carried in by two people.", "from £50", "cart", "svc-marketplace"),
      svc("IKEA Collection & Assembly", "IKEA orders collected from London stores or click-and-collect, delivered and built. Not affiliated with IKEA.", "from £60", "wrench", "svc-ikea"),
    ],
  },
  {
    id: "business",
    title: "Business & office",
    intro:
      "Minimal-downtime relocations planned around your business — evenings and weekends available.",
    items: [
      svc("Office Removals", "Planned business moves with a dedicated project manager.", "custom quote", "briefcase", "svc-office"),
      svc("IT & Server Relocation", "Specialist team for careful tech and server moves.", "from £450", "shield", "svc-it"),
      svc("Retail / Shop Move", "Out-of-hours relocations to keep you trading.", "custom quote", "cart", "svc-retail"),
      svc("Warehouse Removals", "Stock, racking and warehouse moves with the right crew and vans.", "custom quote", "cube", "svc-warehouse"),
      svc("Office Furniture Removals", "Desks, bench desking, storage and meeting tables dismantled, moved, rebuilt or cleared.", "custom quote", "briefcase", "svc-office-furniture"),
    ],
  },
  {
    id: "packing",
    title: "Packing & storage",
    intro:
      "Professional packing and secure, monitored storage for short or long-term needs.",
    items: [
      svc("Full Packing Service", "Our team packs everything with quality materials.", "from £150", "box", "svc-packing-full"),
      svc("Fragile-only Packing", "Expert wrapping for kitchens, glass and valuables.", "from £80", "shield", "svc-packing-fragile"),
      svc("Packing Materials", "Boxes, tape and wrapping kits delivered to you.", "from £50", "cube", "svc-materials"),
      svc("Secure Storage", "Short and long-term units, 24/7 CCTV monitored.", "from £15/wk", "cube", "svc-storage"),
      svc("Moving Crate Hire", "Plastic moving crates delivered to your door and collected after the move.", "custom quote", "box", "svc-crate-hire"),
      svc("Storage with Collection", "We collect, store and redeliver — ideal for renovations and gaps between moves.", "from £15/wk", "truck", "svc-storage-collection"),
    ],
  },
  {
    id: "specialist",
    title: "Specialist & vehicle",
    intro:
      "Pianos, bikes and awkward heavy items that need trained crews and the right kit.",
    items: [
      svc("Piano & Specialist", "Trained crew for pianos and heavy specialist items.", "from £180", "star", "svc-piano"),
      svc("Vehicle Transport", "Move cars, motorbikes and equipment safely.", "custom quote", "truck", "svc-vehicle"),
      svc("Motorbike Transport", "Secure motorbike and scooter transport across London.", "from £80", "truck", "svc-motorbike"),
      svc("Sofa & Furniture Hoisting", "Window and balcony hoisting when furniture won’t fit up the stairs.", "custom quote", "sofa", "svc-hoisting"),
      svc("Heavy & Machinery Moving", "Gym equipment, safes, machinery and heavy items moved with a planned lift.", "custom quote", "wrench", "svc-heavy-machinery"),
      svc("Antique & Fine Art Moving", "Antiques, artwork, mirrors and clocks soft-wrapped, condition-recorded and moved with care.", "custom quote", "star", "svc-antique-fine-art"),
    ],
  },
  {
    id: "extras",
    title: "Timing, clean & international",
    intro:
      "Urgent slots, evening moves, overseas relocations and deposit-ready cleans.",
    items: [
      svc("Same-Day Move", "Urgent, last-minute bookings when you need them.", "from £70", "clock", "svc-sameday"),
      svc("Last Minute Removals", "Short-notice removals when dates suddenly change.", "from £65", "clock", "svc-last-minute"),
      svc("Evening & Weekend Moves", "Out-of-hours moves that fit around work and keys.", "from £60/hr", "calendar", "svc-evening-weekend"),
      svc("International Moves", "Door-to-door moves across Europe and beyond.", "custom quote", "globe", "svc-international"),
      svc("European Moves", "Road moves to and from Europe with export packing.", "custom quote", "globe", "svc-european"),
      svc("End of Tenancy Clean", "Deposit-back deep clean after your move.", "from £120", "sparkles", "svc-clean"),
      svc("Free Home Survey", "No-obligation visit to give you an accurate quote.", "free", "calendar", "svc-survey"),
    ],
  },
];

export const allServices: ServiceItem[] = serviceCategories.flatMap(
  (c) => c.items
);

export function getServiceBySlug(
  slug: string
): { item: ServiceItem; category: ServiceCategory } | null {
  for (const cat of serviceCategories) {
    const item = cat.items.find((i) => i.slug === slug);
    if (item) return { item, category: cat };
  }
  return null;
}

// All 32 London boroughs — the full coverage list.
export const londonBoroughs = [
  "Barking & Dagenham",
  "Barnet",
  "Bexley",
  "Brent",
  "Bromley",
  "Camden",
  "City of London",
  "Croydon",
  "Ealing",
  "Enfield",
  "Greenwich",
  "Hackney",
  "Hammersmith & Fulham",
  "Haringey",
  "Harrow",
  "Havering",
  "Hillingdon",
  "Hounslow",
  "Islington",
  "Kensington & Chelsea",
  "Kingston upon Thames",
  "Lambeth",
  "Lewisham",
  "Merton",
  "Newham",
  "Redbridge",
  "Richmond upon Thames",
  "Southwark",
  "Sutton",
  "Tower Hamlets",
  "Waltham Forest",
  "Wandsworth",
  "Westminster",
];

// ---- Services (category grid) ----
export const categories: Category[] = [
  { title: "House Removals", subtitle: "House moves of any size", href: "/services/house-removals", icon: "home", color: pc(0) },
  { title: "Office Removals", subtitle: "Minimal-downtime business moves", href: "/services/office-removals", icon: "briefcase", color: pc(1) },
  { title: "Sofa Delivery", subtitle: "Sofas carried and placed with care", href: "/services/sofa-delivery", icon: "sofa", color: pc(2) },
  { title: "Packing Service", subtitle: "Professional packing & materials", href: "/services/full-packing-service", icon: "box", color: pc(3) },
  { title: "Secure Storage", subtitle: "Secure short & long-term storage", href: "/services/secure-storage", icon: "shield", color: pc(4) },
  { title: "Man & Van", subtitle: "Flexible hourly small moves", href: "/services/man-and-van", icon: "truck", color: pc(5) },
];

// ---- FAQ ----
// General answers, built from kit/site-facts.ts in lib/page-faqs.ts so a price, deposit or cover figure is never typed twice.
export const faqs: { q: string; a: string }[] = getFaqsForPath("/");
