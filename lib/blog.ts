export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMins: number;
  date: string; // ISO
  dateLabel: string;
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

export function blogCover(post: BlogPost, _w = 800, _h = 520) {
  return `/blog/${post.cover}.jpg`;
}

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
    cover: "complete-guide-to-moving-home-in-london",
    featured: true,
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

export function relatedPosts(slug: string, count = 3): BlogPost[] {
  return posts.filter((p) => p.slug !== slug).slice(0, count);
}
