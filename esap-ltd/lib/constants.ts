export const ESAP_COLORS = {
  yellow: { primary: "#ffd93d", dark: "#ffc107" },
  pink: { primary: "#ff69b4", dark: "#ff1493" },
  blue: { primary: "#4da6ff", dark: "#2e8fff" },
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  products: "/products",
  contact: "/contact",
} as const;

export const SITE_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://esap.ltd",
  siteName: "ESAP",
  tagline: "Creative Technology Studio",
  authors: ["AptS:1547", "AptS:1548"],
  startYear: 2021,
} as const;

export const EXTERNAL_LINKS = {
  weareWebsite: "https://weare.esaps.net",
  storyWebsite: "https://story.esaps.net",
  github: "https://github.com/The-ESAP-Project/WeAreESAP",
} as const;
