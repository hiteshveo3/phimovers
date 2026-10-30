import type { GetStaticPaths, GetStaticProps } from 'next';
import { DcPage } from '../../kit/components/DcPage';
import ServiceDetail, { type ServiceDetailProps } from '../../kit/components/ServiceDetail';
import { SITE_URL } from '../../lib/contact';
import { allServices, getServiceBySlug, priceLabel } from '../../lib/data';
import { getFaqsForPath } from '../../lib/page-faqs';
import { REVIEWS } from '../../kit/reviews';
import { servicePhoto } from '../../kit/service-icons';
import { NO_AREA_COMBO_SERVICES, areaOffers, areas, comboHref } from '../../lib/areas';
import { buildServiceCopy, relatedServices } from '../../lib/services';
import { businessRef, offerFromPrice } from '../../lib/seo';
import { serviceSeo } from '../../lib/seoTargets';
import { specialistLinks, specialistSeo } from '../../lib/seoSpecialist';
import { moreServiceSeo } from '../../lib/seoServices2';
import { specialistLinks2, specialistSeo2 } from '../../lib/seoSpecialist2';
import { faqSchema } from '../../kit/components/DcPage';
import { posts } from '../../lib/blog';

type Props = ServiceDetailProps & { meta: { title: string; description: string; path: string; ogImage: string; schema: object[] } };

// Two reviews from the site's one list (lib/reviews.ts), matched to the service where one exists. Initials only.
const reviewsFor = (title: string) => {
  const word = title.toLowerCase().split(/[^a-z]+/)[0];
  const match = REVIEWS.filter((r) => r.service.toLowerCase().includes(word));
  return [...match, ...REVIEWS.filter((r) => !match.includes(r))].slice(0, 2).map((r) => ({ name: r.name, location: r.location, text: r.text }));
};

/** Services named in the copy of lib/seoServices2.ts, linked after the keyword sections. */
const MORE_RELATED: Record<string, { label: string; href: string }[]> = {
  "sofa-delivery": [{ label: "Sofa & furniture hoisting", href: "/services/sofa-and-furniture-hoisting" }, { label: "Furniture assembly", href: "/services/furniture-assembly" }],
  "furniture-assembly": [{ label: "IKEA collection & assembly", href: "/services/ikea-collection-and-assembly" }, { label: "Sofa delivery", href: "/services/sofa-delivery" }, { label: "Sofa & furniture hoisting", href: "/services/sofa-and-furniture-hoisting" }],
  "single-item-delivery": [{ label: "Marketplace collection & delivery", href: "/services/marketplace-collection-and-delivery" }, { label: "Sofa delivery", href: "/services/sofa-delivery" }, { label: "Furniture delivery", href: "/services/furniture-delivery" }],
  "packing-materials": [{ label: "Moving crate hire", href: "/services/moving-crate-hire" }, { label: "Full packing service", href: "/services/full-packing-service" }],
  "office-removals": [{ label: "Office furniture removals", href: "/services/office-furniture-removals" }],
  "warehouse-removals": [{ label: "Heavy & machinery moving", href: "/services/heavy-and-machinery-moving" }],
  "last-minute-removals": [{ label: "Storage with collection", href: "/services/storage-with-collection" }],
};

