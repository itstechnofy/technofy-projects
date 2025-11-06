import { useInView } from "react-intersection-observer";

const WeBelieveSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="we-believe" className="py-8 sm:py-12 md:py-20 px-4 sm:px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl text-center" ref={ref}>
        <div 
          className={`transition-all duration-1000 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed text-foreground">
            <span className="font-semibold">We believe that great digital experiences</span>
            <br />
            <br />
            are built on a foundation of innovation,
            <br />
            collaboration, and unwavering commitment
            <br />
            to excellence in every pixel and line of code.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeBelieveSection;
