"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";

type TabKey = "new" | "promo" | "plumbing";

type Item = {
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
};

const TABS: TabKey[] = ["new", "promo", "plumbing"];
const GAP = 16; // matches gap-4

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

// Each card links to its matching catalog product (same order as the messages items).
const PRODUCT_IDS: Record<string, string[]> = {
  new: ["p1", "p9", "p3", "p7", "p2", "p11"],
  promo: ["p17", "p20", "p23", "p24", "p25", "p8"],
  plumbing: ["p13", "p14", "p19", "p21", "p16", "p22"],
};

export function ProductShowcase() {
  const t = useTranslations("Products");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { add } = useCart();

  const [active, setActive] = useState<TabKey>("new");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(4);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const items = t.raw(`items.${active}`) as Item[];
  const currency = t("currency");
  const count = items.length;

  // Measure the viewport so cards fit exactly N-per-view.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setViewportWidth(w);
      setPerPage(columnsFor(w));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const numPages = Math.max(1, Math.ceil(count / perPage));
  const maxIndex = Math.max(0, count - perPage);

  // Reset to first page on tab change.
  useEffect(() => setPage(0), [active]);
  // Keep the page valid when the column count changes (resize).
  useEffect(() => {
    setPage((p) => Math.min(p, numPages - 1));
  }, [numPages]);

  const safePage = Math.min(page, numPages - 1);
  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - GAP * (perPage - 1)) / perPage
      : 0;
  const step = cardWidth > 0 ? cardWidth + GAP : 0;
  const startIndex = Math.min(safePage * perPage, maxIndex);
  const offset = startIndex * step;
  const translateX = isRtl ? offset : -offset;

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(numPages - 1, p + 1));

  // Swipe support (touch / pointer).
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
    <section className="bg-paper py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Tabs + arrows */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-line">
          <div className="no-scrollbar -mb-[2px] flex max-w-full items-end gap-5 overflow-x-auto sm:gap-8">
            {TABS.map((tab) => {
              const isActive = tab === active;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActive(tab)}
                  className={`whitespace-nowrap border-b-2 pb-3 text-sm font-extrabold uppercase tracking-wide transition-colors sm:text-base ${
                    isActive
                      ? "border-amber text-ink"
                      : "border-transparent text-steel hover:text-ink"
                  }`}
                >
                  {t(`tabs.${tab}`)}
                </button>
              );
            })}
          </div>

          <div className="mb-3 hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={goPrev}
              disabled={atStart}
              aria-label={t("prev")}
              className="flex h-9 w-9 items-center justify-center border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-ink"
            >
              <PrevIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={atEnd}
              aria-label={t("next")}
              className="flex h-9 w-9 items-center justify-center border border-line bg-white text-ink transition-colors hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-ink"
            >
              <NextIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Slider viewport */}
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
              return (
                <motion.article
                  key={`${active}-${item.name}`}
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
                    href={`/produit/${PRODUCT_IDS[active][i]}`}
                    draggable={false}
                    className="relative block aspect-square overflow-hidden border-b border-line bg-paper"
                  >
                    <Image
                      src={`/products/${active}-${i}.jpg`}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 260px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge */}
                    {active === "promo" && item.discount ? (
                      <span className="absolute start-0 top-0 bg-sale px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                        -{item.discount}%
                      </span>
                    ) : active === "new" ? (
                      <span className="absolute start-0 top-0 bg-amber px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
                        {t("newBadge")}
                      </span>
                    ) : null}
                  </Link>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    <Link
                      href={`/produit/${PRODUCT_IDS[active][i]}`}
                      draggable={false}
                    >
                      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-ink transition-colors group-hover:text-amber-700">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-4">
                      <div className="flex flex-col leading-tight">
                        {item.oldPrice ? (
                          <span className="text-xs text-steel line-through">
                            <span dir="ltr">
                              {priceFmt.format(item.oldPrice)}
                            </span>{" "}
                            {currency}
                          </span>
                        ) : null}
                        <span className="text-lg font-extrabold leading-none text-ink">
                          <span dir="ltr">{priceFmt.format(item.price)}</span>{" "}
                          <span className="text-xs font-bold text-steel">
                            {currency}
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          add({
                            id: `${active}-${i}`,
                            name: item.name,
                            price: item.price,
                            image: `/products/${active}-${i}.jpg`,
                          })
                        }
                        className="mt-3 flex w-full items-center justify-center gap-2 bg-navy px-3 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
                      >
                        <ShoppingCart className="h-4 w-4 shrink-0" />
                        <span>{t("addToCart")}</span>
                      </button>
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
                  p === safePage ? "w-8 bg-amber" : "w-3 bg-steel-200 hover:bg-steel"
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
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