/** Blog guides linked from each service page (slugs from lib/blog.ts). */
const GUIDES: Record<string, string[]> = {
  "house-removals": ["how-much-does-it-cost-to-move-house-uk", "how-long-does-it-take-to-move-house", "what-is-a-removal-service"],
  "man-and-van": ["man-and-van-prices-uk", "man-and-van-vs-full-removal"],
  "sofa-and-furniture-hoisting": ["how-to-hoist-a-sofa-through-a-window-or-balcony", "sofa-wont-fit-up-the-stairs"],
  "sofa-delivery": ["sofa-wont-fit-up-the-stairs", "sofa-delivery-narrow-stairs-london", "how-to-hoist-a-sofa-through-a-window-or-balcony"],
  "furniture-assembly": ["sofa-wont-fit-up-the-stairs"],
  "furniture-delivery": ["cheapest-way-to-send-furniture-uk"],
  "single-item-delivery": ["cheapest-way-to-send-furniture-uk"],
  "marketplace-collection-and-delivery": ["cheapest-way-to-send-furniture-uk"],
  "bed-and-mattress-delivery": ["how-to-move-a-mattress"],
  "moving-crate-hire": ["moving-crates-vs-cardboard-boxes"],
  "packing-materials": ["moving-crates-vs-cardboard-boxes", "how-to-pack-a-kitchen-like-a-pro"],
  "full-packing-service": ["how-to-pack-a-kitchen-like-a-pro", "moving-crates-vs-cardboard-boxes"],
  "heavy-and-machinery-moving": ["how-to-move-gym-equipment-and-heavy-items"],
  "piano-and-specialist": ["how-to-move-gym-equipment-and-heavy-items"],
  "storage-with-collection": ["storage-during-a-house-renovation", "storage-costs-london-uk"],
  "secure-storage": ["storage-costs-london-uk", "self-storage-guide-london", "storage-during-a-house-renovation"],
  "long-distance-removals": ["how-to-choose-a-long-distance-moving-company", "how-much-does-it-cost-to-move-house-uk"],
  "part-load-removals": ["how-to-choose-a-long-distance-moving-company"],
  "office-removals": ["how-much-does-an-office-move-cost"],
  "office-furniture-removals": ["how-much-does-an-office-move-cost"],
  "it-and-server-relocation": ["how-much-does-an-office-move-cost"],
  "vehicle-transport": ["car-transport-cost-uk"],
  "motorbike-transport": ["car-transport-cost-uk"],
  "same-day-move": ["same-day-removals-london"],
  "last-minute-removals": ["same-day-removals-london"],
  "evening-and-weekend-moves": ["evening-weekend-moves-london"],
  "studio-moves": ["studio-flat-move-checklist"],
  "flat-removals": ["prepare-for-flat-move-london", "studio-flat-move-checklist"],
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: allServices.map((s) => ({ params: { slug: s.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const entry = getServiceBySlug(String(params?.slug));
  if (!entry) return { notFound: true };
  const { item, category } = entry;
  const url = `${SITE_URL}/services/${item.slug}`;
  const isHouse = item.slug === 'house-removals';
  const specialist = specialistSeo[item.slug]
    ? { ...specialistSeo[item.slug], related: specialistLinks[item.slug] ?? [] }
    : specialistSeo2[item.slug]
      ? { ...specialistSeo2[item.slug], related: specialistLinks2[item.slug] ?? [] }
      : null;
  const more = moreServiceSeo[item.slug] ? { ...moreServiceSeo[item.slug], related: MORE_RELATED[item.slug] ?? [] } : null;
  const seo = serviceSeo[item.slug] ?? specialist ?? more ?? null;
  const description = seo
    ? seo.description
    : `${item.desc} Fixed-price, fully insured ${item.title.toLowerCase()} across all 32 London boroughs. ${priceLabel(item.price)}.`;
  const pageFaqs = getFaqsForPath(`/services/${item.slug}`);
  const faqs = seo ? [...seo.faqs, ...pageFaqs.filter((f) => !seo.faqs.some((s) => s.q === f.q))] : pageFaqs;
  const photo = servicePhoto(item.slug);

  const serviceLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: item.title,
        description: item.desc,
        serviceType: item.title,
        provider: businessRef(),
        areaServed: { '@type': 'City', name: 'London' },
        url,
        ...(photo ? { image: `${SITE_URL}${photo}` } : {}),
        offers: offerFromPrice(item.price),
      },
    ],
  };

  return {
    props: {
      item,
      categoryTitle: category.title,
      copy: buildServiceCopy(item),
      related: relatedServices(item.slug, 3),
      areas: NO_AREA_COMBO_SERVICES.includes(item.slug)
        ? areas.filter((a) => !a.borough).map((a) => ({ slug: a.slug, name: a.name, href: `/areas/${a.slug}` }))
        : areas.filter((a) => areaOffers(a, item.slug)).map((a) => ({ slug: a.slug, name: a.name, href: comboHref(a.slug, item.slug) })),
      faqs,
      reviews: reviewsFor(item.title),
      seo,
      guides: (GUIDES[item.slug] ?? []).flatMap((slug) => {
        const p = posts.find((x) => x.slug === slug);
        return p ? [{ title: p.title, href: `/blog/${p.slug}` }] : [];
      }),
      meta: {
        title: seo ? seo.title : isHouse ? 'House Removals London | Fixed-Price Moves | Phi Movers' : `${item.title} in London — Phi Movers`,
        description,
        path: `/services/${item.slug}`,
        ogImage: photo || '/logo.png',
        schema: [serviceLd, faqSchema(faqs)],
      },
    },
  };
};

export default function ServicePage({ meta, ...props }: Props) {
  return (
    <DcPage
      title={meta.title}
      description={meta.description}
      path={meta.path}
      ogImage={meta.ogImage}
      crumbs={[{ name: 'Services', path: '/services' }, { name: props.item.title }]}
      schema={meta.schema}
    >
      <ServiceDetail {...props} />
    </DcPage>
  );
}
