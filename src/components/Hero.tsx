import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const rotatingSubheadlines = [
  "We craft innovative web solutions that transform businesses and delight users. From concept to launch, we're your trusted technology partner.",
  "Websites that perform — seamless and smooth.",
  "Apps that deliver — easy, intuitive, user-friendly.",
  "Designs that resonate — made to make your brand stand out.",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingSubheadlines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-[75vh] flex items-center justify-center px-4 sm:px-5 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto text-center max-w-screen-sm sm:max-w-5xl">
        <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] text-foreground">
          Building Digital{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Experiences
          </span>{" "}
          That Matter
        </h1>
        
        <div className="relative h-[120px] sm:h-[100px] md:h-[80px] mb-6 sm:mb-8 overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{
              opacity: 1,
            }}
          >
            {rotatingSubheadlines.map((text, index) => (
              <p
                key={index}
                className="absolute inset-0 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 transition-opacity duration-700"
                style={{
                  opacity: currentIndex === index ? 1 : 0,
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Start Your Project
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full sm:w-auto text-primary hover:text-primary hover:bg-primary/10"
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
