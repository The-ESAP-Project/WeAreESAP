// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

export type StoryFormat = "serial" | "collection" | "interactive";
export type StoryStatus = "draft" | "ongoing" | "completed" | "hiatus";

/** Story registry entry — locale-independent, stored in shared/index.json */
export interface StoryRegistryEntry {
  slug: string;
  format: StoryFormat;
  status: StoryStatus;
  coverImage: string;
  authors: string[];
  relatedCharacters: string[];
  order: number;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
}

/** Story structural metadata — shared/{slug}/meta.json */
export interface StoryMeta {
  slug: string;
  format: StoryFormat;
  status: StoryStatus;
  chapterOrder: string[];
  perspectives?: PerspectiveDefinition[];
  unlocks?: UnlockDefinition[];
  explorationScenes?: string[];
}

/** Translated story info — {locale}/{slug}/info.json */
export interface StoryInfo {
  title: string;
  subtitle?: string;
  description: string;
  synopsis?: string;
  warnings?: string[];
}

/** Merged story data (registry + meta + info) */
export type Story = StoryRegistryEntry & StoryMeta & StoryInfo;

export interface PerspectiveDefinition {
  baseChapterId: string;
  variants: {
    characterId: string;
    chapterId: string;
  }[];
}

export interface UnlockDefinition {
  targetId: string;
  targetType: "chapter" | "exploration" | "perspective";
  conditions: UnlockCondition[];
}

export type UnlockCondition =
  | { type: "read_chapter"; chapterId: string }
  | {
      type: "made_choice";
      chapterId: string;
      choiceId: string;
      optionId: string;
    }
  | { type: "read_perspective"; baseChapterId: string; characterId: string }
  | { type: "found_item"; sceneId: string; itemId: string }
  | { type: "read_all_perspectives"; baseChapterId: string };
