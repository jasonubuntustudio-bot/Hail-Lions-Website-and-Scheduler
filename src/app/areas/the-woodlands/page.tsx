import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair The Woodlands TX",
  description:
    "Mobile paintless dent repair in The Woodlands, Texas. Hail damage and door dings fixed at your location. Call (281) 352-5434.",
  alternates: { canonical: "/areas/the-woodlands" },
};

export default function TheWoodlandsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Paintless Dent Repair in The Woodlands
      </h1>
      <p className="text-cyan-400 mb-8">On-site service in The Woodlands</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          The Woodlands is a busy, car-dependent community. Door dings and the
          occasional hail event are part of driving here. Hail Lions brings
          mobile paintless dent repair to your home or office so you do not have
          to rearrange life around a body shop visit.
        </p>
        <p>
          We specialize in PDR — removing dents without paint so your vehicle
          keeps its original finish and value. Every job includes our 100%
          satisfaction guarantee and lifetime warranty.
        </p>
        <p>
          Upload photos for a quote, choose a convenient window, and we will
          meet you in The Woodlands.
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
