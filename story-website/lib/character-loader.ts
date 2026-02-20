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

/**
 * 角色数据加载工具
 * 提供角色列表、单个角色，以及角色相关故事内容的加载功能
 */

import type { StoryCharacter } from "@/types/character";
import type { Story, StoryMeta } from "@/types/story";
import { loadJsonFile, loadJsonFileDirect, loadJsonFiles } from "./data-loader";
import { loadStory, loadStoryRegistry } from "./story-loader";

/**
 * 加载所有角色，按 order 字段升序排列
 * @param locale 当前语言
 * @returns 角色列表，加载失败返回空数组
 */
export async function loadCharacters(
  locale: string
): Promise<StoryCharacter[]> {
  return loadJsonFiles<StoryCharacter>(["data", "characters"], locale, {
    sortByOrder: true,
  });
}

/**
 * 加载单个角色
 * @param id 角色 ID，对应 JSON 文件名（不含扩展名）
 * @param locale 当前语言
 * @returns 角色数据，不存在时返回 null
 */
export async function loadCharacter(
  id: string,
  locale: string
): Promise<StoryCharacter | null> {
  return loadJsonFile<StoryCharacter>(
    ["data", "characters"],
    `${id}.json`,
    locale,
    locale === "ja" ? "en" : "zh-CN"
  );
}

/** 视角章节信息 */
export interface PerspectiveChapterEntry {
  storySlug: string;
  storyTitle: string;
  baseChapterId: string;
  chapterId: string;
}

/**
 * 获取角色相关的故事内容
 * 包含：与该角色相关的所有故事，以及该角色作为视角角色的章节列表
 *
 * @param characterId 角色 ID
 * @param locale 当前语言
 * @returns relatedStories（按 order 排序的相关故事）和 perspectiveChapters（视角章节列表）
 */
export async function getCharacterRelatedContent(
  characterId: string,
  locale: string
): Promise<{
  relatedStories: Story[];
  perspectiveChapters: PerspectiveChapterEntry[];
}> {
  // 1. 加载故事注册表，过滤出包含该角色的故事，按 order 排序
  const registry = await loadStoryRegistry();
  const relatedEntries = registry
    .filter((entry) => entry.relatedCharacters.includes(characterId))
    .sort((a, b) => a.order - b.order);

  if (relatedEntries.length === 0) {
    return { relatedStories: [], perspectiveChapters: [] };
  }

  // 2. 并行加载每个相关故事的 Story 数据和 shared meta.json
  const results = await Promise.all(
    relatedEntries.map(async (entry) => {
      const [story, meta] = await Promise.all([
        loadStory(entry.slug, locale),
        loadJsonFileDirect<StoryMeta>([
          "data",
          "stories",
          "shared",
          entry.slug,
          "meta.json",
        ]),
      ]);
      return { slug: entry.slug, story, meta };
    })
  );

  // 3. 聚合结果：过滤无效故事，收集视角章节
  const relatedStories: Story[] = [];
  const perspectiveChapters: PerspectiveChapterEntry[] = [];

  for (const { slug, story, meta } of results) {
    if (!story) continue;

    relatedStories.push(story);

    // 从 meta.perspectives 中找到该角色的视角章节
    if (meta?.perspectives) {
      for (const perspective of meta.perspectives) {
        for (const variant of perspective.variants) {
          if (variant.characterId === characterId) {
            perspectiveChapters.push({
              storySlug: slug,
              storyTitle: story.title,
              baseChapterId: perspective.baseChapterId,
              chapterId: variant.chapterId,
            });
          }
        }
      }
    }
  }

  return { relatedStories, perspectiveChapters };
}
