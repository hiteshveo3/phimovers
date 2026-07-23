import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSidebar from "@/components/BlogSidebar";
import BlogToc from "@/components/blog/BlogToc";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BackToTop from "@/components/blog/BackToTop";
import ShareRow from "@/components/blog/ShareRow";
import { Icon } from "@/components/icons";
import { img } from "@/lib/data";
import { authors, getPost, posts, relatedPosts } from "@/lib/blog";

const SITE = "https://phimovers.co.uk";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "Article not found — Phi Movers" };
  const url = `${SITE}/blog/${post.slug}`;
  const cover = img(post.coverSeed, 1280, 640);
  return {
    title: `${post.title} — Phi Movers`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: cover, width: 1280, height: 640, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [cover],
    },
  };
}

const toc = [
  { id: "planning", label: "Planning your London move" },
  { id: "costs", label: "How much does a London move cost?" },
  { id: "van", label: "Choosing the right van & crew" },
  { id: "packing", label: "Packing tips that save time" },
  { id: "permits", label: "Parking & permits in London" },
  { id: "checklist", label: "Moving-day checklist" },
];

/* ---------- reusable article bits ---------- */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 pt-2 text-2xl font-bold tracking-tight text-content"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed text-content/80">{children}</p>
  );
}

function Figure({
  seed,
  alt,
  caption,
}: {
  seed: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="my-2">
      <img
        src={img(seed, 900, 520)}
        alt={alt}
        loading="lazy"
        className="aspect-[16/9] w-full rounded-2xl object-cover"
      />
      <figcaption className="mt-2 text-center text-xs text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

function CostTable() {
  const head = ["", "Man & Van", "Full removal", "DIY van hire"];
  const rows: string[][] = [
    ["Best for", "Small moves, single items", "Whole homes, 2-bed+", "Tight budgets, small loads"],
    ["Typical cost", "£50–£65/hr", "£499–£999 fixed", "£40–£90/day + fuel"],
    ["Crew included", "1 driver (+ helpers)", "3–5 trained movers", "None — you load"],
    ["Insurance", "Goods in transit", "Full goods + liability", "Basic (van only)"],
    ["Loading help", "Included", "Included", "Not included"],
  ];
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-[#9fe870] text-[#163300]">
            {head.map((h, i) => (
              <th
                key={i}
                className={"px-4 py-3 font-bold " + (i === 0 ? "" : "text-center")}
                scope="col"
              >
                {h || "Feature"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={ri % 2 ? "bg-cream" : "bg-surface"}>
              {r.map((c, ci) => (
                <td
                  key={ci}
                  className={
                    "border-t border-line px-4 py-3 " +
                    (ci === 0
                      ? "font-semibold text-content"
                      : "text-center text-content/80")
                  }
                >
                  {ci === 1 && ri === 1 ? (
                    <span className="font-bold text-[#163300]">{c}</span>
                  ) : (
                    c
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Takeaways() {
  const items = [
    "Book 1–2 weeks ahead — sooner for weekends and month-end.",
    "A 2-bed London move usually runs £499–£749 fixed.",
    "Sort parking & permits at both addresses before the day.",
    "Label boxes by room and keep an essentials bag handy.",
  ];
  return (
    <aside className="my-4 rounded-2xl bg-[#9fe870] p-6 text-[#163300]">
      <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
        <Icon name="check" className="h-4 w-4" size={15} strokeWidth={2.4} />
        Key takeaways
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2.5">
            <Icon
              name="check"
              className="mt-0.5 h-4 w-4 shrink-0"
              size={14}
              strokeWidth={2.4}
            />
            <span className="font-medium">{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/* ---------- page ---------- */

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const url = `${SITE}/blog/${post.slug}`;
  const cover = img(post.coverSeed, 1280, 640);
  const related = relatedPosts(post.slug);
  const author = authors[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [cover],
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: author.name },
    publisher: {
      "@type": "Organization",
      name: "Phi Movers",
      logo: { "@type": "ImageObject", url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
  };

  return (
    <main>
      <ReadingProgress />
      <Navbar />
      <BackToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-8 md:py-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[#163300]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" className="hover:text-[#163300]">
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-content" aria-current="page">
                {post.category}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Article */}
            <article>
              <header>
                <Link
                  href="/blog"
                  className="inline-flex rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300] transition-colors hover:bg-[#86d957]"
                >
                  {post.category}
                </Link>
                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-content md:text-4xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                  <Link
                    href={`/author/${author.slug}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-[#163300]"
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-[#9fe870]/60"
                    />
                    <span className="font-semibold text-content">
                      {author.name}
                    </span>
                  </Link>
                  <Link
                    href={`/blog?date=${post.date}`}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-[#163300]"
                    title={`Published ${post.date} (ISO date markup)`}
                  >
                    <Icon name="calendar" className="h-4 w-4" />
                    <time dateTime={post.date}>{post.dateLabel}</time>
                  </Link>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="clock" className="h-4 w-4" />
                    {post.readMins} min read
                  </span>
                </div>
              </header>

              <img
                src={cover}
                alt={post.title}
                className="mt-6 aspect-[2/1] w-full rounded-[24px] object-cover"
              />

              <div className="mt-5 border-y border-line py-3">
                <ShareRow url={url} title={post.title} />
              </div>

              <div className="mt-6 space-y-4">
                {/* Inline table of contents (sticky on mobile) */}
                <BlogToc items={toc} />

                <P>
                  Moving home in London comes with its own quirks — permit zones,
                  congestion charges, narrow staircases and streets where a Luton
                  van simply won&apos;t fit. This guide walks you through
                  everything you need to plan a smooth, fixed-price move across
                  any of the 32 boroughs, from first box to final cup of tea.
                </P>

                <H2 id="planning">Planning your London move</H2>
                <P>
                  Start early. The best crews and weekend slots book up fast,
                  especially around month-end when most tenancies turn over. Aim
                  to confirm your date one to two weeks ahead and declutter room
                  by room before a single box is packed — you&apos;ll pay to move
                  everything, so lighter loads mean lower quotes.
                </P>

                <Takeaways />

                <H2 id="costs">How much does a London move cost?</H2>
                <P>
                  Costs depend on the size of your home, access at both ends and
                  how much packing you want done for you. Here&apos;s how the
                  three most common options compare so you can pick what fits your
                  move and budget.
                </P>
                <CostTable />
                <P>
                  For most one and two-bed flats, a fixed-price removal removes
                  the guesswork — you know the total before the van arrives, with
                  loading, transport and careful unloading included.
                </P>

                <H2 id="van">Choosing the right van &amp; crew</H2>
                <P>
                  A small or transit van suits single items and studio moves,
                  while a Luton van handles flats and houses. If you&apos;re on a
                  higher floor with no lift, add a helper — extra hands are far
                  cheaper than an extra hour on the clock.
                </P>
                <Figure
                  seed="london-loading-van"
                  alt="Movers loading furniture into a Luton removals van"
                  caption="A Luton van comfortably fits a typical one to two-bed home."
                />

                <H2 id="packing">Packing tips that save time</H2>
                <P>
                  Great packing is the difference between a three-hour move and a
                  five-hour one. A few habits make everything faster on the day:
                </P>
                <ul className="space-y-2.5 text-[15px] text-content/80">
                  {[
                    "Pack heavy items (books) in small boxes, light items (bedding) in large ones.",
                    "Label every box by room and mark fragile ones clearly.",
                    "Keep screws and fittings in labelled bags taped to the furniture.",
                    "Pack an essentials bag: chargers, documents, kettle, toiletries.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Icon
                        name="check"
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#163300]"
                        size={14}
                        strokeWidth={2.4}
                      />
                      {t}
                    </li>
                  ))}
                </ul>

                <blockquote className="my-2 flex gap-4 rounded-2xl bg-cream p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
                    <Icon name="quote" className="h-5 w-5" />
                  </span>
                  <p className="text-[15px] italic leading-relaxed text-content/80">
                    Label boxes on the side, not the top — you can read them once
                    they&apos;re stacked.
                  </p>
                </blockquote>

                <H2 id="permits">Parking &amp; permits in London</H2>
                <P>
                  This is the step most people forget. Many boroughs require a
                  suspension bay or visitor permit for a removals van, and
                  congestion or ULEZ charges may apply depending on the route.
                  Sort parking at both the collection and delivery address before
                  moving day to avoid fines and delays.
                </P>
                <Figure
                  seed="london-street-parking"
                  alt="A London residential street with permit parking bays"
                  caption="Check borough parking rules early — suspensions can take days to arrange."
                />

                <H2 id="checklist">Moving-day checklist</H2>
                <P>On the day, keep things moving with a simple routine:</P>
                <ol className="space-y-2.5 text-[15px] text-content/80">
                  {[
                    "Confirm van parking is clear at both addresses.",
                    "Do a final sweep of cupboards, lofts and the garden.",
                    "Take meter readings and photos of the empty rooms.",
                    "Keep valuables and documents with you, not in the van.",
                    "Check every room before the crew leaves the old place.",
                  ].map((t, i) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#9fe870] text-xs font-bold text-[#163300]">
                        {i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ol>

                {/* In-article CTA */}
                <div className="my-6 flex flex-col items-start justify-between gap-4 rounded-[24px] bg-[#9fe870] p-6 text-[#163300] sm:flex-row sm:items-center">
                  <div>
                    <p className="text-lg font-extrabold">
                      Ready to plan your move?
                    </p>
                    <p className="mt-1 text-sm text-[#163300]/70">
                      Start your free quote — we usually reply within about one
                      working hour. All 32 boroughs.
                    </p>
                  </div>
                  <Link
                    href="/pricing"
                    className="btn shrink-0 bg-[#163300] px-6 text-[#9fe870] hover:bg-[#0e2400]"
                  >
                    Get a quote
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                </div>

                {/* Share again */}
                <div className="border-t border-line pt-5">
                  <ShareRow url={url} title={post.title} />
                </div>

                {/* Author bio */}
                <div className="mt-6 flex items-start gap-4 rounded-2xl border border-line bg-surface p-5">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#9fe870]/50"
                  />
                  <div>
                    <Link
                      href={`/author/${author.slug}`}
                      className="text-sm font-bold text-content transition-colors hover:text-[#163300]"
                    >
                      {author.name}
                    </Link>
                    <p className="text-xs font-semibold text-[#163300]">
                      {author.role}
                    </p>
                    <p className="mt-1 text-sm text-muted">{author.bio}</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Right rail: sidebar */}
            <div className="space-y-6">
              <BlogSidebar sticky />
            </div>
          </div>

          {/* More from the blog */}
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-content">
                More from the blog
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#163300] hover:underline"
              >
                View all
                <Icon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-soft"
                >
                  <img
                    src={img(r.coverSeed, 600, 360)}
                    alt={r.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover"
                  />
                  <div className="p-5">
                    <span className="inline-flex rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
                      {r.category} · {r.readMins} min read
                    </span>
                    <h3 className="mt-3 text-base font-bold leading-snug text-content group-hover:text-[#163300]">
                      {r.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
                      Read article
                      <Icon name="arrowRight" className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
