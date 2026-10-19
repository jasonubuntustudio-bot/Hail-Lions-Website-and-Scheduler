import Link from "next/link";
import { MapPin, Camera } from "lucide-react";

export const metadata = {
  title: "Service Areas — Greater Houston",
  description:
    "Hail Lions mobile paintless dent repair serves Houston, Baytown, Katy, Cypress, The Woodlands, Spring, Conroe, and surrounding cities.",
};

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

      {/* Featured: Baytown */}
      <Link
        href="/areas/baytown"
        className="block mb-6 sm:mb-8 bg-gradient-to-r from-cyan-500/15 to-transparent border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-5 sm:p-6 transition"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
              <MapPin className="text-cyan-400" size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-cyan-400 uppercase tracking-wide">
                Featured area
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Baytown, TX
              </h2>
            </div>
          </div>
          <p className="text-gray-400 text-sm sm:ml-auto sm:max-w-md">
            Mobile PDR and hail damage repair — we come to you in Baytown and
            nearby communities.
          </p>
          <span className="text-cyan-400 text-sm font-semibold whitespace-nowrap">
            View Baytown →
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
        {CITIES.map((city) => (
          <Link
            key={city.slug}
            href={`/areas/${city.slug}`}
            className={`rounded-xl p-4 sm:p-5 flex items-center gap-2 sm:gap-3 transition min-h-[52px] ${
              city.slug === "baytown"
                ? "bg-cyan-500/10 border border-cyan-500/50 hover:border-cyan-400"
                : "bg-gray-900 border border-gray-800 hover:border-cyan-500/50"
            }`}
          >
            <MapPin
              className="text-cyan-400 shrink-0"
              size={18}
            />
            <span className="text-white font-medium text-sm sm:text-base">
              {city.name}
            </span>
          </Link>
        ))}
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
