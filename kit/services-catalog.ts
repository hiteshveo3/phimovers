/** Services catalogue for the hub page, header menu and search. Read from lib/data.ts, the one list of Phi services. */

import { serviceCategories, priceLabel } from '../lib/data';

export type ServiceCard = {
  title: string;
  href: string;
  text: string;
  image: string;
  /** Phi icon key from lib/data.ts (home, truck, sofa, box, ...). */
  icon: string;
  price: string;
  slug: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  intro: string;
  shortTitle: string;
  services: ServiceCard[];
};

const SHORT: Record<string, string> = {
  home: 'Home moves',
  furniture: 'Furniture',
  business: 'Business',
  packing: 'Packing & storage',
  specialist: 'Specialist',
  extras: 'Extras',
};

export const servicesCatalog: ServiceCategory[] = serviceCategories.map((c) => ({
  id: c.id,
  title: c.title,
  intro: c.intro,
  shortTitle: SHORT[c.id] ?? c.title,
  services: c.items.map((s) => ({ title: s.title, href: s.href, text: s.desc, image: s.image, icon: s.icon, price: s.price, slug: s.slug })),
}));

export const allServiceCards: ServiceCard[] = servicesCatalog.flatMap((g) => g.services);

export type StartingPrice = { from: string; basis: string };

/** Short price shown next to a service: "£249", "£50/hr", or a plain "Fixed quote". */
export function shortPrice(price: string): string {
  const p = price.trim().replace(/^from\s+/i, '');
  return /^(fixed|custom|free)/i.test(p) ? priceLabel(price) : p;
}

/** Starting price per service, keyed by href. Services priced "custom quote" have none and are left out. */
export const startingPrices: Record<string, StartingPrice> = Object.fromEntries(
  allServiceCards
    .filter((s) => /^from\s+/i.test(s.price.trim()))
    .map((s) => [s.href, { from: shortPrice(s.price), basis: priceLabel(s.price) }]),
);

export function serviceCount(): number {
  return allServiceCards.length;
}
