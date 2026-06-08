"use client";

import { useTranslations } from "next-intl";

const BRANDS = [
  "GROHE",
  "BOSCH",
  "STANLEY",
  "MAKITA",
  "GEBERIT",
  "WAVIN",
  "DEWALT",
  "KÄRCHER",
];

export function BrandsMarquee() {
  const t = useTranslations("Brands");
  const row = [...BRANDS, ...BRANDS];

  return (
    <section className="border-y border-line bg-paper py-9">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-steel">
          {t("title")}
        </p>
        <div dir="ltr" className="marquee relative overflow-hidden">
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent" />

          <div className="animate-ticker flex w-max items-center gap-12 sm:gap-16">
            {row.map((brand, i) => (
              <span
                key={i}
                className="select-none whitespace-nowrap font-display text-2xl font-extrabold tracking-tight text-steel/60 transition-colors hover:text-ink sm:text-3xl"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
