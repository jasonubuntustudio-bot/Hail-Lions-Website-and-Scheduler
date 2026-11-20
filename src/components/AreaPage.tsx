import Link from "next/link";
import { Camera, Phone, MapPin, ChevronRight } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";
import type { AreaContent } from "@/lib/area-content";
import { AREA_TOPICS } from "@/lib/area-topics";

export default function AreaPage({ area }: { area: AreaContent }) {
  const city = area.name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        Service area · {area.stateLabel}
      </p>
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        {area.h1}
      </h1>
      <p className="mb-6 text-lg text-cyan-400">{area.tagline}</p>

      <p className="mb-10 leading-relaxed text-gray-300">
        {BUSINESS_NAME} is fully mobile in {city}. Choose a topic below for
        detailed pages on paintless dent repair, dent removal, auto hail damage
        repair, and insurance-friendly service—or start with photos for a quote.
      </p>

      <h2 className="mb-4 text-xl font-semibold text-white">
        {city} service pages
      </h2>
      <div className="mb-12 space-y-3">
        {AREA_TOPICS.map((topic) => (
          <Link
            key={topic.slug}
            href={`/areas/${area.slug}/${topic.slug}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-gray-900 px-5 py-4 transition hover:border-cyan-500/50"
          >
            <div>
              <p className="font-semibold text-white">{topic.h1(city)}</p>
              <p className="mt-0.5 text-sm text-gray-500">{topic.label}</p>
            </div>
            <ChevronRight className="shrink-0 text-cyan-400" size={20} />
          </Link>
        ))}
      </div>

      {area.neighborhoods && area.neighborhoods.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Neighborhoods near {city}
          </h2>
          <p className="flex flex-wrap gap-2">
            {area.neighborhoods.map((n) => (
              <span
                key={n}
                className="rounded-full border border-gray-700 bg-gray-950 px-3 py-1 text-sm text-gray-400"
              >
                {n}
              </span>
            ))}
          </p>
        </div>
      )}

      {area.nearby && area.nearby.length > 0 && (
        <p className="mb-10 text-sm text-gray-500">
          Also serving{" "}
          {area.nearby.map((n, i) => (
            <span key={n}>
              {i > 0 && (i === area.nearby!.length - 1 ? ", and " : ", ")}
              <Link
                href={`/areas/${n.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-cyan-400 hover:underline"
              >
                {n}
              </Link>
            </span>
          ))}
          .{" "}
          <Link href="/areas" className="text-cyan-400 hover:underline">
            All areas
          </Link>
        </p>
      )}

      <p className="mb-8 rounded-xl border border-gray-800 bg-gray-950/80 p-4 text-sm text-gray-400">
        <MapPin className="mb-1 inline text-cyan-400" size={16} /> Mobile
        service in {area.stateLabel}. Call{" "}
        <a href={`tel:${PHONE_TEL}`} className="text-cyan-400 hover:underline">
          {PHONE}
        </a>
        .
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          <Camera size={20} />
          Start with Photos
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
        >
          <Phone size={18} />
          {PHONE}
        </a>
      </div>
    </div>
  );
}
