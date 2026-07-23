import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProBanner from "@/components/ProBanner";
import CategoryGrid from "@/components/CategoryGrid";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import QuoteForm from "@/components/QuoteForm";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import {
  DEFAULT_OG_IMAGE,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  description:
    "Professional, fully insured house and office removals, packing and storage across all 32 London boroughs. Get a free, fixed-price quote in minutes.",
  alternates: { canonical: "https://phimovers.co.uk/" },
  openGraph: {
    title: "Phi Movers — London removals across all 32 boroughs",
    description:
      "Fully insured house & office removals, packing and storage across every London borough. Free fixed-price quotes.",
    url: "https://phimovers.co.uk/",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Phi Movers" }],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), websiteJsonLd()],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />

      <Reveal>
        <ProBanner />
      </Reveal>
      <Reveal>
        <CategoryGrid />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>

      <Reveal>
        <Reviews />
      </Reveal>
      <Reveal>
        <Faq variant={7} />
      </Reveal>

      <Reveal>
        <section className="container-page pb-4">
          <QuoteForm />
        </section>
      </Reveal>

      <Reveal>
        <Cta variant={2} btn={1} />
      </Reveal>

      <Footer />
    </main>
  );
}
