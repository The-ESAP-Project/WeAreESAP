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

import { TriangleLogo } from "@/components";
import { CharacterCardData } from "@/types/character";
import { HomeCharacters } from "./HomeCharacters";
import { StorySection } from "./StorySection";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { loadJsonFiles } from "@/lib/data-loader";
import { SITE_CONFIG, DEFAULT_IMAGES } from "@/lib/constants";

// 启用 ISR - 1小时重新验证一次
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("home.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}`;

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

async function getCharacters(locale: string): Promise<CharacterCardData[]> {
  // 使用统一的数据加载工具，自动处理 locale 回退和错误
  const characters = await loadJsonFiles<CharacterCardData>(
    ["data", "characters"],
    locale,
    { filter: (c) => c.tier === "core" } // 只返回核心成员(首页展示)
  );

  // 按 ID 排序
  characters.sort((a, b) => a.id.localeCompare(b.id));

  return characters;
}

export default async function Home() {
  const locale = await getLocale();
  const characters = await getCharacters(locale);
  const t = await getTranslations("home");

  return (
    <main className="relative min-h-screen">
      {/* Hero 区域 */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* 大 LOGO */}
          <div className="relative flex justify-center mb-8">
            <TriangleLogo size={200} animated={true} />
          </div>

          {/* 站点标题 */}
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-foreground">
            {t("hero.title")}
          </h1>

          {/* 标语 */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-4 italic">
            {t("hero.tagline")}
          </p>

          {/* 分隔线 */}
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto my-8" />

          {/* 简介 */}
          <div className="max-w-2xl mx-auto space-y-4 text-foreground/80">
            <p className="text-lg">
              {t.rich("hero.intro.main", {
                strong: (chunks) => (
                  <strong className="font-bold">{chunks}</strong>
                ),
              })}
            </p>
            <p>{t("hero.intro.world")}</p>
          </div>
        </div>
      </section>

      {/* 核心成员区域 - 响应式展示 */}
      <section className="w-full py-8">
        <div className="mb-8 text-center px-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t("members.title")}
          </h2>
        </div>

        <HomeCharacters characters={characters} />
      </section>

      {/* 故事区域 - 客户端组件 */}
      <StorySection />
    </main>
  );
}
