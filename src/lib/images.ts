/**
 * Optimized Unsplash URLs — cropped to aspect, smaller bytes.
 * auto=format → WebP/AVIF when browser supports it
 * fit=crop + w/h → hard crop to frame
 * q= quality
 */
const u = (
  id: string,
  w: number,
  h: number,
  q = 70
) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;

export const IMAGES = {
  /** Hero full-bleed — landscape, ~1400 wide */
  hero: u("photo-1503376780353-7e6692767b70", 1400, 900, 68),
  /** Bottom CTA band */
  band: u("photo-1486262715619-67b85e0b08d3", 1200, 640, 65),
  gallery: [
    {
      src: u("photo-1492144534655-ae79c964c9d7", 480, 640, 65),
      alt: "Polished vehicle after repair",
      label: "Factory finish restored",
    },
    {
      src: u("photo-1503376780353-7e6692767b70", 480, 640, 65),
      alt: "Luxury car body detail",
      label: "No paint · no fillers",
    },
    {
      src: u("photo-1552519507-da3b142c6e3d", 480, 640, 65),
      alt: "Black sports car exterior",
      label: "Door dings & creases",
    },
    {
      src: u("photo-1542362567-b07e54370788", 480, 640, 65),
      alt: "Blue performance vehicle",
      label: "Hail damage specialists",
    },
  ],
  services: [
    {
      href: "/services/hail-damage-repair",
      title: "Hail Damage",
      desc: "Storm dents fixed on-site without a full body shop rebuild.",
      img: u("photo-1605727216801-e27ce1d0cc28", 640, 480, 68),
    },
    {
      href: "/services/paintless-dent-repair",
      title: "Paintless Dent Repair",
      desc: "Precision PDR that keeps your original paint and value.",
      img: u("photo-1492144534655-ae79c964c9d7", 640, 480, 68),
    },
    {
      href: "/services/mobile-dent-repair",
      title: "Mobile Service",
      desc: "We come to your driveway, office, or dealership in Houston.",
      img: u("photo-1486262715619-67b85e0b08d3", 640, 480, 68),
    },
  ],
} as const;
