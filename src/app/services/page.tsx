import Link from "next/link";
import { Camera, Check } from "lucide-react";

export const metadata = {
  title: "Paintless Dent Repair Services Houston | Hail, Mobile & Classic PDR",
  description:
    "Hail Lions services: paintless dent repair, hail damage repair, mobile PDR, and classic car dent repair in Houston and surrounding areas. Photo estimates.",
  alternates: { canonical: "/services" },
};

const SERVICES = [
  {
    href: "/services/paintless-dent-repair",
    title: "Paintless Dent Repair",
    keyword: "PDR Houston",
    desc: "Door dings, creases, and soft dents removed without paint or fillers. Factory finish preserved with a lifetime warranty.",
  },
  {
    href: "/services/hail-damage-repair",
    title: "Hail Damage Repair",
    keyword: "Hail repair Houston",
    desc: "Storm hail on hoods, roofs, and doors restored with precision PDR. Insurance-friendly estimates and mobile service.",
  },
  {
    href: "/services/mobile-dent-repair",
    title: "Mobile Dent Repair",
    keyword: "Mobile PDR",
    desc: "We come to your home, office, or workplace across greater Houston. No shop drop-off for most qualifying jobs.",
  },
  {
    href: "/services/classic-car-pdr",
    title: "Classic Car PDR",
    keyword: "Classic car dent repair",
    desc: "Careful paintless repair for vintage and collector vehicles. Protect original paint and value.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
        Paintless Dent Repair Services in Houston
      </h1>
      <p className="mx-auto mb-6 max-w-2xl text-center text-gray-400">
        Hail Lions specializes in mobile paintless dent repair (PDR) for greater
        Houston — hail damage, door dings, creases, and classic cars. Every job
        includes our satisfaction guarantee and lifetime warranty.
      </p>
      <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-gray-500">
        Start with photos for a clear estimate, accept online, then choose a time.
        We meet you at a location that works for your schedule.
      </p>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {SERVICES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:border-cyan-500/50"
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-cyan-500/80">
              {s.keyword}
            </p>
            <h2 className="mb-2 text-xl font-semibold text-white">{s.title}</h2>
            <p className="text-sm text-gray-400">{s.desc}</p>
            <span className="mt-4 inline-block text-sm font-medium text-cyan-400">
              Learn more →
            </span>
          </Link>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-800 bg-gray-950/80 p-6">
        <h2 className="mb-3 text-lg font-semibold text-white">
          Why Houston drivers choose PDR
        </h2>
        <ul className="mb-6 space-y-2 text-sm text-gray-400">
          {[
            "No unnecessary repaint when metal and paint allow paintless methods",
            "Often faster than traditional body shop timelines for qualifying damage",
            "Mobile service across Katy, Cypress, The Woodlands, Baytown, and more",
            "Photo-first quoting so you know the plan before we arrive",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 font-bold text-black transition hover:bg-cyan-400"
          >
            <Camera size={18} />
            Start with Photos
          </Link>
        </div>
      </div>
    </div>
  );
}
