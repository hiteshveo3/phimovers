import HeroBg from "./HeroBg";
import HeroContent from "./HeroContent";

// Change `variant` (1-5) to switch the background style.
const HERO_VARIANT = 6;

export default function Hero() {
  return (
    <section id="home" className="section relative isolate overflow-hidden">
      <HeroBg variant={HERO_VARIANT} />
      <HeroContent />
    </section>
  );
}
