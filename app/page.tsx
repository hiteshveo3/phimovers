import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProBanner from "@/components/ProBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import FeatureGrid from "@/components/FeatureGrid";
import Stats from "@/components/Stats";
import Pricing from "@/components/Pricing";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Newsletter from "@/components/Newsletter";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import {
  packages,
  popular,
  homeMoves,
  officeMoves,
  packingStorage,
  manVanOptions,
} from "@/lib/data";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <Reveal>
        <ProBanner />
      </Reveal>
      <Reveal>
        <CategoryGrid />
      </Reveal>

      <Reveal>
        <ProductSection
          id="packages"
          title="Our moving packages"
          moreLabel="View all packages"
          products={packages}
          layout="grid"
        />
      </Reveal>
      <Reveal>
        <ProductSection
          title="Popular services & add-ons"
          moreLabel="Explore services"
          products={popular}
          layout="grid"
        />
      </Reveal>
      <Reveal>
        <ProductSection
          title="House removals"
          moreLabel="Home moving options"
          products={homeMoves}
        />
      </Reveal>
      <Reveal>
        <ProductSection
          title="Office & commercial moves"
          moreLabel="Business removals"
          products={officeMoves}
        />
      </Reveal>
      <Reveal>
        <ProductSection
          title="Packing & storage"
          moreLabel="Packing & storage options"
          products={packingStorage}
        />
      </Reveal>
      <Reveal>
        <ProductSection
          title="Man & van options"
          moreLabel="All man & van options"
          products={manVanOptions}
        />
      </Reveal>

      <Reveal>
        <FeatureGrid />
      </Reveal>
      <Reveal>
        <Stats />
      </Reveal>
      <Reveal>
        <Reviews />
      </Reveal>
      <Reveal>
        <Pricing />
      </Reveal>
      <Reveal>
        <Faq variant={7} />
      </Reveal>
      <Reveal>
        <Newsletter />
      </Reveal>
      <Reveal>
        <Cta variant={2} btn={1} />
      </Reveal>

      <Footer />
    </main>
  );
}
