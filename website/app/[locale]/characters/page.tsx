// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { unstable_cache } from "next/cache";
import { Metadata } from "next";
import { CharacterCardData } from "@/types/character";
import { CharactersClient } from "./CharactersClient";
import { getTranslations, getLocale } from "next-intl/server";
import { loadJsonFiles } from "@/lib/data-loader";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("characters.metadata");
  const title = `${t("title")} - ${t("subtitle")}`;
  const description = t("description");
  const ogImage = DEFAULT_IMAGES.homepage;
  const localizedUrl = `${SITE_CONFIG.baseUrl}/${locale}/characters`;

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

export default async function CharactersPage() {
  const locale = await getLocale();
  const characters = await getCharacters(locale);
  const t = await getTranslations("characters");

  // 按 tier 分组：core + member 放到手风琴，其他 tier 放到卡片网格
  const accordionCharacters =
    characters?.filter((c) => c.tier === "core" || c.tier === "member") || [];
  const otherCharacters =
    characters?.filter((c) => c.tier !== "core" && c.tier !== "member") || [];

  return (
    <main className="min-h-screen">
      {/* 页面标题 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-6" />
        </div>
      </section>

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
