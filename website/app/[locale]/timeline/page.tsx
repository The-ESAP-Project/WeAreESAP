// Copyright 2025 AptS:1547, AptS:1548
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
import { TimelineYear } from "@/types/timeline";
import { LoadingSpinner } from "@/components/loading";
import { TimelineHero } from "./TimelineHero";
import { AnimatedSection } from "@/components/ui";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { loadJsonFiles } from "@/lib/data-loader";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";

// 动态导入 TimelineClient，减少首屏 JavaScript 包大小
const TimelineClient = dynamic(() =>
  import("./TimelineClient").then((mod) => ({ default: mod.TimelineClient }))
);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("timeline.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/timeline`;

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

async function getTimelineData(locale: string): Promise<TimelineYear[]> {
  // 使用统一的数据加载工具，自动处理错误
  const years = await loadJsonFiles<TimelineYear>(["data", "timeline"], locale);

  // 按年份排序
  years.sort((a, b) => a.year.localeCompare(b.year));

  return years;
}

export default async function TimelinePage() {
  const locale = await getLocale();
  const t = await getTranslations("timeline");
  const years = await getTimelineData(locale);

  return (
    <main className="relative min-h-screen bg-background">
      {/* Hero 区域 - 带动画 */}
      <TimelineHero />

      {/* 时间线内容 */}
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
        {years.length > 0 ? (
          <TimelineClient years={years} />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        )}
      </Suspense>

      {/* 结尾引用 */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-lg md:text-xl text-foreground/80 italic mb-4">
              "{t("ending.quote")}"
            </p>
            <p className="text-xl md:text-2xl font-bold text-foreground">
              {t("ending.conclusion")}
            </p>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
