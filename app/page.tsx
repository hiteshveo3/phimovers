import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProBanner from "@/components/ProBanner";
import CategoryGrid from "@/components/CategoryGrid";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

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
        <Reviews />
      </Reveal>
      <Reveal>
        <Faq variant={7} />
      </Reveal>
      <Reveal>
        <Cta variant={2} btn={1} />
      </Reveal>

      <Footer />
    </main>
  );
}
