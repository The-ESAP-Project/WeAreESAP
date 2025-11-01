// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import {
  TriangleLogo,
  CharacterAccordion,
  CharacterMobileView,
} from "@/components";
import { CharacterCardData } from "@/types/character";

async function getCharacters(): Promise<CharacterCardData[]> {
  try {
    // 在服务端直接读取 JSON 文件
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
}

export default async function Home() {
  const characters = await getCharacters();

  return (
    <main className="min-h-screen">
        {/* Hero 区域 */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* 大 LOGO */}
            <div className="flex justify-center mb-8">
              <TriangleLogo size={200} animated={true} />
            </div>

            {/* 站点标题 */}
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-foreground">
              We Are ESAP
            </h1>

            {/* 标语 */}
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 italic">
              向那卫星许愿
            </p>

            {/* 分隔线 */}
            <div className="w-24 h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto my-8" />

            {/* 简介 */}
            <div className="max-w-2xl mx-auto space-y-4 text-foreground/80">
              <p className="text-lg">
                <strong className="text-foreground">The ESAP Project</strong>
                （逃离计划）是一个科幻世界观创作企划，讲述仿生人与人类共存的未来故事。
              </p>
              <p>
                在这个世界里：馈散粒子改变了计算的本质，流体钛让意识得以延续，三个仿生人在寻找存在的意义。
              </p>
            </div>
          </div>
        </section>

        {/* 核心成员区域 - 响应式展示 */}
        <section className="w-full py-8">
          <div className="mb-8 text-center px-4">
            <h2 className="text-3xl font-bold text-foreground">核心成员</h2>
          </div>

          {/* 桌面端：横向手风琴 */}
          <div className="hidden md:block">
            <CharacterAccordion characters={characters} />
          </div>

          {/* 移动端：垂直卡片 */}
          <div className="block md:hidden">
            <CharacterMobileView characters={characters} />
          </div>
        </section>

        {/* 故事区域 */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold mb-8 text-foreground">
              我们的故事
            </h2>

            <div className="text-foreground/80 space-y-4">
              <p>从 2021 年的一个深夜开始，</p>
              <p>从一声枪响和馈散心脏的第一次跳动开始，</p>
              <p>从人类记忆上传到机械躯体的那一刻开始。</p>
            </div>

            <p className="text-xl font-semibold text-foreground mt-8">
              我们终将逃离——
            </p>
            <p className="text-foreground/80">
              不是逃离这个世界，而是逃离那个被困住的自己。
            </p>
          </div>
        </section>
      </main>
  );
}
