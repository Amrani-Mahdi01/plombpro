"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";

type Status = "new" | "low" | "out";

type Item = {
  name: string;
  price: number;
  oldPrice?: number;
  spec?: string;
  status?: Status;
};

const GAP = 16;

const priceFmt = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function columnsFor(width: number) {
  if (width >= 1180) return 5;
  if (width >= 920) return 4;
  if (width >= 680) return 3;
  // Mobile shows two columns.
  return 2;
}

export function CategoryProducts({
  namespace,
  images,
  ids,
}: {
  namespace: string;
  images: string[];
  ids: string[];
}) {
  const t = useTranslations(namespace);
  const tp = useTranslations("Products");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { add } = useCart();
  const items = t.raw("items") as Item[];
  const currency = tp("currency");
  const count = items.length;

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(4);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      setViewportWidth(el.clientWidth);
      setPerPage(columnsFor(el.clientWidth));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const numPages = Math.max(1, Math.ceil(count / perPage));
  const maxIndex = Math.max(0, count - perPage);

  useEffect(() => {
    setPage((p) => Math.min(p, numPages - 1));
  }, [numPages]);

  const safePage = Math.min(page, numPages - 1);
  const cardWidth =
    viewportWidth > 0 ? (viewportWidth - GAP * (perPage - 1)) / perPage : 0;
  const step = cardWidth > 0 ? cardWidth + GAP : 0;
  const startIndex = Math.min(safePage * perPage, maxIndex);
  const translateX = (isRtl ? 1 : -1) * startIndex * step;

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(numPages - 1, p + 1));

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
    if (swipedNext) goNext();
    else goPrev();
  };

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const atStart = safePage === 0;
  const atEnd = safePage >= numPages - 1;

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-line pb-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="h-5 w-1.5 bg-amber" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                {t("subtitle")}
              </span>
            </div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
              {t("title")}
            </h2>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={goPrev}
              disabled={atStart}
              aria-label={tp("prev")}
              className="flex h-9 w-9 items-center justify-center border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-ink"
            >
              <PrevIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={atEnd}
              aria-label={tp("next")}
              className="flex h-9 w-9 items-center justify-center border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-ink"
            >
              <NextIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={viewportRef}
          className="mt-7 touch-pan-y overflow-hidden py-3"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: translateX }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {items.map((item, i) => {
              const isOut = item.status === "out";
              const href = ids[i] ? `/produit/${ids[i]}` : "/boutique";
              return (
                <motion.article
                  key={item.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(i, perPage) * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={cardWidth > 0 ? { width: cardWidth } : undefined}
                  className="group flex w-[260px] shrink-0 select-none flex-col border border-line bg-white transition-colors hover:border-amber hover:shadow-[0_12px_28px_-16px_rgba(10,24,38,0.4)]"
                >
                  {/* Image tile */}
                  <Link
                    href={href}
                    draggable={false}
                    className="relative block aspect-square overflow-hidden border-b border-line bg-paper"
                  >
                    <Image
                      src={images[i % images.length]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 260px"
                      className={`object-cover transition-transform duration-500 ${
                        isOut
                          ? "opacity-80 grayscale"
                          : "group-hover:scale-105"
                      }`}
                    />

                    {/* Spec label */}
                    {item.spec ? (
                      <span className="absolute start-2 top-2 bg-white/95 px-2 py-0.5 text-xs font-extrabold text-sale shadow-sm">
                        {item.spec}
                      </span>
                    ) : null}

                    {/* New badge */}
                    {item.status === "new" ? (
                      <span className="absolute end-0 top-0 bg-amber px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                        {tp("newBadge")}
                      </span>
                    ) : null}
                  </Link>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    <Link href={href} draggable={false}>
                      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-ink transition-colors group-hover:text-amber-700">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-4">
                      {/* Stock status */}
                      {item.status === "low" ? (
                        <span className="mb-2 inline-block bg-teal px-2 py-1 text-[11px] font-bold text-white">
                          {t("lowStock")}
                        </span>
                      ) : null}
                      {isOut ? (
                        <span className="mb-2 inline-block bg-steel-200 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-steel">
                          {t("outOfStock")}
                        </span>
                      ) : null}

                      <div className="flex flex-col leading-tight">
                        <span className="text-lg font-extrabold leading-none text-ink">
                          <span dir="ltr">{priceFmt.format(item.price)}</span>{" "}
                          <span className="text-xs font-bold text-steel">
                            {currency}
                          </span>
                        </span>
                      </div>

                      {isOut ? (
                        <Link
                          href={href}
                          draggable={false}
                          className="mt-3 flex w-full items-center justify-center gap-2 border border-ink bg-white px-3 py-3 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
                        >
                          <Eye className="h-4 w-4 shrink-0" />
                          <span>{t("details")}</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            add({
                              id: `${namespace}-${i}`,
                              name: item.name,
                              price: item.price,
                              image: images[i % images.length],
                            })
                          }
                          className="mt-3 flex w-full items-center justify-center gap-2 bg-ink px-3 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
                        >
                          <ShoppingCart className="h-4 w-4 shrink-0" />
                          <span>{tp("addToCart")}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>

        {/* Page dots */}
        {numPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: numPages }).map((_, p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-label={`${p + 1}`}
                aria-current={p === safePage}
                className={`h-1.5 transition-all ${
                  p === safePage
                    ? "w-8 bg-amber"
                    : "w-3 bg-steel-200 hover:bg-steel"
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {tp("viewAll")}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
