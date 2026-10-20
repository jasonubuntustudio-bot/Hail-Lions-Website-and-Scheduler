"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Phone, Sparkles } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";

const HERO_IMG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85";

export default function ParallaxHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [contentOffset, setContentOffset] = useState(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion.current) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) {
          ticking = false;
          return;
        }
        const rect = el.getBoundingClientRect();
        // How far the section has scrolled past the top of the viewport
        const scrolled = Math.max(0, -rect.top);
        // Background moves slower (classic parallax)
        setOffset(scrolled * 0.45);
        // Content drifts slightly upward for depth
        setContentOffset(scrolled * 0.18);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[88vh] flex items-center overflow-hidden"
    >
      {/* Parallax background layer — taller so edges don't show when shifting */}
      <div
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        <Image
          src={HERO_IMG}
          alt="Premium vehicle — paintless dent repair"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#05080c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.18),_transparent_55%)]" />

      <div
        className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-20 w-full text-center will-change-transform"
        style={{ transform: `translate3d(0, ${contentOffset}px, 0)` }}
      >
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
          Hail damage, door dings, and creases — fixed at your location without
          paint.{" "}
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
  );
}
