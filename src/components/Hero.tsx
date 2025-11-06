import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const rotatingTexts = [
  "Websites",
  "Mobile Apps",
  "Booking Platforms",
  "Custom Systems",
  "SaaS Dashboards",
];

const Hero = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 1600);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-[80vh] flex items-center justify-center px-6 py-12 md:py-16">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-foreground">
          Building Digital Experiences That Matter
        </h1>
        
        <div className="h-12 sm:h-14 md:h-16 mb-6 overflow-hidden">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateY(-${currentTextIndex * 100}%)`,
            }}
          >
            {rotatingTexts.map((text, index) => (
              <div
                key={index}
                className="h-12 sm:h-14 md:h-16 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-semibold text-primary"
              >
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          We craft innovative web solutions that transform businesses and delight users. 
          From concept to launch, we're your trusted technology partner.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-[#625CC8] hover:bg-[#544FB3] text-white px-8"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Start Your Project
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-[#625CC8] hover:text-[#544FB3] hover:bg-transparent"
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
