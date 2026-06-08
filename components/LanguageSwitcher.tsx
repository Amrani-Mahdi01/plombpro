"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  ar: "العربية",
  fr: "Français",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: string) {
    if (next === locale) return;
    // Keep the user on the same route, just swap the locale.
    router.replace(
      // @ts-expect-error -- pathname + params are compatible at runtime
      { pathname, params },
      { locale: next },
    );
  }

  return (
    <div className="flex items-stretch border border-white/20 text-xs font-semibold">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-pressed={loc === locale}
          className={`px-2.5 py-1 transition-colors ${
            loc === locale
              ? "bg-amber text-ink"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          {LABELS[loc] ?? loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
