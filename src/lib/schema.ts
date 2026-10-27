import { BUSINESS_NAME, PHONE, PHONE_TEL, OWNER_1_NAME } from "@/lib/utils";

const site =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hail-lions-website-and-scheduler.vercel.app";

/** LocalBusiness / AutoRepair JSON-LD for Google local + service search */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutoRepair"],
    "@id": `${site}/#business`,
    name: BUSINESS_NAME,
    alternateName: "Hail Lions PDR",
    description:
      "Mobile paintless dent repair across greater Houston. Hail damage, door dings, and creases — we come to you.",
    url: site,
    telephone: PHONE_TEL,
    image: `${site}/logo.png`,
    logo: `${site}/logo.png`,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Insurance",
    founder: {
      "@type": "Person",
      name: OWNER_1_NAME,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Houston" },
      { "@type": "City", name: "Baytown" },
      { "@type": "City", name: "Katy" },
      { "@type": "City", name: "Cypress" },
      { "@type": "City", name: "The Woodlands" },
      { "@type": "City", name: "Spring" },
      { "@type": "City", name: "Sugar Land" },
      { "@type": "City", name: "Pearland" },
      { "@type": "City", name: "Pasadena" },
      { "@type": "City", name: "Conroe" },
      { "@type": "City", name: "Tomball" },
      { "@type": "City", name: "Kingwood" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "14:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Paintless dent repair services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Paintless Dent Repair",
            url: `${site}/services/paintless-dent-repair`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Hail Damage Repair",
            url: `${site}/services/hail-damage-repair`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile Dent Repair",
            url: `${site}/services/mobile-dent-repair`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Classic Car PDR",
            url: `${site}/services/classic-car-pdr`,
          },
        },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_TEL,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "English",
    },
    sameAs: [],
  };
}
