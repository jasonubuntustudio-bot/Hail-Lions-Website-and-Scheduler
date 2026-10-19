import Image from "next/image";
import Link from "next/link";
import { Camera, MapPin, Shield, Truck, Phone, Check } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16 md:py-24 text-center">
          <div className="flex justify-center mb-5 sm:mb-6">
            <Image
              src="/logo.png"
              alt="Hail Lions"
              width={88}
              height={88}
              className="rounded-full w-20 h-20 sm:w-24 sm:h-24"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight px-1">
            Mobile Paintless
            <br />
            <span className="text-cyan-400">Dent Repair</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-1">
            We come to you. Hail damage, door dings, creases — restored without
            paint. 100% satisfaction guarantee. Lifetime warranty.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-black font-bold text-base sm:text-lg px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition shadow-lg shadow-cyan-500/25 min-h-[52px] w-full sm:w-auto"
            >
              <Camera size={22} />
              Start with Photos
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 active:bg-cyan-500/20 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition min-h-[52px] w-full sm:w-auto"
            >
              <Phone size={22} />
              Call {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gray-800 bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div className="flex flex-col items-center gap-1">
            <Shield className="text-cyan-400" size={20} />
            <span className="text-white font-medium">100% Guarantee</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Check className="text-cyan-400" size={20} />
            <span className="text-white font-medium">Lifetime Warranty</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="text-cyan-400" size={20} />
            <span className="text-white font-medium">Fully Mobile</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapPin className="text-cyan-400" size={20} />
            <span className="text-white font-medium">Houston Area</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Why Hail Lions?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
              <Truck className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Fully Mobile
            </h3>
            <p className="text-gray-400">
              We come to your home, work, or dealership. No shop drop-off
              required.
            </p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
              <Shield className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              100% Guarantee
            </h3>
            <p className="text-gray-400">
              Not happy with the result? You don&apos;t pay. Lifetime warranty
              on every repair for as long as you own the vehicle.
            </p>
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
              <MapPin className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Greater Houston
            </h3>
            <p className="text-gray-400">
              Houston, Baytown, Katy, Cypress, The Woodlands, Spring, Conroe,
              Pasadena, Sugar Land, Pearland and more.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-950 border-y border-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How Booking Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Send Photos",
                desc: "Upload clear photos of the damage. We will review and send a quote.",
              },
              {
                step: "2",
                title: "Choose Time & Place",
                desc: "Pick a time window. We come to your preferred location.",
              },
              {
                step: "3",
                title: "Technician Arrives",
                desc: "Our tech shows up with all tools. Most jobs finish the same day.",
              },
              {
                step: "4",
                title: "Done & Guaranteed",
                desc: "Approve the work. Lifetime warranty kicks in automatically.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500 text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl transition"
            >
              <Camera size={20} />
              Start Your Booking
            </Link>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Our Services
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: "/services/paintless-dent-repair",
              label: "Paintless Dent Repair",
            },
            {
              href: "/services/hail-damage-repair",
              label: "Hail Damage Repair",
            },
            {
              href: "/services/mobile-dent-repair",
              label: "Mobile Dent Repair",
            },
            {
              href: "/services/classic-car-pdr",
              label: "Classic Car PDR",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-5 text-center transition"
            >
              <span className="text-white font-medium">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-800 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to restore your vehicle?
          </h2>
          <p className="text-gray-400 mb-8">
            Send photos for a fast estimate or call Jason directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-xl transition"
            >
              <Camera size={20} />
              Start with Photos
            </Link>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center gap-2 border border-cyan-500 text-cyan-400 font-semibold px-8 py-4 rounded-xl hover:bg-cyan-500/10 transition"
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
