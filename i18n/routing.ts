import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Arabic (RTL) and French — both first-class for Algerian clients.
  locales: ["ar", "fr"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
