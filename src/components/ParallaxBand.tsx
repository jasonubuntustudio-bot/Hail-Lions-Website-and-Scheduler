"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

const BAND_IMG =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80";

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
        // Progress through viewport: -1 entering, 0 center, 1 leaving
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
    <section ref={ref} className="relative py-16 overflow-hidden">
      <div
        className="absolute inset-x-0 -top-[20%] h-[140%] will-change-transform"
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
      >
        <Image
          src={BAND_IMG}
          alt="Technician working on vehicle"
          fill
          className="object-cover opacity-50"
          sizes="100vw"
        />
      </div>
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
  );
}
