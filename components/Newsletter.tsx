"use client";

import { useTranslations } from "next-intl";
import { Mail, Send } from "lucide-react";

export function Newsletter() {
  const t = useTranslations("Newsletter");

  return (
    <section className="bg-navy text-white">
      <div className="hazard-stripes h-2 w-full" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:py-16 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-amber">
            <Mail className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Newsletter
            </span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">
            {t("text")}
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full items-stretch border border-white/20 bg-white/5 lg:justify-self-end"
        >
          <input
            type="email"
            required
            placeholder={t("placeholder")}
            className="w-full bg-transparent px-4 py-4 text-sm text-white placeholder:text-white/50 focus:outline-none"
          />
          <button
            type="submit"
            className="flex shrink-0 items-center gap-2 bg-amber px-5 py-4 text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:bg-white"
          >
            <Send className="h-4 w-4 rtl:-scale-x-100" />
            <span className="hidden sm:inline">{t("button")}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
