import { Link } from "react-router-dom";
import { workProjects } from "@/data/work";

const WorkGrid = () => {
  return (
    <section id="work" className="py-8 sm:py-12 md:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-10 md:mb-12 text-center">Our Work</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {workProjects.map((project) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className="group block"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkGrid;
