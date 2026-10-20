/**
 * Local optimized WebP assets (high visual quality, small files).
 * Source: haillions_media → public/images via LANCZOS + WebP q≈85.
 */
export const IMAGES = {
  /** Hero full-bleed */
  hero: "/images/hero.webp",
  /** Bottom CTA band */
  band: "/images/band.webp",
  gallery: [
    {
      src: "/images/gallery-1.webp",
      alt: "Paintless dent repair on a vehicle panel",
      label: "Factory finish restored",
    },
    {
      src: "/images/gallery-2.webp",
      alt: "Hail damage before repair",
      label: "Hail damage — before",
    },
    {
      src: "/images/gallery-3.webp",
      alt: "Hail damage after paintless repair",
      label: "Hail damage — after",
    },
    {
      src: "/images/gallery-4.webp",
      alt: "Door ding before and after",
      label: "Door dings & creases",
    },
  ],
  services: [
    {
      href: "/services/hail-damage-repair",
      title: "Hail Damage",
      desc: "Storm dents fixed on-site without a full body shop rebuild.",
      img: "/images/service-hail.webp",
    },
    {
      href: "/services/paintless-dent-repair",
      title: "Paintless Dent Repair",
      desc: "Precision PDR that keeps your original paint and value.",
      img: "/images/service-pdr.webp",
    },
    {
      href: "/services/mobile-dent-repair",
      title: "Mobile Service",
      desc: "We come to your driveway, office, or dealership in Houston.",
      img: "/images/service-mobile.webp",
    },
  ],
} as const;
