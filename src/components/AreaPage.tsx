import Link from "next/link";
import { Camera, Phone, MapPin, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";
import type { AreaContent } from "@/lib/area-content";

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
          Looking for{" "}
          <strong className="text-white">paintless dent repair {city}</strong>?{" "}
          {BUSINESS_NAME} provides mobile{" "}
          <strong className="text-white">paintless dent removal {city}</strong>{" "}
          and professional <strong className="text-white">dent repair {city}</strong>{" "}
          at your home, office, or another convenient location—no body-shop
          drop-off required for most qualifying jobs.
        </p>

        <p>
          Our team specializes in <strong className="text-white">auto dent repair</strong>{" "}
          and <strong className="text-white">auto hail damage repair</strong> using
          paintless methods that keep your factory finish. When the paint is
          intact, we massage the metal back toward its original shape instead of
          sanding, filling, or repainting.
        </p>

        <p>
          Many carriers treat PDR as an{" "}
          <strong className="text-white">insurance approved</strong> repair path
          for hail and door dings. We provide clear photo-based estimates and
          documentation so you can move a claim forward when your policy covers
          the damage. You remain responsible for deductibles and any amount your
          insurer does not pay.
        </p>

        {area.hailNote && (
          <>
            <h2 className="pt-2 text-2xl font-semibold text-white">
              Auto hail damage repair in {city}
            </h2>
            <p>{area.hailNote}</p>
            <p>
              After a storm, send photos for an estimate. If paintless repair is
              a fit, accept online and choose a time window in {city}. We handle{" "}
              <strong className="text-white">auto hail damage repair</strong> on
              hoods, roofs, trunks, doors, and other exterior panels when metal
              and paint allow it.
            </p>
          </>
        )}

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Paintless dent removal & auto dent repair in {city}
        </h2>
        <ul className="space-y-2">
          {[
            `Paintless dent repair ${city} for door dings and parking-lot marks`,
            `Paintless dent removal ${city} that preserves OEM paint`,
            `Dent repair ${city} for creases and soft dents (when paint is intact)`,
            "Auto dent repair on steel and many aluminum panels",
            "Auto hail damage repair after Texas storms",
            "Insurance approved process support with clear estimates",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

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
          How mobile paintless dent repair works in {city}
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Send photos through our{" "}
            <Link href="/book" className="text-cyan-400 hover:underline">
              online booking
            </Link>{" "}
            form.
          </li>
          <li>
            Receive a written estimate for paintless dent removal and auto dent
            repair.
          </li>
          <li>Accept the quote and sign authorization online when ready.</li>
          <li>
            Pick a date and time; we meet you in {city} for mobile service.
          </li>
        </ol>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Why choose Hail Lions for dent repair {city}
        </h2>
        <p>
          We are fully mobile, quote from your photos first, and stand behind
          every job with a satisfaction guarantee and lifetime warranty on our
          paintless work. Whether you need everyday{" "}
          <strong className="text-white">auto dent repair</strong> or storm-related{" "}
          <strong className="text-white">auto hail damage repair</strong>, we focus
          on factory-finish results without unnecessary body shop cycles.
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
              . See all locations on our{" "}
              <Link href="/areas" className="text-cyan-400 hover:underline">
                service areas
              </Link>{" "}
              page.
            </p>
          </>
        )}

        <p className="rounded-xl border border-gray-800 bg-gray-950/80 p-4 text-sm text-gray-400">
          <MapPin className="mb-1 inline text-cyan-400" size={16} /> Fully mobile{" "}
          <strong className="text-gray-300">paintless dent repair {city}</strong>{" "}
          — call{" "}
          <a href={`tel:${PHONE_TEL}`} className="text-cyan-400 hover:underline">
            {PHONE}
          </a>{" "}
          with questions about insurance approved claims or scheduling.
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
