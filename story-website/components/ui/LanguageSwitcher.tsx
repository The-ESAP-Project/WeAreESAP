// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALE_LABELS: Record<string, string> = {
  "zh-CN": "中文",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "zh-CN" ? "en" : "zh-CN";

  return (
    <button
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Switch to ${LOCALE_LABELS[nextLocale]}`}
    >
      {LOCALE_LABELS[nextLocale]}
    </button>
  );
}
