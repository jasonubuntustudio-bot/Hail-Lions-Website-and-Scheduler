import Link from "next/link";
import { Camera, Phone, Check, CloudLightning } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair & Hail Damage Baytown TX",
  description:
    "Mobile paintless dent repair and hail damage repair in Baytown, Texas. We come to you. 100% guarantee. Call (281) 352-5434.",
  alternates: { canonical: "/areas/baytown" },
};

export default function BaytownPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
        Paintless Dent Repair in Baytown
      </h1>
      <p className="text-cyan-400 mb-6 sm:mb-8">
        Mobile PDR &amp; hail damage repair · Baytown TX
      </p>

      <div className="space-y-5 text-gray-300 leading-relaxed">
        <p>
          Hail Lions provides fully mobile paintless dent repair in Baytown and
          nearby communities along the east side of the Houston metro. We come
          to your home, workplace, or dealership — no shop drop-off, no waiting
          days for a loaner.
        </p>
        <p>
          Baytown sees its share of storms and everyday parking-lot dings. We
          restore hail damage, door dings, and creases without paint or fillers
          so your factory finish and resale value stay intact.
        </p>
      </div>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <CloudLightning className="text-cyan-400" size={22} />
          <h2 className="text-xl font-semibold text-white">
            Hail damage repair in Baytown
          </h2>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          After a hail event, dozens of small dents can cover the hood, roof,
          and trunk. Paintless dent repair is usually the best fix: faster than
          a traditional body shop, no paint match issues, and often preferred
          for insurance claims when the paint is not cracked.
        </p>
        <ul className="space-y-2 text-sm text-gray-300">
          {[
            "Photo estimate before we schedule",
            "Insurance claim details welcome on booking",
            "On-site repair at your Baytown address",
            "100% satisfaction guarantee + lifetime warranty",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="text-cyan-400 shrink-0 mt-0.5" size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/services/hail-damage-repair"
          className="inline-block mt-4 text-cyan-400 text-sm font-medium py-1"
        >
          Learn more about hail repair →
        </Link>
      </div>

      <div className="mt-8 space-y-5 text-gray-300 leading-relaxed">
        <p>
          Send clear photos for a fast estimate, pick a time window, and we will
          meet you in Baytown. Most single-panel jobs finish the same visit.
        </p>
      </div>

      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-black font-bold px-6 py-3.5 rounded-xl transition min-h-[48px]"
        >
          <Camera size={20} />
          Start with Photos
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 font-semibold px-6 py-3.5 rounded-xl hover:bg-cyan-500/10 transition min-h-[48px]"
        >
          <Phone size={18} />
          {PHONE}
        </a>
      </div>
    </div>
  );
}
