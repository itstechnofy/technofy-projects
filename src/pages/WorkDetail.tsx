import { useParams, Link, useNavigate } from "react-router-dom";
import { workProjects } from "@/data/work";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const WorkDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = workProjects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const currentIndex = workProjects.findIndex((p) => p.slug === slug);
  const prevProject = workProjects[currentIndex - 1];
  const nextProject = workProjects[currentIndex + 1];

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen pb-28 md:pb-32">
      <TopNavbar />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Projects
        </Button>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <img
          src={project.cover}
          alt={project.title}
          className="w-full aspect-video object-cover rounded-lg mb-12 shadow-lg"
        />

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          {project.description.map((para, i) => (
            <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Challenge</h2>
          <ul className="space-y-3">
            {project.challenge.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <ul className="space-y-3">
            {project.results.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-muted-foreground">{renderBold(item)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`${project.title} gallery ${i + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
          {prevProject ? (
            <Link
              to={`/work/${prevProject.slug}`}
              className="flex-1 group"
            >
              <div className="border border-border rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <ChevronLeft className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Previous Project</span>
                </div>
                <div className="flex gap-3">
                  <img
                    src={prevProject.cover}
                    alt={prevProject.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {prevProject.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextProject && (
            <Link
              to={`/work/${nextProject.slug}`}
              className="flex-1 group"
            >
              <div className="border border-border rounded-lg p-4 hover:shadow-lg transition-all">
                <div className="flex items-center justify-end gap-3 mb-2">
                  <span className="text-sm text-muted-foreground">Next Project</span>
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-3">
                  <div className="text-right flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {nextProject.title}
                    </h3>
                  </div>
                  <img
                    src={nextProject.cover}
                    alt={nextProject.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      <BottomNav />
      <Footer />
    </div>
  );
};

export default WorkDetail;
