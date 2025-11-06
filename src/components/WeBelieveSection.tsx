import { useInView } from "react-intersection-observer";

const WeBelieveSection = () => {
  const { ref: line1Ref, inView: line1InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: line2Ref, inView: line2InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: line3Ref, inView: line3InView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="we-believe" className="py-16 md:py-20 px-6">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          We believe that great digital experiences
        </h2>
        
        <div className="space-y-4 text-xl md:text-2xl leading-relaxed">
          <p
            ref={line1Ref}
            className={`transition-all duration-700 ${
              line1InView
                ? "text-foreground translate-y-0 opacity-100"
                : "text-neutral-400 dark:text-neutral-600 translate-y-4 opacity-60"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            are built on a foundation of innovation,
          </p>
          <p
            ref={line2Ref}
            className={`transition-all duration-700 ${
              line2InView
                ? "text-foreground translate-y-0 opacity-100"
                : "text-neutral-400 dark:text-neutral-600 translate-y-4 opacity-60"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            collaboration, and unwavering commitment
          </p>
          <p
            ref={line3Ref}
            className={`transition-all duration-700 ${
              line3InView
                ? "text-foreground translate-y-0 opacity-100"
                : "text-neutral-400 dark:text-neutral-600 translate-y-4 opacity-60"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            to excellence in every project we undertake.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeBelieveSection;
