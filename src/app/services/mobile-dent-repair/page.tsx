import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Mobile Dent Repair Houston",
  description:
    "Mobile paintless dent repair in Houston. We come to your home, office, or dealership. No drop-off required.",
  alternates: { canonical: "/services/mobile-dent-repair" },
};

export default function MobileDentRepairPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Mobile Dent Repair
      </h1>
      <p className="text-xl text-cyan-400 mb-8">We come to you</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          You do not need to drop your car at a shop and wait for days. Hail
          Lions is fully mobile. We bring the tools and expertise to your
          driveway, workplace, or dealership across greater Houston.
        </p>
        <p>
          Parking lots, driveways, and garages are all fine as long as the
          vehicle is accessible and safe to work on. Most single-dent jobs are
          finished the same visit.
        </p>

        <h2 className="text-2xl font-semibold text-white pt-4">
          How mobile service works
        </h2>
        <ul className="space-y-3">
          {[
            "Upload photos for a fast estimate",
            "Choose a date and time window that works for you",
            "Enter the address where the vehicle will be",
            "Technician arrives with everything needed",
            "You approve the work — satisfaction guaranteed",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="text-cyan-400 shrink-0 mt-0.5" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold text-white pt-4">
          Service area
        </h2>
        <p>
          We serve Houston and surrounding communities including Katy, Cypress,
          The Woodlands, Spring, Conroe, Baytown, Sugar Land, Pearland, Tomball,
          and more. If you are unsure whether we cover your location, call or
          start a booking and we will confirm.
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
