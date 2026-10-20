"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";
import { IMAGES } from "@/lib/images";

export default function ParallaxBand() {
  const ref = useRef<HTMLElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) {
          ticking = false;
          return;
        }
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        const progress = (viewH / 2 - (rect.top + rect.height / 2)) / viewH;
        setY(progress * 80);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden py-16">
      <div
        className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform"
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={IMAGES.band}
            alt="Technician working on vehicle"
            fill
            className="object-cover object-center opacity-50"
            sizes="(max-width: 768px) 100vw, 1200px"
            quality={85}
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/90 via-black/80 to-black/90" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Ready to fix those dents?
        </h2>
        <p className="mb-8 text-gray-300">
          Upload photos for a quote — or call Jason directly.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/book"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:bg-cyan-300"
          >
            <Camera size={20} />
            Book with Photos
          </Link>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-cyan-400/50 px-8 py-4 font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            <Phone size={20} />
            {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}
