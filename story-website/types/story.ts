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

export type StoryFormat = "serial" | "collection" | "interactive";
export type StoryStatus = "draft" | "ongoing" | "completed" | "hiatus";

/** Story registry entry — locale-independent, stored in shared/index.json */
export interface StoryRegistryEntry {
  slug: string;
  order: number;
}

/** Story structural metadata — shared/{slug}/meta.json */
export interface StoryMeta {
  format: StoryFormat;
  status: StoryStatus;
  coverImage: string;
  authors: string[];
  relatedCharacters: string[];
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  chapterOrder: string[];
  /** Per-chapter publish timestamps — chapterId → ISO date string */
  chapterPublishedAt?: Record<string, string>;
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

/** Collection registry entry — shared/collections/index.json */
export interface CollectionRegistryEntry {
  slug: string;
  coverImage?: string;
  order: number;
  stories: string[];
}

/** Translated collection info — {locale}/collections/{slug}.json */
export interface CollectionInfo {
  title: string;
  description?: string;
}

/** Merged collection data (registry + info) */
export type Collection = CollectionRegistryEntry & CollectionInfo;
