import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import LogoCarousel from "@/components/LogoCarousel";
import QuoteSection from "@/components/QuoteSection";
import WorkGrid from "@/components/WorkGrid";
import PhilosophySection from "@/components/PhilosophySection";
import Services from "@/components/Services";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <LogoCarousel />
      <QuoteSection />
      <WorkGrid />
      <PhilosophySection />
      <Services />
    </div>
  );
};

export default Index;
