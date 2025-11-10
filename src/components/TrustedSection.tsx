import { useEffect, useRef } from "react";

const clients = [
  {
    name: "Toyota",
    description: "UI/UX concept for global automotive systems",
    logo: "/assets/logos/logo-1.png",
  },
  {
    name: "NS Prime Construction",
    description: "Fire protection and construction branding",
    logo: "/assets/logos/logo-2.png",
  },
  {
    name: "Ayala Land",
    description: "Real estate platform and property showcase",
    logo: "/assets/logos/logo-3.png",
  },
  {
    name: "Villa Kaja",
    description: "Booking web design for private resort stays",
    logo: "/assets/logos/logo-4.png",
  },
  {
    name: "Q Life Filipinas",
    description: "MLM and dropshipping affiliate system",
    logo: "/assets/logos/logo-5.png",
  },
  {
    name: "Solar-Cell",
    description: "Renewable energy website and campaign",
    logo: "/assets/logos/logo-6.png",
  },
  {
    name: "Lucin Organics",
    description: "E-commerce skincare store for organic beauty",
    logo: "/assets/logos/logo-7.png",
  },
  {
    name: "WEPE",
    description: "API integration and SaaS dashboard platform",
    logo: "/assets/logos/logo-8.png",
  },
];

const TrustedSection = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const positionRef = useRef(0);
  const setWidthRef = useRef(0);
  
  // Consistent gap classes for all containers
  const gapClasses = "gap-0 sm:gap-2 md:gap-4 lg:gap-9";

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Wait for layout to calculate width properly
    const initAnimation = () => {
      const firstSet = marquee.firstElementChild as HTMLElement;
      if (!firstSet || firstSet.offsetWidth === 0) {
        requestAnimationFrame(initAnimation);
        return;
      }

      // Calculate the exact width of one set including all items and internal gaps
      // This ensures perfect alignment when looping
      const firstSetWidth = firstSet.offsetWidth;
      
      // Get gap from computed style (handles responsive gaps)
      const computedStyle = window.getComputedStyle(firstSet);
      const gapValue = computedStyle.gap || '0px';
      const gap = parseFloat(gapValue) || 0;
      
      // Total width = set width (which already includes internal gaps) + gap between sets
      // This ensures seamless transition when the duplicate set takes over
      setWidthRef.current = firstSetWidth + gap;

      // Animation duration: 18 seconds for one set width (slower speed)
      const duration = 18000; // 18 seconds in milliseconds
      let startTime = performance.now();
      let lastPosition = 0;

      const animate = (currentTime: number) => {
        if (!marquee) return;

        let elapsed = currentTime - startTime;
        
        // Use modulo to create seamless loop without visible reset
        const progress = (elapsed % duration) / duration;
        
        // Move by exactly one set width, seamlessly looping
        positionRef.current = -progress * setWidthRef.current;

        // Only update if position actually changed (prevents unnecessary repaints)
        if (Math.abs(positionRef.current - lastPosition) > 0.1) {
          marquee.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
          lastPosition = positionRef.current;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initAnimation();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-sm tracking-widest font-medium text-neutral-500 dark:text-neutral-400 uppercase">
          TRUSTED BY INDUSTRY LEADERS
        </h2>
      </div>

      <div className="mt-10 overflow-hidden">
        <div className="relative">
          {/* Marquee track */}
          <div 
            ref={marqueeRef}
            className={`flex ${gapClasses} will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]`}
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {/* First set */}
            <div className={`flex ${gapClasses} shrink-0`}>
              {clients.map((client, index) => (
                <article
                  key={`set1-${index}`}
                  className="shrink-0 text-center"
                >
                  {/* Shadow wrapper */}
                  <div className="mx-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] lg:w-[260px] lg:h-[260px]">
                    {/* White square - image only */}
                    <div 
                      className="bg-white dark:bg-white overflow-hidden rounded-[24px] w-full h-full flex items-center justify-center"
                      style={{
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        WebkitBoxShadow: 'none',
                        MozBoxShadow: 'none'
                      }}
                    >
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="block w-full h-full object-cover"
                        style={{
                          border: 'none',
                          outline: 'none',
                          boxShadow: 'none',
                          WebkitBoxShadow: 'none',
                          MozBoxShadow: 'none'
                        }}
                      />
                    </div>
                  </div>
                  {/* Text below square */}
                  <h4 className="mt-3 text-base font-medium text-[#1F1F1F] dark:text-[#EDEDED]">
                    {client.name}
                  </h4>
                  <p className="text-sm text-[#6F6F6F] dark:text-[#A9A9A9] leading-5">
                    {client.description}
                  </p>
                </article>
              ))}
            </div>

            {/* Duplicate set for seamless loop */}
            <div aria-hidden="true" className={`flex ${gapClasses} shrink-0`}>
              {clients.map((client, index) => (
                <article
                  key={`set2-${index}`}
                  className="shrink-0 text-center"
                >
                  {/* Shadow wrapper */}
                  <div className="mx-auto filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] lg:w-[260px] lg:h-[260px]">
                    {/* White square - image only */}
                    <div 
                      className="bg-white dark:bg-white overflow-hidden rounded-[24px] w-full h-full flex items-center justify-center"
                      style={{
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        WebkitBoxShadow: 'none',
                        MozBoxShadow: 'none'
                      }}
                    >
                      <img
                        src={client.logo}
                        alt=""
                        aria-hidden="true"
                        className="block w-full h-full object-cover"
                        style={{
                          border: 'none',
                          outline: 'none',
                          boxShadow: 'none',
                          WebkitBoxShadow: 'none',
                          MozBoxShadow: 'none'
                        }}
                      />
                    </div>
                  </div>
                  {/* Text below square */}
                  <h4 className="mt-3 text-base font-medium text-[#1F1F1F] dark:text-[#EDEDED]">
                    {client.name}
                  </h4>
                  <p className="text-sm text-[#6F6F6F] dark:text-[#A9A9A9] leading-5">
                    {client.description}
                  </p>
                </article>
              ))}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};

export default TrustedSection;
