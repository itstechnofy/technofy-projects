import { useEffect, useRef, useState } from "react";

const lines = [
  "We believe that great digital experiences",
  "are built on a foundation of innovation,",
  "collaboration, and unwavering commitment",
  "to excellence in every pixel and line of code.",
];

const WeBelieveSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries[0];
          const index = lineRefs.current.findIndex(
            (ref) => ref === mostVisible.target
          );
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    lineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <section id="we-believe" className="py-6 md:py-16 px-4 sm:px-5 bg-muted/30">
      <div className="container mx-auto max-w-screen-sm md:max-w-4xl">
        <div className="space-y-3 md:space-y-4 text-left">
          {lines.map((line, index) => (
            <p
              key={index}
              ref={(el) => (lineRefs.current[index] = el)}
              className={`text-[28px] md:text-[44px] font-semibold md:leading-tight transition-all duration-500 ${
                prefersReducedMotion
                  ? "text-foreground"
                  : activeIndex === index
                  ? "bg-gradient-to-r from-[#7C6FF9] to-[#FF4EC4] bg-clip-text text-transparent"
                  : "text-[#C9C9C9]"
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
