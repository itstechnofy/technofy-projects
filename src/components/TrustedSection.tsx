import { Play } from "lucide-react";
import { useRef, useState } from "react";

const logos = [
  { name: "TechCorp", color: "625CC8" },
  { name: "InnovateX", color: "F74F8C" },
  { name: "FutureWorks", color: "625CC8" },
  { name: "DigitalHub", color: "F74F8C" },
  { name: "CloudBase", color: "625CC8" },
  { name: "DataSync", color: "F74F8C" },
];

const TrustedSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="py-16 md:py-20 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-12">
          Trusted by Industry Leaders
        </h2>

        <div className="relative overflow-hidden mb-12">
          <div
            className="flex animate-scroll w-max hover:pause"
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
            onFocus={(e) => (e.currentTarget.style.animationPlayState = "paused")}
            onBlur={(e) => (e.currentTarget.style.animationPlayState = "running")}
            role="list"
            aria-label="Trusted brands"
          >
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 opacity-60 hover:opacity-100 transition-opacity"
                role="listitem"
              >
                <img
                  src={`https://via.placeholder.com/150x60/${logo.color}/FFFFFF?text=${logo.name}`}
                  alt={logo.name}
                  className="h-12 w-auto"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg group">
            <video
              ref={videoRef}
              className="w-full h-full object-cover cursor-pointer"
              poster="/trusted/poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              onClick={handleVideoClick}
              onError={(e) => {
                const target = e.currentTarget;
                target.poster = "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=675&fit=crop";
              }}
            >
              <source src="/trusted/trailer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TrustedSection;
