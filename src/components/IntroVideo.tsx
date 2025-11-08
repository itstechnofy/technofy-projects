import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { Button } from "./ui/button";

const IntroVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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

    // Delay to ensure smooth page load
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);

    const autoplayTimer = setTimeout(() => {
      autoplayTriggered.current = true;
      setIsPlaying(true);
    }, 1500);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(autoplayTimer);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="intro-video" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-20"
    >
      {/* Cinematic container */}
      <div className="w-full max-w-[95vw] mx-auto px-4">
        <div 
          className={`relative w-full transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ aspectRatio: '16/9' }}
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
              
              {/* Play button - centered and cinematic */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 font-semibold px-8 py-8 rounded-full shadow-2xl hover:scale-110 transition-all duration-500 flex items-center gap-4 group-hover:border-white/50"
                >
                  <Play className="w-6 h-6" fill="currentColor" />
                  <span className="text-xl tracking-wide">See Showreel</span>
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
