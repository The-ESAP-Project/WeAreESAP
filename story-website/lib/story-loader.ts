// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Chapter } from "@/types/chapter";
import type { ExplorationScene } from "@/types/exploration";
import type {
  Story,
  StoryInfo,
  StoryMeta,
  StoryRegistryEntry,
} from "@/types/story";
import { loadJsonFile, loadJsonFileDirect } from "./data-loader";
import { logger } from "./logger";

/** Load the story registry (all stories list) */
export async function loadStoryRegistry(): Promise<StoryRegistryEntry[]> {
  const data = await loadJsonFileDirect<StoryRegistryEntry[]>([
    "data",
    "stories",
    "shared",
    "index.json",
  ]);
  return data ?? [];
}

/** Load a single story (registry + meta + locale info merged) */
export async function loadStory(
  slug: string,
  locale: string
): Promise<Story | null> {
  const registry = await loadStoryRegistry();
  const entry = registry.find((s) => s.slug === slug);
  if (!entry) {
    logger.warn(`Story not found in registry: ${slug}`);
    return null;
  }

  const meta = await loadJsonFileDirect<StoryMeta>([
    "data",
    "stories",
    "shared",
    slug,
    "meta.json",
  ]);
  if (!meta) {
    logger.warn(`Story meta not found: ${slug}`);
    return null;
  }

  const info = await loadJsonFile<StoryInfo>(
    ["data", "stories"],
    `${slug}/info.json`,
    locale
  );
  if (!info) {
    logger.warn(`Story info not found: ${slug} (${locale})`);
    return null;
  }

  return { ...entry, ...meta, ...info };
}

/** Load a chapter */
export async function loadChapter(
  slug: string,
  chapterId: string,
  locale: string
): Promise<Chapter | null> {
  return loadJsonFile<Chapter>(
    ["data", "stories"],
    `${slug}/${chapterId}.json`,
    locale
  );
}

/** Load an exploration scene */
export async function loadExplorationScene(
  slug: string,
  sceneId: string,
  locale: string
): Promise<ExplorationScene | null> {
  return loadJsonFile<ExplorationScene>(
    ["data", "stories"],
    `${slug}/${sceneId}.json`,
    locale
  );
}
