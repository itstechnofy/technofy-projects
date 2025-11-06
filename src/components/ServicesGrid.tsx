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
    <section id="services" className="py-16 md:py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group block"
              >
                <div className="bg-card border border-border rounded-lg p-6 transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    {Icon && <Icon className="w-6 h-6 text-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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
