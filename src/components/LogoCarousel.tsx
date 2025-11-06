const logos = [
  { name: "TechCorp", color: "625CC8" },
  { name: "InnovateX", color: "F74F8C" },
  { name: "FutureWorks", color: "A991FF" },
  { name: "DigitalHub", color: "625CC8" },
  { name: "CloudBase", color: "F74F8C" },
  { name: "DataSync", color: "A991FF" },
];

const LogoCarousel = () => {
  return (
    <section className="py-20 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-12">
          Trusted by Industry Leaders
        </h2>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll w-max">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 mx-8 opacity-60 hover:opacity-100 transition-opacity"
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
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default LogoCarousel;
