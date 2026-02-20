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

import type { StoryMeta } from "@/types/story";

/**
 * If chapterId is a perspective variant, return its base chapter ID.
 * Returns null for base chapters or non-variant chapters.
 */
function resolveVariantToBase(
  meta: StoryMeta,
  chapterId: string
): string | null {
  if (!meta.perspectives) return null;
  for (const p of meta.perspectives) {
    if (p.variants.some((v) => v.chapterId === chapterId))
      return p.baseChapterId;
  }
  return null;
}

/** Get the next chapter ID in the default reading order */
export function getNextChapterId(
  meta: StoryMeta,
  currentChapterId: string
): string | null {
  // Perspective variants use their base chapter's position in the order
  const effectiveId =
    resolveVariantToBase(meta, currentChapterId) ?? currentChapterId;
  const index = meta.chapterOrder.indexOf(effectiveId);
  if (index === -1 || index >= meta.chapterOrder.length - 1) return null;
  return meta.chapterOrder[index + 1];
}

/** Get the previous chapter ID in the default reading order */
export function getPrevChapterId(
  meta: StoryMeta,
  currentChapterId: string
): string | null {
  // Perspective variants use their base chapter's position in the order
  const effectiveId =
    resolveVariantToBase(meta, currentChapterId) ?? currentChapterId;
  const index = meta.chapterOrder.indexOf(effectiveId);
  if (index <= 0) return null;
  return meta.chapterOrder[index - 1];
}

/** Get perspective variants for a chapter */
export function getPerspectives(
  meta: StoryMeta,
  chapterId: string
): { characterId: string; chapterId: string }[] | null {
  if (!meta.perspectives) return null;

  // Check if this chapter IS a base chapter with perspectives
  const asPrimary = meta.perspectives.find(
    (p) => p.baseChapterId === chapterId
  );
  if (asPrimary) return asPrimary.variants;

  // Check if this chapter IS a variant
  for (const p of meta.perspectives) {
    const variant = p.variants.find((v) => v.chapterId === chapterId);
    if (variant) return p.variants;
  }

  return null;
}

/** Get the base chapter ID for a perspective variant */
export function getBaseChapterId(
  meta: StoryMeta,
  chapterId: string
): string | null {
  if (!meta.perspectives) return null;
  for (const p of meta.perspectives) {
    if (p.baseChapterId === chapterId) return chapterId;
    if (p.variants.some((v) => v.chapterId === chapterId))
      return p.baseChapterId;
  }
  return null;
}
