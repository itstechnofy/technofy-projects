export type WorkProject = {
  title: string;
  slug: string;
  cover: string;
  tags: string[];
  description: string[];
  challenge: string[];
  results: string[];
  gallery: string[];
};

export const workProjects: WorkProject[] = [
  {
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    cover: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    tags: ["Web App", "SaaS", "E-Commerce"],
    description: [
      "A comprehensive e-commerce solution built for a leading retail brand, featuring advanced product management, real-time inventory tracking, and seamless payment integration.",
      "The platform handles thousands of daily transactions while maintaining exceptional performance and user experience across all devices."
    ],
    challenge: [
      "Scale to handle 10,000+ concurrent users during peak sales",
      "Integrate with legacy inventory management systems",
      "Implement real-time stock updates across multiple warehouses",
      "Ensure PCI compliance for payment processing"
    ],
    results: [
      "**300%** increase in online sales within first quarter",
      "**99.9%** uptime during Black Friday sales",
      "**45%** reduction in cart abandonment rate",
      "**2.5s** average page load time"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop"
    ]
  },
  {
    title: "Booking Platform",
    slug: "booking-platform",
    cover: "https://images.unsplash.com/photo-1556742521-9713bf272865?w=800&h=600&fit=crop",
    tags: ["Mobile App", "Booking", "iOS/Android"],
    description: [
      "A sophisticated booking platform that connects service providers with customers, featuring real-time availability, automated scheduling, and integrated payment processing.",
      "Built with a mobile-first approach to deliver exceptional user experience on all devices."
    ],
    challenge: [
      "Synchronize availability across multiple providers in real-time",
      "Handle complex scheduling rules and time zones",
      "Implement automated reminder and notification system",
      "Support multiple payment methods and currencies"
    ],
    results: [
      "**50,000+** active users within 6 months",
      "**85%** booking completion rate",
      "**4.8/5** average app store rating",
      "**40%** reduction in no-shows with automated reminders"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556742521-9713bf272865?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop"
    ]
  },
  {
    title: "SaaS Dashboard",
    slug: "saas-dashboard",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tags: ["SaaS", "Dashboard", "Analytics"],
    description: [
      "An enterprise-grade analytics dashboard providing real-time insights and data visualization for business intelligence.",
      "Features customizable widgets, advanced filtering, and automated reporting capabilities."
    ],
    challenge: [
      "Process and visualize millions of data points in real-time",
      "Create highly customizable and shareable dashboards",
      "Implement role-based access control for enterprise clients",
      "Ensure data security and compliance with GDPR"
    ],
    results: [
      "**1M+** data points processed per second",
      "**200+** enterprise clients onboarded",
      "**60%** improvement in decision-making speed",
      "**95%** customer satisfaction score"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"
    ]
  },
  {
    title: "Custom CMS",
    slug: "custom-cms",
    cover: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop",
    tags: ["CMS", "Web App", "Enterprise"],
    description: [
      "A flexible content management system designed for large-scale publishing operations with multi-language support and advanced workflow management.",
      "Empowers content teams to create, manage, and publish content efficiently across multiple channels."
    ],
    challenge: [
      "Support content in 15+ languages with translation workflows",
      "Implement complex approval and publishing workflows",
      "Integrate with existing publishing infrastructure",
      "Provide real-time collaboration features for distributed teams"
    ],
    results: [
      "**75%** reduction in content publishing time",
      "**100+** concurrent editors supported",
      "**15** languages supported out of the box",
      "**99.95%** system availability"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"
    ]
  }
];
