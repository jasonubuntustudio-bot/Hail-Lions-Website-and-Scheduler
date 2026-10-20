"use client";

import Link from "next/link";
import { Camera, Shield, Truck } from "lucide-react";
import ParallaxImage from "@/components/ParallaxImage";
import { useParallax } from "@/hooks/useParallax";
import { IMAGES } from "@/lib/images";

const GALLERY_FACTORS = [0.28, 0.4, 0.22, 0.36];
const SERVICE_FACTORS = [0.32, 0.42, 0.28];

function FeatureCard({
  icon: Icon,
  title,
  body,
  factor,
}: {
  icon: typeof Truck;
  title: string;
  body: string;
  factor: number;
}) {
  const { ref, y } = useParallax(factor);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="card-glow will-change-transform rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-gray-900 to-gray-950 p-6"
      style={{ transform: `translate3d(0, ${y * 0.5}px, 0)` }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15">
        <Icon className="text-cyan-400" size={24} />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="leading-relaxed text-gray-400">{body}</p>
    </div>
  );
}

export default function HomeParallaxSections() {
  const headingGallery = useParallax(0.15);
  const headingServices = useParallax(0.15);
  const headingWhy = useParallax(0.12);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div
          ref={headingGallery.ref as React.RefObject<HTMLDivElement>}
          className="mb-10 text-center will-change-transform"
          style={{ transform: `translate3d(0, ${headingGallery.y}px, 0)` }}
        >
          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Results that look factory
          </h2>
          <p className="mx-auto max-w-xl text-gray-400">
            Paintless dent repair keeps your original finish. Send your own
            photos for a fast estimate — or replace these with your real job
            photos anytime.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {IMAGES.gallery.map((g, i) => (
            <div
              key={g.alt}
              className="card-glow group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10"
            >
              <ParallaxImage
                src={g.src}
                alt={g.alt}
                factor={GALLERY_FACTORS[i] ?? 0.3}
                className="absolute inset-0 h-full w-full"
                imageClassName="object-cover object-center transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 240px"
                quality={65}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white">
                {g.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          Placeholder stock photos — swap in your before/after shots for max
          impact.
        </p>
      </section>

      <section className="bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div
            ref={headingServices.ref as React.RefObject<HTMLDivElement>}
            className="mb-10 text-center will-change-transform"
            style={{ transform: `translate3d(0, ${headingServices.y}px, 0)` }}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              What we fix
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {IMAGES.services.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="card-glow group relative min-h-[280px] overflow-hidden rounded-2xl border border-white/10 transition hover:border-cyan-400/50"
              >
                <ParallaxImage
                  src={s.img}
                  alt={s.title}
                  factor={SERVICE_FACTORS[i] ?? 0.3}
                  className="absolute inset-0 h-full w-full"
                  imageClassName="object-cover object-center transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  quality={68}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="mb-1 text-xl font-bold text-white">
                    {s.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-300">{s.desc}</p>
                  <span className="text-sm font-semibold text-cyan-400">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <div
          ref={headingWhy.ref as React.RefObject<HTMLDivElement>}
          className="mb-10 text-center will-change-transform"
          style={{ transform: `translate3d(0, ${headingWhy.y}px, 0)` }}
        >
          <h2 className="text-3xl font-bold text-white">Why Hail Lions?</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={Truck}
            title="Fully Mobile"
            body="We come to your home, work, or dealership. No shop drop-off required."
            factor={0.2}
          />
          <FeatureCard
            icon={Shield}
            title="100% Guarantee"
            body="Not happy? You don't pay. Lifetime warranty for as long as you own the vehicle."
            factor={0.28}
          />
          <FeatureCard
            icon={Camera}
            title="Photo-first quotes"
            body="Send clear photos, get a fast estimate, pick a time — we handle the rest."
            factor={0.24}
          />
        </div>
      </section>
    </>
  );
}
