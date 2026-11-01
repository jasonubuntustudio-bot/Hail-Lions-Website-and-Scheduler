import Link from "next/link";
import { Shield, Check, Camera } from "lucide-react";
import { BUSINESS_NAME } from "@/lib/utils";

export const metadata = {
  title: "100% Satisfaction Guarantee & Lifetime Warranty | Hail Lions Houston",
  description:
    "Hail Lions offers a 100% satisfaction guarantee and lifetime warranty on paintless dent repair in Houston. If you are not satisfied, you do not pay.",
  alternates: { canonical: "/guarantee" },
};

export default function GuaranteePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-6 flex items-center gap-3">
        <Shield className="text-cyan-400" size={32} />
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Guarantee & Lifetime Warranty
        </h1>
      </div>
      <p className="mb-10 text-lg text-gray-400">
        Confidence in every mobile paintless dent repair we perform across
        greater Houston.
      </p>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-white">
            <Check className="text-cyan-400" size={20} />
            100% Satisfaction Guarantee
          </h2>
          <p className="leading-relaxed text-gray-300">
            If you are not completely satisfied with the repair, you do not owe
            for that work. {BUSINESS_NAME} stands behind every job. Your approval
            is the measure of success — not a rushed invoice.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold text-white">
            <Check className="text-cyan-400" size={20} />
            Lifetime Warranty
          </h2>
          <p className="leading-relaxed text-gray-300">
            All paintless dent repairs we complete carry a lifetime warranty for
            as long as you own the vehicle. If a repaired area needs attention
            related to our workmanship, we will make it right.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-3 text-xl font-semibold text-white">
            Why this matters for PDR
          </h2>
          <p className="mb-4 leading-relaxed text-gray-300">
            Traditional body repairs often rely on fillers and paint that can
            fail, fade, or lower resale value. Paintless dent repair preserves
            factory finish when the panel is a good candidate. Our guarantee and
            warranty exist so you can choose that path with confidence.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              "Clear estimate before work begins (photo-based quoting)",
              "Honest assessment when PDR is not the right method",
              "Mobile service so you are present for the result",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 shrink-0 text-cyan-400" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-sm text-gray-400">
          Warranty covers workmanship on the paintless repair itself. It does not
          cover new damage from later impacts, unrelated panel issues, or work
          performed by others. Ask us any questions before you accept a quote.
        </div>
      </div>

      <div className="mt-10">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          <Camera size={18} />
          Start with Photos
        </Link>
      </div>
    </div>
  );
}
