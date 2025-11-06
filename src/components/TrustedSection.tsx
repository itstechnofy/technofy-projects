const clients = [
  {
    name: "TechCorp Solutions",
    description: "Enterprise software development",
    logo: "https://via.placeholder.com/200x80/625CC8/FFFFFF?text=TechCorp",
  },
  {
    name: "InnovateX Labs",
    description: "AI-powered analytics platform",
    logo: "https://via.placeholder.com/200x80/F74F8C/FFFFFF?text=InnovateX",
  },
  {
    name: "FutureWorks Digital",
    description: "E-commerce transformation",
    logo: "https://via.placeholder.com/200x80/625CC8/FFFFFF?text=FutureWorks",
  },
  {
    name: "DigitalHub Connect",
    description: "Cloud infrastructure solutions",
    logo: "https://via.placeholder.com/200x80/F74F8C/FFFFFF?text=DigitalHub",
  },
  {
    name: "CloudBase Systems",
    description: "Scalable web applications",
    logo: "https://via.placeholder.com/200x80/625CC8/FFFFFF?text=CloudBase",
  },
  {
    name: "DataSync Pro",
    description: "Real-time data integration",
    logo: "https://via.placeholder.com/200x80/F74F8C/FFFFFF?text=DataSync",
  },
  {
    name: "NexGen Platform",
    description: "Mobile-first solutions",
    logo: "https://via.placeholder.com/200x80/625CC8/FFFFFF?text=NexGen",
  },
  {
    name: "SmartFlow Tech",
    description: "Workflow automation tools",
    logo: "https://via.placeholder.com/200x80/F74F8C/FFFFFF?text=SmartFlow",
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10"></div>

        {/* Marquee container */}
        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] will-change-transform">
          {/* First set */}
          {clients.map((client, index) => (
            <article
              key={`set1-${index}`}
              className="w-[270px] shrink-0 rounded-2xl bg-card shadow-sm border border-border p-6 text-center"
            >
              <div className="rounded-2xl bg-muted/50 h-36 flex items-center justify-center p-4">
                <img
                  src={client.logo}
                  className="max-h-20 w-auto object-contain"
                  alt={client.name}
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {client.name}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {client.description}
              </p>
            </article>
          ))}

          {/* Duplicate set for seamless loop */}
          <div aria-hidden="true" className="flex gap-6">
            {clients.map((client, index) => (
              <article
                key={`set2-${index}`}
                className="w-[270px] shrink-0 rounded-2xl bg-card shadow-sm border border-border p-6 text-center"
              >
                <div className="rounded-2xl bg-muted/50 h-36 flex items-center justify-center p-4">
                  <img
                    src={client.logo}
                    className="max-h-20 w-auto object-contain"
                    alt={client.name}
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {client.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
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
          animation: marquee 22s linear infinite;
        }

        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 28s;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustedSection;
