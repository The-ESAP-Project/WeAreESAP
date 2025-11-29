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

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { TechModule } from "@/types/tech";
import { LoadingSpinner } from "@/components/loading";
import { TechHero } from "./TechHero";
import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { loadJsonFiles } from "@/lib/data-loader";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";

// 动态导入 TechPageClient，减少首屏 JavaScript 包大小
const TechPageClient = dynamic(() =>
  import("./TechPageClient").then((mod) => ({ default: mod.TechPageClient }))
);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("tech.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const rawKeywords = t.raw("keywords");
  const keywords = Array.isArray(rawKeywords) ? (rawKeywords as string[]) : [];
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/tech`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: localizedUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.siteName,
        },
      ],
      siteName: SITE_CONFIG.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: localizedUrl,
    },
  };
}

async function getTechModules(locale: string): Promise<TechModule[]> {
  // 使用统一的数据加载工具，自动处理错误
  return loadJsonFiles<TechModule>(["data", "tech"], locale);
}

export default async function TechPage() {
  const locale = await getLocale();
  const modules = await getTechModules(locale);
  const t = await getTranslations("tech");

  return (
    <main className="relative min-h-screen bg-background">
      {/* Hero 区域 - 带动画 */}
      <TechHero />

      {/* 技术模块内容 */}
      <Suspense
        fallback={
          <div
            className="flex flex-col items-center justify-center gap-6 py-20"
            style={{ minHeight: "600px" }}
          >
            <LoadingSpinner size={150} withPulse={true} />
            <p className="text-lg font-medium text-muted-foreground">
              {t("loading")}
            </p>
          </div>
        }
      >
        {modules.length > 0 ? (
          <TechPageClient modules={modules} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        )}
      </Suspense>
    </main>
  );
}
