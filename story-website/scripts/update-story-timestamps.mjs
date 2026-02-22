#!/usr/bin/env node
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

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

const indexPath = join(root, "data", "stories", "shared", "index.json");
const registry = JSON.parse(readFileSync(indexPath, "utf-8"));

let updated = 0;

for (const entry of registry) {
  const metaPath = join(root, "data", "stories", "shared", entry.slug, "meta.json");
  try {
    const meta = JSON.parse(readFileSync(metaPath, "utf-8"));

    // 更新故事级别的 updatedAt
    const storyTimestamp = execSync(
      `git log -1 --format="%aI" -- data/stories/zh-CN/${entry.slug}/ data/stories/shared/${entry.slug}/`,
      { encoding: "utf-8", cwd: root }
    ).trim();

    if (storyTimestamp) {
      meta.updatedAt = storyTimestamp;
      updated++;
    }

    // 为 chapterOrder 里尚未有 publishedAt 的章节自动填入 git 时间
    if (!meta.chapterPublishedAt) meta.chapterPublishedAt = {};
    let chapterFilled = 0;
    for (const chId of meta.chapterOrder ?? []) {
      if (meta.chapterPublishedAt[chId]) continue; // 已有，不覆盖

      const chTimestamp = execSync(
        `git log --diff-filter=A --format="%aI" -- data/stories/zh-CN/${entry.slug}/${chId}.json`,
        { encoding: "utf-8", cwd: root }
      ).trim();

      if (chTimestamp) {
        meta.chapterPublishedAt[chId] = chTimestamp;
        chapterFilled++;
      }
    }

    if (storyTimestamp || chapterFilled > 0) {
      writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");
    }
  } catch {
    // git 不可用时跳过，保留原值
  }
}

console.log(`✨ story timestamps 已更新: ${updated}/${registry.length} 个`);
