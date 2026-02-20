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

import type { SearchItem } from "@/types/search";
import { loadStory, loadStoryRegistry } from "./story-loader";

export async function buildSearchIndex(locale: string): Promise<SearchItem[]> {
  const registry = await loadStoryRegistry();
  const localePrefix = locale === "zh-CN" ? "" : `/${locale}`;

  const results = await Promise.all(
    registry.map(async (entry) => {
      const story = await loadStory(entry.slug, locale);
      if (!story) return null;

      return {
        id: story.slug,
        type: "story" as const,
        title: story.title,
        subtitle: story.subtitle,
        description: story.description,
        url: `${localePrefix}/stories/${story.slug}`,
        keywords: story.tags,
      } satisfies SearchItem;
    })
  );

  return results.filter((item): item is SearchItem => item !== null);
}
