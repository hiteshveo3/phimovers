import { allServices } from "./data";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMins: number;
  date: string; // ISO
  dateLabel: string;
  /** ISO date of the last real update, when the guide was revised after publishing. */
  updated?: string;
  /** Filename stem under /public/blog/{cover}.jpg */
  cover: string;
  featured?: boolean;
};

export const blogCategories = [
  "All",
  "Moving tips",
  "Packing",
  "London",
  "Man & Van",
  "Storage",
  "Sofa & furniture",
];

// Cover photos that exist in /public/blog. Until a post's cover is added there and listed here, cards and the
// article show a drawn illustration for its category instead of a broken image, and og:image falls back to the logo.
const BLOG_COVERS = new Set<string>([]);

/** The cover photo path, or '' when the post has no photo yet. */
export function blogCover(post: BlogPost, _w = 800, _h = 520) {
  return BLOG_COVERS.has(post.cover) ? `/blog/${post.cover}.jpg` : '';
}

/** Illustration used in place of a missing cover (kit/components/Illustrations.tsx subjects). */
export function blogArt(post: BlogPost): 'van' | 'hoist' | 'stairs' | 'sofa' {
  if (/sofa|furniture/i.test(post.category)) return 'hoist';
  if (/pack|storage/i.test(post.category)) return 'sofa';
  if (/london/i.test(post.category)) return 'stairs';
  return 'van';
}

