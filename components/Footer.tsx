import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Wrench, Phone, Mail, MapPin, Clock } from "lucide-react";

const SHOP_LINKS = ["tools", "faucets", "pipes", "heaters", "promos"] as const;
const SOCIALS = ["f", "ig", "yt"] as const;
const HELP_LINKS = ["track", "delivery", "payment", "faq", "contact"] as const;

export async function Footer() {
  const t = await getTranslations("Footer");
  const th = await getTranslations("Header");
  const year = 2026;

  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-amber">
                <Wrench className="h-6 w-6 text-ink" />
              </span>
              <span className="leading-none">
                <span className="block font-display text-xl font-extrabold tracking-tight">
                  {th("brand")}
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-white/60">
                  {th("brandTagline")}
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              {t("aboutText")}
            </p>
            <div className="mt-5">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                {t("followUs")}
              </span>
              <div className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-white/20 text-xs font-bold uppercase text-white/80 transition-colors hover:bg-amber hover:text-ink"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {t("shopTitle")}
            </h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((key) => (
                <li key={key}>
                  <Link
                    href="/"
                    className="text-sm text-white/65 transition-colors hover:text-amber"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {t("helpTitle")}
            </h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((key) => (
                <li key={key}>
                  <Link
                    href="/"
                    className="text-sm text-white/65 transition-colors hover:text-amber"
                  >
                    {t(`help.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              {t("contactTitle")}
            </h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-amber" />
                <span dir="ltr">{t("contact.phone")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-amber" />
                <span dir="ltr">{t("contact.email")}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                <span>{t("contact.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-amber" />
                <span>{t("contact.hours")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-white/55 sm:flex-row sm:text-start">
          <p>
            © {year} {th("brand")}. {t("rights")}
          </p>
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
