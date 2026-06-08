"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/CartContext";
import {
  PRODUCTS,
  CATEGORIES,
  BRANDS,
  COLOR_HEX,
  type Product,
  type Locale,
} from "@/data/products";
import { ShoppingCart, Eye, SlidersHorizontal, X } from "lucide-react";

const nf = new Intl.NumberFormat("fr-FR");
const priceFmt = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Lowercase + strip accents so "cle" matches "clé".
const DIACRITICS = /[̀-ͯ]/g;
const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(DIACRITICS, "");
const PRICE_MIN = 0;
const PRICE_MAX = 27000;
const PRICE_STEP = 100;

// Colors that actually appear on products (in swatch order).
const ALL_COLORS = Object.keys(COLOR_HEX).filter((c) =>
  PRODUCTS.some((p) => p.colors?.includes(c)),
);

export function StorePage() {
  const t = useTranslations("Shop");
  const tcolor = useTranslations("Product");
  const locale = useLocale() as Locale;
  const isRtl = locale === "ar";
  const { add } = useCart();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Filters are derived from the URL (single source of truth).
  const catParam = searchParams.get("category") ?? "";
  const subParam = searchParams.get("sub") ?? "";
  const brandParam = searchParams.get("brand") ?? "";
  const cats = catParam ? catParam.split(",") : [];
  const subs = subParam ? subParam.split(",") : [];
  const brands = brandParam ? brandParam.split(",") : [];
  const colorParam = searchParams.get("color") ?? "";
  const colorsSel = colorParam ? colorParam.split(",") : [];
  const query = (searchParams.get("q") ?? "").trim();
  const queryTokens = normalize(query).split(/\s+/).filter(Boolean);
  const sort = searchParams.get("sort") ?? "featured";
  const promoOnly = searchParams.get("promo") === "1";
  const urlPmin = searchParams.has("pmin")
    ? Number(searchParams.get("pmin"))
    : PRICE_MIN;
  const urlPmax = searchParams.has("pmax")
    ? Number(searchParams.get("pmax"))
    : PRICE_MAX;

  // Local draft for the price sliders (smooth dragging; committed to URL debounced).
  const [pmin, setPmin] = useState(urlPmin);
  const [pmax, setPmax] = useState(urlPmax);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setPmin(urlPmin), [urlPmin]);
  useEffect(() => setPmax(urlPmax), [urlPmax]);

  // Always read the freshest URL when writing, to avoid stale closures.
  function setParams(updates: Record<string, string | null>) {
    const p = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") p.delete(k);
      else p.set(k, v);
    }
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Commit price changes to the URL (debounced).
  useEffect(() => {
    const id = setTimeout(() => {
      setParams({
        pmin: pmin > PRICE_MIN ? String(pmin) : null,
        pmax: pmax < PRICE_MAX ? String(pmax) : null,
      });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pmin, pmax]);

  // Lock body scroll while the mobile filter drawer is open.
  useEffect(() => {
    if (!filtersOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  function toggleCat(key: string) {
    const next = cats.includes(key)
      ? cats.filter((x) => x !== key)
      : [...cats, key];
    const allowed = CATEGORIES.filter((c) => next.includes(c.key)).flatMap(
      (c) => c.subs,
    );
    const nextSubs = subs.filter((x) => allowed.includes(x));
    setParams({ category: next.join(","), sub: nextSubs.join(",") });
  }

  function toggleSub(s: string) {
    const next = subs.includes(s) ? subs.filter((x) => x !== s) : [...subs, s];
    setParams({ sub: next.join(",") });
  }

  function toggleBrand(b: string) {
    const next = brands.includes(b)
      ? brands.filter((x) => x !== b)
      : [...brands, b];
    setParams({ brand: next.join(",") });
  }

  function toggleColor(c: string) {
    const next = colorsSel.includes(c)
      ? colorsSel.filter((x) => x !== c)
      : [...colorsSel, c];
    setParams({ color: next.join(",") });
  }

  function clearAll() {
    setPmin(PRICE_MIN);
    setPmax(PRICE_MAX);
    router.replace(pathname, { scroll: false });
  }

  // Apply filters.
  let filtered = PRODUCTS.filter((p) => {
    if (cats.length && !cats.includes(p.category)) return false;
    if (subs.length && !subs.includes(p.subcategory)) return false;
    if (brands.length && !brands.includes(p.brand)) return false;
    if (
      colorsSel.length &&
      !(p.colors ?? []).some((c) => colorsSel.includes(c))
    )
      return false;
    if (promoOnly && !p.oldPrice) return false;
    if (p.price < pmin || p.price > pmax) return false;
    if (queryTokens.length) {
      const hay = normalize(
        `${p.name.fr} ${p.name.ar} ${p.brand} ${p.spec ?? ""}`,
      );
      if (!queryTokens.every((tok) => hay.includes(tok))) return false;
    }
    return true;
  });
  if (sort === "priceAsc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "priceDesc")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "newest")
    filtered = [...filtered].sort(
      (a, b) => (b.status === "new" ? 1 : 0) - (a.status === "new" ? 1 : 0),
    );

  const activeCount =
    cats.length +
    subs.length +
    brands.length +
    colorsSel.length +
    (promoOnly ? 1 : 0) +
    (query ? 1 : 0) +
    (pmin > PRICE_MIN ? 1 : 0) +
    (pmax < PRICE_MAX ? 1 : 0);

  const subGroups = cats.length
    ? CATEGORIES.filter((c) => cats.includes(c.key))
    : [];

  // ---------- Filter panel (shared by sidebar + mobile drawer) ----------
  const filterPanel = () => (
    <div className="space-y-7">
      <label className="flex cursor-pointer items-center gap-2.5 border border-line bg-paper px-3 py-2.5 text-sm font-bold text-ink">
        <input
          type="checkbox"
          checked={promoOnly}
          onChange={() => setParams({ promo: promoOnly ? null : "1" })}
          className="h-4 w-4 accent-amber"
        />
        <span className="bg-sale px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          %
        </span>
        {t("promoOnly")}
      </label>

      <FilterBlock title={t("categoriesTitle")}>
        <ul className="space-y-1">
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={cats.includes(c.key)}
                  onChange={() => toggleCat(c.key)}
                  className="h-4 w-4 accent-amber"
                />
                {t(`categories.${c.key}`)}
              </label>
            </li>
          ))}
        </ul>
      </FilterBlock>

      <FilterBlock title={t("subcategoriesTitle")}>
        {subGroups.length === 0 ? (
          <p className="text-xs text-steel">{t("subHint")}</p>
        ) : (
          <div className="space-y-4">
            {subGroups.map((c) => (
              <div key={c.key}>
                <p className="mb-1.5 text-xs font-semibold text-amber-700">
                  {t(`categories.${c.key}`)}
                </p>
                <ul className="space-y-1">
                  {c.subs.map((s) => (
                    <li key={s}>
                      <label className="flex cursor-pointer items-center gap-2.5 py-0.5 text-sm text-ink">
                        <input
                          type="checkbox"
                          checked={subs.includes(s)}
                          onChange={() => toggleSub(s)}
                          className="h-4 w-4 accent-amber"
                        />
                        {t(`subcategories.${s}`)}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </FilterBlock>

      <FilterBlock title={t("brandsTitle")}>
        <ul className="space-y-1">
          {BRANDS.map((b) => (
            <li key={b}>
              <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="h-4 w-4 accent-amber"
                />
                {b}
              </label>
            </li>
          ))}
        </ul>
      </FilterBlock>

      <FilterBlock title={t("colorsTitle")}>
        <ul className="space-y-1">
          {ALL_COLORS.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={colorsSel.includes(c)}
                  onChange={() => toggleColor(c)}
                  className="h-4 w-4 accent-amber"
                />
                <span
                  className="h-4 w-4 border border-line"
                  style={{ backgroundColor: COLOR_HEX[c] }}
                />
                {tcolor(`colors.${c}`)}
              </label>
            </li>
          ))}
        </ul>
      </FilterBlock>

      <FilterBlock title={t("priceTitle")}>
        <div className="mb-3 flex items-center justify-between text-sm font-bold text-ink">
          <span dir="ltr">{nf.format(pmin)}</span>
          <span className="text-steel">—</span>
          <span dir="ltr">{nf.format(pmax)}</span>
        </div>
        <label className="mb-1 block text-[11px] text-steel">{t("min")}</label>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={pmin}
          onChange={(e) => setPmin(Math.min(Number(e.target.value), pmax))}
          className="mb-4 w-full accent-amber"
        />
        <label className="mb-1 block text-[11px] text-steel">{t("max")}</label>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={pmax}
          onChange={(e) => setPmax(Math.max(Number(e.target.value), pmin))}
          className="w-full accent-amber"
        />
      </FilterBlock>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full border border-line py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-navy hover:text-white"
        >
          {t("clear")}
        </button>
      )}
    </div>
  );

  // ---------- Product card ----------
  const card = (p: Product) => {
    const isOut = p.status === "out";
    const discount = p.oldPrice
      ? Math.round((1 - p.price / p.oldPrice) * 100)
      : 0;
    return (
      <article
        key={p.id}
        className="group flex flex-col border border-line bg-white transition-colors hover:border-amber hover:shadow-[0_12px_28px_-16px_rgba(10,24,38,0.4)]"
      >
        <Link
          href={`/produit/${p.id}`}
          className="relative block aspect-square overflow-hidden border-b border-line bg-paper"
        >
          <Image
            src={p.image}
            alt={p.name[locale]}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            className={`object-cover transition-transform duration-500 ${
              isOut ? "opacity-80 grayscale" : "group-hover:scale-105"
            }`}
          />
          {p.spec ? (
            <span className="absolute start-2 top-2 bg-white/95 px-2 py-0.5 text-xs font-extrabold text-sale shadow-sm">
              {p.spec}
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="absolute end-0 top-0 bg-sale px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              -{discount}%
            </span>
          ) : p.status === "new" ? (
            <span className="absolute end-0 top-0 bg-amber px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
              {t("newBadge")}
            </span>
          ) : null}
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-steel">
            {p.brand}
          </span>
          <Link href={`/produit/${p.id}`}>
            <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-ink transition-colors hover:text-amber-700">
              {p.name[locale]}
            </h3>
          </Link>

          {p.colors && p.colors.length > 0 ? (
            <div className="mt-2 flex gap-1">
              {p.colors.slice(0, 5).map((c) => (
                <span
                  key={c}
                  title={c}
                  className="h-3 w-3 border border-line"
                  style={{ backgroundColor: COLOR_HEX[c] ?? "#cccccc" }}
                />
              ))}
            </div>
          ) : null}

          <div className="mt-auto pt-4">
            {p.status === "low" ? (
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
              {p.oldPrice ? (
                <span className="text-xs text-steel line-through">
                  <span dir="ltr">{priceFmt.format(p.oldPrice)}</span>{" "}
                  {t("currency")}
                </span>
              ) : null}
              <span className="text-lg font-extrabold leading-none text-ink">
                <span dir="ltr">{priceFmt.format(p.price)}</span>{" "}
                <span className="text-xs font-bold text-steel">
                  {t("currency")}
                </span>
              </span>
            </div>

            {isOut ? (
              <Link
                href={`/produit/${p.id}`}
                className="mt-3 flex w-full items-center justify-center gap-2 border border-navy bg-white px-3 py-3 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:bg-navy hover:text-white"
              >
                <Eye className="h-4 w-4 shrink-0" />
                {t("details")}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() =>
                  add({
                    id: p.id,
                    name: p.name[locale],
                    price: p.price,
                    image: p.image,
                  })
                }
                className="mt-3 flex w-full items-center justify-center gap-2 bg-navy px-3 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
              >
                <ShoppingCart className="h-4 w-4 shrink-0" />
                {t("addToCart")}
              </button>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-6 border-b border-line pb-5">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-5 w-1.5 bg-amber" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              {t("subtitle")}
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            {t("title")}
          </h1>
        </div>

        <div className="gap-8 lg:grid lg:grid-cols-[250px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">{filterPanel()}</aside>

          {/* Results */}
          <div>
            <div className="mb-5 border-b border-line pb-4">
              {/* Toolbar: filters (left) + sort (right) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-2 border border-line px-3 py-2 text-xs font-bold uppercase tracking-wide text-ink lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("filters")}
                  {activeCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center bg-amber px-1 text-[11px] text-ink">
                      {activeCount}
                    </span>
                  )}
                </button>
                <select
                  value={sort}
                  onChange={(e) =>
                    setParams({
                      sort: e.target.value === "featured" ? null : e.target.value,
                    })
                  }
                  aria-label={t("sortLabel")}
                  className="ms-auto border border-line bg-white px-3 py-2 text-xs font-semibold text-ink focus:outline-none"
                >
                  <option value="featured">{t("sort.featured")}</option>
                  <option value="priceAsc">{t("sort.priceAsc")}</option>
                  <option value="priceDesc">{t("sort.priceDesc")}</option>
                  <option value="newest">{t("sort.newest")}</option>
                </select>
              </div>

              {/* Result count + active search chip (below the toolbar) */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-steel">
                  {t("results", { count: filtered.length })}
                </span>
                {query && (
                  <span className="inline-flex max-w-full items-center gap-1.5 bg-paper px-2.5 py-1 text-xs font-semibold text-ink">
                    <span className="truncate">
                      {t("searchLabel", { q: query })}
                    </span>
                    <button
                      type="button"
                      onClick={() => setParams({ q: null })}
                      aria-label={t("clear")}
                      className="shrink-0 text-steel transition-colors hover:text-sale"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-steel">{t("noResults")}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => card(p))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-navy/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 start-0 z-[70] flex w-full max-w-xs flex-col bg-white lg:hidden"
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line bg-navy px-4 py-3 text-white">
                <span className="flex items-center gap-2 font-display text-base font-extrabold">
                  <SlidersHorizontal className="h-5 w-5 text-amber" />
                  {t("filters")}
                </span>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label={t("close")}
                  className="flex h-9 w-9 items-center justify-center border border-white/20 transition-colors hover:bg-amber hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{filterPanel()}</div>
              <div className="border-t border-line p-4">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="w-full bg-amber py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-navy hover:text-white"
                >
                  {t("apply")} ({filtered.length})
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-steel">
        {title}
      </h3>
      {children}
    </div>
  );
}
