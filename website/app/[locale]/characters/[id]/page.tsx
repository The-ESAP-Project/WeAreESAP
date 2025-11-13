// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { Character } from "@/types/character";
import { Relationship } from "@/types/relationship";
import { RelationshipNodeData } from "@/types/relationship-node";
import { CharacterHero, CharacterInfo } from "@/components/character/detail";
import { getImageUrl } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { getCharacterRelationships } from "@/lib/relationship-parser";
import { loadJsonFile } from "@/lib/data-loader";
import { SITE_CONFIG } from "@/lib/constants";

// 懒加载非首屏组件（直接导入具体文件，避免 barrel export 影响 tree-shaking）
const CharacterStory = dynamic(
  () =>
    import("@/components/character/detail/CharacterStory").then((mod) => ({
      default: mod.CharacterStory,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterSpeechStyle = dynamic(
  () =>
    import("@/components/character/detail/CharacterSpeechStyle").then(
      (mod) => ({ default: mod.CharacterSpeechStyle })
    ),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterAbilities = dynamic(
  () =>
    import("@/components/character/detail/CharacterAbilities").then((mod) => ({
      default: mod.CharacterAbilities,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterDailyLife = dynamic(
  () =>
    import("@/components/character/detail/CharacterDailyLife").then((mod) => ({
      default: mod.CharacterDailyLife,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterSpecialMoments = dynamic(
  () =>
    import("@/components/character/detail/CharacterSpecialMoments").then(
      (mod) => ({ default: mod.CharacterSpecialMoments })
    ),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterPhilosophy = dynamic(
  () =>
    import("@/components/character/detail/CharacterPhilosophy").then((mod) => ({
      default: mod.CharacterPhilosophy,
    })),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

const CharacterRelationships = dynamic(
  () =>
    import("@/components/character/detail/CharacterRelationships").then(
      (mod) => ({ default: mod.CharacterRelationships })
    ),
  { loading: () => <div className="h-64 animate-pulse bg-muted rounded-xl" /> }
);

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const t = await getTranslations("characters");
  const character = await getCharacter(id, locale);

  if (!character) {
    return {
      title: `${t("notFound")} - We Are ESAP`,
    };
  }

  const baseUrl = SITE_CONFIG.baseUrl;
  const pageUrl = `${baseUrl}/${locale}/characters/${character.id}`;
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
      url: pageUrl,
      images: [
        {
          url: `${baseUrl}${characterImage}`,
          width: 1200,
          height: 630,
          alt: `${character.name} - ${t("metadata.profileAlt")}`,
        },
      ],
      siteName: "We Are ESAP",
    },
    twitter: {
      card: "summary_large_image",
      title: characterTitle,
      description: characterDesc,
      images: [`${baseUrl}${characterImage}`],
    },
  };
}

// 获取单个角色数据
async function getCharacter(
  id: string,
  locale: string
): Promise<Character | null> {
  // 使用统一的数据加载工具，自动处理 locale 回退和错误
  return loadJsonFile<Character>(["data", "characters"], `${id}.json`, locale);
}

// 获取相关角色的基本数据（用于关系图谱）
async function getRelatedCharactersData(
  relationships: Relationship[],
  locale: string
): Promise<Record<string, RelationshipNodeData>> {
  const characterMap: Record<string, RelationshipNodeData> = {};

  // 并行加载所有相关角色（性能优化：避免串行等待）
  const relatedCharsPromises = relationships.map((rel) =>
    getCharacter(rel.targetId, locale)
  );
  const relatedChars = await Promise.all(relatedCharsPromises);

  // 构建角色映射表
  relatedChars.forEach((relatedChar, index) => {
    if (relatedChar) {
      const rel = relationships[index];
      characterMap[rel.targetId] = {
        id: relatedChar.id,
        name: relatedChar.name,
        color: relatedChar.color.primary,
      };
    }
  });

  return characterMap;
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const character = await getCharacter(id, locale);

  if (!character) {
    notFound();
  }

  // 获取关系数据
  const relationships = await getCharacterRelationships(id);

  // 预获取相关角色的数据
  const relatedCharactersData = await getRelatedCharactersData(
    relationships,
    locale
  );

  return (
    <main className="min-h-screen">
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
          <CharacterRelationships
            character={character}
            relationships={relationships}
            relatedCharactersData={relatedCharactersData}
          />
        </div>
      </div>

      {/* 底部间距 */}
      <div className="h-20" />
    </main>
  );
}
