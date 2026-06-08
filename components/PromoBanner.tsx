"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function PromoBanner() {
  const t = useTranslations("Promo");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-navy"
        >
          <Image
            src="/products/new-0.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="blueprint-grid absolute inset-0 opacity-40" />
          <div
            className={`absolute inset-0 ${
              isRtl
                ? "bg-gradient-to-l from-navy via-navy/80 to-navy/30"
                : "bg-gradient-to-r from-navy via-navy/80 to-navy/30"
            }`}
          />

          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 bg-amber px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                <span className="h-2 w-2 bg-navy" />
                {t("eyebrow")}
              </span>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
                {t("text")}
              </p>
              <Link
                href="/boutique?promo=1"
                className="group mt-7 inline-flex items-center gap-2 bg-amber px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-white"
              >
                {t("cta")}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>

            <div className="hidden justify-end lg:col-span-4 lg:flex">
              <div className="flex h-40 w-40 flex-col items-center justify-center border-4 border-amber bg-navy/40 backdrop-blur-sm">
                <span className="font-display text-5xl font-extrabold text-amber">
                  {t("badge")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
