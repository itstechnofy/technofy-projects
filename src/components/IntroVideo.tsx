import { useState } from "react";
import { Play } from "lucide-react";

const IntroVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section id="intro-video" className="py-2">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="relative aspect-video rounded-2xl shadow-md overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          {/* Poster */}
          {!isPlaying && (
            <>
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2070&q=80"
                alt="Intro video"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Play button */}
              <button
                onClick={handlePlay}
                className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white/95 dark:bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                aria-label="Play video"
              >
                <Play className="w-6 h-6 text-neutral-900 ml-1" fill="currentColor" />
              </button>
            </>
          )}
          {/* Video player */}
          {isPlaying && (
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Intro video"
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
