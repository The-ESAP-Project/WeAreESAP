// Copyright 2021-2026 The ESAP Project
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

import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CharacterHero,
  CharacterInfo,
  PullToReveal,
} from "@/components/character/detail";
import { CharacterSkeleton } from "@/components/loading";
import { PersonJsonLd } from "@/components/seo";
import { locales } from "@/i18n/request";
import { DEFAULT_IMAGES } from "@/lib/constants";
import { loadJsonFile } from "@/lib/data-loader";
import { buildAlternates } from "@/lib/metadata";
import type { Character } from "@/types/character";

// 懒加载非首屏组件（直接导入具体文件，避免 barrel export 影响 tree-shaking）
const CharacterStory = dynamic(
  () =>
    import("@/components/character/detail/CharacterStory").then((mod) => ({
      default: mod.CharacterStory,
    })),
  { loading: () => <CharacterSkeleton /> }
);

const CharacterSpeechStyle = dynamic(
  () =>
    import("@/components/character/detail/CharacterSpeechStyle").then(
      (mod) => ({ default: mod.CharacterSpeechStyle })
    ),
  { loading: () => <CharacterSkeleton /> }
);

const CharacterAbilities = dynamic(
  () =>
    import("@/components/character/detail/CharacterAbilities").then((mod) => ({
      default: mod.CharacterAbilities,
    })),
  { loading: () => <CharacterSkeleton /> }
);

const CharacterDailyLife = dynamic(
  () =>
    import("@/components/character/detail/CharacterDailyLife").then((mod) => ({
      default: mod.CharacterDailyLife,
    })),
  { loading: () => <CharacterSkeleton /> }
);

const CharacterSpecialMoments = dynamic(
  () =>
    import("@/components/character/detail/CharacterSpecialMoments").then(
      (mod) => ({ default: mod.CharacterSpecialMoments })
    ),
  { loading: () => <CharacterSkeleton /> }
);

const CharacterPhilosophy = dynamic(
  () =>
    import("@/components/character/detail/CharacterPhilosophy").then((mod) => ({
      default: mod.CharacterPhilosophy,
    })),
  { loading: () => <CharacterSkeleton /> }
);

// 生成静态参数
export async function generateStaticParams() {
  const charactersDir = path.join(process.cwd(), "data", "characters", "zh-CN");
  const files = await fs.readdir(charactersDir);
  const characterIds = files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));

  return locales.flatMap((locale) =>
    characterIds.map((id) => ({ locale, id }))
  );
}

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("characters");
  const character = await getCharacter(id, locale);

  if (!character) {
    const notFoundTitle = `${t("notFound")} - We Are ESAP`;
    const notFoundDesc = t("notFoundDescription");

    return {
      title: notFoundTitle,
      description: notFoundDesc,
      openGraph: {
        title: notFoundTitle,
        description: notFoundDesc,
        type: "website",
        images: [
          {
            url: DEFAULT_IMAGES.notFound,
            width: 1200,
            height: 630,
            alt: "We Are ESAP - Character Not Found",
          },
        ],
        siteName: "We Are ESAP",
      },
      twitter: {
        card: "summary_large_image",
        title: notFoundTitle,
        description: notFoundDesc,
        images: [DEFAULT_IMAGES.notFound],
      },
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const characterTitle = `${character.name} (${character.code})`;
  const characterDesc = `${character.description} - ${character.quote}`;
  const characterImage = character.backgroundImage || DEFAULT_IMAGES.homepage;
  const alternates = buildAlternates(locale, `/characters/${character.id}`);

  // 动态生成角色专属 keywords（纯角色词）
  const keywords = [
    ...new Set(
      [
        character.name,
        character.code,
        character.role,
        ...(character.keywords || []),
      ].filter(Boolean)
    ),
  ];

  return {
    title: `${characterTitle} - We Are ESAP`,
    description: characterDesc,
    keywords,
    openGraph: {
      title: characterTitle,
      description: characterDesc,
      type: "profile",
      url: alternates.canonical,
      images: [
        {
          url: characterImage,
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
      images: [characterImage],
    },
    alternates,
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

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  setRequestLocale(locale);
  const character = await getCharacter(id, locale);

  if (!character) {
    notFound();
  }

  return (
    <PullToReveal
      hiddenProfile={character.hiddenProfile}
      characterColor={character.color.primary}
      characterName={character.name}
    >
      <PersonJsonLd character={character} locale={locale} />
      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-6">
          <CharacterHero character={character} />
          <CharacterInfo character={character} />
          <CharacterStory character={character} />
          <CharacterSpeechStyle character={character} />
          <CharacterAbilities character={character} />
          <CharacterDailyLife character={character} />
          <CharacterSpecialMoments character={character} />
          <CharacterPhilosophy character={character} />
        </div>
      </main>
    </PullToReveal>
  );
}
