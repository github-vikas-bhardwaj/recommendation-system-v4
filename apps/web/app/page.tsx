import { CtaSection } from "./components/landing/CtaSection";
import { FeaturesSection } from "./components/landing/FeaturesSection";
import { Footer } from "./components/landing/footer/Footer";
import { HeroSection } from "./components/landing/HeroSection";
import { HowItWorksSection } from "./components/landing/HowItWorksSection";

export default function Home() {
  return (
    <main className="mesh-bg flex-1">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
