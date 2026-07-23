"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SoftImage from "../SoftImage";
import { Icon } from "../icons";
import { authors, blogCover, type BlogPost } from "@/lib/blog";

const PAGE_SIZE = 6;
const author = authors[0];

function Card({ post, large = false }: { post: BlogPost; large?: boolean }) {
  if (large) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-[24px] border border-line bg-surface transition-colors hover:bg-cream md:grid-cols-2"
      >
        <SoftImage
          src={blogCover(post)}
          alt={post.title}
          icon="box"
          className="h-56 w-full md:h-full"
          imgClassName="h-56 w-full object-cover md:h-full"
        />
        <div className="flex flex-col justify-center p-6 md:p-8">
          <span className="inline-flex w-fit rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300]">
            Featured · {post.category}
          </span>
          <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-content group-hover:text-[#163300]">
            {post.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {post.excerpt}
          </p>
          <span className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="font-semibold text-content">{author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{post.dateLabel}</time>
            <span aria-hidden>·</span>
            <span>{post.readMins} min read</span>
          </span>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
            Read article
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:bg-cream"
    >
      <SoftImage
        src={blogCover(post)}
        alt={post.title}
        icon="box"
        className="aspect-[16/9] w-full"
        imgClassName="aspect-[16/9] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit rounded-pill bg-[#9fe870]/25 px-2.5 py-0.5 text-xs font-semibold text-[#163300]">
          {post.category} · {post.readMins} min read
        </span>
        <h3 className="mt-3 text-base font-bold leading-snug text-content group-hover:text-[#163300]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        <span className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-xs text-muted">
          <span className="font-semibold text-content">{author.name}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{post.dateLabel}</time>
        </span>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#163300]">
          Read article
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogList({
  posts,
  categories,
  initialDate,
}: {
  posts: BlogPost[];
  categories: string[];
  initialDate?: string;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [dateFilter, setDateFilter] = useState(initialDate ?? "");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const isFiltering = query.trim() !== "" || cat !== "All" || dateFilter !== "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesCat = cat === "All" || p.category === cat;
      const matchesDate = !dateFilter || p.date === dateFilter;
      const matchesQ =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        author.name.toLowerCase().includes(q);
      return matchesCat && matchesDate && matchesQ;
    });
  }, [posts, query, cat, dateFilter]);

  const featured = posts.find((p) => p.featured);
  const showFeatured = !isFiltering && featured;
  const gridPosts = showFeatured
    ? filtered.filter((p) => p.slug !== featured!.slug)
    : filtered;
  const shown = gridPosts.slice(0, visible);
  const hasMore = visible < gridPosts.length;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="flex h-11 w-full items-center gap-2.5 rounded-pill border border-line bg-surface px-4 text-sm md:max-w-xs">
          <Icon name="search" className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search articles…"
            className="w-full bg-transparent text-content outline-none placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-muted hover:text-content"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          )}
        </label>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCat(c);
                setVisible(PAGE_SIZE);
              }}
              className={
                "rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors " +
                (cat === c
                  ? "bg-[#9fe870] text-[#163300]"
                  : "bg-surface text-content hover:bg-[#9fe870]/25 hover:text-[#163300]")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {dateFilter && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Filtered by date:</span>
          <time
            dateTime={dateFilter}
            className="rounded-pill bg-[#9fe870]/30 px-2.5 py-0.5 font-semibold text-[#163300]"
          >
            {dateFilter}
          </time>
          <button
            type="button"
            onClick={() => setDateFilter("")}
            className="font-semibold text-[#163300] hover:underline"
          >
            Clear date
          </button>
        </div>
      )}

      {showFeatured && (
        <div className="mt-8">
          <Card post={featured!} large />
        </div>
      )}

      {shown.length > 0 ? (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <Card key={p.slug} post={p} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((n) => n + PAGE_SIZE)}
                className="btn bg-[#9fe870] px-6 text-[#163300] hover:bg-[#86d957]"
              >
                Load more articles
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-12 rounded-2xl border border-line bg-surface p-10 text-center">
          <p className="text-sm font-semibold text-content">
            No articles found
          </p>
          <p className="mt-1 text-sm text-muted">
            Try a different search or category.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCat("All");
              setDateFilter("");
            }}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#163300] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
