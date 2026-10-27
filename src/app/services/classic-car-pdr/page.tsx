import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Classic Car Paintless Dent Repair Houston",
  description:
    "PDR for classic and vintage cars in Houston. Preserve original paint and value. Careful, experienced technicians.",
  alternates: { canonical: "/services/classic-car-pdr" },
};

export default function ClassicCarPdrPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Classic Car PDR
      </h1>
      <p className="text-xl text-cyan-400 mb-8">
        Protect original paint and value
      </p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          A dent on a classic or vintage vehicle is more than cosmetic — it can
          affect originality and resale value. Paintless dent repair is often
          the best option because it avoids modern paint and fillers that do not
          match period finishes.
        </p>
        <p>
          We take extra care with older metals, limited access points, and
          delicate finishes. Before any tool touches the car, we discuss the
          approach and what to expect so you stay in control.
        </p>

        <h2 className="text-2xl font-semibold text-white pt-4">
          Why PDR for classics?
        </h2>
        <ul className="space-y-3">
          {[
            "Original factory or period paint stays intact",
            "No sanding or body filler that can fail later",
            "Preserves authenticity and collector value",
            "Experienced hands for limited access panels",
            "Lifetime warranty for as long as you own the vehicle",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="text-cyan-400 shrink-0 mt-0.5" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p>
          Not every dent on a classic is a candidate for PDR — we will tell you
          honestly if traditional methods are the better path. Send photos and
          we will give you a clear recommendation.
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
