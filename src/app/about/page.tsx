import Link from "next/link";
import { Phone, User } from "lucide-react";
import {
  PHONE,
  PHONE_TEL,
  OWNER_1_NAME,
  OWNER_1_TITLE,
  OWNER_2_NAME,
  OWNER_2_TITLE,
} from "@/lib/utils";

export const metadata = {
  title: "About Us",
  description:
    "Meet the owners of Hail Lions LLC — Houston's mobile paintless dent repair specialists.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        About Hail Lions
      </h1>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Hail Lions LLC is a fully mobile paintless dent repair company serving
          greater Houston. We started with the customer in mind: highest quality
          work, a real satisfaction guarantee, and the convenience of coming to
          you.
        </p>
        <p>
          The name Hail Lions stands for Honesty, Integrity, and Pride in the
          work we do. Paintless dent repair is more than a service here — it is
          a craft. If you are not satisfied, you do not owe anything. Every
          repair carries a lifetime warranty for as long as you own the vehicle.
        </p>
      </div>

      {/* Owners */}
      <h2 className="text-2xl font-bold text-white mt-12 mb-6">Ownership</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-full bg-cyan-500/15 flex items-center justify-center mb-4">
            <User className="text-cyan-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white">{OWNER_1_NAME}</h3>
          <p className="text-cyan-400 text-sm mb-3">{OWNER_1_TITLE}</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Grew up in the Houston area. Years in auto body and collision led to
            a focus on paintless dent repair — the best way to restore a vehicle
            without paint or fillers. Married, father of three, and available
            directly to clients.
          </p>
        </div>

        <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-6">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <User className="text-gray-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-white">{OWNER_2_NAME}</h3>
          <p className="text-gray-500 text-sm mb-3">{OWNER_2_TITLE}</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Placeholder for second owner bio. Replace name and details in{" "}
            <code className="text-xs text-gray-400">src/lib/utils.ts</code> when
            ready.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-gray-300 leading-relaxed mb-10">
        <p>
          For me, Paintless Dent Repair is a passion. If you ask a question
          about PDR you should come with a chair — you will get the long answer.
          Having a love for what you do makes it more than an occupation.
        </p>
        <p>
          Customer satisfaction is as high a priority as quality. Convenience
          matters too: we are completely mobile and will meet you at a time and
          place of your choosing across the Houston metro.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/book"
          className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-black font-semibold px-6 py-3.5 rounded-xl transition min-h-[48px]"
        >
          Book Service
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
