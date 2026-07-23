// Central content for the Phi Movers site (London-only, all 32 boroughs).
// Swap the `image` fields with real photo URLs when available.

export const img = (seed: string, w = 640, h = 480) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

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

export type Product = {
  title: string;
  price: string;
  author: string; // used for crew / detail line
  category: string;
  image: string;
};

export type Category = {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  color: string;
};

export const navLinks: { label: string; href: string }[] = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Areas", href: "/areas" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// ---- Services mega menu ----
export type MegaLink = { label: string; icon: string; color: string; href: string };
export type MegaGroup = { title: string; columns: MegaLink[][] };

const area = (label: string, i: number): MegaLink => ({
  label,
  icon: "mapPin",
  color: pc(i),
  href: `/areas/${slugify(label)}`,
});

export const servicesMenu: MegaGroup[] = [
  {
    title: "Services",
    columns: [
      [
        { label: "House Removals", icon: "home", color: pc(0), href: "/services/house-removals" },
        { label: "Sofa Delivery", icon: "sofa", color: pc(1), href: "/services/sofa-delivery" },
        { label: "Man & Van", icon: "truck", color: pc(2), href: "/services/man-and-van" },
        { label: "Office Removals", icon: "briefcase", color: pc(3), href: "/services/office-removals" },
        { label: "Full Packing Service", icon: "box", color: pc(4), href: "/services/full-packing-service" },
        { label: "Secure Storage", icon: "shield", color: pc(5), href: "/services/secure-storage" },
        { label: "Student Moves", icon: "user", color: pc(6), href: "/services/student-moves" },
        { label: "Flat Removals", icon: "home", color: pc(7), href: "/services/flat-removals" },
      ],
      [
        { label: "Piano & Specialist", icon: "star", color: pc(0), href: "/services/piano-and-specialist" },
        { label: "Furniture Delivery", icon: "sofa", color: pc(1), href: "/services/furniture-delivery" },
        { label: "Same-Day Move", icon: "clock", color: pc(2), href: "/services/same-day-move" },
        { label: "House Clearance", icon: "cart", color: pc(3), href: "/services/house-clearance" },
        { label: "International Moves", icon: "globe", color: pc(4), href: "/services/international-moves" },
        { label: "End of Tenancy Clean", icon: "sparkles", color: pc(5), href: "/services/end-of-tenancy-clean" },
        { label: "Vehicle Transport", icon: "truck", color: pc(6), href: "/services/vehicle-transport" },
        { label: "All services", icon: "box", color: pc(7), href: "/services" },
      ],
    ],
  },
  {
    title: "London boroughs we cover",
    columns: [
      [
        area("Camden", 0),
        area("Islington", 1),
        area("Hackney", 2),
        area("Westminster", 3),
        area("Kensington & Chelsea", 4),
        area("Hammersmith & Fulham", 5),
        area("Wandsworth", 6),
        area("Lambeth", 7),
      ],
      [
        area("Southwark", 0),
        area("Greenwich", 1),
        area("Lewisham", 2),
        area("Croydon", 3),
        area("Ealing", 4),
        area("Brent", 5),
        area("Barnet", 6),
        { label: "All 32 boroughs", icon: "mapPin", color: pc(7), href: "/areas" },
      ],
    ],
  },
];

// ---- Full services page (categorised, with images) ----
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
    image: image ?? `/services/${slug}.jpg`,
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

// ---- Packages & service cards ----
export const packages: Product[] = [
  { title: "Studio & 1-Bed Move", price: "from £299", author: "2 movers · 1 van", category: "House Removals", image: img("move-studio") },
  { title: "2-Bed House Move", price: "from £499", author: "3 movers · 1 van", category: "House Removals", image: img("move-2bed") },
  { title: "3-Bed House Move", price: "from £749", author: "4 movers · 2 vans", category: "House Removals", image: img("move-3bed") },
  { title: "4-Bed+ House Move", price: "from £999", author: "5 movers · 2 vans", category: "House Removals", image: img("move-4bed") },
  { title: "Man & Van", price: "from £50/hr", author: "1 mover · 1 van", category: "Man & Van", image: img("move-manvan") },
  { title: "Office Move", price: "Custom quote", author: "Dedicated project manager", category: "Office Removals", image: img("move-office") },
];

export const popular: Product[] = [
  { title: "Full Packing Service", price: "from £150", author: "Materials included", category: "Packing", image: img("pop-packing") },
  { title: "Furniture Dismantling", price: "from £60", author: "Reassembly included", category: "Assembly", image: img("pop-assembly") },
  { title: "Secure Storage", price: "from £15/wk", author: "24/7 CCTV monitored", category: "Storage", image: img("pop-storage") },
  { title: "Fragile & Specialist", price: "from £180", author: "Specialist crew", category: "Specialist", image: img("pop-fragile") },
  { title: "End of Tenancy Clean", price: "from £120", author: "Deposit-back clean", category: "Cleaning", image: img("pop-clean") },
];

export const homeMoves: Product[] = [
  { title: "Studio Flat Move", price: "from £249", author: "2 movers · van", category: "House Removals", image: img("home-studio") },
  { title: "1-Bed Flat Move", price: "from £329", author: "2 movers · van", category: "House Removals", image: img("home-1bed") },
  { title: "2-Bed House Move", price: "from £499", author: "3 movers · van", category: "House Removals", image: img("home-2bed") },
  { title: "3-Bed House Move", price: "from £749", author: "4 movers · 2 vans", category: "House Removals", image: img("home-3bed") },
  { title: "4-Bed House Move", price: "from £999", author: "5 movers · 2 vans", category: "House Removals", image: img("home-4bed") },
];

