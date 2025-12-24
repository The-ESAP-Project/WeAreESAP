// Copyright 2025 The ESAP Project
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
 * 搜索索引构建器
 * 服务端函数，用于构建搜索索引数据
 */

import { loadJsonFiles } from "./data-loader";
import type { Character } from "@/types/character";
import type { TechModule } from "@/types/tech";
import type { TimelineYear } from "@/types/timeline";
import type { SearchItem } from "@/types/search";

/**
 * 构建搜索索引数据
 * @param locale 语言
 * @returns 搜索项数组
 */
export async function buildSearchIndex(locale: string): Promise<SearchItem[]> {
  const items: SearchItem[] = [];
  const localePrefix = locale === "zh-CN" ? "" : `/${locale}`;

  // 加载角色数据
  const characters = await loadJsonFiles<Character>(
    ["data", "characters"],
    locale
  );
  characters.forEach((char) => {
    items.push({
      id: char.id,
      type: "character",
      title: char.name,
      subtitle: char.code,
      description: `${char.description} ${char.quote} ${char.role}`,
      url: `${localePrefix}/characters/${char.id}`,
      keywords: char.keywords,
      color: char.color.primary,
    });
  });

  // 加载技术设定数据
  const techModules = await loadJsonFiles<TechModule>(["data", "tech"], locale);
  techModules.forEach((tech) => {
    items.push({
      id: tech.id,
      type: "tech",
      title: tech.name,
      subtitle: tech.description,
      description: tech.sections.map((s) => s.title).join(" "),
      url: `${localePrefix}/tech?module=${tech.id}`,
      color: tech.color.primary,
    });
  });

  // 加载时间线数据
  const timelineYears = await loadJsonFiles<TimelineYear>(
    ["data", "timeline"],
    locale
  );
  timelineYears.forEach((year) => {
    year.events.forEach((event) => {
      items.push({
        id: event.id,
        type: "timeline",
        title: event.title,
        subtitle: event.date,
        description: event.content
          .filter((c) => c.type === "paragraph" || c.type === "quote")
          .map((c) => ("text" in c ? c.text : ""))
          .join(" "),
        url: `${localePrefix}/timeline?event=${event.id}`,
        keywords: event.meta?.tags,
      });
    });
  });

  return items;
}
