import Link from "next/link";
import { MapPin, Camera } from "lucide-react";
import ServiceAreaMap from "@/components/ServiceAreaMap";

export const metadata = {
  title: "Service Areas — Greater Houston",
  description:
    "Hail Lions mobile paintless dent repair serves Houston, Baytown, Katy, Cypress, The Woodlands, Spring, Conroe, and surrounding cities.",
};

const FEATURED = [
  {
    slug: "houston",
    name: "Houston, TX",
    blurb: "Mobile PDR across the city — home, office, or dealership.",
  },
  {
    slug: "baytown",
    name: "Baytown, TX",
    blurb: "Paintless dent repair and hail damage — we come to you.",
  },
];

const CITIES = [
  { slug: "houston", name: "Houston" },
  { slug: "baytown", name: "Baytown" },
  { slug: "katy", name: "Katy" },
  { slug: "cypress", name: "Cypress" },
  { slug: "the-woodlands", name: "The Woodlands" },
  { slug: "spring", name: "Spring" },
  { slug: "conroe", name: "Conroe" },
  { slug: "pasadena", name: "Pasadena" },
  { slug: "sugar-land", name: "Sugar Land" },
  { slug: "pearland", name: "Pearland" },
  { slug: "tomball", name: "Tomball" },
  { slug: "kingwood", name: "Kingwood" },
];

export default function AreasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Service Areas
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Fully mobile paintless dent repair across greater Houston. We come to
          your home, office, or dealership.
        </p>
      </div>

      {/* Map: Houston + Baytown */}
      <div className="mb-8 sm:mb-10">
        <ServiceAreaMap />
      </div>

      {/* Featured: Houston & Baytown */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
        {FEATURED.map((city) => (
          <Link
            key={city.slug}
            href={`/areas/${city.slug}`}
            className="block bg-gradient-to-r from-cyan-500/15 to-transparent border border-cyan-500/40 hover:border-cyan-400 active:border-cyan-300 rounded-2xl p-5 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <MapPin className="text-cyan-400" size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-cyan-400 uppercase tracking-wide mb-0.5">
                  Primary area
                </p>
                <h2 className="text-xl font-bold text-white">{city.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{city.blurb}</p>
                <span className="inline-block text-cyan-400 text-sm font-semibold mt-2">
                  View {city.name.split(",")[0]} →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 px-1">
        All service areas
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
        {CITIES.map((city) => {
          const isPrimary =
            city.slug === "houston" || city.slug === "baytown";
          return (
            <Link
              key={city.slug}
              href={`/areas/${city.slug}`}
              className={`rounded-xl p-4 sm:p-5 flex items-center gap-2 sm:gap-3 transition min-h-[52px] ${
                isPrimary
                  ? "bg-cyan-500/10 border border-cyan-500/50 hover:border-cyan-400"
                  : "bg-gray-900 border border-gray-800 hover:border-cyan-500/50"
              }`}
            >
              <MapPin className="text-cyan-400 shrink-0" size={18} />
              <span className="text-white font-medium text-sm sm:text-base">
                {city.name}
              </span>
            </Link>
          );
        })}
      </div>

      <p className="text-center text-gray-500 text-sm mb-8 px-2">
        Don&apos;t see your city? We often serve nearby communities — start a
        booking or call and we will confirm.
      </p>

      <div className="text-center">
        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-black font-bold px-8 py-3.5 rounded-xl transition min-h-[48px]"
        >
          <Camera size={20} />
          Start with Photos
        </Link>
      </div>
    </div>
  );
}
