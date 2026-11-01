import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";

export const metadata = {
  title: "Paintless Dent Repair Houston TX | Mobile PDR Specialists",
  description:
    "Paintless dent repair in Houston. Mobile PDR for door dings, creases, and hail. Keep factory paint. Photo quotes. Call (281) 352-5434.",
  alternates: { canonical: "/services/paintless-dent-repair" },
};

export default function PaintlessDentRepairPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        Service
      </p>
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        Paintless Dent Repair (PDR) in Houston
      </h1>
      <p className="mb-8 text-xl text-cyan-400">
        Factory-finish dents fixed without paint or body filler
      </p>

      <div className="space-y-6 leading-relaxed text-gray-300">
        <p>
          <strong className="text-white">Paintless dent repair</strong> uses
          specialized rods, tips, and glue-pull systems to gently work metal
          back toward its original contour. When the paint surface is unbroken,
          PDR can remove door dings, many creases, and hail marks without
          sanding or repainting.
        </p>
        <p>
          {BUSINESS_NAME} brings mobile PDR to you across greater Houston—Katy,
          Cypress, The Woodlands, Baytown, Spring, Sugar Land, and more. Send
          photos for an estimate, accept online, and schedule a time that fits
          your day.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Ideal candidates for PDR
        </h2>
        <ul className="space-y-2">
          {[
            "Door dings from parking lots and car doors",
            "Soft hail dents with intact clear coat",
            "Body-line dents where metal has not been severely stretched",
            "Steel and many aluminum exterior panels",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Benefits vs traditional body work
        </h2>
        <ul className="space-y-2">
          {[
            "Original OEM paint preserved",
            "No color-match risk on undamaged panels",
            "Usually faster turnaround for qualifying damage",
            "Often lower cost than full body-shop processes",
            "Lifetime warranty on our paintless repairs",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Our quote-first process
        </h2>
        <p>
          Upload photos → we review damage → you get a written estimate → accept
          and sign authorization → pick an available slot. No surprise shop
          visits just to find out if the dent can be fixed paintless.
        </p>

        <p>
          Also see{" "}
          <Link
            href="/services/hail-damage-repair"
            className="text-cyan-400 hover:underline"
          >
            hail damage repair
          </Link>
          ,{" "}
          <Link
            href="/services/mobile-dent-repair"
            className="text-cyan-400 hover:underline"
          >
            mobile dent repair
          </Link>
          , and{" "}
          <Link
            href="/services/classic-car-pdr"
            className="text-cyan-400 hover:underline"
          >
            classic car PDR
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
