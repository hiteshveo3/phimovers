import Link from "next/link";
import { Icon } from "./icons";
import { posts as allPosts } from "@/lib/blog";

const catIcon: Record<string, string> = {
  Packing: "box",
  London: "mapPin",
  "Man & Van": "truck",
  Storage: "cube",
  "Moving tips": "home",
};

const popular = allPosts.slice(0, 4).map((p) => ({
  title: p.title,
  meta: `${p.category} · ${p.readMins} min`,
  icon: catIcon[p.category] ?? "box",
  href: `/blog/${p.slug}`,
}));

const cats: [string, number][] = [
  ["Moving tips", 12],
  ["Packing", 8],
  ["London", 15],
  ["Man & Van", 6],
  ["Storage", 4],
];

export default function BlogSidebar({ sticky = false }: { sticky?: boolean }) {
  const wrap = "space-y-6 " + (sticky ? "md:sticky md:top-24" : "");

  return (
    <aside className={wrap}>
      {/* Search (desktop only — mobile uses nav / listing search) */}
      <Link
        href="/blog"
        className="hidden h-11 items-center gap-2.5 rounded-pill bg-[#9fe870]/25 px-4 text-sm text-[#163300] transition-colors hover:bg-[#9fe870]/40 lg:flex"
      >
        <Icon name="search" className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">Search the blog…</span>
      </Link>

      {/* Popular posts */}
      <div className="rounded-2xl bg-white p-5">
        <h3 className="mb-4 text-sm font-bold text-content">Popular posts</h3>
        <ul className="space-y-2">
          {popular.map((p) => (
            <li key={p.title}>
              <Link
                href={p.href}
                className="group -mx-2 flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[#9fe870]/25"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#9fe870] text-[#163300]">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-snug text-content group-hover:text-[#163300]">
                    {p.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{p.meta}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories (desktop only) */}
      <div className="hidden rounded-2xl bg-white p-5 lg:block">
        <h3 className="mb-4 text-sm font-bold text-content">Categories</h3>
        <ul className="space-y-2">
          {cats.map(([c, n]) => (
            <li key={c}>
              <Link
                href="/blog"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-content transition-colors hover:bg-[#9fe870]/25 hover:text-[#163300]"
              >
                <span>{c}</span>
                <span className="rounded-pill bg-[#9fe870]/25 px-2 text-xs font-semibold text-[#163300]">
                  {n}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Quote CTA — bright green card */}
      <div className="rounded-2xl bg-[#9fe870] p-5">
        <p className="text-base font-extrabold leading-snug text-black">
          Moving soon? Start your free quote in under a minute.
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
