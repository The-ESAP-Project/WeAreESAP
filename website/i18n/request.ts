// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import {hasLocale} from 'next-intl';
import {routing} from './routing';

// 支持的语言列表
export const locales = ["zh-CN", "en", "ja"] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = routing.defaultLocale;

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;

  // 验证 locale 是否有效
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: {
      common: (await import(`@/messages/${locale}/common.json`)).default,
      home: (await import(`@/messages/${locale}/home.json`)).default,
    },
  };
});
