import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const lines = [
  "We believe that great digital experiences",
  "are built on a foundation of innovation,",
  "collaboration, and unwavering commitment",
  "to excellence in every pixel and line of code.",
];

const WeBelieveSection = () => {
  const [activeLine, setActiveLine] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % lines.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [inView]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section id="we-believe" className="py-6 md:py-16 px-4 sm:px-5 bg-muted/30">
      <div className="container mx-auto max-w-screen-sm md:max-w-4xl" ref={ref}>
        <div className="space-y-2 md:space-y-3 text-left">
          {lines.map((line, index) => (
            <p
              key={index}
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight transition-all duration-700 ${
                prefersReducedMotion
                  ? "text-foreground"
                  : inView && activeLine === index
                  ? "bg-gradient-to-r from-[#A991FF] to-[#F74F8C] bg-clip-text text-transparent"
                  : "text-[#BFBFBF]"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeBelieveSection;
