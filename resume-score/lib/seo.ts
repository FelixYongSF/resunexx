export const siteUrl = "https://www.resunexx.com";

export const siteDescription =
  "AI-powered resume analysis and recruiter-style feedback for early-career job seekers. Check ATS readiness, recruiter signals, and practical next steps.";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const pricingOffers = [
  {
    "@type": "Offer",
    name: "FREE Resume Signal Check",
    price: "0.00",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: absoluteUrl("/upload?plan=free")
  },
  {
    "@type": "Offer",
    name: "PRO Resume Intelligence Report",
    price: "4.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: absoluteUrl("/upload?plan=standard")
  },
  {
    "@type": "Offer",
    name: "ELITE Resume Intelligence Report",
    price: "9.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: absoluteUrl("/upload?plan=full")
  }
];
