import ReviewCard from "./ReviewCard";
import Link from "next/link";
import { Icon } from "./icons";
import { siteReviews } from "@/lib/reviews";

const reviews = siteReviews.slice(0, 3);

export default function Reviews() {
  return (
    <section id="reviews" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip border-[#163300]/15 bg-[#9fe870]/25 text-[#163300]">
            <Icon name="star" className="mr-1 h-3.5 w-3.5" />
            Customer reviews
          </span>
          <h2 className="section-title mt-4">Loved by movers across London</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Real reviews from real customers who trusted us with their move.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.name} review={r} variant={3} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#163300] hover:underline"
          >
            Read all reviews
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
