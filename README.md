# SwiftMove Removals

A modern, front-end marketing site for a UK removals (moving) company, built
with **Next.js 14 (App Router) + React + Tailwind CSS**.

Features: services grid, moving packages, drag/arrow carousels, live service
search, transparent pricing toggle, scroll-reveal animations, trust marquee,
mega-menu navigation, and full light/dark mode.

> The design system was originally adapted from a Craftwork-style layout and
> fully re-themed for a removals business.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Project structure

```
app/
  layout.tsx        # Root layout + font (Manrope, a Grotesk substitute)
  page.tsx          # Assembles all homepage sections
  globals.css       # Tailwind layers + component utility classes
components/          # Navbar, Hero, ProBanner, CategoryGrid, ProductCard,
                    # ProductSection, FeatureGrid, Stats, Pricing, Newsletter, Footer
lib/
  data.ts           # ALL content lives here (nav, categories, products, plans)
tailwind.config.ts  # Colors, fonts, container width, shadows
```

## Swapping in real photos

All imagery currently uses stable placeholders via the `img()` helper in
`lib/data.ts`. Replace the `image` values with real photo URLs, e.g.:

```ts
{ title: "2-Bed House Move", price: "from £499", author: "3 movers · 1 van",
  category: "Home Removals", image: "https://<your-cdn>/2bed-move.jpg" },
```

`next.config.mjs` already allows remote images from any host, so external URLs
will render through `next/image` without extra config.

## Notes / not included

- This is UI-only: no backend, quote engine, booking or payments.
- Prices, areas, phone number and accreditations are placeholder content —
  update them in `lib/data.ts` and the components.
- Fonts: **Manrope** (a clean grotesk) is used; change it in `app/layout.tsx`.
- Colors are defined in `tailwind.config.ts` and easy to fine-tune.
