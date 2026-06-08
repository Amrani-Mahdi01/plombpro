"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { CATEGORIES, PRODUCTS, type Locale } from "@/data/products";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "./CartContext";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Phone,
  Truck,
  Wallet,
  ChevronDown,
  Wrench,
  Droplets,
  Cable,
  Flame,
  ShowerHead,
  Tag,
  Store,
} from "lucide-react";

const NAV_KEYS = [
  "tools",
  "faucets",
  "pipes",
  "heaters",
  "bathroom",
  "promos",
] as const;

const CAT_MENU = [
  { key: "tools", Icon: Wrench },
  { key: "faucets", Icon: Droplets },
  { key: "pipes", Icon: Cable },
  { key: "heaters", Icon: Flame },
  { key: "bathroom", Icon: ShowerHead },
  { key: "promos", Icon: Tag },
] as const;

// Maps the nav keys to the store's category keys (?category=...).
const NAV_TO_CAT: Record<string, string> = {
  tools: "outils",
  faucets: "robinetterie",
  pipes: "tuyaux",
  heaters: "chauffage",
  bathroom: "sanitaire",
  promos: "",
};

function catHref(key: string) {
  if (key === "promos") return "/boutique?promo=1";
  const c = NAV_TO_CAT[key];
  return c ? `/boutique?category=${c}` : "/boutique";
}

function subHref(key: string, sub: string) {
  return `/boutique?category=${NAV_TO_CAT[key]}&sub=${sub}`;
}

// Sub-categories shown in the hover mega-menu (none for the promos column).
function subsForNav(key: string): string[] {
  if (key === "promos") return [];
  return CATEGORIES.find((c) => c.key === NAV_TO_CAT[key])?.subs ?? [];
}

// A few featured products previewed in the hover mega-menu.
function productsForNav(key: string) {
  if (key === "promos") return PRODUCTS.filter((p) => p.oldPrice).slice(0, 3);
  const c = NAV_TO_CAT[key];
  return PRODUCTS.filter((p) => p.category === c).slice(0, 3);
}

const priceFmt = new Intl.NumberFormat("fr-FR");

