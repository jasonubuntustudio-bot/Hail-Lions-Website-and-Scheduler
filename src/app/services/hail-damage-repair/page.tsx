import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";

export const metadata = {
  title: "Hail Damage Repair Houston TX | Mobile Paintless Dent Repair",
  description:
    "Mobile hail damage repair in Houston and surrounding areas. Paintless dent repair restores factory paint. Photo estimates, insurance-friendly. (281) 352-5434.",
  alternates: { canonical: "/services/hail-damage-repair" },
};

export default function HailDamageRepairPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        Service
      </p>
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        Hail Damage Repair in Houston, TX
      </h1>
      <p className="mb-8 text-xl text-cyan-400">
        Mobile paintless dent repair after Texas hail storms
      </p>

      <div className="space-y-6 leading-relaxed text-gray-300">
        <p>
          Greater Houston sits in a high hail-risk region. After a storm, hoods,
          roofs, trunks, and doors can carry dozens or hundreds of small dents.
          <strong className="text-white"> Paintless dent repair (PDR)</strong> is
          often the preferred way to restore the vehicle when the paint is still
          intact—without sanding, filler, or a full repaint.
        </p>
        <p>
          {BUSINESS_NAME} is a <strong className="text-white">fully mobile</strong>{" "}
          hail repair service. You send photos, receive an estimate, accept the
          quote, and we come to your home or workplace across Houston, Katy,
          Cypress, The Woodlands, Baytown, and nearby cities.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Why choose PDR for hail damage?
        </h2>
        <ul className="space-y-3">
          {[
            "Factory paint stays on the car — no blend or color match on undamaged panels",
            "Faster than traditional body work for many hail patterns",
            "Often preferred by insurers when dents qualify for paintless repair",
            "Helps protect resale value compared with unnecessary repaints",
            "Lifetime warranty on our workmanship",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Insurance hail claims
        </h2>
        <p>
          Many customers use insurance for hail. When you book, you can flag the
          job as an insurance claim and share claim or adjuster details. We
          provide clear estimates and documentation so you can move the claim
          forward. You remain responsible for deductibles and any amount your
          carrier does not cover.
        </p>
        <p>
          Need a limited authorization for insurer payments? Our digital repair
          authorization (signed when you accept a quote) includes the terms we
          use for payment and insurance direction-to-pay where applicable.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          How to get a hail estimate
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Take clear photos of each damaged panel (straight-on and angled).
          </li>
          <li>
            Submit them on our{" "}
            <Link href="/book" className="text-cyan-400 hover:underline">
              Start with Photos
            </Link>{" "}
            form with your vehicle info.
          </li>
          <li>Review the estimate we send — accept online when ready.</li>
          <li>Choose a day and time; we meet you for mobile repair.</li>
        </ol>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          When PDR may not be enough
        </h2>
        <p>
          Sharp creases that cracked paint, severely stretched metal, or prior
          body work can limit what paintless methods can do. We will tell you
          honestly if traditional body repair is the better path for part of the
          vehicle.
        </p>

        <p>
          Related services:{" "}
          <Link
            href="/services/paintless-dent-repair"
            className="text-cyan-400 hover:underline"
          >
            paintless dent repair
          </Link>
          ,{" "}
          <Link
            href="/services/mobile-dent-repair"
            className="text-cyan-400 hover:underline"
          >
            mobile dent repair
          </Link>
          , and our{" "}
          <Link href="/areas" className="text-cyan-400 hover:underline">
            Houston-area service map
          </Link>
          .
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/book"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 font-bold text-black transition hover:bg-cyan-400"
        >
          <Camera size={20} />
          Start with Photos
        </Link>
        <a
          href={`tel:${PHONE_TEL}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
        >
          <Phone size={18} />
          {PHONE}
        </a>
      </div>
    </div>
  );
}
