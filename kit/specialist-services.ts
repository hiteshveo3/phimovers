/** Specialist and furniture services featured on the homepage and services hub.
 * Dedicated specialist pages win far more search clicks than generic removals pages,
 * so they get prominent internal links. Slugs must exist in lib/data.ts. */
import { allServiceCards, type ServiceCard } from "./services-catalog";

export const SPECIALIST_SLUGS = [
  "sofa-and-furniture-hoisting",
  "sofa-delivery",
  "single-item-delivery",
  "marketplace-collection-and-delivery",
  "ikea-collection-and-assembly",
  "furniture-assembly",
  "moving-crate-hire",
  "heavy-and-machinery-moving",
  "piano-and-specialist",
  "antique-and-fine-art-moving",
  "storage-with-collection",
  "office-furniture-removals",
  "long-distance-removals",
  "part-load-removals",
];

export const specialistCards: ServiceCard[] = SPECIALIST_SLUGS.map((slug) => allServiceCards.find((s) => s.slug === slug)).filter(
  (s): s is ServiceCard => Boolean(s),
);
