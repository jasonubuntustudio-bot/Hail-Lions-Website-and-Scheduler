import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";

export const metadata = {
  title: "Classic Car Paintless Dent Repair Houston TX | Preserve Original Paint",
  description:
    "Classic and vintage car PDR in Houston. Preserve original paint and collector value with careful paintless dent repair. Mobile service. (281) 352-5434.",
  alternates: { canonical: "/services/classic-car-pdr" },
};

export default function ClassicCarPdrPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        Service
      </p>
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        Classic Car Paintless Dent Repair
      </h1>
      <p className="mb-8 text-xl text-cyan-400">
        Houston mobile PDR that protects original paint and value
      </p>

      <div className="space-y-6 leading-relaxed text-gray-300">
        <p>
          A dent on a classic or vintage vehicle is more than cosmetic — it can
          affect originality, show scores, and resale.{" "}
          <strong className="text-white">Paintless dent repair</strong> is often
          the best path because it avoids modern paint and fillers that do not
          match period finishes.
        </p>
        <p>
          {BUSINESS_NAME} provides careful, mobile PDR for classics across greater
          Houston. We discuss access, metal condition, and expectations before
          tools touch the car so you stay in control of the outcome.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Why owners choose PDR for classics
        </h2>
        <ul className="space-y-3">
          {[
            "Original factory or period paint stays intact when the surface is unbroken",
            "No sanding or body filler that can fail or show under show lighting",
            "Helps preserve authenticity and collector value",
            "Experienced approach for limited access and older panel designs",
            "Lifetime warranty for as long as you own the vehicle",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          What we need from you
        </h2>
        <p>
          Clear photos of each dent (straight-on and at an angle), year/make/model,
          and notes about prior repairs or special finishes. We will tell you
          honestly if traditional methods are the better path for part of the
          panel.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Mobile service for show and driver cars
        </h2>
        <p>
          Many classics are repaired at the owner’s preferred location when
          access and weather allow. That reduces transport risk and keeps the
          car in a familiar environment during the work.
        </p>

        <p>
          Also see{" "}
          <Link
            href="/services/paintless-dent-repair"
            className="text-cyan-400 hover:underline"
          >
            general PDR
          </Link>{" "}
          and{" "}
          <Link
            href="/services/mobile-dent-repair"
            className="text-cyan-400 hover:underline"
          >
            mobile dent repair
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
