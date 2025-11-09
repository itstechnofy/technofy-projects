export type Service = {
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  description: string[];
  challenges: string[];
  outcomes: string[];
  relatedWork: string[];
};

export const services: Service[] = [
  {
    title: "Web Development",
    slug: "web-development",
    icon: "Globe",
    shortDescription: "Custom web applications built with cutting-edge technologies.",
    description: [
      "We create powerful, scalable web applications tailored to your business needs. Our expertise spans modern frameworks, cloud infrastructure, and performance optimization.",
      "From MVPs to enterprise solutions, we deliver web applications that grow with your business and delight your users."
    ],
    challenges: [
      "Building applications that scale from prototype to millions of users",
      "Integrating complex business logic with intuitive user interfaces",
      "Ensuring security, compliance, and data protection",
      "Optimizing performance across all devices and network conditions"
    ],
    outcomes: [
      "Scalable architecture that grows with your business",
      "Fast, responsive interfaces that users love",
      "Secure, compliant solutions that protect your data",
      "Maintainable codebase with comprehensive documentation"
    ],
    relatedWork: ["ecommerce-platform", "saas-dashboard", "custom-cms"]
  },
  {
    title: "Mobile Apps",
    slug: "mobile-apps",
    icon: "Smartphone",
    shortDescription: "Native and cross-platform mobile applications.",
    description: [
      "We build beautiful, high-performance mobile applications for iOS and Android. Whether native or cross-platform, we focus on delivering exceptional user experiences.",
      "Our mobile solutions integrate seamlessly with your backend systems and provide offline capabilities when needed."
    ],
    challenges: [
      "Creating consistent experiences across iOS and Android",
      "Optimizing performance and battery usage",
      "Handling offline functionality and data synchronization",
      "Managing app store submissions and updates"
    ],
    outcomes: [
      "High-rated apps with excellent user reviews",
      "Smooth performance on all device types",
      "Reliable offline functionality",
      "Seamless updates and maintenance"
    ],
    relatedWork: ["booking-platform"]
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    icon: "Palette",
    shortDescription: "Beautiful, intuitive interfaces that users love.",
    description: [
      "We design digital experiences that are both beautiful and functional. Our process combines user research, iterative design, and usability testing.",
      "Every design decision is informed by data and focused on achieving your business goals while delighting your users."
    ],
    challenges: [
      "Balancing business goals with user needs",
      "Creating accessible designs that work for everyone",
      "Designing for multiple platforms and screen sizes",
      "Maintaining consistency across large applications"
    ],
    outcomes: [
      "Intuitive interfaces that require minimal training",
      "Higher user engagement and satisfaction",
      "Reduced support costs through better UX",
      "Consistent brand experience across touchpoints"
    ],
    relatedWork: ["ecommerce-platform", "booking-platform", "saas-dashboard"]
  },
  {
    title: "Digital Strategy",
    slug: "digital-strategy",
    icon: "Target",
    shortDescription: "Comprehensive digital transformation guidance.",
    description: [
      "We help organizations navigate digital transformation with strategic planning, technology selection, and implementation roadmaps.",
      "Our approach combines industry best practices with your unique business context to create actionable strategies that deliver results."
    ],
    challenges: [
      "Aligning technology initiatives with business objectives",
      "Managing change across the organization",
      "Selecting the right technology stack for your needs",
      "Balancing innovation with risk management"
    ],
    outcomes: [
      "Clear roadmap for digital transformation",
      "Alignment between IT and business teams",
      "Reduced technology risk and costs",
      "Measurable business value from technology investments"
    ],
    relatedWork: ["custom-cms", "saas-dashboard"]
  },
  {
    title: "Cloud Infrastructure",
    slug: "cloud-infrastructure",
    icon: "Cloud",
    shortDescription: "Scalable, secure cloud solutions.",
    description: [
      "We design and implement cloud infrastructure that scales with your business. From migration to optimization, we handle the complexity of cloud deployment.",
      "Our solutions leverage modern cloud services while maintaining security, compliance, and cost-efficiency."
    ],
    challenges: [
      "Migrating legacy systems to the cloud",
      "Optimizing cloud costs while maintaining performance",
      "Ensuring security and compliance in the cloud",
      "Managing multi-cloud or hybrid environments"
    ],
    outcomes: [
      "Reliable, scalable infrastructure",
      "Reduced operational costs",
      "Improved security and compliance",
      "Faster deployment and innovation"
    ],
    relatedWork: ["ecommerce-platform", "saas-dashboard"]
  },
  {
    title: "API Development",
    slug: "api-development",
    icon: "Code",
    shortDescription: "Robust APIs that power your digital ecosystem.",
    description: [
      "We build RESTful and GraphQL APIs that serve as the backbone of modern applications. Our APIs are designed for performance, security, and developer experience.",
      "From design to documentation, we create APIs that are easy to integrate and maintain."
    ],
    challenges: [
      "Designing APIs that scale to millions of requests",
      "Ensuring backward compatibility during evolution",
      "Implementing proper authentication and authorization",
      "Creating comprehensive documentation and SDKs"
    ],
    outcomes: [
      "Fast, reliable API infrastructure",
      "Excellent developer experience for integrators",
      "Secure, compliant data access",
      "Clear documentation and support"
    ],
    relatedWork: ["ecommerce-platform", "booking-platform"]
  }
];
