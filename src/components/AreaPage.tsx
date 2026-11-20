import Link from "next/link";
import { Camera, Phone, MapPin, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";
import type { AreaContent } from "@/lib/area-content";

/**
 * One full SEO page per city. Keywords integrated naturally.
 */
export default function AreaPage({ area }: { area: AreaContent }) {
  const city = area.name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        Service area · {area.stateLabel}
      </p>
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        Paintless Dent Repair {city}
      </h1>
      <p className="mb-8 text-lg text-cyan-400">{area.tagline}</p>

      <div className="space-y-6 leading-relaxed text-gray-300">
        <p>
          {BUSINESS_NAME} provides mobile{" "}
          <strong className="text-white">paintless dent repair {city}</strong>{" "}
          for drivers who want factory-finish results without a body-shop
          drop-off. Whether you need everyday{" "}
          <strong className="text-white">dent repair {city}</strong> or help
          after a storm, we come to your home, office, or another convenient
          spot in {area.stateLabel}.
        </p>

        <p>
          <strong className="text-white">Paintless dent removal {city}</strong>{" "}
          works by carefully massaging the metal back toward its original shape
          while your OEM paint stays intact—no sanding, filler, or unnecessary
          repaint when the panel is a good candidate. That same approach powers
          our <strong className="text-white">auto dent repair</strong> work on
          cars, trucks, and SUVs across the area.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Auto hail damage repair in {city}
        </h2>
        <p>
          {area.hailNote ||
            `${city} and nearby communities see periodic Texas hail. When dents
            cover a hood, roof, or trunk, paintless methods are often the
            fastest way to restore the vehicle without a full refinish.`}
        </p>
        <p>
          Our team handles <strong className="text-white">auto hail damage repair</strong>{" "}
          with clear photo estimates first. You review the quote, accept online,
          and choose a time window—we bring the tools to you in {city}.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          What we fix
        </h2>
        <ul className="space-y-2">
          {[
            `Paintless dent repair ${city} for door dings and parking-lot marks`,
            `Paintless dent removal ${city} that preserves factory paint`,
            `Dent repair ${city} for soft creases when the clear coat is intact`,
            "Auto dent repair on steel and many aluminum panels",
            "Auto hail damage repair after local storms",
            "Mobile service—no shop drop-off for most qualifying jobs",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Insurance approved process support
        </h2>
        <p>
          Many carriers treat paintless work as an{" "}
          <strong className="text-white">insurance approved</strong> option for
          qualifying hail and door-ding damage because it keeps factory paint and
          can limit cost versus full body refinish. We provide written estimates
          and documentation you can share with your adjuster.
        </p>
        <p>
          Coverage and deductibles are always between you and your insurer. We
          make the repair scope clear so you can move the claim forward with
          confidence—whether you use insurance or pay out of pocket for{" "}
          <strong className="text-white">auto dent repair</strong> in {city}.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          How mobile PDR works in {city}
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Send photos through our{" "}
            <Link href="/book" className="text-cyan-400 hover:underline">
              online booking
            </Link>{" "}
            form for paintless dent repair {city}.
          </li>
          <li>
            Receive a written estimate for paintless dent removal or auto hail
            damage repair.
          </li>
          <li>Accept the quote and sign authorization online when ready.</li>
          <li>
            Pick a date and time; we meet you in {city} for mobile service.
          </li>
        </ol>

        {area.neighborhoods && area.neighborhoods.length > 0 && (
          <>
            <h2 className="pt-2 text-2xl font-semibold text-white">
              Neighborhoods we serve near {city}
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

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Why Hail Lions for dent repair {city}
        </h2>
        <p>
          We are fully mobile, quote from your photos first, and stand behind
          every job with a satisfaction guarantee and lifetime warranty on our
          paintless workmanship. From a single door ding to broader{" "}
          <strong className="text-white">auto hail damage repair</strong>, you
          get honest recommendations—including when traditional body work is the
          better path.
        </p>

        {area.nearby && area.nearby.length > 0 && (
          <>
            <h2 className="pt-2 text-2xl font-semibold text-white">
              Nearby service areas
            </h2>
            <p className="text-gray-400">
              We also offer paintless dent repair in{" "}
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
              . See the full list on our{" "}
              <Link href="/areas" className="text-cyan-400 hover:underline">
                service areas
              </Link>{" "}
              page.
            </p>
          </>
        )}

        <p className="rounded-xl border border-gray-800 bg-gray-950/80 p-4 text-sm text-gray-400">
          <MapPin className="mb-1 inline text-cyan-400" size={16} /> Mobile{" "}
          <strong className="text-gray-300">
            paintless dent repair {city}
          </strong>
          . Questions about insurance approved claims or scheduling? Call{" "}
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