export const posts: BlogPost[] = [
  {
    slug: "how-much-does-it-cost-to-move-house-uk",
    title: "How much does it cost to move house in the UK? (2026 guide)",
    excerpt:
      "Removals prices by property size, packing, storage, van costs and the legal extras — plus honest ways to cut the cost of moving home.",
    category: "Moving tips",
    readMins: 11,
    date: "2026-10-17",
    dateLabel: "17 October 2026",
    cover: "complete-guide-to-moving-home-in-london",
    featured: true,
  },
  {
    slug: "how-long-does-it-take-to-move-house",
    title: "How long does it take to move house? Timelines explained",
    excerpt:
      "The typical weeks from offer to completion, plus how many hours moving day really takes for a studio, flat or family house.",
    category: "Moving tips",
    readMins: 8,
    date: "2026-10-16",
    dateLabel: "16 October 2026",
    cover: "studio-flat-move-checklist",
  },
  {
    slug: "how-much-does-an-office-move-cost",
    title: "How much does an office move cost? What really drives the price",
    excerpt:
      "Headcount, floors, IT, out-of-hours timing and old furniture — what shapes office moving cost and how to get an accurate quote.",
    category: "Moving tips",
    readMins: 9,
    date: "2026-10-15",
    dateLabel: "15 October 2026",
    cover: "evening-weekend-moves-london",
  },
  {
    slug: "storage-costs-london-uk",
    title: "Storage costs per month in London and the UK",
    excerpt:
      "What self storage costs a month, which unit size fits a flat or 3-bed house, and the extras that push the price up.",
    category: "Storage",
    readMins: 7,
    date: "2026-10-15",
    dateLabel: "15 October 2026",
    cover: "self-storage-guide-london",
  },
  {
    slug: "how-to-choose-a-long-distance-moving-company",
    title: "How to choose a long-distance moving company: a buyer’s checklist",
    excerpt:
      "Fixed prices, insurance, who really does the move, drivers’ hours and part-loads — what to check before you book a long-distance removal.",
    category: "Moving tips",
    readMins: 8,
    date: "2026-10-14",
    dateLabel: "14 October 2026",
    cover: "man-and-van-vs-full-removal",
  },
  {
    slug: "cheapest-way-to-send-furniture-uk",
    title: "The cheapest way to transport furniture in the UK",
    excerpt:
      "Man & van, courier marketplaces, DIY van hire or a removals firm — what each really costs, plus moving furniture to Spain.",
    category: "Sofa & furniture",
    readMins: 8,
    date: "2026-10-14",
    dateLabel: "14 October 2026",
    cover: "sofa-delivery-narrow-stairs-london",
  },
  {
    slug: "car-transport-cost-uk",
    title: "Car delivery cost in the UK: what to expect in 2026",
    excerpt:
      "How distance, open or enclosed transport and non-runners change the price — with typical costs for 100 and 300-mile moves.",
    category: "Moving tips",
    readMins: 7,
    date: "2026-10-13",
    dateLabel: "13 October 2026",
    cover: "complete-guide-to-moving-home-in-london",
  },
  {
    slug: "man-and-van-prices-uk",
    title: "Man and van prices in the UK: how hourly rates really work",
    excerpt:
      "Typical hourly rates across UK cities, what should be included, the hidden costs to watch and what London man & van costs.",
    category: "Man & Van",
    readMins: 7,
    date: "2026-10-12",
    dateLabel: "12 October 2026",
    cover: "man-and-van-vs-full-removal",
  },
  {
    slug: "what-is-a-removal-service",
    title: "What is a removal service? A plain-English guide",
    excerpt:
      "What removal companies actually do, the main types of service and the questions to ask before you book one.",
    category: "Moving tips",
    readMins: 7,
    date: "2026-10-10",
    dateLabel: "10 October 2026",
    cover: "studio-flat-move-checklist",
  },
  {
    slug: "how-to-hoist-a-sofa-through-a-window-or-balcony",
    title: "How to hoist a sofa through a window or over a balcony",
    excerpt:
      "When a furniture hoist is the answer, the measurements and permissions you need, and why DIY rope lifts are a bad idea.",
    category: "Sofa & furniture",
    readMins: 7,
    date: "2026-10-09",
    dateLabel: "9 October 2026",
    cover: "prepare-for-flat-move-london",
  },
  {
    slug: "sofa-wont-fit-up-the-stairs",
    title: "Sofa won’t fit up the stairs? Your options, step by step",
    excerpt:
      "Feet off, dismantling, removing a door or window, hoisting or sending it back — what to try, and in what order.",
    category: "Sofa & furniture",
    readMins: 7,
    date: "2026-10-08",
    dateLabel: "8 October 2026",
    cover: "sofa-delivery-narrow-stairs-london",
  },
  {
    slug: "moving-crates-vs-cardboard-boxes",
    title: "Moving crates vs cardboard boxes: which is better?",
    excerpt:
      "Crate hire or flat-pack boxes? A side-by-side comparison, a rough guide to crates per room and the environmental angle.",
    category: "Packing",
    readMins: 6,
    date: "2026-10-07",
    dateLabel: "7 October 2026",
    cover: "how-to-pack-a-kitchen-like-a-pro",
  },
  {
    slug: "how-to-move-a-mattress",
    title: "How to move a mattress without damaging it",
    excerpt:
      "Wrapping, the bending rules for memory foam and pocket sprung, carrying it on stairs and disposing of an old one.",
    category: "Sofa & furniture",
    readMins: 6,
    date: "2026-10-06",
    dateLabel: "6 October 2026",
    cover: "studio-flat-move-checklist",
  },
  {
    slug: "how-to-move-gym-equipment-and-heavy-items",
    title: "How to move gym equipment, safes and other heavy items",
    excerpt:
      "Treadmills, multi-gyms and safes: dismantling, floor protection, weight and access — and when to call a specialist.",
    category: "Moving tips",
    readMins: 6,
    date: "2026-10-03",
    dateLabel: "3 October 2026",
    cover: "man-and-van-vs-full-removal",
  },
  {
    slug: "storage-during-a-house-renovation",
    title: "Storage during a house renovation: a practical guide",
    excerpt:
      "What to store, how to plan the timeline, keeping an inventory and getting access — with collection and delivery included.",
    category: "Storage",
    readMins: 6,
    date: "2026-10-01",
    dateLabel: "1 October 2026",
    cover: "self-storage-guide-london",
  },
  {
    slug: "complete-guide-to-moving-home-in-london",
    title: "The complete guide to moving home in London (2026)",
    excerpt:
      "Costs, choosing the right van, packing tips, permits and a moving-day checklist for all 32 London boroughs.",
    category: "Moving tips",
    readMins: 8,
    date: "2026-07-20",
    dateLabel: "20 July 2026",
    cover: "complete-guide-to-moving-home-in-london",
  },
  {
    slug: "sofa-delivery-narrow-stairs-london",
    title: "Sofa delivery up narrow London stairs — what actually works",
    excerpt:
      "Measure turns, remove legs, and know when a fixed sofa run beats hourly man & van.",
    category: "Sofa & furniture",
    readMins: 5,
    date: "2026-07-18",
    dateLabel: "18 July 2026",
    cover: "sofa-delivery-narrow-stairs-london",
  },
  {
    slug: "how-to-pack-a-kitchen-like-a-pro",
    title: "How to pack a kitchen like a pro",
    excerpt:
      "Wrap, box and label your kitchen so glasses, plates and appliances arrive in one piece.",
    category: "Packing",
    readMins: 5,
    date: "2026-07-14",
    dateLabel: "14 July 2026",
    cover: "how-to-pack-a-kitchen-like-a-pro",
  },
  {
    slug: "same-day-removals-london",
    title: "Same-day removals in London: when it’s realistic",
    excerpt:
      "What we need from you, how pricing works, and honest limits on last-minute vans.",
    category: "Moving tips",
    readMins: 4,
    date: "2026-07-11",
    dateLabel: "11 July 2026",
    cover: "same-day-removals-london",
  },
  {
    slug: "moving-in-london-parking-and-permits",
    title: "Moving in London: parking & permits explained",
    excerpt:
      "How to arrange bay suspensions, avoid fines and plan around the congestion charge and ULEZ.",
    category: "London",
    readMins: 4,
    date: "2026-07-08",
    dateLabel: "8 July 2026",
    cover: "moving-in-london-parking-and-permits",
  },
  {
    slug: "evening-weekend-moves-london",
    title: "Evening and weekend moves in London",
    excerpt:
      "Out-of-hours slots for key exchanges and office cutovers — costs, quiet hours and booking tips.",
    category: "Moving tips",
    readMins: 4,
    date: "2026-07-04",
    dateLabel: "4 July 2026",
    cover: "evening-weekend-moves-london",
  },
  {
    slug: "man-and-van-vs-full-removal",
    title: "Man & van vs full removal: which should you pick?",
    excerpt:
      "A simple way to choose the right service for the size and budget of your move.",
    category: "Man & Van",
    readMins: 3,
    date: "2026-06-30",
    dateLabel: "30 June 2026",
    cover: "man-and-van-vs-full-removal",
  },
  {
    slug: "prepare-for-flat-move-london",
    title: "How to prepare for a flat move in London",
    excerpt:
      "Access photos, inventory basics and building rules that keep your fixed quote accurate.",
    category: "Moving tips",
    readMins: 5,
    date: "2026-06-26",
    dateLabel: "26 June 2026",
    cover: "prepare-for-flat-move-london",
  },
  {
    slug: "studio-flat-move-checklist",
    title: "The studio flat move checklist",
    excerpt:
      "Everything to sort before, during and after a small move so nothing slips through.",
    category: "Moving tips",
    readMins: 6,
    date: "2026-06-22",
    dateLabel: "22 June 2026",
    cover: "studio-flat-move-checklist",
  },
  {
    slug: "self-storage-guide-london",
    title: "A simple guide to self storage in London",
    excerpt:
      "When storage helps, what it costs and how to pack a unit so your things stay safe.",
    category: "Storage",
    readMins: 5,
    date: "2026-06-15",
    dateLabel: "15 June 2026",
    cover: "self-storage-guide-london",
  },
];

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

