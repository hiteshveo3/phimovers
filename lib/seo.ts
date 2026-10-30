import { PHONE_E164, ADDRESS_STREET, ADDRESS_TOWN, ADDRESS_POSTCODE } from "@/lib/contact";
import {
  BRAND,
  COMPANY_NAME,
  COMPANY_NO,
  COMPANIES_HOUSE_URL,
  EMAIL,
  GOOGLE_DIRECTIONS,
  HOURS,
  SOCIALS,
  TRUSTPILOT_URL,
} from "@/kit/site-facts";

/**
 * The one canonical host. Vercel redirects the apex to www, so every absolute URL in the sitemap, robots,
 * schema and metadata uses www. kit/site-facts `SITE` and lib/contact `SITE_URL` must match this.
 */
export const SITE = "https://www.phimovers.co.uk";

/** The business node every page's schema points at, e.g. `provider: businessRef()`. */
export const BUSINESS_ID = `${SITE}/#business`;
export const businessRef = () => ({ "@id": BUSINESS_ID });

/** Parse marketing price strings into a schema.org Offer (or omit price). */
export function offerFromPrice(price: string): Record<string, unknown> {
  const raw = price.trim();
  const hourly = /\/\s*h(ou)?r/i.test(raw) || /per\s*hour/i.test(raw);
  const weekly = /\/\s*w(ee)?k/i.test(raw) || /per\s*week/i.test(raw);
  const custom = /^custom/i.test(raw) || /^free$/i.test(raw);
  const match = raw.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  const amount = match ? match[1] : null;

  if (custom || !amount) {
    return {
      "@type": "Offer",
      priceCurrency: "GBP",
      description: "Fixed quotation after enquiry",
      availability: "https://schema.org/InStock",
    };
  }

  if (hourly || weekly) {
    return {
      "@type": "Offer",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: amount,
        priceCurrency: "GBP",
        unitText: hourly ? "HOUR" : "WEEK",
      },
    };
  }

  return {
    "@type": "Offer",
    priceCurrency: "GBP",
    price: amount,
    availability: "https://schema.org/InStock",
  };
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

/**
 * Canonical business entity for the site-wide @graph, built from kit/site-facts.ts. No AggregateRating:
 * the rating is shown on the page where the reviews are, not claimed site-wide. Facts that are still
 * empty in site-facts (company number, socials, Trustpilot) are left out until they are filled in.
 */
export function organizationJsonLd() {
  const hours = {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: DAYS,
    opens: hh(HOURS.open),
    closes: hh(HOURS.close),
  };
  const sameAs = [...SOCIALS.map((s) => s.url), TRUSTPILOT_URL, COMPANIES_HOUSE_URL].filter(Boolean);
  return {
    "@type": "MovingCompany",
    "@id": BUSINESS_ID,
    name: BRAND,
    legalName: COMPANY_NAME,
    url: SITE,
    telephone: PHONE_E164,
    email: EMAIL,
    image: `${SITE}/logo.png`,
    logo: `${SITE}/logo.png`,
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS_STREET,
      addressLocality: ADDRESS_TOWN,
      postalCode: ADDRESS_POSTCODE,
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.5647,
      longitude: 0.1345,
    },
    hasMap: GOOGLE_DIRECTIONS,
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "AdministrativeArea", name: "Greater London" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: PHONE_E164,
      email: EMAIL,
      areaServed: "GB",
      availableLanguage: "en-GB",
      hoursAvailable: hours,
    },
    openingHoursSpecification: [hours],
    ...(COMPANY_NO
      ? { identifier: { "@type": "PropertyValue", propertyID: "Companies House", value: COMPANY_NO } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

// No SearchAction: /services does not read a ?q= parameter, and Google retired the sitelinks search box.
export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: BRAND,
    publisher: businessRef(),
    inLanguage: "en-GB",
  };
}

export const DEFAULT_OG_IMAGE = `${SITE}/logo.png`;
