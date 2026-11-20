import Link from "next/link";
import { Camera, Phone, MapPin, Check } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";
import type { AreaContent } from "@/lib/area-content";

/** Renders only the unique copy defined per city in area-content — no shared boilerplate paragraphs. */
export default function AreaPage({ area }: { area: AreaContent }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        Service area · {area.stateLabel}
      </p>
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        {area.h1}
      </h1>
      <p className="mb-8 text-lg text-cyan-400">{area.tagline}</p>

      <div className="space-y-6 leading-relaxed text-gray-300">
        {area.intro.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}

        <h2 className="pt-2 text-2xl font-semibold text-white">
          {area.hailHeading}
        </h2>
        {area.hailBody.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}

        <h2 className="pt-2 text-2xl font-semibold text-white">
          {area.servicesHeading}
        </h2>
        <ul className="space-y-2">
          {area.services.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          {area.insuranceHeading}
        </h2>
        {area.insuranceBody.map((p) => (
          <p key={p.slice(0, 48)}>{p}</p>
        ))}

        <h2 className="pt-2 text-2xl font-semibold text-white">
          {area.processHeading}
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          {area.processSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        {area.neighborhoods && area.neighborhoods.length > 0 && (
          <>
            <h2 className="pt-2 text-2xl font-semibold text-white">
              Neighborhoods near {area.name}
            </h2>
            <p className="flex flex-wrap gap-2">
              {area.neighborhoods.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-sm text-gray-300"
                >
                  {n}
                </span>
              ))}
            </p>
          </>
        )}

        <p>{area.closing}</p>

        {area.nearby && area.nearby.length > 0 && (
          <p className="text-sm text-gray-500">
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

        <p className="rounded-xl border border-gray-800 bg-gray-950/80 p-4 text-sm text-gray-400">
          <MapPin className="mb-1 inline text-cyan-400" size={16} />{" "}
          {area.stateLabel}. Call{" "}
          <a href={`tel:${PHONE_TEL}`} className="text-cyan-400 hover:underline">
            {PHONE}
          </a>
          .
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
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
