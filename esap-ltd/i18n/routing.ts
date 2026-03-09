import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["zh-CN", "en"],
  defaultLocale: "zh-CN",
  localePrefix: "as-needed",
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
  },
});
