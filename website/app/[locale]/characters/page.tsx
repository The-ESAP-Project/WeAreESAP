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

import { unstable_cache } from "next/cache";
import { Metadata } from "next";
import { CharacterCardData } from "@/types/character";
import { CharactersClient } from "./CharactersClient";
import { CharactersHero } from "./CharactersHero";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadJsonFiles } from "@/lib/data-loader";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("characters.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const rawKeywords = t.raw("keywords");
  const keywords = Array.isArray(rawKeywords) ? (rawKeywords as string[]) : [];
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/characters`;

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

const getCharacters = unstable_cache(
  async (locale: string): Promise<CharacterCardData[]> => {
    // 使用统一的数据加载工具，自动处理 locale 回退和错误
    const characters = await loadJsonFiles<CharacterCardData>(
      ["data", "characters"],
      locale
    );

    // 按 ID 排序
    characters.sort((a, b) => a.id.localeCompare(b.id));

    return characters;
  },
  ["characters"],
  {
    revalidate: 3600, // 1小时缓存
    tags: ["characters"],
  }
);

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const characters = await getCharacters(locale);
  const t = await getTranslations("characters");

  // 按 tier 分组：core + member 放到手风琴，其他 tier 放到卡片网格
  const accordionCharacters =
    characters?.filter((c) => c.tier === "core" || c.tier === "member") || [];
  const otherCharacters =
    characters?.filter((c) => c.tier !== "core" && c.tier !== "member") || [];

  return (
    <main className="min-h-screen">
      {/* 页面标题 - 带动画 */}
      <CharactersHero />

      {/* 角色展示（响应式） */}
      <CharactersClient
        accordionCharacters={accordionCharacters}
        otherCharacters={otherCharacters}
      />

      {/* 底部间距 */}
      <div className="h-20" />
    </main>
  );
}
