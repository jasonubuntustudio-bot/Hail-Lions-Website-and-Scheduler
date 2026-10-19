import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair Pearland TX",
  description:
    "Mobile paintless dent repair in Pearland, Texas. Hail damage and door dings fixed at your location. Call (281) 352-5434.",
};

export default function PearlandPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
        Paintless Dent Repair in Pearland
      </h1>
      <p className="text-cyan-400 mb-6 sm:mb-8">Mobile service in Pearland TX</p>

      <div className="space-y-5 text-gray-300 leading-relaxed">
        <p>
          Hail Lions provides mobile paintless dent repair in Pearland and nearby
          communities. We come to your home, office, or dealership — no shop
          drop-off required.
        </p>
        <p>
          Whether you are dealing with hail damage, door dings, or creases, we
          restore panels without paint or fillers so your factory finish and
          value stay intact. Every job includes our 100% satisfaction guarantee
          and lifetime warranty.
        </p>
        <p>
          Send clear photos for a fast estimate, choose a time window that works
          for you, and we will meet you in Pearland.
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
