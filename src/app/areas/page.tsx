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
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Service Areas</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Fully mobile paintless dent repair across greater Houston. We come to
          your home, office, or dealership.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {CITIES.map((city) => (
          <Link
            key={city.slug}
            href={`/areas/${city.slug}`}
            className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-5 flex items-center gap-3 transition"
          >
            <MapPin className="text-cyan-400 shrink-0" size={20} />
            <span className="text-white font-medium">{city.name}</span>
          </Link>
        ))}
      </div>

      <p className="text-center text-gray-500 text-sm mb-8">
        Don&apos;t see your city? We often serve nearby communities — start a
        booking or call and we will confirm.
      </p>

      <div className="text-center">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl transition"
        >
          <Camera size={20} />
          Start with Photos
        </Link>
      </div>
    </div>
  );
}
