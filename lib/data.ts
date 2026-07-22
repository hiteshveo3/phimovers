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
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Areas", href: "#areas" },
  { label: "How it works", href: "#how" },
  { label: "Reviews", href: "#reviews" },
];

// ---- Services mega menu ----
export type MegaLink = { label: string; icon: string; color: string; href: string };
export type MegaGroup = { title: string; columns: MegaLink[][] };

const area = (label: string, i: number): MegaLink => ({
  label,
  icon: "mapPin",
  color: pc(i),
  href: "#",
});

export const servicesMenu: MegaGroup[] = [
  {
    title: "Services",
    columns: [
      [
        { label: "Home Removals", icon: "home", color: pc(0), href: "#" },
        { label: "Office Removals", icon: "briefcase", color: pc(1), href: "#" },
        { label: "Packing Service", icon: "box", color: pc(2), href: "#" },
        { label: "Storage Solutions", icon: "shield", color: pc(3), href: "#" },
        { label: "Man & Van", icon: "truck", color: pc(4), href: "#" },
        { label: "International Moves", icon: "globe", color: pc(5), href: "#" },
        { label: "Furniture Assembly", icon: "wrench", color: pc(6), href: "#" },
        { label: "House Clearance", icon: "cart", color: pc(7), href: "#" },
      ],
      [
        { label: "Piano & Specialist", icon: "star", color: pc(0), href: "#" },
        { label: "Fragile Packing", icon: "shield", color: pc(1), href: "#" },
        { label: "Student Moves", icon: "user", color: pc(2), href: "#" },
        { label: "Same-Day Move", icon: "clock", color: pc(3), href: "#" },
        { label: "Furniture Delivery", icon: "sofa", color: pc(4), href: "#" },
        { label: "End of Tenancy Clean", icon: "sparkles", color: pc(5), href: "#" },
        { label: "Vehicle Transport", icon: "truck", color: pc(6), href: "#" },
        { label: "Free Home Survey", icon: "calendar", color: pc(7), href: "#" },
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
        { label: "All 32 boroughs", icon: "mapPin", color: pc(7), href: "#areas" },
      ],
    ],
  },
];

// ---- Services (category grid) ----
export const categories: Category[] = [
  { title: "Home Removals", subtitle: "House moves of any size", href: "#", icon: "home", color: pc(0) },
  { title: "Office Removals", subtitle: "Minimal-downtime business moves", href: "#", icon: "briefcase", color: pc(1) },
  { title: "Packing Service", subtitle: "Professional packing & materials", href: "#", icon: "box", color: pc(2) },
  { title: "Storage Solutions", subtitle: "Secure short & long-term storage", href: "#", icon: "shield", color: pc(3) },
  { title: "Man & Van", subtitle: "Small moves & single items", href: "#", icon: "truck", color: pc(4) },
  { title: "International Moves", subtitle: "Across Europe & beyond", href: "#", icon: "globe", color: pc(5) },
  { title: "Furniture Assembly", subtitle: "Dismantle & reassemble", href: "#", icon: "wrench", color: pc(6) },
  { title: "House Clearance", subtitle: "Clear & dispose responsibly", href: "#", icon: "cart", color: pc(7) },
];

// ---- Packages & service cards ----
export const packages: Product[] = [
  { title: "Studio & 1-Bed Move", price: "from £299", author: "2 movers · 1 van", category: "Home Removals", image: img("move-studio") },
  { title: "2-Bed House Move", price: "from £499", author: "3 movers · 1 van", category: "Home Removals", image: img("move-2bed") },
  { title: "3-Bed House Move", price: "from £749", author: "4 movers · 2 vans", category: "Home Removals", image: img("move-3bed") },
  { title: "4-Bed+ House Move", price: "from £999", author: "5 movers · 2 vans", category: "Home Removals", image: img("move-4bed") },
  { title: "Man & Van", price: "from £45/hr", author: "1 mover · 1 van", category: "Man & Van", image: img("move-manvan") },
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
  { title: "Studio Flat Move", price: "from £249", author: "2 movers · van", category: "Home Removals", image: img("home-studio") },
  { title: "1-Bed Flat Move", price: "from £329", author: "2 movers · van", category: "Home Removals", image: img("home-1bed") },
  { title: "2-Bed House Move", price: "from £499", author: "3 movers · van", category: "Home Removals", image: img("home-2bed") },
  { title: "3-Bed House Move", price: "from £749", author: "4 movers · 2 vans", category: "Home Removals", image: img("home-3bed") },
  { title: "4-Bed House Move", price: "from £999", author: "5 movers · 2 vans", category: "Home Removals", image: img("home-4bed") },
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
  { title: "Packing Materials Kit", price: "from £35", author: "Boxes, tape & wrap", category: "Packing", image: img("pack-kit") },
  { title: "Storage — per week", price: "from £15/wk", author: "Secure, dry unit", category: "Storage", image: img("store-week") },
  { title: "Storage — per month", price: "from £55/mo", author: "24/7 access", category: "Storage", image: img("store-month") },
];

export const manVanOptions: Product[] = [
  { title: "Man & Van — 1 Hour", price: "from £45", author: "1 mover · van", category: "Man & Van", image: img("mv-hour") },
  { title: "Half Day (4 hrs)", price: "from £160", author: "2 movers · van", category: "Man & Van", image: img("mv-half") },
  { title: "Full Day (8 hrs)", price: "from £299", author: "2 movers · van", category: "Man & Van", image: img("mv-full") },
  { title: "Single Item Delivery", price: "from £39", author: "1 mover · van", category: "Man & Van", image: img("mv-single") },
  { title: "Student Move", price: "from £59", author: "Budget-friendly", category: "Man & Van", image: img("mv-student") },
];

export type Feature = { title: string; body: string; cta: string };

export const features: Feature[] = [
  { title: "Fully Insured", body: "Goods-in-transit and public liability cover on every single move, for total peace of mind.", cta: "Our cover" },
  { title: "Fixed-Price Quotes", body: "No hidden fees or surprises. The price we quote is the price you pay on moving day.", cta: "Get a Quote" },
  { title: "Trained, Vetted Movers", body: "Professional, background-checked crews who treat your belongings like their own.", cta: "Meet the team" },
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
  { key: "monthly", label: "Man & Van", price: "£45", period: "/hour", sub: "1 mover + van · 2-hour minimum" },
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
