// Phi Movers areas, read from lib/areas.ts so the header search, the regions and the area pages never drift apart.
// Shared by the header area search, the region counts and /areas.

import { areas, areaRegions, areaHref, getAreaBySlug } from '../lib/areas';
import postcodes from './postcodes.json';

export type Region = 'Central London' | 'North London' | 'East London' | 'South London' | 'West London';

export type Borough = { name: string; slug: string; region: Region; href: string; postcodes?: string };

const REGION_BY_LABEL: Record<string, Region> = {
  Central: 'Central London',
  North: 'North London',
  East: 'East London',
  South: 'South London',
  West: 'West London',
};

export const REGION_ORDER: Region[] = ['Central London', 'North London', 'East London', 'South London', 'West London'];

/** Region hub pages in lib/areas.ts, one per region. */
export const REGION_HREF: Record<Region, string> = {
  'Central London': areaHref('central-london'),
  'North London': areaHref('north-london'),
  'East London': areaHref('east-london'),
  'South London': areaHref('south-london'),
  'West London': areaHref('west-london'),
};

const POSTCODES: Record<string, string> = { ...(postcodes as Record<string, string>), 'City of London': 'EC1 EC2 EC3 EC4' };

export const BOROUGHS: Borough[] = areaRegions
  .filter((r) => REGION_BY_LABEL[r.label])
  .flatMap((r) =>
    r.slugs.flatMap((slug) => {
      const a = getAreaBySlug(slug);
      return a ? [{ name: a.name, slug: a.slug, region: REGION_BY_LABEL[r.label], href: areaHref(a.slug), postcodes: POSTCODES[a.name] }] : [];
    }),
  );

/** Everything in lib/areas.ts, including the regional hubs and key towns. */
export const ALL_AREAS = areas.map((a) => ({ name: a.name, slug: a.slug, href: areaHref(a.slug) }));

export const REGION_COUNTS: Record<Region, number> = BOROUGHS.reduce(
  (acc, b) => ({ ...acc, [b.region]: (acc[b.region] ?? 0) + 1 }),
  {} as Record<Region, number>,
);

/** Matches a typed area name or the outward part of a postcode ("IG2", "ig2 7rx", "Hackney"). */
export function findBoroughs(query: string): Borough[] {
  const clean = (v: string) => v.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
  const q = clean(query);
  if (q.length < 2) return [];
  // A full postcode typed without a space ("ig27rx") still ends in digit + two letters.
  const compact = q.replace(/\s/g, '').toUpperCase();
  const outward = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(compact) ? compact.slice(0, -3) : q.split(' ')[0].toUpperCase();
  return BOROUGHS.filter((b) => clean(b.name).includes(q) || (b.postcodes ?? '').split(' ').includes(outward)).slice(0, 6);
}
