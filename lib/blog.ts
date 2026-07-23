export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMins: number;
  date: string; // ISO
  dateLabel: string;
  coverSeed: string;
  featured?: boolean;
};

export const blogCategories = [
  "All",
  "Moving tips",
  "Packing",
  "London",
  "Man & Van",
  "Storage",
];

export const posts: BlogPost[] = [
  {
    slug: "complete-guide-to-moving-home-in-london",
    title: "The complete guide to moving home in London (2026)",
    excerpt:
      "Costs, choosing the right van, packing tips, permits and a moving-day checklist for all 32 London boroughs.",
    category: "Moving tips",
    readMins: 8,
    date: "2026-07-20",
    dateLabel: "20 July 2026",
    coverSeed: "london-move-cover",
    featured: true,
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
    coverSeed: "kitchen-pack",
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
    coverSeed: "london-permit",
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
    coverSeed: "man-van-compare",
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
    coverSeed: "studio-move",
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
    coverSeed: "storage-unit",
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

export function relatedPosts(slug: string, count = 3): BlogPost[] {
  return posts.filter((p) => p.slug !== slug).slice(0, count);
}
