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
            Paintless dent repair Houston — factory-look results
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Hail Lions specializes in paintless dent repair Houston drivers trust:
            paintless dent removal Houston locals use for door dings, and
            professional dent repair Houston without unnecessary paint or filler.
            Send photos for a fast estimate.
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
                quality={85}
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
              Auto dent repair & auto hail damage repair
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-400">
              From parking-lot dings to storm hail — mobile service across
              greater Houston with insurance approved documentation when you
              file a claim.
            </p>
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
                  quality={85}
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
          <h2 className="text-3xl font-bold text-white">
            Why Hail Lions for dent repair Houston?
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={Truck}
            title="Fully Mobile"
            body="Paintless dent removal Houston-wide at your home, work, or dealership. No shop drop-off for most jobs."
            factor={0.2}
          />
          <FeatureCard
            icon={Shield}
            title="Insurance approved support"
            body="Clear estimates and documentation for auto hail damage repair claims. Guarantee + lifetime warranty on our work."
            factor={0.28}
          />
          <FeatureCard
            icon={Camera}
            title="Photo-first quotes"
            body="Send photos, get a fast auto dent repair estimate, accept online, and pick a time that works."
            factor={0.24}
          />
        </div>
        <div className="mx-auto mt-12 max-w-3xl space-y-4 text-center text-gray-400 leading-relaxed">
          <p>
            <strong className="text-white">Paintless dent repair Houston</strong>{" "}
            is our core service: we restore metal without sanding or repainting
            when the factory paint is intact. That same approach powers{" "}
            <strong className="text-white">paintless dent removal Houston</strong>{" "}
            customers request after door dings and shopping-cart marks.
          </p>
          <p>
            Need broader <strong className="text-white">dent repair Houston</strong>{" "}
            help or full-panel{" "}
            <strong className="text-white">auto hail damage repair</strong>? We
            assess from your photos, explain what PDR can and cannot do, and
            support an <strong className="text-white">insurance approved</strong>{" "}
            workflow when your carrier covers the loss.
          </p>
          <p className="text-sm text-gray-500">
            Serving Houston, Baytown, Katy, Cypress, The Woodlands, Spring, and
            surrounding cities with mobile auto dent repair.
          </p>
        </div>
      </section>
    </>
  );
}
