// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export const locales = ["zh-CN", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = routing.defaultLocale;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      common: (await import(`@/messages/${locale}/common.json`)).default,
      home: (await import(`@/messages/${locale}/home.json`)).default,
      stories: (await import(`@/messages/${locale}/stories.json`)).default,
      reader: (await import(`@/messages/${locale}/reader.json`)).default,
      notFound: (await import(`@/messages/${locale}/notFound.json`)).default,
    },
  };
});
