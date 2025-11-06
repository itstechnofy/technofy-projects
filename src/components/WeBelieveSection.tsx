import { useInView } from "react-intersection-observer";
import { useState } from "react";

const lines = [
  "We believe that great digital experiences",
  "are built on a foundation of innovation,",
  "collaboration, and unwavering commitment",
  "to excellence in every pixel and line of code.",
];

const WeBelieveSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section id="we-believe" className="py-6 md:py-16 px-4 sm:px-5 bg-muted/30">
      <div className="container mx-auto max-w-screen-sm md:max-w-4xl">
        <div className="space-y-2 md:space-y-3 text-left">
          {lines.map((line, index) => {
            const { ref } = useInView({
              threshold: 0.6,
              triggerOnce: false,
              onChange: (inView) => {
                if (inView) {
                  setActiveIndex(index);
                }
              },
            });

            return (
              <p
                key={index}
                ref={ref}
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight transition-all duration-700 ${
                  prefersReducedMotion
                    ? "text-foreground"
                    : activeIndex === index
                    ? "bg-gradient-to-r from-[#A991FF] to-[#F74F8C] bg-clip-text text-transparent"
                    : "text-[#BFBFBF]"
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WeBelieveSection;
