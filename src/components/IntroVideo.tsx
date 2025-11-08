import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { Button } from "./ui/button";

const IntroVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState(0.85);
  const sectionRef = useRef<HTMLElement>(null);
  const autoplayTriggered = useRef(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Smooth autoplay on desktop after initial load
  useEffect(() => {
    if (autoplayTriggered.current) return;
    
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    const autoplayTimer = setTimeout(() => {
      autoplayTriggered.current = true;
      setIsPlaying(true);
    }, 1500);

    return () => {
      clearTimeout(autoplayTimer);
    };
  }, []);

  // Scroll-based expansion effect (desktop only)
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return; // No scroll effect on mobile

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const sectionCenter = sectionTop + sectionHeight / 2;
      const viewportCenter = windowHeight / 2;

      // Calculate how close section is to viewport center
      const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
      const maxDistance = windowHeight;
      
      // When section is in view
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Scale from 0.85 to 1.0 based on proximity to center
        const centeredness = Math.max(0, 1 - distanceFromCenter / maxDistance);
        const newScale = 0.85 + (centeredness * 0.15); // 0.85 to 1.0
        setScale(newScale);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="intro-video" 
      className="py-8 md:py-20 my-8 md:my-16 overflow-hidden"
    >
      {/* Mobile: compact container, Desktop: cinematic full-width */}
      <div className="max-w-4xl md:max-w-[95vw] mx-auto px-4 md:px-6">
        <div 
          className="relative aspect-video rounded-xl md:rounded-3xl shadow-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-transform duration-700 ease-out"
          style={{ 
            transform: window.innerWidth >= 768 ? `scale(${scale})` : 'scale(1)',
          }}
        >
          {/* Cinematic overlay and poster */}
          {!isPlaying && (
            <div className="absolute inset-0 group">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2070&q=80"
                alt="Video showreel preview"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Cinematic vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
              
              {/* Play button - responsive sizing */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 font-semibold px-6 py-6 md:px-8 md:py-8 rounded-full shadow-2xl hover:scale-110 transition-all duration-500 flex items-center gap-3 md:gap-4 group-hover:border-white/50"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                  <span className="text-lg md:text-xl tracking-wide">See Showreel</span>
                </Button>
              </div>
            </div>
          )}
          
          {/* Video player - full cinematic experience */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1"
                title="Showreel video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IntroVideo;
