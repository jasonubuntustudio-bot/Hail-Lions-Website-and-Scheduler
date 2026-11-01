/** Local SEO copy for service-area pages */

export type AreaContent = {
  slug: string;
  name: string;
  stateLabel: string; // "Katy, TX"
  title: string;
  description: string;
  h1: string;
  tagline: string;
  neighborhoods?: string[];
  hailNote?: string;
  nearby?: string[];
};

export const AREAS: AreaContent[] = [
  {
    slug: "houston",
    name: "Houston",
    stateLabel: "Houston, TX",
    title: "Paintless Dent Repair Houston TX | Mobile Hail & Door Ding Fix",
    description:
      "Mobile paintless dent repair in Houston, TX. Hail damage, door dings, and creases fixed at your home or office. Photo estimates. (281) 352-5434.",
    h1: "Paintless Dent Repair in Houston, TX",
    tagline: "Mobile PDR across the Houston metro — we come to you",
    neighborhoods: [
      "Downtown",
      "Midtown",
      "Heights",
      "Memorial",
      "Energy Corridor",
      "Galleria",
      "Medical Center",
      "East End",
    ],
    hailNote:
      "Houston sees frequent spring and fall hail. When storms hit, paintless dent repair is often the fastest way to restore panels without a body-shop paint job.",
    nearby: ["Katy", "Cypress", "The Woodlands", "Baytown", "Pasadena"],
  },
  {
    slug: "katy",
    name: "Katy",
    stateLabel: "Katy, TX",
    title: "Paintless Dent Repair Katy TX | Mobile Hail Damage Repair",
    description:
      "Mobile paintless dent repair in Katy, TX. Hail damage and door dings fixed at your home, office, or driveway. Cinco Ranch & west Houston. (281) 352-5434.",
    h1: "Paintless Dent Repair in Katy, TX",
    tagline: "We come to you in Katy, Cinco Ranch, and west Houston",
    neighborhoods: [
      "Cinco Ranch",
      "Cross Creek Ranch",
      "Katy Mills area",
      "Firethorne",
      "Fulshear-adjacent",
    ],
    hailNote:
      "West-side storms often track through Katy. Mobile PDR means you don’t leave a car at a shop for days while hail dents are worked out.",
    nearby: ["Houston", "Cypress", "Sugar Land", "Tomball"],
  },
  {
    slug: "cypress",
    name: "Cypress",
    stateLabel: "Cypress, TX",
    title: "Paintless Dent Repair Cypress TX | Mobile Hail & Dent Fix",
    description:
      "Mobile paintless dent repair in Cypress, TX. Hail damage repair and door ding removal at your location. Northwest Houston service. (281) 352-5434.",
    h1: "Paintless Dent Repair in Cypress, TX",
    tagline: "Mobile PDR for Cypress and northwest Houston",
    neighborhoods: [
      "Bridgeland",
      "Towne Lake",
      "Cy-Fair area",
      "Copperfield-adjacent",
    ],
    hailNote:
      "Cypress and Cy-Fair see regular hail events. We offer photo-based estimates and mobile service so repairs fit your schedule.",
    nearby: ["Houston", "Tomball", "The Woodlands", "Katy", "Spring"],
  },
  {
    slug: "the-woodlands",
    name: "The Woodlands",
    stateLabel: "The Woodlands, TX",
    title: "Paintless Dent Repair The Woodlands TX | Mobile PDR",
    description:
      "Mobile paintless dent repair in The Woodlands, TX. Hail damage and door dings fixed at home or work. North Houston PDR. (281) 352-5434.",
    h1: "Paintless Dent Repair in The Woodlands, TX",
    tagline: "Convenient mobile dent repair in The Woodlands",
    neighborhoods: [
      "Village centers",
      "Sterling Ridge",
      "Creekside Park",
      "Shenandoah-adjacent",
    ],
    hailNote:
      "After north-Houston hail, PDR keeps factory paint intact and avoids unnecessary panel replacement when the metal can be massaged back.",
    nearby: ["Spring", "Conroe", "Tomball", "Houston", "Cypress"],
  },
  {
    slug: "baytown",
    name: "Baytown",
    stateLabel: "Baytown, TX",
    title: "Paintless Dent Repair Baytown TX | Mobile Hail Repair",
    description:
      "Mobile paintless dent repair in Baytown, TX. Hail damage and door dings fixed at your place. East Houston PDR service. (281) 352-5434.",
    h1: "Paintless Dent Repair in Baytown, TX",
    tagline: "East-side mobile PDR for Baytown and nearby",
    neighborhoods: ["Bayway", "Goose Creek area", "Mont Belvieu-adjacent"],
    hailNote:
      "Baytown drivers don’t need a long trip west for quality PDR. We come to you with the same lifetime warranty as our Houston jobs.",
    nearby: ["Houston", "Pasadena", "Pearland", "Kingwood"],
  },
  {
    slug: "spring",
    name: "Spring",
    stateLabel: "Spring, TX",
    title: "Paintless Dent Repair Spring TX | Mobile Hail Damage Fix",
    description:
      "Mobile paintless dent repair in Spring, TX. Hail and door ding repair at your home or office. (281) 352-5434.",
    h1: "Paintless Dent Repair in Spring, TX",
    tagline: "Mobile dent repair for Spring and north Houston",
    neighborhoods: ["Old Town Spring", "Springwoods", "Klein-adjacent"],
    nearby: ["The Woodlands", "Tomball", "Houston", "Cypress"],
  },
  {
    slug: "sugar-land",
    name: "Sugar Land",
    stateLabel: "Sugar Land, TX",
    title: "Paintless Dent Repair Sugar Land TX | Mobile PDR",
    description:
      "Mobile paintless dent repair in Sugar Land, TX. Hail damage and door dings fixed on-site. Southwest Houston area. (281) 352-5434.",
    h1: "Paintless Dent Repair in Sugar Land, TX",
    tagline: "Mobile PDR in Sugar Land and Fort Bend County",
    neighborhoods: ["First Colony", "New Territory", "Telfair"],
    nearby: ["Houston", "Pearland", "Katy"],
  },
  {
    slug: "tomball",
    name: "Tomball",
    stateLabel: "Tomball, TX",
    title: "Paintless Dent Repair Tomball TX | Mobile Hail Repair",
    description:
      "Mobile paintless dent repair in Tomball, TX. Hail and door ding PDR at your location. (281) 352-5434.",
    h1: "Paintless Dent Repair in Tomball, TX",
    tagline: "Mobile service for Tomball and northwest Harris County",
    nearby: ["Cypress", "The Woodlands", "Spring", "Houston"],
  },
  {
    slug: "conroe",
    name: "Conroe",
    stateLabel: "Conroe, TX",
    title: "Paintless Dent Repair Conroe TX | Mobile PDR & Hail",
    description:
      "Mobile paintless dent repair in Conroe, TX. Hail damage repair without a body shop paint job. (281) 352-5434.",
    h1: "Paintless Dent Repair in Conroe, TX",
    tagline: "Mobile PDR for Conroe and Montgomery County",
    nearby: ["The Woodlands", "Spring", "Tomball"],
  },
  {
    slug: "kingwood",
    name: "Kingwood",
    stateLabel: "Kingwood, TX",
    title: "Paintless Dent Repair Kingwood TX | Mobile Dent Fix",
    description:
      "Mobile paintless dent repair in Kingwood, TX. Hail and door ding repair at home or work. (281) 352-5434.",
    h1: "Paintless Dent Repair in Kingwood, TX",
    tagline: "Northeast Houston mobile PDR",
    nearby: ["Houston", "Spring", "Baytown", "Pasadena"],
  },
  {
    slug: "pasadena",
    name: "Pasadena",
    stateLabel: "Pasadena, TX",
    title: "Paintless Dent Repair Pasadena TX | Mobile Hail Repair",
    description:
      "Mobile paintless dent repair in Pasadena, TX. Hail damage and door dings fixed at your place. (281) 352-5434.",
    h1: "Paintless Dent Repair in Pasadena, TX",
    tagline: "Southeast Houston mobile dent repair",
    nearby: ["Houston", "Baytown", "Pearland"],
  },
  {
    slug: "pearland",
    name: "Pearland",
    stateLabel: "Pearland, TX",
    title: "Paintless Dent Repair Pearland TX | Mobile PDR",
    description:
      "Mobile paintless dent repair in Pearland, TX. Hail and door ding repair without repainting. (281) 352-5434.",
    h1: "Paintless Dent Repair in Pearland, TX",
    tagline: "Mobile PDR for Pearland and south Houston",
    nearby: ["Houston", "Sugar Land", "Pasadena"],
  },
];

export function getArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}
