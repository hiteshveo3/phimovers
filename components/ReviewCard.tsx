import { Icon } from "./icons";

export type Review = {
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
};

const defaultReview: Review = {
  name: "Sarah Thompson",
  location: "Islington, London",
  rating: 5,
  text: "The crew arrived on time, wrapped everything with care and had us fully moved in before lunch. Fixed price with no surprises — genuinely the most stress-free move we've ever had.",
  avatar: "https://i.pravatar.cc/160?img=45",
};

export const reviewLabels: Record<number, string> = {
  1: "Accent bar",
  2: "Forest dark",
  3: "Bright green",
  4: "Left border",
  5: "Centered avatar",
  6: "Split avatar",
  7: "Soft gradient",
  8: "Source header",
  9: "Big quote",
  10: "Compact pill",
};

function Stars({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className={"flex items-center gap-0.5 " + className}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          className={"h-4 w-4 " + (i < rating ? "opacity-100" : "opacity-20")}
        />
      ))}
    </div>
  );
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export default function ReviewCard({
  review = defaultReview,
  variant = 1,
  meta,
}: {
  review?: Review;
  variant?: number;
  meta?: string;
}) {
  const initials = initialsOf(review.name);

  switch (variant) {
    /* 2 — Forest dark card */
    case 2:
      return (
        <figure className="relative w-full max-w-md overflow-hidden rounded-[22px] bg-[#163300] p-7 text-white shadow-xl">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-1 top-1 select-none font-serif text-[130px] leading-none text-[#9fe870]/20"
          >
            &rdquo;
          </span>
          <Stars rating={review.rating} className="text-[#9fe870]" />
          <blockquote className="relative mt-5 text-[16px] font-medium leading-relaxed text-white/90">
            {review.text}
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#9fe870] text-sm font-bold text-[#163300]">
              {initials}
            </span>
            <span>
              <span className="block text-sm font-bold">{review.name}</span>
              <span className="block text-xs text-white/60">
                {review.location}
              </span>
            </span>
          </figcaption>
        </figure>
      );

    /* 3 — Bright green card, dark text */
    case 3:
      return (
        <figure className="relative w-full max-w-md overflow-hidden rounded-[22px] bg-[#9fe870] p-7 text-[#163300]">
          <div className="flex items-center justify-between">
            <Stars rating={review.rating} className="text-[#163300]" />
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/25 px-3 py-1 text-[11px] font-bold text-[#163300] backdrop-blur-md">
              <Icon name="check" className="h-4 w-4" size={15} strokeWidth={2.2} />
              Customer review
            </span>
          </div>
          <blockquote className="mt-5 text-[16px] font-semibold leading-relaxed">
            {review.text}
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-3 border-t border-[#163300]/15 pt-5">
            <img
              src={review.avatar}
              alt={review.name}
              style={{ filter: "none" }}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#163300]/20"
            />
            <span>
              <span className="block text-sm font-bold">{review.name}</span>
              <span className="block text-xs text-[#163300]/70">
                {review.location}
              </span>
              {meta ? (
                <span className="mt-1 block text-[11px] font-semibold text-[#163300]/80">
                  {meta}
                </span>
              ) : null}
            </span>
          </figcaption>
        </figure>
      );

    /* 4 — Left green border, minimal */
    case 4:
      return (
        <figure className="w-full max-w-md rounded-r-2xl border-l-4 border-[#9fe870] bg-surface py-5 pl-6 pr-6 shadow-sm">
          <Stars rating={review.rating} className="text-[#163300]" />
          <blockquote className="mt-4 text-[16px] leading-relaxed text-content">
            {review.text}
          </blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            {review.avatar ? (
              <img
                src={review.avatar}
                alt={review.name}
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-[#9fe870]/50"
              />
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#163300] text-sm font-bold text-[#9fe870]">
                {initials}
              </span>
            )}
            <span className="text-sm">
              <span className="block font-bold text-content">
                {review.name}
              </span>
              <span className="block text-xs text-muted">
                {review.location}
              </span>
            </span>
          </figcaption>
        </figure>
      );

    /* 5 — Centered, avatar on top */
    case 5:
      return (
        <figure className="w-full max-w-md rounded-[22px] border border-line bg-surface p-8 text-center shadow-sm">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#9fe870] text-base font-bold text-[#163300]">
            {initials}
          </span>
          <Stars rating={review.rating} className="mt-4 justify-center text-[#163300]" />
          <blockquote className="mt-4 text-[16px] leading-relaxed text-content">
            {review.text}
          </blockquote>
          <figcaption className="mt-5">
            <span className="block text-sm font-bold text-content">
              {review.name}
            </span>
            <span className="block text-xs text-muted">{review.location}</span>
          </figcaption>
        </figure>
      );

    /* 6 — Split: avatar column + content */
    case 6:
      return (
        <figure className="flex w-full max-w-md gap-5 rounded-[22px] border border-line bg-surface p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#163300] text-base font-bold text-[#9fe870]">
              {initials}
            </span>
            <span className="mt-3 w-px flex-1 bg-line" aria-hidden />
          </div>
          <div>
            <Stars rating={review.rating} className="text-[#163300]" />
            <blockquote className="mt-3 text-[15px] leading-relaxed text-content">
              {review.text}
            </blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-bold text-content">{review.name}</span>
              <span className="block text-xs text-muted">
                {review.location}
              </span>
            </figcaption>
          </div>
        </figure>
      );

    /* 7 — Soft gradient card */
    case 7:
      return (
        <figure className="relative w-full max-w-md overflow-hidden rounded-[22px] border border-[#9fe870]/40 bg-gradient-to-br from-[#f2fbe9] to-[#eaf9dc] p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <Stars rating={review.rating} className="text-[#163300]" />
            <span className="text-sm font-extrabold text-[#163300]">
              {review.rating.toFixed(1)}
            </span>
          </div>
          <blockquote className="mt-5 text-[16px] font-medium leading-relaxed text-[#163300]">
            {review.text}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#163300] text-sm font-bold text-[#9fe870]">
              {initials}
            </span>
            <span>
              <span className="block text-sm font-bold text-[#163300]">
                {review.name}
              </span>
              <span className="block text-xs text-[#163300]/70">
                {review.location}
              </span>
            </span>
          </figcaption>
        </figure>
      );

    /* 8 — Source header (Google-style) */
    case 8:
      return (
        <figure className="w-full max-w-md rounded-[22px] border border-line bg-surface shadow-sm">
          <div className="flex items-center justify-between rounded-t-[22px] bg-cream px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#9fe870] text-xs font-bold text-[#163300]">
                <Icon name="check" className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold text-content">
                Customer review
              </span>
            </div>
            <Stars rating={review.rating} className="text-[#163300]" />
          </div>
          <div className="p-6">
            <blockquote className="text-[16px] leading-relaxed text-content">
              {review.text}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#163300] text-xs font-bold text-[#9fe870]">
                {initials}
              </span>
              <span>
                <span className="block text-sm font-bold text-content">
                  {review.name}
                </span>
                <span className="block text-xs text-muted">
                  {review.location}
                </span>
              </span>
            </figcaption>
          </div>
        </figure>
      );

    /* 9 — Big quote led */
    case 9:
      return (
        <figure className="relative w-full max-w-md rounded-[22px] border border-line bg-surface p-8 shadow-sm">
          <span
            aria-hidden
            className="block font-serif text-6xl leading-none text-[#9fe870]"
          >
            &ldquo;
          </span>
          <blockquote className="mt-2 text-lg font-semibold leading-snug text-content">
            {review.text}
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#9fe870] text-sm font-bold text-[#163300]">
                {initials}
              </span>
              <span>
                <span className="block text-sm font-bold text-content">
                  {review.name}
                </span>
                <span className="block text-xs text-muted">
                  {review.location}
                </span>
              </span>
            </div>
            <Stars rating={review.rating} className="text-[#163300]" />
          </figcaption>
        </figure>
      );

    /* 10 — Compact with rating pill */
    case 10:
      return (
        <figure className="w-full max-w-md rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#163300] text-sm font-bold text-[#9fe870] ring-2 ring-[#9fe870]/40">
              {initials}
            </span>
            <div className="min-w-0">
              <span className="block truncate text-sm font-bold text-content">
                {review.name}
              </span>
              <span className="block truncate text-xs text-muted">
                {review.location}
              </span>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-pill bg-[#9fe870] px-2.5 py-1 text-xs font-bold text-[#163300]">
              <Icon name="star" className="h-3.5 w-3.5" />
              {review.rating.toFixed(1)}
            </span>
          </div>
          <blockquote className="mt-4 text-[15px] leading-relaxed text-content">
            {review.text}
          </blockquote>
        </figure>
      );

    /* 1 — Accent bar + quote watermark (default) */
    case 1:
    default:
      return (
        <figure className="group relative w-full max-w-md overflow-hidden rounded-[22px] border border-line bg-surface p-7 shadow-[0_18px_50px_-20px_rgba(22,51,0,0.35)] transition-transform duration-300 hover:-translate-y-1">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5 bg-[#9fe870]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-1 top-2 select-none font-serif text-[130px] leading-none text-[#9fe870]/25"
          >
            &rdquo;
          </span>
          <div className="relative flex items-center justify-between">
            <Stars rating={review.rating} className="text-[#163300]" />
            <span className="inline-flex items-center gap-1 rounded-pill bg-[#9fe870]/25 px-2.5 py-1 text-[11px] font-bold text-[#163300]">
              <Icon name="check" className="h-3.5 w-3.5" />
              Customer review
            </span>
          </div>
          <blockquote className="relative mt-5 text-[16px] font-medium leading-relaxed text-content">
            {review.text}
          </blockquote>
          <hr className="my-6 border-line" />
          <figcaption className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#163300] text-sm font-bold text-[#9fe870] ring-2 ring-[#9fe870]/40">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-content">
                {review.name}
              </span>
              <span className="block truncate text-xs text-muted">
                {review.location}
              </span>
            </span>
            <span className="ml-auto flex flex-col items-end">
              <span className="text-lg font-extrabold leading-none text-[#163300]">
                {review.rating.toFixed(1)}
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted">
                Rating
              </span>
            </span>
          </figcaption>
        </figure>
      );
  }
}
