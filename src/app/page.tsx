import Link from "next/link";
import { MapPin, Shield, Truck, Check } from "lucide-react";
import ParallaxHero from "@/components/ParallaxHero";
import ParallaxBand from "@/components/ParallaxBand";
import HomeParallaxSections from "@/components/HomeParallaxSections";

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