export const officeMoves: Product[] = [
  { title: "Small Office Move", price: "from £600", author: "Weekend move · ≤10 staff", category: "Office", image: img("office-small") },
  { title: "Medium Office Move", price: "from £1,200", author: "Project manager included", category: "Office", image: img("office-medium") },
  { title: "Large Office / HQ", price: "Custom quote", author: "Full crew & logistics", category: "Office", image: img("office-large") },
  { title: "IT & Server Relocation", price: "from £450", author: "Specialist tech team", category: "Office", image: img("office-it") },
  { title: "Retail / Shop Move", price: "Custom quote", author: "Out-of-hours service", category: "Office", image: img("office-retail") },
];

export const packingStorage: Product[] = [
  { title: "Full Packing Service", price: "from £150", author: "Materials included", category: "Packing", image: img("pack-full") },
  { title: "Fragile-only Packing", price: "from £80", author: "Kitchen & valuables", category: "Packing", image: img("pack-fragile") },
  { title: "Packing Materials Kit", price: "from £50", author: "Boxes, tape & wrap", category: "Packing", image: img("pack-kit") },
  { title: "Storage — per week", price: "from £15/wk", author: "Secure, dry unit", category: "Storage", image: img("store-week") },
  { title: "Storage — per month", price: "from £55/mo", author: "24/7 access", category: "Storage", image: img("store-month") },
];

export const manVanOptions: Product[] = [
  { title: "Man & Van — 1 Hour", price: "from £50", author: "1 mover · van", category: "Man & Van", image: img("mv-hour") },
  { title: "Half Day (4 hrs)", price: "from £160", author: "2 movers · van", category: "Man & Van", image: img("mv-half") },
  { title: "Full Day (8 hrs)", price: "from £299", author: "2 movers · van", category: "Man & Van", image: img("mv-full") },
  { title: "Single Item Delivery", price: "from £50", author: "1 mover · van", category: "Man & Van", image: img("mv-single") },
  { title: "Student Move", price: "from £59", author: "Budget-friendly", category: "Man & Van", image: img("mv-student") },
];

export type Feature = { title: string; body: string; cta: string };

export const features: Feature[] = [
  { title: "Fully Insured", body: "Goods-in-transit and public liability cover on every single move, for total peace of mind.", cta: "Our cover" },
  { title: "Fixed-Price Quotes", body: "No hidden fees or surprises. The price we quote is the price you pay on moving day.", cta: "Get a Quote" },
  { title: "Experienced London movers", body: "Uniformed crews who treat your belongings and home with care on every job.", cta: "Meet the team" },
  { title: "Packing & Materials", body: "Optional full packing service with strong boxes, wrap and blankets to protect everything.", cta: "Explore packing" },
  { title: "Flexible Scheduling", body: "Evening and weekend slots available to fit around your busy life and completion dates.", cta: "Check availability" },
  { title: "London Specialists", body: "We cover all 32 London boroughs and know the parking, permits and congestion zones inside out.", cta: "Areas we cover" },
];

// ---- Pricing (toggle) ----
export type BillingKey = "monthly" | "yearly" | "lifetime";

export type ProTier = {
  key: BillingKey;
  label: string;
  price: string;
  period: string;
  sub: string;
  badge?: string;
};

export const proTiers: ProTier[] = [
  { key: "monthly", label: "Man & Van", price: "£50", period: "/hour", sub: "1 mover + van · 2-hour minimum" },
  { key: "yearly", label: "Home Move", price: "£499", period: "fixed price", sub: "3 movers + van · up to 2-bed", badge: "Most popular" },
  { key: "lifetime", label: "Large Move", price: "£749", period: "fixed price", sub: "4 movers + 2 vans · 3–4 bed" },
];

export const proFeatures: string[] = [
  "Fully insured, professional crew",
  "Loading, transport & careful unloading",
  "Free wardrobe & standard boxes on the day",
  "Furniture blankets & full protection included",
];

// ---- FAQ ----
export const faqs: { q: string; a: string }[] = [
  {
    q: "How do you calculate my moving quote?",
    a: "We give a fixed price based on your inventory, property access and distance — confirmed after a quick free survey. No hidden fees on moving day.",
  },
  {
    q: "Are my belongings insured during the move?",
    a: "Yes. Every move includes goods-in-transit and public liability cover, so your items are protected from start to finish.",
  },
  {
    q: "Do you provide packing materials?",
    a: "Absolutely — we offer an optional full packing service with strong boxes, wrap and blankets, or you can pack yourself and we'll handle the rest.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking 1–2 weeks ahead, but we regularly handle short-notice and same-day moves wherever possible.",
  },
  {
    q: "Do you offer storage?",
    a: "Yes — we have secure, CCTV-monitored short and long-term storage available by the week or month.",
  },
  {
    q: "Which areas do you cover?",
    a: "We're London specialists covering all 32 boroughs — from Camden and Islington to Croydon and Ealing, across North, South, East and West London.",
  },
];

// ---- Search index ----
export const allProducts: Product[] = [
  ...packages,
  ...popular,
  ...homeMoves,
  ...officeMoves,
  ...packingStorage,
  ...manVanOptions,
];
