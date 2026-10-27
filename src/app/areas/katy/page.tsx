import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair Katy TX",
  description:
    "Mobile paintless dent repair in Katy, Texas. Hail damage and door dings fixed at your home or office. (281) 352-5434.",
  alternates: { canonical: "/areas/katy" },
};

export default function KatyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">
        Paintless Dent Repair in Katy
      </h1>
      <p className="text-cyan-400 mb-8">We come to you in Katy, TX</p>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Katy residents do not need to drive into town and leave a car at a
          body shop for days. Hail Lions brings mobile paintless dent repair
          straight to your driveway or workplace in Katy and nearby communities.
        </p>
        <p>
          From hail storms that roll through the western suburbs to everyday
          door dings at retail centers, we restore panels without paint. Same
          satisfaction guarantee and lifetime warranty as everywhere else we
          serve.
        </p>
        <p>
          Send a few clear photos for an estimate, pick a time window, and we
          will meet you in Katy.
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
