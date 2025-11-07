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
                  className="shrink-0 text-center"
                >
                  {/* White square - image only */}
                  <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] lg:w-[260px] lg:h-[260px] flex items-center justify-center mx-auto p-6">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {/* Text below square */}
                  <h3 className="mt-3 text-base font-medium text-[#1F1F1F]">
                    {client.name}
                  </h3>
                  <p className="text-sm text-[#8A8A8A] leading-5">
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
                  className="shrink-0 text-center"
                >
                  <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] w-[200px] h-[200px] sm:w-[230px] sm:h-[230px] lg:w-[260px] lg:h-[260px] flex items-center justify-center mx-auto p-6">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-medium text-[#1F1F1F]">
                    {client.name}
                  </h3>
                  <p className="text-sm text-[#8A8A8A] leading-5">
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
