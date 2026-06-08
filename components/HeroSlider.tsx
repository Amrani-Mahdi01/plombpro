"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Wrench,
  Droplets,
  Flame,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

type Slide = {
  kicker: string;
  title: string;
  subtitle: string;
  price: string;
  cta: string;
  ctaSecondary: string;
};

// Per-slide background photo + matching kicker icon.
const SLIDE_MEDIA = [
  { src: "/hero/hero-tools.jpg", Icon: Wrench, productId: "p1", category: "outils" },
  { src: "/hero/hero-faucet.jpg", Icon: Droplets, productId: "p9", category: "robinetterie" },
  { src: "/hero/hero-heater.jpg", Icon: Flame, productId: "p17", category: "chauffage" },
];

const AUTOPLAY_MS = 6000;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HeroSlider() {
  const t = useTranslations("Hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const slides = t.raw("slides") as Slide[];

  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const count = slides.length;

  const paginate = useCallback(
    (dir: number) => {
      setState(([prev]) => [(prev + dir + count) % count, dir]);
    },
    [count],
  );

  const goTo = useCallback((next: number) => {
    setState(([prev]) => [next, next > prev ? 1 : -1]);
  }, []);

  // Swipe support (touch / pointer) — primary control on mobile.
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
    paginate(swipedNext ? 1 : -1);
  };

  // Auto-play
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paginate, paused, index]);

  // Visual direction respects RTL so transitions feel natural in both layouts.
  const visualDir = direction * (isRtl ? -1 : 1);
  const slide = slides[index];
  const media = SLIDE_MEDIA[index % SLIDE_MEDIA.length];
  const Icon = media.Icon;

  // Logical chevrons: "previous" points to the start edge in either direction.
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const CtaArrow = isRtl ? ArrowLeft : ArrowRight;

  // Scrim is anchored to the text side (start edge) so copy stays legible
  // regardless of where the photo's subject sits.
  const scrim = isRtl
    ? "bg-gradient-to-l from-navy/95 via-navy/55 to-navy/10"
    : "bg-gradient-to-r from-navy/95 via-navy/55 to-navy/10";

  return (
    <section
      className="relative touch-pan-y overflow-hidden bg-navy"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      aria-roledescription="carousel"
    >
      <div className="relative h-[620px] sm:h-[560px] lg:h-[620px]">
        <AnimatePresence initial={false} custom={visualDir}>
          <motion.div
            key={index}
            custom={visualDir}
            initial={{ opacity: 0, x: visualDir * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: visualDir * -80 }}
            transition={{
              x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.45 },
            }}
            className="absolute inset-0"
          >
            {/* Background photo with a slow zoom for life */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 7, ease: "linear" }}
            >
              <Image
                src={media.src}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>

            {/* Legibility scrims */}
            <div className={`absolute inset-0 ${scrim}`} />
            <div className="absolute inset-0 bg-navy/20" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/80 to-transparent" />

            {/* Content */}
            <div className="relative mx-auto flex h-full max-w-7xl items-center px-4">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-2xl"
              >
                <motion.span
                  variants={item}
                  className="inline-flex items-center gap-2 bg-amber px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink"
                >
                  <Icon className="h-4 w-4" />
                  {slide.kicker}
                </motion.span>

                <motion.h1
                  variants={item}
                  className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  variants={item}
                  className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.div
                  variants={item}
                  className="mt-6 inline-flex items-center gap-3 border-s-4 border-amber ps-3"
                >
                  <span className="text-2xl font-extrabold text-white sm:text-3xl">
                    {slide.price}
                  </span>
                </motion.div>

                <motion.div
                  variants={item}
                  className="mt-7 flex flex-wrap items-center gap-3"
                >
                  <Link
                    href={`/produit/${media.productId}`}
                    className="group inline-flex items-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-amber-600"
                  >
                    {slide.cta}
                    <CtaArrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>
                  <Link
                    href={`/boutique?category=${media.category}`}
                    className="inline-flex items-center gap-2 border border-white/40 bg-white/5 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-ink"
                  >
                    {slide.ctaSecondary}
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label={t("prev")}
          className="absolute start-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-ink/40 text-white backdrop-blur-sm transition-colors hover:bg-amber hover:text-ink sm:flex"
        >
          <PrevIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label={t("next")}
          className="absolute end-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-ink/40 text-white backdrop-blur-sm transition-colors hover:bg-amber hover:text-ink sm:flex"
        >
          <NextIcon className="h-5 w-5" />
        </button>

        {/* Dots + autoplay progress */}
        <div className="absolute bottom-5 z-10 flex w-full items-center justify-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={t("goToSlide", { number: i + 1 })}
              aria-current={i === index}
              className="relative h-1.5 overflow-hidden bg-white/40"
              style={{ width: i === index ? 40 : 16 }}
            >
              {i === index && (
                <motion.span
                  key={`progress-${index}-${paused}`}
                  className="absolute inset-0 bg-amber"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: paused ? 0.0001 : 1 }}
                  transition={{
                    duration: paused ? 0 : AUTOPLAY_MS / 1000,
                    ease: "linear",
                  }}
                  style={{ transformOrigin: isRtl ? "right" : "left" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
