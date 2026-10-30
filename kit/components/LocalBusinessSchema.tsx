import { organizationJsonLd, websiteJsonLd } from '../../lib/seo';

// Site-wide organisation and website schema, one graph, taken from lib/seo.ts.
export default function LocalBusinessSchema() {
  const schema = { '@context': 'https://schema.org', '@graph': [organizationJsonLd(), websiteJsonLd()] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
