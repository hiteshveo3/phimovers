"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ReviewCard from "@/components/ReviewCard";
import MenuSelect from "@/components/MenuSelect";
import { Icon } from "@/components/icons";
import {
  reviewServices,
  type SiteReview,
} from "@/lib/reviews";
import { WHATSAPP_HREF } from "@/lib/contact";

const RATINGS = ["All", "5", "4"] as const;

export default function ReviewsFilter({ reviews }: { reviews: SiteReview[] }) {
  const [service, setService] = useState<string>("All");
  const [rating, setRating] = useState<string>("All");
  const [borough, setBorough] = useState<string>("All");
  const [query, setQuery] = useState("");

  const boroughs = useMemo(() => {
    const set = new Set(reviews.map((r) => r.borough));
    return ["All", ...Array.from(set).sort()];
  }, [reviews]);

  const ratingOptions = RATINGS.map((r) => ({
    value: r,
    label: r === "All" ? "All ratings" : `${r} stars`,
  }));

  const boroughOptions = boroughs.map((b) => ({
    value: b,
    label: b === "All" ? "All boroughs" : b,
  }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      const okService = service === "All" || r.service === service;
      const okRating = rating === "All" || String(r.rating) === rating;
      const okBorough = borough === "All" || r.borough === borough;
      const okQ =
        q === "" ||
        r.name.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.service.toLowerCase().includes(q);
      return okService && okRating && okBorough && okQ;
    });
  }, [reviews, service, rating, borough, query]);

  const avg =
    reviews.reduce((s, r) => s + r.rating, 0) / Math.max(reviews.length, 1);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-cream p-4 md:p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#9fe870] text-[#163300]">
            <Icon name="star" className="h-6 w-6" />
          </span>
          <div>
            <p className="text-2xl font-extrabold text-[#163300]">
              {avg.toFixed(1)}
              <span className="text-base font-semibold text-muted"> / 5</span>
            </p>
            <p className="text-sm text-muted">
              {reviews.length} customer reviews
            </p>
          </div>
        </div>
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="btn ml-auto bg-[#9fe870] px-5 text-[#163300] hover:bg-[#86d957]"
        >
          <Icon name="whatsapp" className="h-4 w-4" />
          Get a quote
        </a>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <label className="flex h-11 w-full items-center gap-2.5 rounded-pill border border-line bg-surface px-4 text-sm md:max-w-sm">
          <Icon name="search" className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reviews…"
            className="w-full bg-transparent text-content outline-none placeholder:text-muted"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {reviewServices.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setService(s)}
              className={
                "rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors " +
                (service === s
                  ? "bg-[#9fe870] text-[#163300]"
                  : "bg-surface text-content hover:bg-[#9fe870]/25")
              }
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <MenuSelect
            label="Rating"
            value={rating}
            options={ratingOptions}
            onChange={setRating}
          />
          <MenuSelect
            label="Borough"
            value={borough}
            options={boroughOptions}
            onChange={setBorough}
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        Showing {filtered.length} of {reviews.length} reviews
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              variant={3}
              meta={`${r.service} · ${r.borough}`}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center">
          <p className="font-semibold text-content">No reviews match</p>
          <p className="mt-1 text-sm text-muted">Try clearing a filter.</p>
          <button
            type="button"
            onClick={() => {
              setService("All");
              setRating("All");
              setBorough("All");
              setQuery("");
            }}
            className="mt-4 text-sm font-semibold text-[#163300] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-muted">
        Want to share your move?{" "}
        <Link href="/contact" className="font-semibold text-[#163300] hover:underline">
          Contact us
        </Link>
      </p>
    </div>
  );
}
