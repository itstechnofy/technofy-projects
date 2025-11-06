import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="container mx-auto text-center max-w-5xl">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          Building Digital Experiences{" "}
          <span className="gradient-text text-glow">That Matter</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          We craft innovative web solutions that transform businesses and delight users. 
          From concept to launch, we're your trusted technology partner.
        </p>
        
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Start Your Project
        </Button>
      </div>
    </section>
  );
};

export default Hero;
