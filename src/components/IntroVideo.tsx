import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

// Change this to your Vimeo video ID
const VIMEO_VIDEO_ID = "76979871"; // Example video - replace with your video ID

interface IntroVideoProps {
  onVideoFocus?: (isFocused: boolean) => void;
}

const IntroVideo = ({ onVideoFocus }: IntroVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scale, setScale] = useState(0.85);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const autoplayTriggered = useRef(false);
  const playerReady = useRef(false);
  const hasUnmuted = useRef(false);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const sendVimeoCommand = (method: string, value?: any) => {
    if (!videoRef.current) return;
    
    const data = value !== undefined 
      ? { method, value }
      : { method };
    
    videoRef.current.contentWindow?.postMessage(JSON.stringify(data), '*');
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPaused) {
      sendVimeoCommand("play");
      setIsPaused(false);
    } else {
      sendVimeoCommand("pause");
      setIsPaused(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isMuted) {
      sendVimeoCommand("setVolume", 1);
      setIsMuted(false);
    } else {
      sendVimeoCommand("setVolume", 0);
      setIsMuted(true);
    }
  };

  // Handle Vimeo player messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('vimeo.com')) return;
      
      try {
        const data = JSON.parse(event.data);
        
        // Player ready
        if (data.event === "ready") {
          playerReady.current = true;
          
          // Enable event listening
          sendVimeoCommand("addEventListener", "play");
          sendVimeoCommand("addEventListener", "pause");
          sendVimeoCommand("addEventListener", "ended");
        }
        
        // Track play state and unmute on desktop after video starts
        if (data.event === "play") {
          setIsPaused(false);
          
          // Unmute on desktop only after first play to prevent double sound
          if (!hasUnmuted.current) {
            const isDesktop = window.innerWidth >= 768;
            if (isDesktop) {
              setTimeout(() => {
                sendVimeoCommand("setVolume", 1);
                setIsMuted(false);
                hasUnmuted.current = true;
              }, 200);
            }
          }
        }
        
        if (data.event === "pause") {
          setIsPaused(true);
        }
        
        // Video ended - reset to poster
        if (data.event === "ended") {
          setIsPlaying(false);
          setIsPaused(false);
          playerReady.current = false;
          hasUnmuted.current = false;
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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

  // Scroll-based expansion effect
  useEffect(() => {
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
      const maxDistance = windowHeight / 2;
      
      const isDesktop = window.innerWidth >= 768;
      
      // When section is in view
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        const centeredness = Math.max(0, 1 - distanceFromCenter / maxDistance);
        
        if (isDesktop) {
          // Desktop: dramatic cinematic effect (0.85 to 1.2)
          const newScale = 0.85 + (centeredness * 0.35);
          setScale(newScale);
          
          // Hide header when video is highly focused (centeredness > 0.6)
          onVideoFocus?.(centeredness > 0.6);
        } else {
          // Mobile: very subtle expansion (0.98 to 1.02)
          const newScale = 0.98 + (centeredness * 0.04);
          setScale(newScale);
        }
      } else {
        // Reset to initial scale when out of view
        setScale(isDesktop ? 0.85 : 0.98);
        onVideoFocus?.(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [onVideoFocus]);

  return (
    <section 
      ref={sectionRef} 
      id="intro-video" 
      className="py-8 md:py-20 my-8 md:my-16 overflow-hidden"
    >
      {/* Mobile: compact container, Desktop: cinematic full-width */}
      <div className="max-w-4xl md:max-w-[95vw] mx-auto px-4 md:px-6">
        <div 
          className="relative aspect-video rounded-xl md:rounded-3xl shadow-md md:shadow-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-transform duration-700 ease-out"
          style={{ 
            transform: `scale(${scale})`,
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
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-black border-2 border-white/30 font-semibold px-6 py-6 md:px-8 md:py-8 rounded-full shadow-2xl hover:scale-110 transition-all duration-500 flex items-center gap-3 md:gap-4 group-hover:border-white/50"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                  <span className="text-lg md:text-xl tracking-wide">See Showreel</span>
                </Button>
              </div>
            </div>
          )}
          
          {/* Video player - Vimeo for reliable API control */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black">
              <iframe
                ref={videoRef}
                className="absolute inset-0 h-full w-full"
                src={`https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?autoplay=1&loop=1&autopause=0&muted=1&controls=0&title=0&byline=0&portrait=0&sidedock=0&background=0&api=1`}
                title="Showreel video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
              
              {/* Overlay to prevent direct video clicks on desktop */}
              <div className="absolute inset-0 z-10 md:block hidden pointer-events-auto" onClick={(e) => e.preventDefault()} />

              {/* Custom controls - bottom right with proper spacing and click handling */}
              <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-30 hidden md:flex items-center gap-3 pointer-events-auto">
                <button
                  onClick={togglePlayPause}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 cursor-pointer"
                  aria-label={isPaused ? "Play video" : "Pause video"}
                  type="button"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                  ) : (
                    <Pause className="w-5 h-5 text-black" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 cursor-pointer"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  type="button"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-black" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IntroVideo;
