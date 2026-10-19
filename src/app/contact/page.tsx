import Link from "next/link";
import { Phone, Camera, MapPin, User } from "lucide-react";
import {
  PHONE,
  PHONE_TEL,
  OWNER_1_NAME,
  OWNER_1_TITLE,
  OWNER_2_NAME,
  OWNER_2_TITLE,
  OWNER_2_PHONE,
  OWNER_2_PHONE_TEL,
} from "@/lib/utils";

export const metadata = {
  title: "Contact",
  description:
    "Contact Hail Lions for mobile paintless dent repair in Houston. Call (281) 352-5434 or book online with photos.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact</h1>
      <p className="text-gray-400 mb-8 sm:mb-10">
        Prefer to talk first? Call us. Ready to book? Start with photos.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <a
          href={`tel:${PHONE_TEL}`}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 hover:border-cyan-500/50 active:border-cyan-500 transition block min-h-[44px]"
        >
          <Phone className="text-cyan-400 mb-3" size={28} />
          <h2 className="text-lg font-semibold text-white mb-1">Main line</h2>
          <p className="text-cyan-400 font-medium text-xl">{PHONE}</p>
          <p className="text-gray-500 text-sm mt-2">
            {OWNER_1_NAME} · {OWNER_1_TITLE}
          </p>
        </a>

        <Link
          href="/book"
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 hover:border-cyan-500/50 active:border-cyan-500 transition block"
        >
          <Camera className="text-cyan-400 mb-3" size={28} />
          <h2 className="text-lg font-semibold text-white mb-1">Book online</h2>
          <p className="text-gray-300 text-sm">
            Upload photos for a fast estimate
          </p>
          <p className="text-cyan-400 text-sm mt-2 font-medium">
            Start with Photos →
          </p>
        </Link>
      </div>

      {/* Team / owners */}
      <h2 className="text-xl font-semibold text-white mb-4">Owners</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-cyan-500/15 flex items-center justify-center shrink-0">
            <User className="text-cyan-400" size={20} />
          </div>
          <div>
            <p className="text-white font-medium">{OWNER_1_NAME}</p>
            <p className="text-gray-500 text-sm">{OWNER_1_TITLE}</p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="text-cyan-400 text-sm mt-1 inline-block"
            >
              {PHONE}
            </a>
          </div>
        </div>

        <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-5 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
            <User className="text-gray-500" size={20} />
          </div>
          <div>
            <p className="text-white font-medium">{OWNER_2_NAME}</p>
            <p className="text-gray-500 text-sm">{OWNER_2_TITLE}</p>
            {OWNER_2_PHONE && OWNER_2_PHONE_TEL ? (
              <a
                href={`tel:${OWNER_2_PHONE_TEL}`}
                className="text-cyan-400 text-sm mt-1 inline-block"
              >
                {OWNER_2_PHONE}
              </a>
            ) : (
              <p className="text-gray-600 text-sm mt-1">Phone TBD</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-cyan-400" size={20} />
          <h2 className="text-lg font-semibold text-white">Service area</h2>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          Fully mobile across greater Houston — including Baytown, Katy, Cypress,
          The Woodlands, Spring, Conroe, Pasadena, Sugar Land, Pearland,
          Tomball, Kingwood, and surrounding communities. We come to you.
        </p>
        <Link
          href="/areas"
          className="inline-block mt-4 text-cyan-400 text-sm font-medium py-2"
        >
          View all service areas →
        </Link>
      </div>
    </div>
  );
}
