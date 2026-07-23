import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBg from "@/components/HeroBg";
import ReviewsFilter from "@/components/ReviewsFilter";
import { siteReviews } from "@/lib/reviews";
import { SITE_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Customer Reviews — Phi Movers | London Removals",
  description:
    "Read Phi Movers customer reviews from house moves, man & van, sofa delivery and office removals across all 32 London boroughs.",
  alternates: { canonical: `${SITE_URL}/reviews` },
};

export default function ReviewsPage() {
  const ratingSum = siteReviews.reduce((n, r) => n + r.rating, 0);
  const ratingValue = (ratingSum / siteReviews.length).toFixed(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Phi Movers",
    url: SITE_URL,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: String(siteReviews.length),
      bestRating: "5",
      worstRating: "1",
    },
    review: siteReviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
      },
      reviewBody: r.text,
      datePublished: r.date,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <HeroBg variant={6} />
        <div className="container-page py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-[#163300]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-content" aria-current="page">
                Reviews
              </li>
            </ol>
          </nav>

          <span className="mt-6 inline-flex rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300]">
            Customer reviews
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-content md:text-5xl">
            What customers say
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
            Real feedback from London moves — filter by service, borough or
            rating to find reviews like yours.
          </p>
        </div>
      </section>

      <div className="bg-[#f4f5f2]">
        <div className="container-page py-12 md:py-16">
          <ReviewsFilter reviews={siteReviews} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
