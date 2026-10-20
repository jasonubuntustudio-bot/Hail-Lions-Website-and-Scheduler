"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Phone, Sparkles } from "lucide-react";
import { PHONE, PHONE_TEL } from "@/lib/utils";
import { IMAGES } from "@/lib/images";

export default function ParallaxHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [bgY, setBgY] = useState(0);
  const [contentY, setContentY] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.min(Math.max(-rect.top, 0), rect.height);
      setBgY(scrolled * 0.55);
      setContentY(scrolled * 0.12);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[90vh] items-center overflow-hidden sm:min-h-[92vh]"
    >
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-0 h-[120%] w-full will-change-transform"
        style={{ transform: `translate3d(0, ${bgY}px, 0)` }}
        aria-hidden
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={IMAGES.hero}
            alt="Premium vehicle — paintless dent repair"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1400px"
            quality={70}
          />
        </div>
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/55 to-[#05080c]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_top,_rgba(0,212,255,0.2),_transparent_55%)]" />

      <div
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 text-center will-change-transform sm:py-20"
        style={{ transform: `translate3d(0, ${contentY}px, 0)` }}
      >
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 scale-150 rounded-full bg-cyan-400/30 blur-xl" />
            <Image
              src="/logo.png"
              alt="Hail Lions"
              width={100}
              height={100}
              className="relative h-24 w-24 rounded-full object-cover shadow-2xl shadow-cyan-500/30 ring-2 ring-cyan-400/50 sm:h-28 sm:w-28"
              priority
            />
          </div>
        </div>

        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
          <Sparkles size={14} />
          Houston · Baytown · Mobile PDR
        </p>

        <h1 className="text-glow mb-4 text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-7xl">
          The King of
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Dent Repair
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-xl">
          Hail damage, door dings, and creases — fixed at your location without
          paint.{" "}
          <span className="font-medium text-white">
            100% satisfaction guarantee · Lifetime warranty
          </span>
        </p>

        <div className="mx-auto flex max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          <Link
            href="/book"
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-8 py-4 text-base font-bold text-black shadow-[0_0_40px_rgba(0,212,255,0.45)] transition hover:bg-cyan-300 active:bg-cyan-200 sm:w-auto sm:text-lg"
          >
            <Camera size={22} />
            Start with Photos
          </Link>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:w-auto sm:text-lg"
          >
            <Phone size={22} />
            {PHONE}
          </a>
        </div>
      </div>
    </section>
  );
}