export const authors: Author[] = [
  {
    slug: "sameer-ahmad-basra",
    name: "Sameer Ahmad Basra",
    role: "Writer",
    bio: "Sameer writes practical, no-nonsense moving guides for Londoners — drawn from real jobs across all 32 boroughs, covering vans, packing, permits and fixed-price removals.",
    avatar: "/team/sameer-ahmad-basra.jpg",
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function postsByAuthor(_slug: string): BlogPost[] {
  // Single team author for now — every guide is written by the Phi Movers team.
  return posts;
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

const STOP = new Set(["what", "with", "your", "from", "that", "this", "how", "does", "guide", "london", "move", "moving", "cost", "much", "best"]);
const words = (t: string) => new Set(t.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3 && !STOP.has(w)));

/** Related guides scored by shared category (3) and shared title words (1 each), newest first on a tie. */
export function relatedPosts(slug: string, count = 3): BlogPost[] {
  const post = getPost(slug);
  if (!post) return posts.slice(0, count);
  const mine = words(`${post.title} ${post.excerpt}`);
  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = p.category === post.category ? 3 : 0;
      words(`${p.title} ${p.excerpt}`).forEach((w) => { if (mine.has(w)) score += 1; });
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
    .slice(0, count)
    .map((x) => x.p);
}

/** Service and area pages a guide leads on to, for the "You might also need" block. */
const CATEGORY_PAGES: Record<string, string[]> = {
  "Moving tips": ["/services/house-removals", "/services/flat-removals", "/pricing"],
  Packing: ["/services/full-packing-service", "/services/packing-materials", "/pricing"],
  London: ["/areas", "/services/man-and-van", "/pricing"],
  "Man & Van": ["/services/man-and-van", "/services/single-item-delivery", "/pricing"],
  Storage: ["/services/secure-storage", "/services/storage-with-collection", "/pricing"],
  "Sofa & furniture": ["/services/sofa-delivery", "/services/sofa-and-furniture-hoisting", "/pricing"],
};
const PAGE_INFO: Record<string, { title: string; description: string }> = {
  "/pricing": { title: "Prices and calculator", description: "Our published rate card and a live calculator for your van, helpers and hours." },
  "/areas": { title: "Areas we cover", description: "Local pages for all 32 London boroughs, with parking notes and prices." },
};

export function relatedPagesFor(post: BlogPost): { path: string; title: string; h1: string; description: string }[] {
  return (CATEGORY_PAGES[post.category] ?? ["/services", "/pricing"]).flatMap((path) => {
    const svc = allServices.find((s) => s.href === path);
    const info = svc ? { title: svc.title, description: svc.desc } : PAGE_INFO[path] ?? { title: "All services", description: "Every service we offer across London." };
    return [{ path, title: info.title, h1: info.title, description: info.description }];
  });
}
