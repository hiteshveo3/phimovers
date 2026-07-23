import type { MetadataRoute } from "next";
import { allServices } from "@/lib/data";
import { areas } from "@/lib/areas";
import { authors, posts } from "@/lib/blog";
import {
  isPriorityCombo,
  PRIORITY_BOROUGHS,
  PRIORITY_SERVICES,
} from "@/lib/combos";

const SITE = "https://phimovers.co.uk";

function url(path: string): string {
  return path === "/" ? SITE : `${SITE}${path}`;
}

function byPriorityDesc(
  a: MetadataRoute.Sitemap[number],
  b: MetadataRoute.Sitemap[number],
) {
  return (b.priority ?? 0) - (a.priority ?? 0);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/services"), lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: url("/pricing"), lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: url("/areas"), lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: url("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: url("/reviews"), lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: url("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/legal"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/cookies"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/accessibility"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/complaints"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const s of allServices) {
    const core = (PRIORITY_SERVICES as readonly string[]).includes(s.slug);
    entries.push({
      url: url(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: core ? 0.9 : 0.8,
    });
  }

  for (const a of areas) {
    const core = (PRIORITY_BOROUGHS as readonly string[]).includes(a.slug);
    entries.push({
      url: url(`/areas/${a.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: core ? 0.8 : 0.75,
    });
  }

  for (const p of posts) {
    entries.push({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(p.date),
      changeFrequency: "monthly",
      priority: 0.72,
    });
  }

  // Indexation tier: only priority borough × service combos (~96)
  for (const borough of PRIORITY_BOROUGHS) {
    for (const service of PRIORITY_SERVICES) {
      if (!isPriorityCombo(borough, service)) continue;
      entries.push({
        url: url(`/areas/${borough}/${service}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.65,
      });
    }
  }

  for (const a of authors) {
    entries.push({
      url: url(`/author/${a.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

  return entries.sort(byPriorityDesc);
}
