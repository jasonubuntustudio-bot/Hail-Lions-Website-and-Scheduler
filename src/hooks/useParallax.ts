"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns a vertical offset in px based on how far `ref` is from viewport center.
 * factor: 0.15–0.6 typical; higher = stronger movement.
 */
export function useParallax(factor = 0.25) {
  const ref = useRef<HTMLElement | null>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const progress = (viewH / 2 - center) / viewH;
      setY(progress * factor * 120);
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
  }, [factor]);

  return { ref, y };
}
