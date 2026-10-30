// Customer reviews, read from lib/reviews.ts so the site has one list.
// Photos in /public/reviews are not confirmed as the reviewers' own, so every review shows initials()
// instead. Set REVIEW_PHOTOS_CONFIRMED to true only once each photo is confirmed real and permitted.

import { siteReviews } from '../lib/reviews';

export type Review = { name: string; tag: string; text: string; date?: string; source: 'Google'; location: string; service: string; avatar?: string };

export const REVIEW_PHOTOS_CONFIRMED = false;

export const REVIEWS: Review[] = siteReviews.map((r) => ({
  name: r.name,
  tag: r.service,
  text: r.text,
  date: r.date,
  source: 'Google',
  location: r.location,
  service: r.service,
  avatar: REVIEW_PHOTOS_CONFIRMED ? r.avatar : undefined,
}));

/** What people mention most, counted from the review text itself (no hand-picked numbers). */
const THEME_RULES: [string, RegExp][] = [
  ['On time', /\bon time\b|early|punctual|arrived/i],
  ['Careful with belongings', /careful|wrapped|scratch|with care|protect/i],
  ['Clear, fixed price', /fixed price|no surprises|price|quote/i],
  ['Friendly crew', /polite|friendly|lovely|helpful|professional/i],
  ['Quick', /quick|fast|before lunch|efficient/i],
  ['Stairs and tight access', /stair|narrow|tight|floor/i],
];

export const REVIEW_THEMES: { label: string; count: number }[] = THEME_RULES
  .map(([label, re]) => ({ label, count: REVIEWS.filter((r) => re.test(r.text)).length }))
  .filter((t) => t.count > 0)
  .sort((a, b) => b.count - a.count);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p.replace(/[^A-Za-z]/g, '')[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
