import ReviewCard, { type Review } from "./ReviewCard";
import { Icon } from "./icons";

const reviews: Review[] = [
  {
    name: "Sarah Thompson",
    location: "Islington, London",
    rating: 5,
    text: "The crew arrived on time, wrapped everything with care and had us fully moved in before lunch. Fixed price with no surprises — the most stress-free move we've ever had.",
    avatar: "https://i.pravatar.cc/160?img=45",
  },
  {
    name: "James Carter",
    location: "Hackney, London",
    rating: 5,
    text: "Booked a last-minute man & van and they still turned up early. Polite, quick and genuinely careful with every single box. Couldn't recommend them more.",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    name: "Priya Patel",
    location: "Croydon, London",
    rating: 5,
    text: "From the free survey to the final box, everything was smooth. The fixed quote didn't change by a single penny and the team was lovely throughout.",
    avatar: "https://i.pravatar.cc/160?img=32",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="section">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip border-[#163300]/15 bg-[#9fe870]/25 text-[#163300]">
            <Icon name="star" className="mr-1 h-3.5 w-3.5" />
            Verified customer reviews
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
      </div>
    </section>
  );
}
