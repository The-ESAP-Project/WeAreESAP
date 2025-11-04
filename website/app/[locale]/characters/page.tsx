// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { unstable_cache } from "next/cache";
import { Metadata } from "next";
import { CharacterCardData } from "@/types/character";
import { CharactersClient } from "./CharactersClient";

export const metadata: Metadata = {
  title: "角色档案 - We Are ESAP",
  description: "探索 ESAP 项目的核心成员，了解每个角色的故事与设定",
};

const getCharacters = unstable_cache(
  async (): Promise<CharacterCardData[]> => {
    try {
      const fs = require("fs/promises");
      const path = require("path");

      const charactersDir = path.join(process.cwd(), "data", "characters");
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

      return characters;
    } catch (error) {
      console.error("获取角色数据失败:", error);
      return [];
    }
  },
  ["all-characters"],
  {
    revalidate: 3600, // 1小时缓存
    tags: ["characters"],
  }
);

export default async function CharactersPage() {
  const characters = await getCharacters();

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
            角色档案
          </h1>
          <p className="text-lg text-muted-foreground">
            探索 ESAP 项目的核心成员
          </p>
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
