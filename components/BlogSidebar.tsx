import Link from "next/link";
import { Icon } from "./icons";

type Post = { title: string; meta: string; icon: string };

const posts: Post[] = [
  { title: "How to pack a kitchen like a pro", meta: "Packing · 5 min", icon: "box" },
  { title: "Moving in London: parking & permits", meta: "London · 4 min", icon: "mapPin" },
  { title: "Studio flat move checklist", meta: "Home Removals · 6 min", icon: "home" },
  { title: "Man & van vs full removal", meta: "Man & Van · 3 min", icon: "truck" },
];

const cats: [string, number][] = [
  ["Home Removals", 12],
  ["Packing Tips", 8],
  ["London Areas", 15],
  ["Man & Van", 6],
  ["Storage", 4],
];

export default function BlogSidebar({ sticky = false }: { sticky?: boolean }) {
  const wrap = "space-y-6 " + (sticky ? "md:sticky md:top-24" : "");

  return (
    <aside className={wrap}>
      {/* Search */}
      <div className="flex h-11 items-center gap-2.5 rounded-pill bg-[#9fe870]/25 px-4 text-sm text-[#163300]">
        <Icon name="search" className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">Search the blog…</span>
      </div>

      {/* Popular posts */}
      <div className="rounded-2xl bg-cream p-5">
        <h3 className="mb-4 text-sm font-bold text-content">Popular posts</h3>
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.title} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#9fe870] text-[#163300]">
                <Icon name={p.icon} className="h-5 w-5" />
              </span>
              <a href="#" className="group">
                <span className="block text-sm font-semibold leading-snug text-content group-hover:text-[#163300]">
                  {p.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted">{p.meta}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="rounded-2xl bg-cream p-5">
        <h3 className="mb-4 text-sm font-bold text-content">Categories</h3>
        <ul className="space-y-2">
          {cats.map(([c, n]) => (
            <li key={c}>
              <a
                href="#"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-content hover:bg-[#9fe870]/25"
              >
                <span>{c}</span>
                <span className="rounded-pill bg-surface px-2 text-xs text-muted">
                  {n}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Quote CTA */}
      <div className="rounded-2xl bg-[#9fe870] p-5 text-[#163300]">
        <p className="text-base font-extrabold leading-snug text-[#163300]">
          Moving soon? Get a free quote in 60 seconds.
        </p>
        <p className="mt-1.5 text-xs text-[#163300]/70">
          Fixed prices · All 32 London boroughs
        </p>
        <Link
          href="/pricing"
          className="btn mt-4 w-full bg-[#163300] px-5 text-[#9fe870] hover:bg-[#0e2400]"
        >
          Get a quote
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
