const services = [
  {
    title: "Web Development",
    description: "Custom web applications built with cutting-edge technologies. Scalable, performant, and maintainable solutions tailored to your needs.",
  },
  {
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that users love. We combine aesthetics with functionality to create memorable experiences.",
  },
  {
    title: "Digital Strategy",
    description: "Comprehensive digital transformation guidance. From planning to execution, we help you navigate the digital landscape.",
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Our Services</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-card border border-border card-glow transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
