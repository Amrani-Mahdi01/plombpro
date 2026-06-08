"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/CartContext";
import { ProductGallery } from "./ProductGallery";
import { PRODUCTS, COLOR_HEX, type Locale } from "@/data/products";
import {
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  Truck,
  Wallet,
  ShieldCheck,
  Check,
} from "lucide-react";

const priceFmt = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function ProductDetail({ productId }: { productId: string }) {
  const t = useTranslations("Product");
  const ts = useTranslations("Shop");
  const locale = useLocale() as Locale;
  const { add } = useCart();
  const product = PRODUCTS.find((p) => p.id === productId);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product?.colors?.[0] ?? "");
  if (!product) return null;

  const isOut = product.status === "out";
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
  const related = PRODUCTS.filter(
    (r) => r.category === product.category && r.id !== product.id,
  ).slice(0, 4);

  // Build a gallery from the product image + similar products (same sub-category first).
  const sameSub = PRODUCTS.filter(
    (r) => r.subcategory === product.subcategory && r.id !== product.id,
  ).map((r) => r.image);
  const sameCat = PRODUCTS.filter(
    (r) => r.category === product.category && r.id !== product.id,
  ).map((r) => r.image);
  const gallery = Array.from(
    new Set([product.image, ...sameSub, ...sameCat]),
  ).slice(0, 4);

  const Sep = () => (
    <ChevronRight className="h-3.5 w-3.5 text-steel rtl:-scale-x-100" />
  );

  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-steel">
          <Link href="/" className="hover:text-amber-700">
            {t("home")}
          </Link>
          <Sep />
          <Link href="/boutique" className="hover:text-amber-700">
            {t("shop")}
          </Link>
          <Sep />
          <Link
            href={`/boutique?category=${product.category}`}
            className="hover:text-amber-700"
          >
            {ts(`categories.${product.category}`)}
          </Link>
          <Sep />
          <span className="line-clamp-1 font-semibold text-ink">
            {product.name[locale]}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image gallery */}
          <ProductGallery
            images={gallery}
            alt={product.name[locale]}
            isOut={isOut}
            prevLabel={t("prev")}
            nextLabel={t("next")}
            overlay={
              <>
                {product.spec ? (
                  <span className="absolute start-3 top-3 z-10 bg-white/95 px-2.5 py-1 text-sm font-extrabold text-sale shadow-sm">
                    {product.spec}
                  </span>
                ) : null}
                {discount > 0 ? (
                  <span className="absolute end-0 top-0 z-10 bg-sale px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white">
                    -{discount}%
                  </span>
                ) : product.status === "new" ? (
                  <span className="absolute end-0 top-0 z-10 bg-amber px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-ink">
                    {ts("newBadge")}
                  </span>
                ) : null}
              </>
            }
          />

          {/* Info */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              {product.brand}
            </span>
            <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
              {product.name[locale]}
            </h1>

            <div className="mt-3">
              {isOut ? (
                <span className="inline-block bg-steel-200 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-steel">
                  {t("outOfStock")}
                </span>
              ) : product.status === "low" ? (
                <span className="inline-block bg-teal px-2.5 py-1 text-xs font-bold text-white">
                  {t("lowStock")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal">
                  <span className="h-2 w-2 bg-teal" />
                  {t("inStock")}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3 border-y border-line py-4">
              {product.oldPrice ? (
                <span className="text-base text-steel line-through">
                  <span dir="ltr">{priceFmt.format(product.oldPrice)}</span>{" "}
                  {ts("currency")}
                </span>
              ) : null}
              <span className="font-display text-3xl font-extrabold text-ink">
                <span dir="ltr">{priceFmt.format(product.price)}</span>{" "}
                <span className="text-lg text-steel">{ts("currency")}</span>
              </span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ink/75">
              {t("description", { brand: product.brand })}
            </p>

            <div className="mt-5">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-steel">
                {t("featuresTitle")}
              </h3>
              <ul className="space-y-1.5">
                {(t.raw("features") as string[]).map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-ink/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-steel">
                  {t("color")}:{" "}
                  <span className="text-ink">{t(`colors.${color}`)}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      title={t(`colors.${c}`)}
                      aria-label={t(`colors.${c}`)}
                      aria-pressed={c === color}
                      className={`h-9 w-9 border-2 transition-all ${
                        c === color
                          ? "border-ink"
                          : "border-line hover:border-steel"
                      }`}
                      style={{ backgroundColor: COLOR_HEX[c] ?? "#cccccc" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!isOut ? (
              <div className="mt-6 flex flex-wrap items-stretch gap-3">
                <div className="flex items-stretch border border-line">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label={t("decrease")}
                    className="flex h-12 w-12 items-center justify-center text-ink transition-colors hover:bg-paper"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex h-12 w-12 items-center justify-center border-x border-line font-bold text-ink">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label={t("increase")}
                    className="flex h-12 w-12 items-center justify-center text-ink transition-colors hover:bg-paper"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    add(
                      {
                        id: color ? `${product.id}-${color}` : product.id,
                        name: color
                          ? `${product.name[locale]} — ${t(`colors.${color}`)}`
                          : product.name[locale],
                        price: product.price,
                        image: product.image,
                      },
                      qty,
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("addToCart")}
                </button>
              </div>
            ) : (
              <Link
                href="/boutique"
                className="mt-6 inline-flex items-center gap-2 border border-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
              >
                {t("backToShop")}
              </Link>
            )}

            {/* Trust */}
            <div className="mt-7 grid grid-cols-3 gap-3 border-t border-line pt-6">
              {[
                { Icon: Truck, label: t("delivery") },
                { Icon: Wallet, label: t("cod") },
                { Icon: ShieldCheck, label: t("warranty") },
              ].map(({ Icon, label }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <Icon className="h-6 w-6 text-amber-700" />
                  <span className="text-[11px] font-semibold text-steel">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-extrabold uppercase tracking-tight text-ink">
            {t("specifications")}
          </h2>
          <table className="w-full border border-line text-sm">
            <tbody>
              <Row label={t("brand")} value={product.brand} />
              <Row
                label={t("category")}
                value={ts(`categories.${product.category}`)}
              />
              <Row
                label={t("subcategory")}
                value={ts(`subcategories.${product.subcategory}`)}
              />
              {product.spec ? (
                <Row label={t("spec")} value={product.spec} />
              ) : null}
              <Row label={t("reference")} value={product.id.toUpperCase()} />
            </tbody>
          </table>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-5 font-display text-xl font-extrabold uppercase tracking-tight text-ink">
              {t("related")}
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/produit/${r.id}`}
                  className="group flex flex-col border border-line bg-white transition-colors hover:border-amber"
                >
                  <div className="relative aspect-square overflow-hidden border-b border-line bg-paper">
                    <Image
                      src={r.image}
                      alt={r.name[locale]}
                      fill
                      sizes="(max-width: 768px) 50vw, 220px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-steel">
                      {r.brand}
                    </span>
                    <h3 className="line-clamp-2 min-h-[2.25rem] text-xs font-bold leading-snug text-ink">
                      {r.name[locale]}
                    </h3>
                    <span className="mt-1 block text-sm font-extrabold text-ink">
                      <span dir="ltr">{priceFmt.format(r.price)}</span>{" "}
                      <span className="text-xs text-steel">{ts("currency")}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-line last:border-b-0">
      <th className="w-1/3 bg-paper px-4 py-2.5 text-start text-xs font-bold uppercase tracking-wide text-steel">
        {label}
      </th>
      <td className="px-4 py-2.5 text-ink">{value}</td>
    </tr>
  );
}
