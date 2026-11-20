import type { Metadata } from "next";
import { MapPin, Shield, Truck, Check } from "lucide-react";
import ParallaxHero from "@/components/ParallaxHero";
import ParallaxBand from "@/components/ParallaxBand";
import HomeParallaxSections from "@/components/HomeParallaxSections";
import { PHONE } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute:
      "Paintless Dent Repair Houston | Auto Hail Damage Repair | Hail Lions",
  },
  description:
    "Paintless dent repair Houston, paintless dent removal Houston, and auto dent repair. Mobile auto hail damage repair — insurance approved process support. Call " +
    PHONE,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Paintless Dent Repair Houston | Hail Lions",
    description:
      "Mobile paintless dent repair and auto hail damage repair across greater Houston. Photo estimates. Insurance approved support.",
    url: "/",
    images: [
      {
        url: "/images/hero.webp",
        alt: "Paintless dent repair Houston — Hail Lions mobile PDR",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="bg-[#05080c]">
      <ParallaxHero />

      {/* Trust bar */}
      <section className="border-y border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-gray-950 to-cyan-950/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 text-center text-sm md:grid-cols-4">
          {[
            { icon: Shield, label: "100% Guarantee" },
            { icon: Check, label: "Lifetime Warranty" },
            { icon: Truck, label: "Fully Mobile" },
            { icon: MapPin, label: "Houston & Baytown" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon className="text-cyan-400" size={22} />
              <span className="font-semibold text-white">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <HomeParallaxSections />

      <ParallaxBand />
    </div>
  );
}
