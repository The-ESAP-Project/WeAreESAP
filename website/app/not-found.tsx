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

import { cookies, headers } from "next/headers";
import { TriangleLogo } from "@/components/ui";
import Link from "next/link";
import { defaultLocale, type Locale } from "@/i18n/request";
import { DEFAULT_IMAGES } from "@/lib/constants";
import "./globals.css";

// 从 cookies 或 headers 检测语言
async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headersList = await headers();

  // 1. 尝试从 cookie 获取
  const localeCookie = cookieStore.get("NEXT_LOCALE");
  if (localeCookie?.value) {
    return localeCookie.value as Locale;
  }

  // 2. 尝试从 Accept-Language header 获取
  const acceptLanguage = headersList.get("accept-language");
  if (acceptLanguage) {
    if (acceptLanguage.includes("zh")) return "zh-CN";
    if (acceptLanguage.includes("ja")) return "ja";
    if (acceptLanguage.includes("en")) return "en";
  }

  // 3. 返回默认语言
  return defaultLocale;
}

// 手动加载翻译
async function getTranslations(locale: Locale) {
  try {
    const messages = await import(`@/messages/${locale}/notFound.json`);
    return messages.default;
  } catch {
    // 如果加载失败，使用默认语言
    const messages = await import(`@/messages/${defaultLocale}/notFound.json`);
    return messages.default;
  }
}

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations(locale);
  const title = `${t.title} - ${t.subtitle}`;
  const description = t.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: DEFAULT_IMAGES.notFound,
          width: 1200,
          height: 630,
          alt: "We Are ESAP - 404",
        },
      ],
      siteName: "We Are ESAP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_IMAGES.notFound],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function GlobalNotFound() {
  const locale = await getLocale();
  const t = await getTranslations(locale);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 三角形 LOGO */}
        <div className="flex justify-center mb-8">
          <div style={{ animation: "spin 8s linear infinite" }}>
            <TriangleLogo size={120} />
          </div>
        </div>

        {/* 404 大号文字 */}
        <h1 className="text-8xl md:text-9xl font-bold mb-6 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue bg-clip-text text-transparent">
          {t.heading}
        </h1>

        {/* 主标题 */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          {t.message}
        </h2>

        {/* 副标题 */}
        <p className="text-lg text-muted-foreground mb-12">{t.description}</p>

        {/* 导航按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={`/${locale}`}
            className="px-8 py-3 rounded-lg bg-esap-blue text-white font-medium hover:bg-esap-blue-dark transition-colors w-full sm:w-auto"
          >
            {t.backHome}
          </Link>
          <Link
            href={`/${locale}/characters`}
            className="px-8 py-3 rounded-lg border-2 border-esap-pink text-esap-pink font-medium hover:bg-esap-pink hover:text-white transition-colors w-full sm:w-auto"
          >
            {t.browseCharacters}
          </Link>
        </div>
      </div>
    </main>
  );
}
