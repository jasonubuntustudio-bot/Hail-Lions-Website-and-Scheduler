/**
 * Local optimized WebP assets (high visual quality, small files).
 * Source: haillions.com media → public/images via ImageMagick WebP.
 */
export const IMAGES = {
  /** Hero full-bleed */
  hero: "/images/hero.webp",
  /** Bottom CTA band */
  band: "/images/band.webp",
  gallery: [
    {
      src: "/images/gallery-1.webp",
      alt: "Hail damage on vehicle panel before paintless repair",
      label: "Hail damage",
    },
    {
      src: "/images/gallery-2.webp",
      alt: "Door dent removal paintless process",
      label: "Door dents",
    },
    {
      src: "/images/gallery-3.webp",
      alt: "Paintless dent removal detail work",
      label: "Precision PDR",
    },
    {
      src: "/images/gallery-4.webp",
      alt: "Paintless dent removal on body panel",
      label: "Factory finish",
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
  /** Detail page heroes */
  serviceHero: {
    pdr: "/images/service-pdr.webp",
    hail: "/images/service-hail.webp",
    mobile: "/images/service-mobile.webp",
    classic: "/images/service-classic.webp",
  },
  extra: {
    houston: "/images/gallery-houston.webp",
    hailService: "/images/gallery-hail-svc.webp",
    door: "/images/gallery-door.webp",
    dent: "/images/gallery-dent.webp",
    road: "/images/area-road.webp",
    storm: "/images/area-storm.webp",
    car: "/images/area-car.webp",
  },
} as const;
