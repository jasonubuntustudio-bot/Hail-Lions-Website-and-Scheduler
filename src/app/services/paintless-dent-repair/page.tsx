import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair Houston",
  description:
    "Professional paintless dent repair (PDR) in Houston. No paint, no fillers. We come to you. 100% satisfaction guarantee and lifetime warranty.",
};

export default function PaintlessDentRepairPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Paintless Dent Repair
      </h1>
      <p className="text-xl text-cyan-400 mb-8">Houston & surrounding areas</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Paintless dent repair (PDR) removes dings, dents, and creases without
          sanding, fillers, or repainting. We work from behind the panel using
          specialized tools so your factory finish stays original — and your
          vehicle keeps its value.
        </p>
        <p>
          Most non-collision dents are excellent candidates for PDR. Hail
          damage, door dings, shopping cart marks, and many larger dents can be
          restored the same day at your location.
        </p>

        <h2 className="text-2xl font-semibold text-white pt-4">
          Why choose PDR?
        </h2>
        <ul className="space-y-3">
          {[
            "No paint or body filler — factory finish preserved",
            "Faster than traditional body shop work",
            "Usually less expensive than conventional repair",
            "No Carfax body-shop record in most cases",
            "Lifetime warranty for as long as you own the vehicle",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="text-cyan-400 shrink-0 mt-0.5" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-white pt-4">
          How it works
        </h2>
        <p>
          Send photos for a quick estimate. We schedule a time and come to your
          home, office, or dealership. Most single-panel repairs take one to
          three hours. You inspect the work — if you are not satisfied, you do
          not pay.
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
