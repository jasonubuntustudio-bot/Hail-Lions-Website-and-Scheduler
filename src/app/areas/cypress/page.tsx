import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair Cypress TX",
  description:
    "Mobile paintless dent repair in Cypress, Texas. Hail and door ding repair at your location. Call (281) 352-5434.",
  alternates: { canonical: "/areas/cypress" },
};

export default function CypressPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Paintless Dent Repair in Cypress
      </h1>
      <p className="text-cyan-400 mb-8">Mobile service in Cypress, TX</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Cypress drivers deal with the same parking-lot dings and seasonal hail
          as the rest of the Houston metro. Hail Lions offers fully mobile
          paintless dent repair so you can get the work done at home or at the
          office without losing a vehicle for days.
        </p>
        <p>
          We use PDR to push dents out from behind the panel — no sanding, no
          fillers, no paint match issues. You keep the factory finish and a
          lifetime warranty on the repair.
        </p>
        <p>
          Book online with photos or call to schedule a visit in Cypress.
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
