const columns: { title: string; links: string[] }[] = [
  {
    title: "Services",
    links: [
      "Home Removals",
      "Office Removals",
      "Packing Service",
      "Storage",
      "Man & Van",
      "International Moves",
    ],
  },
  {
    title: "London boroughs",
    links: ["Camden", "Islington", "Hackney", "Westminster", "Croydon", "All 32 boroughs"],
  },
  {
    title: "Company",
    links: ["About us", "Our team", "Reviews", "Careers", "Contact"],
  },
  {
    title: "Support",
    links: ["Get a quote", "FAQ", "Insurance & cover", "Terms", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer id="areas" className="mt-10 border-t border-line bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <a href="#" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#9fe870]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#163300" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="3" x2="12" y2="21" />
                  <ellipse cx="12" cy="12" rx="6.5" ry="5" />
                </svg>
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                Phi Movers
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Stress-free house &amp; office removals across all 32 London
              boroughs. Fully insured and fixed-price.
            </p>
            <p className="mt-4 text-sm font-semibold text-content">
              Call us: +44 20 7946 0134
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-content"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Phi Movers Ltd. All rights reserved.</p>
          <p>Fully insured · BAR member · Which? Trusted Trader</p>
        </div>
      </div>
    </footer>
  );
}
