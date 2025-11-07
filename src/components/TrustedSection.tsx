const clients = [
  {
    name: "TechCorp Solutions",
    description: "Enterprise software development",
    logo: "https://via.placeholder.com/120x120/625CC8/FFFFFF?text=Tech",
  },
  {
    name: "InnovateX Labs",
    description: "AI-powered analytics",
    logo: "https://via.placeholder.com/120x120/F74F8C/FFFFFF?text=Innovate",
  },
  {
    name: "FutureWorks Digital",
    description: "E-commerce transformation",
    logo: "https://via.placeholder.com/120x120/625CC8/FFFFFF?text=Future",
  },
  {
    name: "DigitalHub Connect",
    description: "Cloud infrastructure",
    logo: "https://via.placeholder.com/120x120/F74F8C/FFFFFF?text=Digital",
  },
  {
    name: "CloudBase Systems",
    description: "Scalable applications",
    logo: "https://via.placeholder.com/120x120/625CC8/FFFFFF?text=Cloud",
  },
  {
    name: "DataSync Pro",
    description: "Real-time integration",
    logo: "https://via.placeholder.com/120x120/F74F8C/FFFFFF?text=Data",
  },
  {
    name: "NexGen Platform",
    description: "Mobile-first solutions",
    logo: "https://via.placeholder.com/120x120/625CC8/FFFFFF?text=NexGen",
  },
  {
    name: "SmartFlow Tech",
    description: "Workflow automation",
    logo: "https://via.placeholder.com/120x120/F74F8C/FFFFFF?text=Smart",
  },
];

const TrustedSection = () => {
  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-sm tracking-widest font-medium text-neutral-500 dark:text-neutral-400 uppercase">
          TRUSTED BY INDUSTRY LEADERS
        </h2>
      </div>

      <div className="mt-10 overflow-hidden">
        <div 
          className="relative"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
          }}
        >
          {/* Marquee track */}
          <div className="flex gap-8 animate-marquee will-change-transform">
            {/* First set */}
            <div className="flex gap-8">
              {clients.map((client, index) => (
                <article
                  key={`set1-${index}`}
                  className="shrink-0 w-[240px] sm:w-[280px] lg:w-[320px] text-center"
                >
                  {/* White square - image only */}
                  <div className="bg-white rounded-[24px] ring-1 ring-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 aspect-square flex items-center justify-center">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Text below square */}
                  <h3 className="mt-4 text-lg font-medium text-[#1F1F1F]">
                    {client.name}
                  </h3>
                  <p className="text-base text-[#2C2C2C]">
                    {client.description}
                  </p>
                </article>
              ))}
            </div>

            {/* Duplicate set for seamless loop */}
            <div aria-hidden="true" className="flex gap-8">
              {clients.map((client, index) => (
                <article
                  key={`set2-${index}`}
                  className="shrink-0 w-[240px] sm:w-[280px] lg:w-[320px] text-center"
                >
                  <div className="bg-white rounded-[24px] ring-1 ring-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-6 aspect-square flex items-center justify-center">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-[#1F1F1F]">
                    {client.name}
                  </h3>
                  <p className="text-base text-[#2C2C2C]">
                    {client.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation-play-state: paused;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustedSection;
