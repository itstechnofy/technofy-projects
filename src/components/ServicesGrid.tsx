import { Link } from "react-router-dom";
import { services } from "@/data/services";
import { Globe, Smartphone, Palette, Target, Cloud, Code } from "lucide-react";

const iconMap: Record<string, any> = {
  Globe,
  Smartphone,
  Palette,
  Target,
  Cloud,
  Code,
};

const ServicesGrid = () => {
  return (
    <section id="services" className="py-8 sm:py-12 md:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-10 md:mb-12 text-center">Our Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-lg p-5 sm:p-6 md:p-8 transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
                    {Icon && <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
