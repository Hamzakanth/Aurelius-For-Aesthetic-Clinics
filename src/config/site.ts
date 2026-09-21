// Canonical, og:url, og:image, the sitemap, robots.txt and the JSON-LD
// url/logo fields all resolve through this one origin, so a production build
// that forgets NEXT_PUBLIC_SITE_URL would ship localhost URLs to Google.
// Fail the build instead — a broken deploy is cheaper than a poisoned index.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

if (process.env.NODE_ENV === "production" && SITE_URL.includes("localhost")) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is unset for a production build. Canonical, OG and " +
      "schema URLs would point at localhost. Set it to the deployed origin."
  )
}

export const siteConfig = {
  name: "Aurelius",
  shortName: "Aurelius",
  tagline: "The AI front desk for aesthetic and beauty studios",
  /** The <title> for the home page and the OG/Twitter fallback. Title-cased
   *  and kept under ~60 characters so Google renders it without a tail cut. */
  seoTitle: "Aurelius — The AI Front Desk for Aesthetic & Beauty Studios",
  /** Meta description. 155 characters — the differentiator leads, so the
   *  clause that survives a SERP truncation is the one that sells. */
  description:
    "Not a chatbot — an AI front desk for aesthetic clinics, skin studios, nail bars and laser rooms. Answers calls and DMs, fills gaps, rebooks clients.",
  url: SITE_URL,
  ogImage: "/og.png",
  locale: "en_US",
  keywords: [
    "aesthetic clinic software",
    "AI receptionist for salons",
    "med spa booking automation",
    "nail salon front desk automation",
    "skin studio client management",
    "salon no-show and reminder automation",
    "beauty studio rebooking software",
  ],
  links: {
    x: "https://x.com/aurelius",
    instagram: "https://instagram.com/aurelius",
    linkedin: "https://linkedin.com/company/aurelius",
    docs: "/docs",
    status: "https://status.aurelius.studio",
    email: "info@imera.com",
  },
  /** Front-of-house support. A studio that cannot sign in has a full waiting area. */
  support: {
    phone: "(415) 555-0142",
    hours: "8am–8pm, Mon–Sat",
  },
  company: {
    legalName: "Aurelius Studio Systems, Inc.",
    foundedYear: 2021,
    address: "One Market Plaza, San Francisco, CA",
  },
} as const

export type SiteConfig = typeof siteConfig
