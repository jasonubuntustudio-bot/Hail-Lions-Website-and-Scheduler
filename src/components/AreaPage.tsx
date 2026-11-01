import Link from "next/link";
import { Camera, Phone, MapPin, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";
import type { AreaContent } from "@/lib/area-content";

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
        <p>
          {BUSINESS_NAME} provides <strong className="text-white">mobile paintless dent repair</strong>{" "}
          in {area.name}. We come to your home, office, or another convenient spot so you
          skip drop-off at a body shop for everyday dings and many hail repairs.
        </p>

        <p>
          Our technicians use PDR tools to massage metal back toward its original shape
          while keeping your <strong className="text-white">factory paint</strong> intact—
          no unnecessary filler or repaint when the panel is a good PDR candidate.
        </p>

        {area.hailNote && (
          <>
            <h2 className="pt-2 text-2xl font-semibold text-white">
              Hail damage repair in {area.name}
            </h2>
            <p>{area.hailNote}</p>
            <p>
              Start with clear photos for an estimate. If the job is a good fit for
              paintless repair, accept the quote online and choose a time window that
              works for you in {area.name}.
            </p>
          </>
        )}

        <h2 className="pt-2 text-2xl font-semibold text-white">
          What we fix in {area.name}
        </h2>
        <ul className="space-y-2">
          {[
            "Hail dents on hoods, roofs, trunks, and doors",
            "Parking-lot door dings and shopping-cart marks",
            "Creases and larger soft dents (when paint is intact)",
            "Many classic and modern vehicle panels",
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
              Neighborhoods we serve near {area.name}
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
          How mobile PDR works
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Send photos through our{" "}
            <Link href="/book" className="text-cyan-400 hover:underline">
              online booking
            </Link>{" "}
            form.
          </li>
          <li>Receive a clear estimate and accept when you’re ready.</li>
          <li>Pick a date and time; we meet you in {area.name}.</li>
          <li>Repair is completed on-site when conditions allow, with our warranty.</li>
        </ol>

        {area.nearby && area.nearby.length > 0 && (
          <>
            <h2 className="pt-2 text-2xl font-semibold text-white">
              Nearby service areas
            </h2>
            <p className="text-gray-400">
              We also serve{" "}
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
          <MapPin className="mb-1 inline text-cyan-400" size={16} /> Fully mobile —
          no shop drop-off required for most PDR jobs in {area.stateLabel}. Call{" "}
          <a href={`tel:${PHONE_TEL}`} className="text-cyan-400 hover:underline">
            {PHONE}
          </a>{" "}
          with questions.
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
