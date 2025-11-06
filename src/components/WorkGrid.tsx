import { Link } from "react-router-dom";
import { workProjects } from "@/data/work";

const WorkGrid = () => {
  return (
    <section id="work" className="py-16 md:py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Work</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workProjects.map((project) => (
            <Link
              key={project.slug}
              to={`/work/${project.slug}`}
              className="group block"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
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
