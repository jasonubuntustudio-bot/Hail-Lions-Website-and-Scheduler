import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, Shield, Truck, Check } from "lucide-react";
import ParallaxHero from "@/components/ParallaxHero";
import ParallaxBand from "@/components/ParallaxBand";

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    alt: "Polished vehicle after repair",
    label: "Factory finish restored",
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    alt: "Luxury car body detail",
    label: "No paint · no fillers",
  },
  {
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    alt: "Black sports car exterior",
    label: "Door dings & creases",
  },
  {
    src: "https://images.unsplash.com/photo-1542362567-b07e54370788?auto=format&fit=crop&w=800&q=80",
    alt: "Blue performance vehicle",
    label: "Hail damage specialists",
  },
];

const SERVICES = [
  {
    href: "/services/hail-damage-repair",
    title: "Hail Damage",
    desc: "Storm dents fixed on-site without a full body shop rebuild.",
    img: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=900&q=80",
  },
  {
    href: "/services/paintless-dent-repair",
    title: "Paintless Dent Repair",
    desc: "Precision PDR that keeps your original paint and value.",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    href: "/services/mobile-dent-repair",
    title: "Mobile Service",
    desc: "We come to your driveway, office, or dealership in Houston.",
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#05080c]">
      <ParallaxHero />

      {/* Trust bar */}
      <section className="border-y border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-gray-950 to-cyan-950/40">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {[
            { icon: Shield, label: "100% Guarantee" },
            { icon: Check, label: "Lifetime Warranty" },
            { icon: Truck, label: "Fully Mobile" },
            { icon: MapPin, label: "Houston & Baytown" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon className="text-cyan-400" size={22} />
              <span className="text-white font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Photo gallery */}
      <section className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Results that look factory
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Paintless dent repair keeps your original finish. Send your own
            photos for a fast estimate — or replace these with your real job
            photos anytime.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {GALLERY.map((g) => (
            <div
              key={g.alt}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 card-glow"
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white">
                {g.label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          Placeholder stock photos — swap in your before/after shots for max
          impact.
        </p>
      </section>

      {/* Service cards with photos */}
      <section className="bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
            What we fix
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition card-glow min-h-[280px]"
              >
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">{s.desc}</p>
                  <span className="text-cyan-400 text-sm font-semibold">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Why Hail Lions?
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Truck,
              title: "Fully Mobile",
              body: "We come to your home, work, or dealership. No shop drop-off required.",
            },
            {
              icon: Shield,
              title: "100% Guarantee",
              body: "Not happy? You don't pay. Lifetime warranty for as long as you own the vehicle.",
            },
            {
              icon: Camera,
              title: "Photo-first quotes",
              body: "Send clear photos, get a fast estimate, pick a time — we handle the rest.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-500/20 rounded-2xl p-6 card-glow"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
                <f.icon className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <ParallaxBand />
    </div>
  );
}
