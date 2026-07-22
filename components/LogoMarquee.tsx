const brands = [
  "Checkatrade",
  "Trustpilot",
  "Which? Trusted Traders",
  "BAR Member",
  "Google Reviews",
  "TrustMark",
  "Yell",
  "AnyVan",
  "Ombudsman",
  "FSB",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-12 pr-12">
      {brands.map((b) => (
        <span
          key={b}
          className="whitespace-nowrap text-xl font-bold tracking-tight text-muted/70"
        >
          {b}
        </span>
      ))}
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <div className="relative overflow-hidden py-2">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream to-transparent" />
    </div>
  );
}
