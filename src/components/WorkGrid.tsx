import { Link } from "react-router-dom";
import { workProjects } from "@/data/work";

const WorkGrid = () => {
  return (
    <section id="work" className="py-6 md:py-16 px-4 sm:px-5">
      <div className="container mx-auto max-w-screen-sm md:max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-8 text-center">Our Work</h2>

        <div className="max-w-[680px] md:max-w-none mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {workProjects.map((project) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className="group block"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
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
