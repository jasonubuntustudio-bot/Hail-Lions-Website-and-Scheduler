import type { MetadataRoute } from "next";

const site =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://hail-lions-website-and-scheduler.vercel.app";

const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/book", changeFrequency: "weekly", priority: 0.95 },
  { path: "/quote", changeFrequency: "monthly", priority: 0.85 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services/paintless-dent-repair", changeFrequency: "monthly", priority: 0.85 },
  { path: "/services/hail-damage-repair", changeFrequency: "monthly", priority: 0.85 },
  { path: "/services/mobile-dent-repair", changeFrequency: "monthly", priority: 0.85 },
  { path: "/services/classic-car-pdr", changeFrequency: "monthly", priority: 0.8 },
  { path: "/areas", changeFrequency: "monthly", priority: 0.9 },
  { path: "/areas/houston", changeFrequency: "monthly", priority: 0.85 },
  { path: "/areas/baytown", changeFrequency: "monthly", priority: 0.8 },
  { path: "/areas/katy", changeFrequency: "monthly", priority: 0.8 },
  { path: "/areas/cypress", changeFrequency: "monthly", priority: 0.8 },
  { path: "/areas/the-woodlands", changeFrequency: "monthly", priority: 0.8 },
  { path: "/areas/spring", changeFrequency: "monthly", priority: 0.75 },
  { path: "/areas/sugar-land", changeFrequency: "monthly", priority: 0.75 },
  { path: "/areas/pearland", changeFrequency: "monthly", priority: 0.75 },
  { path: "/areas/pasadena", changeFrequency: "monthly", priority: 0.75 },
  { path: "/areas/conroe", changeFrequency: "monthly", priority: 0.75 },
  { path: "/areas/tomball", changeFrequency: "monthly", priority: 0.7 },
  { path: "/areas/kingwood", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/guarantee", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.75 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${site}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
