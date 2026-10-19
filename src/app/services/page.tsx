import Link from "next/link";

export const metadata = {
  title: "Services",
  description:
    "Paintless dent repair, hail damage, mobile service, classic car PDR — Hail Lions Houston.",
};

const SERVICES = [
  {
    href: "/services/paintless-dent-repair",
    title: "Paintless Dent Repair",
    desc: "Remove dings and dents without paint, fillers, or sanding. Factory finish preserved.",
  },
  {
    href: "/services/hail-damage-repair",
    title: "Hail Damage Repair",
    desc: "Restore hail-damaged panels with precision PDR. Insurance-friendly process.",
  },
  {
    href: "/services/mobile-dent-repair",
    title: "Mobile Dent Repair",
    desc: "We come to your home, office, or dealership across greater Houston.",
  },
  {
    href: "/services/classic-car-pdr",
    title: "Classic Car PDR",
    desc: "Special care for classic and vintage vehicles. Preserve original paint and value.",
  },
];

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4 text-center">
        Our Services
      </h1>
      <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
        Specialized paintless dent repair for Houston and surrounding areas.
        Every job includes our satisfaction guarantee and lifetime warranty.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {SERVICES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-2xl p-6 transition block"
          >
            <h2 className="text-xl font-semibold text-white mb-2">{s.title}</h2>
            <p className="text-gray-400 text-sm">{s.desc}</p>
            <span className="inline-block mt-4 text-cyan-400 text-sm font-medium">
              Learn more →
            </span>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/book"
          className="inline-flex bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl transition"
        >
          Start with Photos
        </Link>
      </div>
    </div>
  );
}
