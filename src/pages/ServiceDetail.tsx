import { useParams, Link, useNavigate } from "react-router-dom";
import { services } from "@/data/services";
import { workProjects } from "@/data/work";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const relatedProjects = workProjects.filter((p) =>
    service.relatedWork.includes(p.slug)
  );

  return (
    <div className="min-h-screen pb-28 md:pb-32">
      <TopNavbar />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/#services")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Services
        </Button>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">{service.title}</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          {service.description.map((para, i) => (
            <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Challenges We Solve</h2>
          <ul className="space-y-3">
            {service.challenges.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Results & Outcomes</h2>
          <ul className="space-y-3">
            {service.outcomes.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent mt-1">✓</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Let's discuss how we can help transform your business with {service.title.toLowerCase()}.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/#contact")}
          >
            Start Your Project
          </Button>
        </section>

        {relatedProjects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  to={`/work/${project.slug}`}
                  className="group"
                >
                  <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all">
                    <img
                      src={project.cover}
                      alt={project.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
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
          </section>
        )}
      </div>

      <BottomNav />
      <Footer />
    </div>
  );
};

export default ServiceDetail;
