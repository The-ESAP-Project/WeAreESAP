// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Character } from "@/types/character";
import { CharacterHero, CharacterInfo } from "@/components/character/detail";
import { TransitionFinisher } from "@/components/ui/TransitionFinisher";
import { getImageUrl } from "@/lib/utils";

// 懒加载非首屏组件
const CharacterStory = dynamic(
  () =>
    import("@/components/character/detail").then((mod) => ({
      default: mod.CharacterStory,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterSpeechStyle = dynamic(
  () =>
    import("@/components/character/detail").then((mod) => ({
      default: mod.CharacterSpeechStyle,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterAbilities = dynamic(
  () =>
    import("@/components/character/detail").then((mod) => ({
      default: mod.CharacterAbilities,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterDailyLife = dynamic(
  () =>
    import("@/components/character/detail").then((mod) => ({
      default: mod.CharacterDailyLife,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterSpecialMoments = dynamic(
  () =>
    import("@/components/character/detail").then((mod) => ({
      default: mod.CharacterSpecialMoments,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterPhilosophy = dynamic(
  () =>
    import("@/components/character/detail").then((mod) => ({
      default: mod.CharacterPhilosophy,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterRelationships = dynamic(
  () =>
    import("@/components/character/detail").then((mod) => ({
      default: mod.CharacterRelationships,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    return {
      title: "角色未找到 - We Are ESAP",
    };
  }

  const characterTitle = `${character.name} (${character.code})`;
  const characterDesc = `${character.description} - ${character.quote}`;
  const characterImage = getImageUrl(character.backgroundImage);

  return {
    title: `${characterTitle} - We Are ESAP`,
    description: characterDesc,
    openGraph: {
      title: characterTitle,
      description: characterDesc,
      type: "profile",
      images: [
        {
          url: characterImage,
          width: 1200,
          height: 630,
          alt: `${character.name}的角色档案`,
        },
      ],
      siteName: "We Are ESAP",
    },
    twitter: {
      card: "summary_large_image",
      title: characterTitle,
      description: characterDesc,
      images: [characterImage],
    },
  };
}

// 获取单个角色数据
async function getCharacter(id: string): Promise<Character | null> {
  try {
    const fs = require("fs/promises");
    const path = require("path");

    const filePath = path.join(
      process.cwd(),
      "data",
      "characters",
      `${id}.json`
    );
    const fileContent = await fs.readFile(filePath, "utf-8");
    const character: Character = JSON.parse(fileContent);

    return character;
  } catch (error) {
    console.error(`获取角色 ${id} 失败:`, error);
    return null;
  }
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <TransitionFinisher />
      {/* Hero 区域 */}
      <CharacterHero character={character} />

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-20">
          {/* 基本信息 */}
          <CharacterInfo character={character} />

          {/* 角色故事 */}
          <CharacterStory character={character} />

          {/* 说话风格 */}
          <CharacterSpeechStyle character={character} />

          {/* 能力设定 */}
          <CharacterAbilities character={character} />

          {/* 日常生活 */}
          <CharacterDailyLife character={character} />

          {/* 特殊时刻 */}
          <CharacterSpecialMoments character={character} />

          {/* 哲学观 */}
          <CharacterPhilosophy character={character} />

          {/* 人际关系 */}
          <CharacterRelationships character={character} />
        </div>
      </div>

      {/* 底部间距 */}
      <div className="h-20" />
    </main>
  );
}
