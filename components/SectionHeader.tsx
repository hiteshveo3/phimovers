export default function SectionHeader({
  title,
  moreLabel,
  moreHref = "#",
}: {
  title: string;
  moreLabel?: string;
  moreHref?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="section-title">{title}</h2>
      {moreLabel && (
        <a href={moreHref} className="link-more shrink-0">
          {moreLabel}
          <span aria-hidden>→</span>
        </a>
      )}
    </div>
  );
}
