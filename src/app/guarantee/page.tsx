import Link from "next/link";
import { Shield, Check } from "lucide-react";

export const metadata = {
  title: "100% Satisfaction Guarantee & Lifetime Warranty",
  description:
    "Hail Lions offers a 100% satisfaction guarantee and lifetime warranty on every paintless dent repair.",
  alternates: { canonical: "/guarantee" },
};

export default function GuaranteePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-cyan-400" size={32} />
        <h1 className="text-4xl font-bold text-white">Our Guarantee</h1>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Check className="text-cyan-400" size={20} />
            100% Satisfaction Guarantee
          </h2>
          <p className="text-gray-300 leading-relaxed">
            If you are not completely satisfied with the repair, you do not owe
            anything. We take pride in our work and stand behind every job. Your
            happiness is the measure of our success.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <Check className="text-cyan-400" size={20} />
            Lifetime Warranty
          </h2>
          <p className="text-gray-300 leading-relaxed">
            All paintless dent repairs carry a lifetime warranty for as long as
            you own the vehicle. If a repaired area ever needs attention, we
            will make it right.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-3">
            Why this matters
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Traditional body shops often use fillers and paint that can fail
            over time and lower resale value. Paintless dent repair preserves
            your factory finish. Our guarantee and warranty give you confidence
            that the job is done right the first time.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Link
          href="/book"
          className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition"
        >
          Start with Photos
        </Link>
      </div>
    </div>
  );
}
