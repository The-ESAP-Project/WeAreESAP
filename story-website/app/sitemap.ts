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

import type { MetadataRoute } from "next";
import { loadCharacters } from "@/lib/character-loader";
import { loadJsonFileDirect } from "@/lib/data-loader";
import { loadStoryRegistry } from "@/lib/story-loader";
import type { StoryMeta } from "@/types/story";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://story.esaps.net";

const LOCALES = ["zh-CN", "en", "ja"] as const;
const DEFAULT_LOCALE = "zh-CN";

function localizedUrl(urlPath: string, locale: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${urlPath}`;
}

function buildEntry(
  urlPath: string,
  lastModified: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap[number] {
  return {
    url: localizedUrl(urlPath, DEFAULT_LOCALE),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, localizedUrl(urlPath, locale)])
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date().toISOString();

  // 静态路由
  entries.push(buildEntry("/", now, "weekly", 1.0));
  entries.push(buildEntry("/stories", now, "weekly", 0.9));
  entries.push(buildEntry("/characters", now, "weekly", 0.85));

  // 角色路由
  const characters = await loadCharacters(DEFAULT_LOCALE);
  for (const character of characters) {
    entries.push(
      buildEntry(`/characters/${character.id}`, now, "monthly", 0.75)
    );
  }

  // 故事路由
  const registry = await loadStoryRegistry();

  for (const entry of registry) {
    const { slug } = entry;

    // 从 meta.json 读取章节和探索场景列表
    const meta = await loadJsonFileDirect<StoryMeta>([
      "data",
      "stories",
      "shared",
      slug,
      "meta.json",
    ]);

    const lastMod = meta?.updatedAt || now;

    // 故事详情页
    entries.push(buildEntry(`/stories/${slug}`, lastMod, "monthly", 0.8));

    if (meta) {
      const chapterIds = new Set<string>(meta.chapterOrder ?? []);

      // 视角变体章节
      for (const perspective of meta.perspectives ?? []) {
        for (const variant of perspective.variants) {
          chapterIds.add(variant.chapterId);
        }
      }

      for (const chapterId of chapterIds) {
        entries.push(
          buildEntry(`/stories/${slug}/${chapterId}`, lastMod, "monthly", 0.7)
        );
      }

      // 探索场景
      for (const sceneId of meta.explorationScenes ?? []) {
        entries.push(
          buildEntry(
            `/stories/${slug}/explore/${sceneId}`,
            lastMod,
            "monthly",
            0.6
          )
        );
      }
    }
  }

  return entries;
}
