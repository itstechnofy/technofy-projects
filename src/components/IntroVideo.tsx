import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const IntroVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scale, setScale] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasAutoplayedRef = useRef(false);
  const isMobile = useIsMobile();

  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Autoplay on desktop only - run once on mount
  useEffect(() => {
    // Skip if mobile or already attempted autoplay
    if (isMobile || hasAutoplayedRef.current) return;
    
    // Mark as attempted immediately to prevent double execution
    hasAutoplayedRef.current = true;
    
    // Delay before starting
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Calculate scale based on scroll position
      // Video grows as it moves towards center of viewport
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        // Calculate how centered the section is (0 to 1, where 1 is perfectly centered)
        const centerPosition = windowHeight / 2 - (sectionTop + sectionHeight / 2);
        const maxDistance = windowHeight;
        const centeredness = Math.max(0, 1 - Math.abs(centerPosition) / maxDistance);
        
        // Scale from 0.85 to 1.15 based on scroll position
        const newScale = 0.85 + (centeredness * 0.3);
        setScale(newScale);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="intro-video" className="py-8 md:py-16 my-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div 
          className="relative aspect-video rounded-2xl shadow-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
        >
          {/* Poster */}
          {!isPlaying && (
            <>
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2070&q=80"
                alt="Video showreel preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Overlay gradient for better button visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* See Showreel button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-white/95 hover:bg-white text-neutral-900 font-semibold px-6 py-6 rounded-full shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                  <span className="text-lg">See Showreel</span>
                </Button>
              </div>
            </>
          )}
          {/* Video player */}
          {isPlaying && (
            <iframe
              ref={iframeRef}
              key="video-iframe"
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&enablejsapi=1"
              title="Showreel video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default IntroVideo;
