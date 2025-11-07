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
      
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Slower, more gradual highlighting - increased multiplier for slower progression
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Much slower progress calculation (0 to 1)
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight * 1.8)));
        
        // Map progress to number of highlighted lines (0 to 5)
        const lines = Math.floor(progress * 6);
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
  const normalClass = "text-muted-foreground";

  return (
    <section id="we-believe" className="py-16 md:py-24 px-4 sm:px-5 bg-transparent" ref={sectionRef}>
      <div className="container mx-auto max-w-screen-lg">
        <div className="space-y-3 md:space-y-4 text-center">
          <p className={`text-2xl md:text-4xl font-medium leading-relaxed transition-all duration-700 ${highlightedLines >= 1 ? gradientClass : normalClass}`}>
            We believe that great digital
          </p>
          <p className={`text-2xl md:text-4xl font-medium leading-relaxed transition-all duration-700 ${highlightedLines >= 2 ? gradientClass : normalClass}`}>
            experiences are built on
          </p>
          <p className={`text-2xl md:text-4xl font-medium leading-relaxed transition-all duration-700 ${highlightedLines >= 3 ? gradientClass : normalClass}`}>
            a foundation of innovation,
          </p>
          <p className={`text-2xl md:text-4xl font-medium leading-relaxed transition-all duration-700 ${highlightedLines >= 4 ? gradientClass : normalClass}`}>
            collaboration, and unwavering
          </p>
          <p className={`text-2xl md:text-4xl font-medium leading-relaxed transition-all duration-700 ${highlightedLines >= 5 ? gradientClass : normalClass}`}>
            commitment to excellence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeBelieveSection;
