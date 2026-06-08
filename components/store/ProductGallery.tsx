"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  isOut?: boolean;
  overlay?: ReactNode;
  prevLabel: string;
  nextLabel: string;
};

export function ProductGallery({
  images,
  alt,
  isOut,
  overlay,
  prevLabel,
  nextLabel,
}: Props) {
  const isRtl = useLocale() === "ar";
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const count = images.length;

  const go = (d: number) =>
    setState(([i]) => [(i + d + count) % count, d]);
  const goTo = (n: number) => setState(([i]) => [n, n > i ? 1 : -1]);

  // Swipe (touch / pointer)
  const dragStart = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) < 40) return;
    const swipedNext = isRtl ? dx > 0 : dx < 0;
    go(swipedNext ? 1 : -1);
  };

  const visualDir = dir * (isRtl ? -1 : 1);
  const Prev = isRtl ? ChevronRight : ChevronLeft;
  const Next = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div>
      <div
        className="relative aspect-square touch-pan-y overflow-hidden border border-line bg-paper"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatePresence initial={false} custom={visualDir}>
          <motion.div
            key={index}
            custom={visualDir}
            initial={{ opacity: 0, x: visualDir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: visualDir * -60 }}
            transition={{
              x: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              priority={index === 0}
              className={`object-cover ${isOut ? "opacity-80 grayscale" : ""}`}
            />
          </motion.div>
        </AnimatePresence>

        {overlay}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={prevLabel}
              className="absolute start-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-white/90 text-ink backdrop-blur-sm transition-colors hover:bg-navy hover:text-white"
            >
              <Prev className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={nextLabel}
              className="absolute end-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-white/90 text-ink backdrop-blur-sm transition-colors hover:bg-navy hover:text-white"
            >
              <Next className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-paper transition-colors ${
                i === index ? "border-amber" : "border-line hover:border-steel"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
