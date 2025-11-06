const projects = [
  {
    title: "E-Commerce Revolution",
    description: "Transforming online retail with seamless user experience",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&q=80",
    slug: "e-commerce-revolution"
  },
  {
    title: "FinTech Dashboard",
    description: "Real-time analytics for modern financial services",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    slug: "fintech-dashboard"
  },
  {
    title: "Healthcare Portal",
    description: "Connecting patients and providers seamlessly",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    slug: "healthcare-portal"
  },
  {
    title: "SaaS Platform",
    description: "Scalable solutions for modern businesses",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    slug: "saas-platform"
  },
  {
    title: "Mobile Learning App",
    description: "Education at your fingertips",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    slug: "mobile-learning"
  },
  {
    title: "Restaurant POS System",
    description: "Modern point-of-sale for hospitality",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    slug: "restaurant-pos"
  }
];

const WorkGrid = () => {
  return (
    <section id="work" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Our Work</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={`/work/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border card-glow transition-all duration-300 hover:scale-105"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-glow transition-all">
                  {project.title}
                </h3>
                <p className="text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkGrid;
