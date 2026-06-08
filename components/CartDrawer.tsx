"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useCart } from "./CartContext";
import { Plus, Minus, Trash2, ShoppingCart, Truck } from "lucide-react";

const priceFmt = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function CartDrawer() {
  const t = useTranslations("Cart");
  const tp = useTranslations("Products");
  const currency = tp("currency");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { items, total, count, isOpen, close, remove, setQty } = useCart();

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const offscreen = isRtl ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />

          <motion.aside
            className="fixed inset-y-0 end-0 z-[70] flex w-full max-w-md flex-col bg-white"
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-ink px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="h-5 w-5 text-amber" />
                <h2 className="font-display text-lg font-extrabold tracking-tight">
                  {t("title")}
                </h2>
                <span className="bg-amber px-2 py-0.5 text-xs font-bold text-ink">
                  {count}
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                className="flex items-center gap-1.5 border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
              >
                {t("backToSite")}
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center bg-paper text-steel">
                  <ShoppingCart className="h-8 w-8" />
                </span>
                <p className="font-display text-lg font-bold text-ink">
                  {t("empty")}
                </p>
                <p className="text-sm text-steel">{t("emptyHint")}</p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 bg-ink px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
                >
                  {t("continue")}
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 p-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-line bg-paper">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-sm font-bold text-ink">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            aria-label={t("remove")}
                            className="shrink-0 text-steel transition-colors hover:text-sale"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <span className="mt-1 text-xs font-bold text-amber-700">
                          <span dir="ltr">{priceFmt.format(item.price)}</span>{" "}
                          {currency}
                        </span>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-stretch border border-line">
                            <button
                              type="button"
                              onClick={() => setQty(item.id, item.qty - 1)}
                              aria-label={t("decrease")}
                              className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-paper"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="flex h-8 w-9 items-center justify-center border-x border-line text-sm font-bold text-ink">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(item.id, item.qty + 1)}
                              aria-label={t("increase")}
                              className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-paper"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-extrabold text-ink">
                            <span dir="ltr">
                              {priceFmt.format(item.price * item.qty)}
                            </span>{" "}
                            <span className="text-xs text-steel">{currency}</span>
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="border-t border-line bg-paper p-5">
                  <div className="mb-1 flex items-center gap-2 text-xs font-medium text-steel">
                    <Truck className="h-4 w-4 text-amber-700" />
                    {t("codNote")}
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wide text-steel">
                      {t("subtotal")}
                    </span>
                    <span className="font-display text-xl font-extrabold text-ink">
                      <span dir="ltr">{priceFmt.format(total)}</span> {currency}
                    </span>
                  </div>
                  <Link
                    href="/commande"
                    onClick={close}
                    className="flex w-full items-center justify-center gap-2 bg-amber px-5 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    {t("checkout")}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
