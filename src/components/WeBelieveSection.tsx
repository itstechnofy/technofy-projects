import { useEffect, useRef, useState } from "react";

const WeBelieveSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [highlightedLines, setHighlightedLines] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Start highlighting when section enters viewport
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Calculate progress through the section (0 to 1)
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight * 0.8)));
        
        // Map progress to number of highlighted lines (0 to 4)
        const lines = Math.floor(progress * 5);
        setHighlightedLines(lines);
      } else if (sectionTop >= windowHeight) {
        setHighlightedLines(0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const gradientClass = "bg-gradient-to-r from-[#9B87F5] to-[#F97BBD] bg-clip-text text-transparent";
  const normalClass = "text-[#C5C5C5]";

  return (
    <section id="we-believe" className="py-6 md:py-16 px-4 sm:px-5 bg-transparent" ref={sectionRef}>
      <div className="container mx-auto max-w-screen-sm md:max-w-4xl">
        <div className="space-y-2 text-left">
          <p className={`text-xl md:text-2xl font-medium leading-relaxed transition-all duration-500 ${highlightedLines >= 1 ? gradientClass : normalClass}`}>
            We believe that great digital experiences
          </p>
          <p className={`text-xl md:text-2xl font-medium leading-relaxed transition-all duration-500 ${highlightedLines >= 2 ? gradientClass : normalClass}`}>
            are built on a foundation of innovation,
          </p>
          <p className={`text-xl md:text-2xl font-medium leading-relaxed transition-all duration-500 ${highlightedLines >= 3 ? gradientClass : normalClass}`}>
            collaboration, and unwavering commitment
          </p>
          <p className={`text-xl md:text-2xl font-medium leading-relaxed transition-all duration-500 ${highlightedLines >= 4 ? gradientClass : normalClass}`}>
            to excellence in every pixel and line of code.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeBelieveSection;
