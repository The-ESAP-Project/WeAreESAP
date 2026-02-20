// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

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
