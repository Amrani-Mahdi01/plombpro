"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/CartContext";
import { WILAYAS } from "@/data/wilayas";
import {
  User,
  Phone,
  MapPin,
  Home,
  Building2,
  Wallet,
  CheckCircle2,
  ShoppingBag,
  Truck,
} from "lucide-react";

const priceFmt = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DELIVERY_FEES = { home: 600, stopdesk: 350 } as const;

export function CheckoutPage() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { items, total, clear } = useCart();

  const [method, setMethod] = useState<"home" | "stopdesk">("home");
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const deliveryFee = DELIVERY_FEES[method];
  const grandTotal = total + deliveryFee;
  const currency = t("currency");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num =
      "CMD-" + Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(num);
    setSubmitted(true);
    clear();
    window.scrollTo({ top: 0 });
  }

  // ---- Confirmation ----
  if (submitted) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-amber">
            <CheckCircle2 className="h-9 w-9 text-ink" />
          </span>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
            {t("successTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/70">
            {t("successText")}
          </p>
          <div className="mt-6 inline-block border border-line bg-paper px-6 py-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-steel">
              {t("orderNumber")}
            </span>
            <span className="mt-1 block font-display text-xl font-extrabold text-ink">
              {orderNumber}
            </span>
          </div>
          <div className="mt-8">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 bg-navy px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
            >
              {t("continue")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ---- Empty cart ----
  if (items.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center bg-paper text-steel">
            <ShoppingBag className="h-8 w-8" />
          </span>
          <h1 className="font-display text-xl font-extrabold text-ink">
            {t("empty")}
          </h1>
          <p className="text-sm text-steel">{t("emptyHint")}</p>
          <Link
            href="/boutique"
            className="mt-2 bg-navy px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber hover:text-ink"
          >
            {t("backToShop")}
          </Link>
        </div>
      </section>
    );
  }

  const inputClass =
    "w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-steel focus:border-amber focus:outline-none";

  // ---- Checkout form ----
  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 border-b border-line pb-5">
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            {t("title")}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          {/* Form */}
          <div className="space-y-8">
            {/* Delivery info */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                <Truck className="h-5 w-5 text-amber-700" />
                {t("deliveryInfo")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("fullName")} icon={<User className="h-4 w-4" />}>
                  <input type="text" required className={inputClass} />
                </Field>
                <Field label={t("phone")} icon={<Phone className="h-4 w-4" />}>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    inputMode="tel"
                    className={inputClass}
                  />
                </Field>
                <Field label={t("wilaya")} icon={<MapPin className="h-4 w-4" />}>
                  <select required defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      {t("selectWilaya")}
                    </option>
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} — {locale === "ar" ? w.ar : w.fr}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("commune")}>
                  <input type="text" required className={inputClass} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={t("address")}>
                    <textarea required rows={2} className={inputClass} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label={t("notes")}>
                    <textarea
                      rows={2}
                      placeholder={t("notesPlaceholder")}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Delivery method */}
            <div>
              <h2 className="mb-4 font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                {t("deliveryMethod")}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <MethodCard
                  active={method === "home"}
                  onClick={() => setMethod("home")}
                  icon={<Home className="h-5 w-5" />}
                  label={t("home")}
                  fee={`${priceFmt.format(DELIVERY_FEES.home)} ${currency}`}
                />
                <MethodCard
                  active={method === "stopdesk"}
                  onClick={() => setMethod("stopdesk")}
                  icon={<Building2 className="h-5 w-5" />}
                  label={t("stopdesk")}
                  fee={`${priceFmt.format(DELIVERY_FEES.stopdesk)} ${currency}`}
                />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="mb-4 font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                {t("paymentTitle")}
              </h2>
              <div className="flex items-start gap-3 border-2 border-amber bg-amber/5 p-4">
                <Wallet className="mt-0.5 h-6 w-6 shrink-0 text-amber-700" />
                <div>
                  <span className="block text-sm font-bold text-ink">
                    {t("cod")}
                  </span>
                  <span className="block text-xs text-steel">
                    {t("codHint")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-line">
              <div className="bg-navy px-4 py-3">
                <h2 className="font-display text-base font-extrabold uppercase tracking-tight text-white">
                  {t("summary")}
                </h2>
              </div>

              <ul className="max-h-72 divide-y divide-line overflow-y-auto">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 p-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-line bg-paper">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                      <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-amber px-1 text-[11px] font-bold text-ink">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <span className="line-clamp-2 text-xs font-bold text-ink">
                        {item.name}
                      </span>
                      <span className="mt-0.5 text-xs font-bold text-steel">
                        <span dir="ltr">
                          {priceFmt.format(item.price * item.qty)}
                        </span>{" "}
                        {currency}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border-t border-line p-4">
                <Line label={t("subtotal")} value={`${priceFmt.format(total)} ${currency}`} />
                <Line
                  label={t("delivery")}
                  value={`${priceFmt.format(deliveryFee)} ${currency}`}
                />
                <div className="flex items-center justify-between border-t border-line pt-3">
                  <span className="text-sm font-bold uppercase tracking-wide text-ink">
                    {t("total")}
                  </span>
                  <span className="font-display text-xl font-extrabold text-ink">
                    <span dir="ltr">{priceFmt.format(grandTotal)}</span>{" "}
                    <span className="text-sm text-steel">{currency}</span>
                  </span>
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full bg-amber px-5 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-navy hover:text-white"
                >
                  {t("confirm")}
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-steel">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

function MethodCard({
  active,
  onClick,
  icon,
  label,
  fee,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  fee: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 border-2 p-3 text-start transition-colors ${
        active ? "border-amber bg-amber/5" : "border-line hover:border-steel"
      }`}
    >
      <span className="text-amber-700">{icon}</span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-bold text-ink">{label}</span>
        <span className="text-xs text-steel" dir="ltr">
          {fee}
        </span>
      </span>
      <span
        className={`h-4 w-4 border-2 ${
          active ? "border-amber bg-amber" : "border-line"
        }`}
      />
    </button>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-steel">{label}</span>
      <span className="font-semibold text-ink" dir="ltr">
        {value}
      </span>
    </div>
  );
}