export function Header() {
  const t = useTranslations("Header");
  const tShop = useTranslations("Shop");
  const tProducts = useTranslations("Products");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const catRef = useRef<HTMLDivElement>(null);
  const navCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { count, open, mounted } = useCart();

  // Route to the store with the search term (or to the bare store if empty).
  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = query.trim();
    router.push(term ? `/boutique?q=${encodeURIComponent(term)}` : "/boutique");
    setMobileOpen(false);
  };

  // Open/close the per-item hover dropdown with a small grace delay so moving
  // the cursor toward the panel doesn't dismiss it.
  const openNavMenu = (key: string) => {
    if (navCloseTimer.current) clearTimeout(navCloseTimer.current);
    setOpenNav(key);
  };
  const scheduleCloseNav = () => {
    if (navCloseTimer.current) clearTimeout(navCloseTimer.current);
    navCloseTimer.current = setTimeout(() => setOpenNav(null), 120);
  };
  useEffect(() => {
    return () => {
      if (navCloseTimer.current) clearTimeout(navCloseTimer.current);
    };
  }, []);

  // Close the categories dropdown on outside click / Escape.
  useEffect(() => {
    if (!catOpen) return;
    const onDown = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCatOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  // Lock scroll + close on Escape while the full-screen mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="bg-navy text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs">
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-1.5 sm:flex">
              <Truck className="h-3.5 w-3.5 text-amber" />
              {t("topbar.shipping")}
            </span>
            <span className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-amber" />
              {t("topbar.payment")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${t("topbar.phone").replace(/\s/g, "")}`}
              className="hidden items-center gap-1.5 hover:text-amber md:flex"
            >
              <Phone className="h-3.5 w-3.5 text-amber" />
              <span dir="ltr">{t("topbar.phone")}</span>
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="flex h-11 w-11 items-center justify-center bg-amber">
              <Wrench className="h-6 w-6 text-ink" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl font-extrabold tracking-tight text-ink">
                {t("brand")}
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-steel">
                {t("brandTagline")}
              </span>
            </span>
          </Link>

          {/* Search */}
          <form
            role="search"
            className="hidden h-11 flex-1 items-stretch border border-line transition-colors focus-within:border-amber md:flex"
            onSubmit={submitSearch}
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchButton")}
              className="h-full w-full bg-paper px-4 text-sm text-ink placeholder:text-steel focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-amber px-5 text-sm font-bold text-ink transition-colors hover:bg-amber-600"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">{t("searchButton")}</span>
            </button>
          </form>

          {/* Actions */}
          <div className="ms-auto flex items-center gap-1 md:ms-0">
            <Link
              href="/"
              className="hidden items-center gap-2 px-3 py-2 text-sm font-medium text-ink hover:text-amber-600 sm:flex"
            >
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">{t("account")}</span>
            </Link>

            <button
              type="button"
              onClick={open}
              className="relative flex items-center gap-2 bg-navy px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden lg:inline">{t("cart")}</span>
              {mounted && count > 0 && (
                <span className="absolute -top-2 -end-2 flex h-5 min-w-5 items-center justify-center bg-amber px-1 text-[11px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? t("menuClose") : t("menuOpen")}
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center border border-line text-ink md:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="border-t border-line px-4 py-3 md:hidden">
          <form
            role="search"
            className="flex items-stretch border border-line"
            onSubmit={submitSearch}
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchButton")}
              className="w-full bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-steel focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center bg-amber px-4 text-ink"
              aria-label={t("searchButton")}
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden border-b border-line bg-navy text-white md:block">
        <div className="mx-auto flex max-w-7xl items-stretch px-4">
          <div ref={catRef} className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 bg-amber px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-amber-600"
            >
              <Menu className="h-4 w-4" />
              {t("allCategories")}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  catOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {catOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute start-0 top-full z-[60] w-64 border border-line bg-white text-ink shadow-xl"
                >
                  <ul>
                    {CAT_MENU.map(({ key, Icon }) => (
                      <li key={key}>
                        <Link
                          href={catHref(key)}
                          onClick={() => setCatOpen(false)}
                          className="flex items-center gap-3 border-b border-line px-4 py-3 text-sm font-semibold transition-colors last:border-b-0 hover:bg-paper hover:text-amber-700"
                        >
                          <Icon className="h-5 w-5 text-amber-700" />
                          {t(`nav.${key}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link
            href="/boutique"
            className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-700"
          >
            <Store className="h-4 w-4 text-amber" />
            {t("shop")}
          </Link>
          <ul className="flex items-stretch">
            {NAV_KEYS.map((key, i) => {
              const subs = subsForNav(key);
              const products = productsForNav(key);
              // Right-align the last two panels so they don't overflow the row.
              const alignEnd = i >= NAV_KEYS.length - 2;
              return (
                <li
                  key={key}
                  className="relative flex items-stretch"
                  onMouseEnter={() => openNavMenu(key)}
                  onMouseLeave={scheduleCloseNav}
                  onFocus={() => openNavMenu(key)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      scheduleCloseNav();
                    }
                  }}
                >
                  <Link
                    href={catHref(key)}
                    aria-haspopup="true"
                    aria-expanded={openNav === key}
                    className={`flex h-full items-center gap-1 px-4 py-3 text-sm font-semibold transition-colors hover:bg-navy-700 ${
                      openNav === key ? "bg-navy-700" : ""
                    } ${key === "promos" ? "text-amber" : "text-white/90"}`}
                  >
                    {t(`nav.${key}`)}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        openNav === key ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  <AnimatePresence>
                    {openNav === key && products.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => openNavMenu(key)}
                        onMouseLeave={scheduleCloseNav}
                        className={`absolute top-full z-[60] flex w-[34rem] border border-line bg-white text-ink shadow-xl ${
                          alignEnd ? "end-0" : "start-0"
                        }`}
                      >
                        {subs.length > 0 && (
                          <div className="w-44 shrink-0 border-e border-line bg-paper p-3">
                            <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-steel">
                              {t(`nav.${key}`)}
                            </p>
                            <ul>
                              {subs.map((sub) => (
                                <li key={sub}>
                                  <Link
                                    href={subHref(key, sub)}
                                    onClick={() => setOpenNav(null)}
                                    className="block px-2 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-amber-700"
                                  >
                                    {tShop(`subcategories.${sub}`)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex-1 p-3">
                          <div className="grid grid-cols-3 gap-2">
                            {products.map((p) => (
                              <Link
                                key={p.id}
                                href={`/produit/${p.id}`}
                                onClick={() => setOpenNav(null)}
                                className="group/card flex flex-col border border-line transition-colors hover:border-amber"
                              >
                                <span className="relative block aspect-square overflow-hidden bg-paper">
                                  <Image
                                    src={p.image}
                                    alt={p.name[locale]}
                                    fill
                                    sizes="120px"
                                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                                  />
                                </span>
                                <span className="flex flex-1 flex-col gap-1 p-2">
                                  <span className="line-clamp-2 text-xs font-semibold leading-snug text-ink">
                                    {p.name[locale]}
                                  </span>
                                  <span
                                    className="mt-auto text-xs font-bold text-amber-700"
                                    dir="ltr"
                                  >
                                    {priceFmt.format(p.price)} {tProducts("currency")}
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href={catHref(key)}
                            onClick={() => setOpenNav(null)}
                            className="mt-3 flex items-center justify-center gap-1 border-t border-line pt-3 text-sm font-bold text-amber-700 transition-colors hover:text-amber-600"
                          >
                            {t("megaViewAll")}
                            <ChevronDown className="h-4 w-4 -rotate-90 rtl:rotate-90" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile full-screen menu — slides in from the left */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-navy text-white md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t("allCategories")}
          >
            {/* Top bar */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center bg-amber">
                  <Wrench className="h-6 w-6 text-ink" />
                </span>
                <span className="leading-none">
                  <span className="block font-display text-lg font-extrabold tracking-tight">
                    {t("brand")}
                  </span>
                  <span className="block text-[11px] uppercase tracking-wider text-white/60">
                    {t("brandTagline")}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={t("menuClose")}
                className="flex h-11 w-11 items-center justify-center border border-white/20 transition-colors hover:bg-amber hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto">
              <Link
                href="/boutique"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-4 bg-amber px-5 py-4 text-base font-extrabold text-ink"
              >
                <Store className="h-5 w-5" />
                {t("shop")}
              </Link>
              <ul>
                {CAT_MENU.map(({ key, Icon }) => (
                  <li key={key}>
                    <Link
                      href={catHref(key)}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 border-b border-white/10 px-5 py-4 text-base font-bold transition-colors hover:bg-white/5 ${
                        key === "promos" ? "text-amber" : "text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-amber" />
                      {t(`nav.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="px-5 py-2">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 border-b border-white/10 py-4 text-base font-bold text-white"
                >
                  <User className="h-5 w-5 text-amber" />
                  {t("account")}
                </Link>
                <a
                  href={`tel:${t("topbar.phone").replace(/\s/g, "")}`}
                  className="flex items-center gap-4 py-4 text-base font-bold text-white"
                >
                  <Phone className="h-5 w-5 text-amber" />
                  <span dir="ltr">{t("topbar.phone")}</span>
                </a>
              </div>
            </nav>

            {/* Footer: language switch */}
            <div className="shrink-0 border-t border-white/10 p-5">
              <LanguageSwitcher />
            </div>
            <div className="hazard-stripes h-2 w-full shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
