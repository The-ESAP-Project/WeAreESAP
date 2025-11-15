// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { TechModule } from "@/types/tech";
import { LoadingSpinner } from "@/components/loading";
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
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/tech`;

  return {
    title,
    description,
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
      {/* Hero 区域 */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-6" />
        </div>
      </section>

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
