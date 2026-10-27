import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair Houston TX",
  description:
    "Mobile paintless dent repair in Houston. Hail damage, door dings, creases. We come to you. Call (281) 352-5434.",
  alternates: { canonical: "/areas/houston" },
};

export default function HoustonPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Paintless Dent Repair in Houston
      </h1>
      <p className="text-cyan-400 mb-8">Mobile service across the city</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Hail Lions provides mobile paintless dent repair throughout Houston.
          Whether you are dealing with hail damage after a storm, a door ding in
          a parking garage, or a crease from a shopping cart, we come to your
          location and restore the panel without paint or fillers.
        </p>
        <p>
          Houston drivers deal with congested lots, frequent storms, and long
          commutes — dents happen. Our goal is to make the fix convenient: photo
          estimate, scheduled window, on-site repair, and a lifetime warranty.
        </p>
        <p>
          We serve neighborhoods and areas across the city and work with both
          cash and insurance jobs. Start with photos for a fast quote, or call
          Jason directly.
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
