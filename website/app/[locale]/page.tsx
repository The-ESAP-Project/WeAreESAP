// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { unstable_cache } from "next/cache";
import { TriangleLogo } from "@/components";
import { CharacterCardData } from "@/types/character";
import { HomeCharacters } from "./HomeCharacters";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const getCharacters = unstable_cache(
  async (locale: string): Promise<CharacterCardData[]> => {
    try {
      // 尝试读取指定语言的目录
      let charactersDir = path.join(
        process.cwd(),
        "data",
        "characters",
        locale
      );

      // 检查目录是否存在，不存在则回退到 zh-CN
      try {
        await fs.access(charactersDir);
      } catch {
        console.log(`角色数据目录 ${locale} 不存在，回退到 zh-CN`);
        charactersDir = path.join(process.cwd(), "data", "characters", "zh-CN");
      }

      const files = await fs.readdir(charactersDir);

      const characters: CharacterCardData[] = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const filePath = path.join(charactersDir, file);
          const fileContent = await fs.readFile(filePath, "utf-8");
          const character = JSON.parse(fileContent);
          characters.push(character);
        }
      }

      // 按 ID 排序
      characters.sort((a: CharacterCardData, b: CharacterCardData) =>
        a.id.localeCompare(b.id)
      );

      // 只返回核心成员(首页展示)
      return characters.filter((c) => c.tier === "core");
    } catch (error) {
      console.error("获取角色数据失败:", error);
      return [];
    }
  },
  ["home-characters"],
  {
    revalidate: 3600, // 1小时缓存
    tags: ["characters"],
  }
);

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

      {/* 故事区域 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            {t("story.title")}
          </h2>

          <div className="text-foreground/80 space-y-4">
            <p>{t("story.lines.line1")}</p>
            <p>{t("story.lines.line2")}</p>
            <p>{t("story.lines.line3")}</p>
          </div>

          <p className="text-xl font-semibold text-foreground mt-8">
            {t("story.conclusion.main")}
          </p>
          <p className="text-foreground/80">{t("story.conclusion.sub")}</p>
        </div>
      </section>
    </main>
  );
}
