import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Hail Damage Repair Houston",
  description:
    "Mobile hail damage repair in Houston. Paintless dent repair for hail-damaged vehicles. Insurance-friendly. Lifetime warranty.",
};

export default function HailDamageRepairPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Hail Damage Repair
      </h1>
      <p className="text-xl text-cyan-400 mb-8">Houston TX mobile service</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Hail season hits Houston hard. Dozens or hundreds of small dents
          across the hood, roof, and trunk can destroy the look of your vehicle
          — and drop its value. Paintless dent repair is the best way to restore
          hail damage without paint or fillers.
        </p>
        <p>
          We work with insurance claims every day. Send photos, get a clear
          estimate, and we come to you. Many hail jobs can be completed in a
          day or two depending on severity.
        </p>

        <h2 className="text-2xl font-semibold text-white pt-4">
          PDR vs traditional body shop for hail
        </h2>
        <ul className="space-y-3">
          {[
            "No blending or repainting adjacent panels",
            "Original factory paint stays intact",
            "Faster turnaround — days, not weeks",
            "Often preferred by insurers for non-severe hail",
            "Lifetime warranty on the repair",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="text-cyan-400 shrink-0 mt-0.5" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-white pt-4">
          Insurance claims
        </h2>
        <p>
          When you book, you can mark the job as an insurance claim and add your
          claim number and adjuster details. We provide clear documentation and
          work with you and the carrier so the process stays smooth.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-lg transition"
        >
          <Camera size={20} />
          Start with Photos
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 font-semibold px-6 py-3 rounded-lg hover:bg-cyan-500/10 transition"
        >
          <Phone size={18} />
          {PHONE}
        </a>
      </div>
    </div>
  );
}
