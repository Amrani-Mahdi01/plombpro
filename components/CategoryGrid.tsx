"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

type Cat = { name: string; count: string };

// Maps each category to an existing local image.
const IMAGES = [
  "/hero/hero-tools.jpg",
  "/hero/hero-faucet.jpg",
  "/products/plumbing-1.jpg",
  "/hero/hero-heater.jpg",
  "/products/promo-2.jpg",
  "/products/plumbing-2.jpg",
];

// Store category key each tile links to (?category=...).
const CAT_KEYS = [
  "outils",
  "robinetterie",
  "tuyaux",
  "chauffage",
  "sanitaire",
  "chauffage",
];

export function CategoryGrid() {
  const t = useTranslations("Categories");
  const items = t.raw("items") as Cat[];

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 max-w-2xl"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="h-5 w-1.5 bg-amber" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              {t("subtitle")}
            </span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: (i % 3) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/boutique?category=${CAT_KEYS[i % CAT_KEYS.length]}`}
                className="group relative block aspect-[4/3] overflow-hidden border border-line"
              >
                <Image
                  src={IMAGES[i % IMAGES.length]}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                  <div>
                    <h3 className="font-display text-sm font-extrabold leading-tight text-white sm:text-lg lg:text-xl">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-white/70">
                      {cat.count} {t("productsLabel")}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-amber text-ink transition-colors group-hover:bg-white">
                    <ArrowRight className="h-5 w-5 rtl:-scale-x-100" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 border border-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-navy hover:text-white"
          >
            {t("viewAll")}
            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
