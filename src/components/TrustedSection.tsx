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

      <div className="relative mt-10">
        {/* Edge fade gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent z-10"></div>

        {/* Marquee container - continuous scroll */}
        <div className="flex gap-6 animate-marquee will-change-transform">
          {/* First set */}
          {clients.map((client, index) => (
            <article
              key={`set1-${index}`}
              className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] shrink-0 rounded-2xl bg-white dark:bg-white shadow-sm p-6 flex flex-col items-center justify-center text-center"
            >
              <img
                src={client.logo}
                className="w-24 h-24 object-contain"
                alt={client.name}
              />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                {client.name}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed line-clamp-2">
                {client.description}
              </p>
            </article>
          ))}

          {/* Duplicate set for seamless loop */}
          <div aria-hidden="true" className="flex gap-6">
            {clients.map((client, index) => (
              <article
                key={`set2-${index}`}
                className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] shrink-0 rounded-2xl bg-white dark:bg-white shadow-sm p-6 flex flex-col items-center justify-center text-center"
              >
                <img
                  src={client.logo}
                  className="w-24 h-24 object-contain"
                  alt={client.name}
                />
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  {client.name}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed line-clamp-2">
                  {client.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 18s linear infinite;
        }

        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 24s;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustedSection;
