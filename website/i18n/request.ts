// Copyright 2025 The ESAP Project
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// 支持的语言列表
export const locales = ["zh-CN", "en", "ja"] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = routing.defaultLocale;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // 验证 locale 是否有效
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: {
      common: (await import(`@/messages/${locale}/common.json`)).default,
      home: (await import(`@/messages/${locale}/home.json`)).default,
      project: (await import(`@/messages/${locale}/project.json`)).default,
      characters: (await import(`@/messages/${locale}/characters.json`))
        .default,
      tech: (await import(`@/messages/${locale}/tech.json`)).default,
      timeline: (await import(`@/messages/${locale}/timeline.json`)).default,
      join: (await import(`@/messages/${locale}/join.json`)).default,
      notFound: (await import(`@/messages/${locale}/notFound.json`)).default,
    },
  };
});
