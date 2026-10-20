import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, Shield, Truck, Phone, Check, Sparkles } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

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
      {/* Hero with photo background */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85"
          alt="Premium vehicle — paintless dent repair"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#05080c]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.18),_transparent_55%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-20 w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl scale-150" />
              <Image
                src="/logo.png"
                alt="Hail Lions"
                width={100}
                height={100}
                className="relative rounded-full w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-500/30"
                priority
              />
            </div>
          </div>

          <p className="inline-flex items-center gap-2 text-cyan-300 text-sm font-medium mb-4 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            <Sparkles size={14} />
            Houston · Baytown · Mobile PDR
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 leading-[1.05] text-glow">
            The King of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400">
              Dent Repair
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            Hail damage, door dings, and creases — fixed at your location
            without paint.{" "}
            <span className="text-white font-medium">
              100% satisfaction guarantee · Lifetime warranty
            </span>
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-200 text-black font-bold text-base sm:text-lg px-8 py-4 rounded-2xl transition shadow-[0_0_40px_rgba(0,212,255,0.45)] min-h-[52px] w-full sm:w-auto"
            >
              <Camera size={22} />
              Start with Photos
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/5 backdrop-blur text-white hover:bg-white/10 font-semibold text-base sm:text-lg px-8 py-4 rounded-2xl transition min-h-[52px] w-full sm:w-auto"
            >
              <Phone size={22} />
              {PHONE}
            </a>
          </div>
        </div>
      </section>

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

      {/* CTA band */}
      <section className="relative py-16 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80"
          alt="Technician working on vehicle"
          fill
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/90 via-black/80 to-black/90" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to fix those dents?
          </h2>
          <p className="text-gray-300 mb-8">
            Upload photos for a quote — or call Jason directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-bold px-8 py-4 rounded-2xl min-h-[52px] shadow-[0_0_30px_rgba(0,212,255,0.4)]"
            >
              <Camera size={20} />
              Book with Photos
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 border border-cyan-400/50 text-cyan-300 font-semibold px-8 py-4 rounded-2xl min-h-[52px] hover:bg-cyan-500/10"
            >
              <Phone size={20} />
              {PHONE}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
