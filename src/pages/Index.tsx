import { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";
import Hero from "@/components/Hero";
import TrustedSection from "@/components/TrustedSection";
import IntroVideo from "@/components/IntroVideo";
import WorkGrid from "@/components/WorkGrid";
import WeBelieveSection from "@/components/WeBelieveSection";
import ServicesGrid from "@/components/ServicesGrid";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [isVideoFocused, setIsVideoFocused] = useState(false);

  return (
    <div className="min-h-screen pb-28">
      <TopNavbar isHidden={isVideoFocused} />
      <Hero />
      <TrustedSection />
      <IntroVideo onVideoFocus={setIsVideoFocused} />
      <WorkGrid />
      <WeBelieveSection />
      <ServicesGrid />
      <ContactSection />
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
