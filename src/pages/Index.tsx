import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";
import Hero from "@/components/Hero";
import TrustedSection from "@/components/TrustedSection";
import WorkGrid from "@/components/WorkGrid";
import WeBelieveSection from "@/components/WeBelieveSection";
import ServicesGrid from "@/components/ServicesGrid";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen pb-28 md:pb-32">
      <TopNavbar />
      <Hero />
      <TrustedSection />
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
