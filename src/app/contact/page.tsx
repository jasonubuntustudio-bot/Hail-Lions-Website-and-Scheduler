import Link from "next/link";
import { Phone, Camera, MapPin } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Contact",
  description:
    "Contact Hail Lions for mobile paintless dent repair in Houston. Call (281) 352-5434 or book online with photos.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Contact</h1>
      <p className="text-gray-400 mb-10">
        Prefer to talk first? Call Jason. Ready to book? Start with photos.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <a
          href={`tel:${PHONE_TEL}`}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition block"
        >
          <Phone className="text-cyan-400 mb-3" size={28} />
          <h2 className="text-lg font-semibold text-white mb-1">Call</h2>
          <p className="text-cyan-400 font-medium text-xl">{PHONE}</p>
          <p className="text-gray-500 text-sm mt-2">Jason Huddleston</p>
        </a>

        <Link
          href="/book"
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition block"
        >
          <Camera className="text-cyan-400 mb-3" size={28} />
          <h2 className="text-lg font-semibold text-white mb-1">Book online</h2>
          <p className="text-gray-300">Upload photos for a fast estimate</p>
          <p className="text-cyan-400 text-sm mt-2 font-medium">
            Start with Photos →
          </p>
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-cyan-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Service area</h2>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          Fully mobile across greater Houston — including Katy, Cypress, The
          Woodlands, Spring, Conroe, Baytown, Sugar Land, Pearland, Tomball, and
          surrounding communities. We come to you.
        </p>
        <Link
          href="/areas"
          className="inline-block mt-4 text-cyan-400 text-sm font-medium hover:underline"
        >
          View all service areas →
        </Link>
      </div>
    </div>
  );
}
