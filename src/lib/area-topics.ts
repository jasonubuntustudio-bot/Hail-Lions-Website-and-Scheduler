/** Keyword topic pages under each service area */

import type { AreaContent } from "@/lib/area-content";

export type AreaTopic = {
  slug: string;
  /** Phrase for H1 — city name inserted */
  h1: (city: string) => string;
  title: (city: string) => string;
  description: (city: string) => string;
  /** Short label on hub cards */
  label: string;
  /** Build body sections */
  sections: (area: AreaContent) => { heading: string; paragraphs: string[] }[];
};

export const AREA_TOPICS: AreaTopic[] = [
  {
    slug: "paintless-dent-repair",
    label: "Paintless Dent Repair",
    h1: (city) => `Paintless Dent Repair ${city}`,
    title: (city) =>
      `Paintless Dent Repair ${city} TX | Mobile PDR | Hail Lions`,
    description: (city) =>
      `Paintless dent repair ${city}. Mobile PDR for door dings and hail. Factory paint preserved. Photo estimates. Call (281) 352-5434.`,
    sections: (area) => {
      const c = area.name;
      return [
        {
          heading: `Paintless dent repair ${c} — what it means`,
          paragraphs: [
            `Paintless dent repair ${c} restores dents by massaging metal back toward its original shape without sanding, filler, or repainting when the paint is intact. Hail Lions brings this service to your driveway or workplace in ${area.stateLabel}.`,
            `Homeowners and drivers searching for paintless dent repair ${c} want factory-finish results and less downtime than a traditional body shop. Our photo-first process gives you a clear estimate before we schedule a visit.`,
          ],
        },
        {
          heading: `Why mobile paintless dent repair ${c}`,
          paragraphs: [
            `We come to you across ${c}${area.neighborhoods?.length ? ` and nearby areas like ${area.neighborhoods.slice(0, 3).join(", ")}` : ""}. Most qualifying jobs do not require leaving the car at a shop for days.`,
            area.hailNote ||
              `Storm season and everyday parking lots both drive demand for paintless dent repair ${c}. We handle door dings, soft creases, and many hail patterns with the same lifetime warranty.`,
          ],
        },
      ];
    },
  },
  {
    slug: "paintless-dent-removal",
    label: "Paintless Dent Removal",
    h1: (city) => `Paintless Dent Removal ${city}`,
    title: (city) =>
      `Paintless Dent Removal ${city} TX | Door Dings & Hail | Hail Lions`,
    description: (city) =>
      `Paintless dent removal ${city}. Remove door dings and soft dents without paint. Mobile service. (281) 352-5434.`,
    sections: (area) => {
      const c = area.name;
      return [
        {
          heading: `Paintless dent removal ${c}`,
          paragraphs: [
            `Paintless dent removal ${c} is the process of taking dings and dents out of the metal while keeping your original clear coat and color. No blending adjacent panels for most qualifying damage.`,
            `Hail Lions offers paintless dent removal ${c} as a mobile service. Upload photos, review the estimate, accept online, and we meet you at a time that works in ${area.stateLabel}.`,
          ],
        },
        {
          heading: `When paintless dent removal works best`,
          paragraphs: [
            `Best results come when paint is unbroken and the metal has not been severely stretched. Sharp tears, cracked paint, or prior bodywork may need traditional methods—we will say so honestly after reviewing your photos.`,
            `Customers choose paintless dent removal ${c} for parking-lot door dings, shopping-cart marks, and many hail hits where the finish is still sound.`,
          ],
        },
      ];
    },
  },
  {
    slug: "dent-repair",
    label: "Dent Repair",
    h1: (city) => `Dent Repair ${city}`,
    title: (city) =>
      `Dent Repair ${city} TX | Mobile Paintless Service | Hail Lions`,
    description: (city) =>
      `Dent repair ${city}. Mobile paintless options for door dings, creases, and hail. Photo quotes. (281) 352-5434.`,
    sections: (area) => {
      const c = area.name;
      return [
        {
          heading: `Dent repair ${c} with a mobile team`,
          paragraphs: [
            `Dent repair ${c} does not have to mean a week at a body shop. Hail Lions focuses on paintless methods first so you keep factory paint whenever the panel allows it.`,
            `From small door dings to larger soft dents, dent repair ${c} starts with clear photos and a written estimate. You accept when ready and choose a service window in ${area.stateLabel}.`,
          ],
        },
        {
          heading: `What dent repair ${c} covers`,
          paragraphs: [
            `We commonly repair parking-lot damage, light creases, and hail patterns on hoods, roofs, doors, and trunks. Classic and modern vehicles are both candidates when access and paint condition are right.`,
            area.hailNote ||
              `After local storms, dent repair ${c} demand rises quickly. Early photos help us schedule before calendars fill.`,
          ],
        },
      ];
    },
  },
  {
    slug: "auto-dent-repair",
    label: "Auto Dent Repair",
    h1: (city) => `Auto Dent Repair in ${city}`,
    title: (city) =>
      `Auto Dent Repair ${city} TX | Mobile PDR | Hail Lions`,
    description: (city) =>
      `Auto dent repair in ${city}. Mobile paintless service for cars and trucks. Door dings and creases. (281) 352-5434.`,
    sections: (area) => {
      const c = area.name;
      return [
        {
          heading: `Auto dent repair for ${c} drivers`,
          paragraphs: [
            `Auto dent repair is everyday work for Hail Lions in ${c}. Cars, trucks, and SUVs with intact paint are often strong candidates for paintless methods that avoid unnecessary repaint.`,
            `Our auto dent repair process is mobile: we quote from photos, then come to your home or office in ${area.stateLabel}. You stay in control of schedule and cost before work begins.`,
          ],
        },
        {
          heading: `Auto dent repair vs full body shop`,
          paragraphs: [
            `Traditional shops excel at collision and paint work. For isolated dings and many hail dents, auto dent repair with PDR is faster and keeps OEM finish. We will recommend body shop work when paint is broken or metal is beyond paintless limits.`,
          ],
        },
      ];
    },
  },
  {
    slug: "auto-hail-damage-repair",
    label: "Auto Hail Damage Repair",
    h1: (city) => `Auto Hail Damage Repair in ${city}`,
    title: (city) =>
      `Auto Hail Damage Repair ${city} TX | Paintless Hail Fix | Hail Lions`,
    description: (city) =>
      `Auto hail damage repair in ${city}. Mobile paintless hail repair for hoods, roofs, and doors. Photo estimates. (281) 352-5434.`,
    sections: (area) => {
      const c = area.name;
      return [
        {
          heading: `Auto hail damage repair ${c}`,
          paragraphs: [
            `Auto hail damage repair in ${c} focuses on restoring storm dents without a full repaint when panels qualify for paintless work. Hoods, roofs, trunks, and doors are common candidates.`,
            area.hailNote ||
              `${c} and nearby communities see periodic hail. Fast photo estimates help you decide next steps while damage is fresh.`,
            `Hail Lions provides mobile auto hail damage repair across ${area.stateLabel}. Send photos, get a clear quote, accept online, and pick a time window.`,
          ],
        },
        {
          heading: `Insurance and auto hail damage repair`,
          paragraphs: [
            `Many policies cover hail. We support an insurance-friendly process with written estimates and documentation. Deductibles and coverage decisions stay between you and your carrier; we make the repair path clear.`,
          ],
        },
      ];
    },
  },
  {
    slug: "insurance-approved",
    label: "Insurance Approved",
    h1: (city) => `Insurance Approved Dent Repair in ${city}`,
    title: (city) =>
      `Insurance Approved PDR ${city} TX | Hail & Dent Claims | Hail Lions`,
    description: (city) =>
      `Insurance approved paintless dent repair support in ${city}. Clear estimates for hail and dent claims. Mobile service. (281) 352-5434.`,
    sections: (area) => {
      const c = area.name;
      return [
        {
          heading: `Insurance approved process support in ${c}`,
          paragraphs: [
            `Drivers in ${c} often ask whether paintless dent repair is insurance approved. Many carriers accept PDR for qualifying hail and door-ding damage because it preserves factory paint and can limit cost versus full refinish.`,
            `Hail Lions supports an insurance approved workflow: photo-based estimates, clear line items, and documentation you can share with your adjuster. Final coverage and deductibles are determined by your policy.`,
          ],
        },
        {
          heading: `How claims usually work with us`,
          paragraphs: [
            `You can note insurance details when you book. We return a professional estimate for paintless work in ${area.stateLabel}. After you accept and authorize repairs, we schedule mobile service. Supplement or depreciation questions remain with your insurer; we stay available to clarify the repair scope.`,
            `Whether you pay out of pocket or use insurance, you get the same mobile paintless quality and lifetime warranty on our workmanship.`,
          ],
        },
      ];
    },
  },
];

export function getTopic(slug: string) {
  return AREA_TOPICS.find((t) => t.slug === slug);
}

export const AREA_TOPIC_SLUGS = AREA_TOPICS.map((t) => t.slug);
