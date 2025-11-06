const lines = [
  "We believe that great digital experiences",
  "are built on a foundation of innovation,",
  "collaboration, and unwavering commitment",
  "to excellence in every pixel and line of code.",
];

const WeBelieveSection = () => {
  return (
    <section id="we-believe" className="py-6 md:py-16 px-4 sm:px-5 bg-transparent">
      <div className="container mx-auto max-w-screen-sm md:max-w-4xl">
        <div className="space-y-2 text-left">
          {lines.map((line, index) => (
            <p
              key={index}
              className={`text-xl md:text-2xl font-medium leading-relaxed ${
                index === lines.length - 1
                  ? "bg-gradient-to-r from-[#B7A4D6] to-[#CC96B0] bg-clip-text text-transparent"
                  : "text-[#C5C5C5]"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeBelieveSection;
