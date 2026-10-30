import type { MetadataRoute } from "next";
import { allServices } from "@/lib/data";
import { areaOffers, areas, comboHref, getAreaBySlug } from "@/lib/areas";
import { townHref, towns } from "@/lib/towns";
import { counties } from "@/lib/counties";
import { authors, posts } from "@/lib/blog";
import { ARTICLE_SLUGS } from "@/lib/blogArticleSlugs";
import { EVIDENCE_BACKED_COMBOS } from "@/lib/combos";
import { SITE } from "@/lib/seo";

// Indexable pages only: no /client, /track, /auth or /admin (robots blocks them), no blog post without a
// built article, and only the area × service combos backed by evidence. No priority / changefreq, and a
// lastModified only where the date is real (blog posts).

const STATIC_PATHS = [
  "/",
  "/services",
  "/pricing",
  "/areas",
  "/removals",
  "/contact",
  "/blog",
  "/reviews",
  "/about",
  "/legal",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
  "/complaints",
];

const url = (path: string) => (path === "/" ? SITE : `${SITE}${path}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: string[] = [...STATIC_PATHS];

  for (const s of allServices) paths.push(`/services/${s.slug}`);
  for (const a of areas) paths.push(`/areas/${a.slug}`);

  for (const c of EVIDENCE_BACKED_COMBOS) {
    const area = getAreaBySlug(c.borough);
    const built = area && allServices.some((s) => s.slug === c.service) && areaOffers(area, c.service);
    if (built) paths.push(comboHref(c.borough, c.service));
  }

  for (const t of towns) {
    paths.push(townHref(t.slug));
    for (const s of t.services) paths.push(townHref(t.slug, s));
  }
  for (const c of counties) paths.push(`/removals/county/${c.slug}`);
  for (const a of authors) paths.push(`/author/${a.slug}`);

  const entries: MetadataRoute.Sitemap = paths.map((p) => ({ url: url(p) }));
  for (const p of posts) {
    if (ARTICLE_SLUGS.has(p.slug)) entries.push({ url: url(`/blog/${p.slug}`), lastModified: new Date(p.date) });
  }
  return entries;
}
