import Link from "next/link";
import { MapPin } from "lucide-react";

/**
 * Visual service-area map focused on Houston + Baytown.
 * Uses OpenStreetMap (no API key). Bounds cover both cities.
 */
export default function ServiceAreaMap() {
  // Bbox: west, south, east, north — covers Houston metro through Baytown
  const osmEmbed =
    "https://www.openstreetmap.org/export/embed.html?bbox=-95.75%2C29.55%2C-94.85%2C30.05&layer=mapnik";

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
      <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] min-h-[220px] bg-gray-950">
        <iframe
          title="Hail Lions service area — Houston and Baytown"
          src={osmEmbed}
          className="absolute inset-0 w-full h-full border-0 grayscale-[30%] contrast-125"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Overlay labels so Houston & Baytown are always visible */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-auto">
          <Link
            href="/areas/houston"
            className="inline-flex items-center gap-1.5 bg-black/80 border border-cyan-500/50 text-white text-sm font-semibold px-3 py-2 rounded-full backdrop-blur hover:border-cyan-400 transition"
          >
            <MapPin className="text-cyan-400" size={16} />
            Houston
          </Link>
          <Link
            href="/areas/baytown"
            className="inline-flex items-center gap-1.5 bg-black/80 border border-cyan-500/50 text-white text-sm font-semibold px-3 py-2 rounded-full backdrop-blur hover:border-cyan-400 transition"
          >
            <MapPin className="text-cyan-400" size={16} />
            Baytown
          </Link>
        </div>
      </div>
      <p className="text-xs text-gray-500 px-3 py-2 border-t border-gray-800">
        Map shows greater Houston including Baytown. Tap a city for local
        service details.
      </p>
    </div>
  );
}
