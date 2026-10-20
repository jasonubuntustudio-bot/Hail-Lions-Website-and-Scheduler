"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  factor?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

/** Cropped-to-fit image with vertical parallax */
export default function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "object-cover object-center",
  factor = 0.35,
  sizes = "100vw",
  priority = false,
  quality = 85,
}: Props) {
  const { ref, y } = useParallax(factor);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-x-0 -top-[12%] h-[124%] w-full will-change-transform"
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={quality}
            className={imageClassName}
            sizes={sizes}
          />
        </div>
      </div>
    </div>
  );
}
