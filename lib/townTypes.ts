/** Shared shapes for UK town data (lib/towns.ts and lib/towns/*.ts). */

export type TownFaq = { q: string; a: string };

/** Sub-pages a town can have under /removals/{town}/{service}. */
export type TownService = "man-and-van" | "house-clearance" | "office-removals" | "secure-storage" | "furniture-delivery";

export type TownInput = {
  name: string;
  county: string;
  region:
    | "South East"
    | "East of England"
    | "South West"
    | "East Midlands"
    | "West Midlands"
    | "Yorkshire"
    | "North West"
    | "North East"
    | "Scotland"
    | "Wales";
  /** Main outward postcodes, space separated, e.g. "SL1 SL2 SL3" */
  postcodes: string;
  /** Approximate road miles from central London */
  miles: number;
  /** Local authority, e.g. "Slough Borough Council" */
  council?: string;
  /** 2–3 sentence opening unique to this town (who moves here, what the moves look like) */
  intro?: string;
  /** Typical housing stock movers see */
  housing: string;
  /** Parking, roads, permits and access notes */
  access: string;
  /** 2–4 verifiable local facts (stations, universities, main roads, landmarks) used as evidence in copy */
  facts?: string[];
  localFaq: TownFaq;
  /** Slugs of other towns in the data set */
  nearby: string[];
  /** Sub-pages to build; omit for hub only */
  services?: TownService[];
};

/** Enrichment for towns that already exist in lib/towns.ts */
export type TownEnrichment = Pick<TownInput, "council" | "intro" | "facts">;
