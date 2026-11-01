import Link from "next/link";
import { Camera, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL, BUSINESS_NAME } from "@/lib/utils";

export const metadata = {
  title: "Mobile Dent Repair Houston TX | We Come to You | Hail Lions",
  description:
    "Mobile paintless dent repair in Houston. We come to your home, office, or driveway for hail damage and door dings. No shop drop-off. (281) 352-5434.",
  alternates: { canonical: "/services/mobile-dent-repair" },
};

export default function MobileDentRepairPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cyan-500/80">
        Service
      </p>
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        Mobile Dent Repair in Houston, TX
      </h1>
      <p className="mb-8 text-xl text-cyan-400">
        Paintless dent repair at your home, office, or workplace
      </p>

      <div className="space-y-6 leading-relaxed text-gray-300">
        <p>
          You should not have to rearrange your week to leave a car at a body
          shop. {BUSINESS_NAME} is a{" "}
          <strong className="text-white">fully mobile paintless dent repair</strong>{" "}
          service: we bring the tools and skill to your driveway, office lot, or
          another safe, accessible location across greater Houston.
        </p>
        <p>
          Mobile PDR is ideal for door dings, many creases, and hail damage when
          the factory paint is still intact. Most single-panel jobs finish in
          one visit when weather and access allow.
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          How mobile service works
        </h2>
        <ul className="space-y-3">
          {[
            "Upload clear photos for a written estimate",
            "Accept the quote and sign the repair authorization online",
            "Pick a date, time window, and the address where the vehicle will be",
            "Technician arrives with everything needed for PDR",
            "Work is completed on-site when conditions allow — satisfaction guaranteed",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Where we work
        </h2>
        <p>
          Parking lots, driveways, and open garages are fine when the vehicle is
          accessible and safe to work on. We need reasonable space around the
          panels being repaired and weather that allows careful metal work
          outdoors.
        </p>
        <p>
          Service covers Houston and surrounding communities including{" "}
          <Link href="/areas/katy" className="text-cyan-400 hover:underline">
            Katy
          </Link>
          ,{" "}
          <Link href="/areas/cypress" className="text-cyan-400 hover:underline">
            Cypress
          </Link>
          ,{" "}
          <Link
            href="/areas/the-woodlands"
            className="text-cyan-400 hover:underline"
          >
            The Woodlands
          </Link>
          ,{" "}
          <Link href="/areas/baytown" className="text-cyan-400 hover:underline">
            Baytown
          </Link>
          , Spring, Sugar Land, Pearland, Tomball, Conroe, and more. See the full{" "}
          <Link href="/areas" className="text-cyan-400 hover:underline">
            service area list
          </Link>
          .
        </p>

        <h2 className="pt-2 text-2xl font-semibold text-white">
          Mobile vs shop drop-off
        </h2>
        <ul className="space-y-2">
          {[
            "No loaner car required for many smaller jobs",
            "You stay with your schedule — we come to you",
            "Same lifetime warranty as any Hail Lions repair",
            "Photo estimate first so you know the plan before we arrive",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 shrink-0 text-cyan-400" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p>
          Related:{" "}
          <Link
            href="/services/paintless-dent-repair"
            className="text-cyan-400 hover:underline"
          >
            paintless dent repair
          </Link>
          ,{" "}
          <Link
            href="/services/hail-damage-repair"
            className="text-cyan-400 hover:underline"
          >
            hail damage repair
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
