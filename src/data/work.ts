export type WorkMediaItem =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
      alt: string;
    };

export type WorkProject = {
  title: string;
  slug: string;
  cover: string;
  tags: string[];
  description: string[];
  challenge: string[];
  results: string[];
  gallery: WorkMediaItem[];
};

export const workProjects: WorkProject[] = [
  {
    title: "Staycation Booking Platform",
    slug: "staycation-booking",
    cover: "/assets/work/work-1/cover.png",
    tags: ["Web App", "Booking", "Hospitality"],
    description: [
      "Transforming resort and villa bookings into seamless digital experiences.",
      "If you’re running a private resort, villa, or boutique property — we can build a platform like this, tailored to your brand and experience.",
      "Creating an immersive booking experience for private stays — personal, luxurious, and intuitive with smart filters, calendar selections, and real-time availability."
    ],
    challenge: [
      "Design and build an immersive booking flow for exclusive stays.",
      "Balance premium aesthetics with powerful search, filtering, and live availability."
    ],
    results: [
      "Making bookings easy, fast, and enjoyable for every guest.",
      "A fully responsive platform that helps guests effortlessly find and reserve their perfect stay.",
      "Includes a secure admin panel for property management, user control, and booking analytics."
    ],
    gallery: [
      {
        type: "image",
        src: "/assets/work/work-1/content.png",
        alt: "Staycation booking experience feature overview"
      },
      {
        type: "image",
        src: "/assets/work/work-1/result-1.png",
        alt: "Staycation booking platform results screen"
      },
      {
        type: "image",
        src: "/assets/work/work-1/result-2.png",
        alt: "Staycation booking analytics dashboard"
      }
    ]
  },
  {
    title: "Neighborhood Café Ordering App",
    slug: "cafe-ordering-app",
    cover: "/assets/work/work-2/cover.png",
    tags: ["Mobile App", "Ordering", "Hospitality"],
    description: [
      "Bringing café comfort into a digital experience.",
      "A simple, modern app that makes ordering coffee fast and familiar — for pickup or delivery, anytime, anywhere."
    ],
    challenge: [
      "Craft a clean, minimal interface for a modern café brand.",
      "Make browsing, customizing, and ordering effortless across pickup and delivery."
    ],
    results: [
      "User-friendly, product-driven flow that feels calm and familiar.",
      "Smooth ordering experience that keeps customers engaged on the go or at home."
    ],
    gallery: [
      {
        type: "image",
        src: "/assets/work/work-2/content.png",
        alt: "Café ordering app product customization screen"
      },
      {
        type: "image",
        src: "/assets/work/work-2/result.png",
        alt: "Café ordering app result summary"
      }
    ]
  },
  {
    title: "Skincare E-Commerce Website",
    slug: "skincare-ecommerce",
    cover: "/assets/work/work-3/cover.png",
    tags: ["E-Commerce", "Web App", "Beauty"],
    description: [
      "A modern skincare platform built for smooth shopping and effortless performance.",
      "Designed to highlight product quality through a refined browsing and checkout flow."
    ],
    challenge: [
      "Build an intuitive, luxurious storefront that remains simple to use.",
      "Integrate quick add-to-cart, secure payments, and responsive performance."
    ],
    results: [
      "A modern e-commerce experience that makes skincare shopping easy, fast, and elegant.",
      "Users explore products, learn benefits, and check out in just a few clicks on a high-performing platform."
    ],
    gallery: [
      {
        type: "image",
        src: "/assets/work/work-3/content.png",
        alt: "Skincare e-commerce product showcase"
      },
      {
        type: "video",
        src: "/assets/work/work-3/result.mp4",
        poster: "/assets/work/work-3/content.png",
        alt: "Skincare e-commerce shopping flow demo"
      }
    ]
  },
  {
    title: "Global Freight Platform",
    slug: "global-freight-platform",
    cover: "/assets/work/work-4/cover.png",
    tags: ["Logistics", "Web App", "B2B"],
    description: [
      "Global freight, simplified.",
      "Redefining logistics through design, data, and seamless experience."
    ],
    challenge: [
      "Modernize freight operations through accessible digital design.",
      "Build a streamlined platform that presents complex logistics services with clarity."
    ],
    results: [
      "A modern, high-performing logistics website built for clarity, speed, and user experience.",
      "Structured modules, confident messaging, and real-time tracking bring efficiency to global operations."
    ],
    gallery: [
      {
        type: "image",
        src: "/assets/work/work-4/content.png",
        alt: "Global freight platform hero layout"
      },
      {
        type: "video",
        src: "/assets/work/work-4/result.mp4",
        poster: "/assets/work/work-4/content.png",
        alt: "Global freight platform interaction demo"
      }
    ]
  }
];
