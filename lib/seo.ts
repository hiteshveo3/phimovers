import { PHONE_E164, SITE_URL, EMAIL } from "@/lib/contact";

const SITE = SITE_URL;

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

/** Canonical business entity for homepage @graph. */
export function organizationJsonLd() {
  return {
    "@type": "MovingCompany",
    "@id": `${SITE}/#business`,
    name: "Phi Movers",
    legalName: "Phi Movers Ltd",
    url: SITE,
    telephone: PHONE_E164,
    email: EMAIL,
    image: `${SITE}/logo.png`,
    logo: `${SITE}/logo.png`,
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: "71–75 Shelton Street, Covent Garden",
      addressLocality: "London",
      postalCode: "WC2H 9JQ",
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "City",
      name: "London",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "07:00",
        closes: "21:00",
      },
    ],
    sameAs: [] as string[],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "Phi Movers",
    publisher: { "@id": `${SITE}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE}/services?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export const DEFAULT_OG_IMAGE = `${SITE}/logo.png`;
