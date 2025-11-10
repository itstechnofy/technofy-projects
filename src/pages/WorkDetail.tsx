import { useParams, Link, useNavigate } from "react-router-dom";
import { workProjects } from "@/data/work";
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

// VideoPlayer component - simplified to ensure native controls work
const VideoPlayer = ({
  src,
  poster,
  alt,
  index,
  onPlay,
  registerRef,
}: {
  src: string;
  poster: string;
  alt: string;
  index: number;
  onPlay: () => void;
  registerRef: (el: HTMLVideoElement | null) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start as false - show video immediately

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error state when src changes
    setHasError(false);
    setIsLoading(false); // Don't show loading initially - let poster show

    // Ensure video is unmuted
    video.muted = false;
    video.volume = 1;
    video.controls = true;

    // Error handler - prevent errors from breaking the page
    const handleError = (e: Event) => {
      console.warn('Video loading error:', e);
      setHasError(true);
      setIsLoading(false);
      // Don't let the error propagate
      e.preventDefault();
      e.stopPropagation();
    };

    // Success handlers - video is ready
    const handleLoadedData = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
    };

    // Show loading only when video actually starts loading
    const handleLoadStart = () => {
      setIsLoading(true);
    };

    // Aggressive fix: continuously ensure controls are accessible
    const ensureControlsWork = () => {
      if (hasError) return; // Don't try to fix controls if video has error
      
      // Remove any blocking styles
      video.style.pointerEvents = 'auto';
      video.style.touchAction = 'manipulation';
      video.style.cursor = 'default';
      
      // Fix all parent elements
      let parent: HTMLElement | null = video.parentElement;
      while (parent && parent !== document.body) {
        const computed = window.getComputedStyle(parent);
        if (computed.pointerEvents === 'none') {
          parent.style.setProperty('pointer-events', 'auto', 'important');
        }
        if (computed.touchAction === 'none') {
          parent.style.setProperty('touch-action', 'manipulation', 'important');
        }
        parent = parent.parentElement;
      }

      // Try to access and fix shadow DOM controls (for webkit browsers)
      try {
        const shadowRoot = (video as any).webkitShadowRoot || (video as any).shadowRoot;
        if (shadowRoot) {
          const allInShadow = shadowRoot.querySelectorAll('*');
          allInShadow.forEach((el: any) => {
            if (el.style) {
              el.style.pointerEvents = 'auto';
              el.style.cursor = 'pointer';
            }
          });
        }
      } catch (e) {
        // Shadow DOM not accessible
      }
    };

    // Run immediately
    ensureControlsWork();

    // Add error handlers
    video.addEventListener('error', handleError, { passive: true });
    video.addEventListener('loadeddata', handleLoadedData, { passive: true });
    video.addEventListener('canplay', handleCanPlay, { passive: true });
    video.addEventListener('loadstart', handleLoadStart, { passive: true });

    // Run on all video events
    const events = ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'play', 'playing'];
    events.forEach(event => {
      video.addEventListener(event, ensureControlsWork, { passive: true });
    });

    // Also run periodically to catch any dynamic changes
    const interval = setInterval(ensureControlsWork, 500);

    // Register the ref
    registerRef(video);

    return () => {
      clearInterval(interval);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
      events.forEach(event => {
        video.removeEventListener(event, ensureControlsWork);
      });
    };
  }, [registerRef, hasError, src]);

  const handlePlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    video.muted = false;
    video.volume = 1;
    onPlay();
  };

  // Show fallback if video fails to load
  if (hasError) {
    return (
      <div className="w-full h-64 rounded-lg shadow-md bg-muted flex flex-col items-center justify-center gap-2 p-4">
        <AlertCircle className="w-8 h-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          Video unavailable
        </p>
        {poster && (
          <img
            src={poster}
            alt={alt}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-lg shadow-md overflow-hidden bg-muted">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        controlsList="nodownload"
        className="w-full h-64 rounded-lg shadow-md object-cover"
        aria-label={alt}
        playsInline
        preload="metadata"
        muted={false}
        onPlay={handlePlay}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          video.muted = false;
          video.volume = 1;
          setIsLoading(false);
        }}
        onCanPlay={(e) => {
          const video = e.currentTarget;
          video.muted = false;
          video.volume = 1;
          setIsLoading(false);
        }}
        onError={(e) => {
          // Additional error handling at React level
          setHasError(true);
          setIsLoading(false);
          e.preventDefault();
        }}
        onLoadStart={() => {
          setIsLoading(true);
        }}
      />
      {isLoading && (
        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <div className="bg-background/90 px-3 py-1.5 rounded-lg shadow-lg border border-border">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent"></div>
              <span className="text-xs text-foreground">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WorkDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = workProjects.find((p) => p.slug === slug);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    // Safely pause and reset all videos when slug changes
    try {
      videoRefs.current.forEach((video) => {
        if (video) {
          try {
            video.pause();
            video.currentTime = 0;
          } catch (error) {
            // Silently handle video errors to prevent navigation issues
            console.warn('Error resetting video:', error);
          }
        }
      });
    } catch (error) {
      // Prevent any video-related errors from breaking navigation
      console.warn('Error in video cleanup:', error);
    }
  }, [slug]);

  const registerVideoRef = (index: number) => (element: HTMLVideoElement | null) => {
    if (element) {
      videoRefs.current[index] = element;
    } else {
      videoRefs.current.splice(index, 1);
    }
  };

  const handleVideoPlay = (currentIndex: number) => () => {
    try {
      videoRefs.current.forEach((video, index) => {
        if (video && index !== currentIndex) {
          try {
            video.pause();
          } catch (error) {
            // Silently handle video errors
            console.warn('Error pausing video:', error);
          }
        }
      });
    } catch (error) {
      // Prevent video errors from breaking the page
      console.warn('Error in video play handler:', error);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const currentIndex = workProjects.findIndex((p) => p.slug === slug);
  const prevProject = workProjects[currentIndex - 1];
  const nextProject = workProjects[currentIndex + 1];

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen pb-28 md:pb-32">
      <TopNavbar />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Projects
        </Button>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <img
          src={project.cover}
          alt={project.title}
          className="w-full aspect-video object-cover rounded-lg mb-12 shadow-lg"
        />

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          {project.description.map((para, i) => (
            <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Challenge</h2>
          <ul className="space-y-3">
            {project.challenge.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <ul className="space-y-3">
            {project.results.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-muted-foreground">{renderBold(item)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((item, i) =>
              item.type === "image" ? (
                <img
                  key={i}
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              ) : (
                <VideoPlayer
                  key={i}
                  src={item.src}
                  poster={item.poster}
                  alt={item.alt}
                  index={i}
                  onPlay={handleVideoPlay(i)}
                  registerRef={registerVideoRef(i)}
                />
              )
            )}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
          {prevProject ? (
            <Link
              to={`/work/${prevProject.slug}`}
              className="flex-1 group"
            >
              <div className="border border-border rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <ChevronLeft className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Previous Project</span>
                </div>
                <div className="flex gap-3">
                  <img
                    src={prevProject.cover}
                    alt={prevProject.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {prevProject.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextProject && (
            <Link
              to={`/work/${nextProject.slug}`}
              className="flex-1 group"
            >
              <div className="border border-border rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-end gap-3 mb-2">
                  <span className="text-sm text-muted-foreground">Next Project</span>
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-3">
                  <div className="text-right flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {nextProject.title}
                    </h3>
                  </div>
                  <img
                    src={nextProject.cover}
                    alt={nextProject.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      <BottomNav />
      <Footer />
    </div>
  );
};

export default WorkDetail;
