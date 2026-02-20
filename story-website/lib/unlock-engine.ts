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

import type { StoryReadingState } from "@/types/reading-state";
import type {
  StoryMeta,
  UnlockCondition,
  UnlockDefinition,
} from "@/types/story";

/** Check if a single unlock condition is met */
export function checkCondition(
  condition: UnlockCondition,
  state: StoryReadingState,
  meta?: StoryMeta
): boolean {
  switch (condition.type) {
    case "read_chapter":
      return state.chaptersRead.includes(condition.chapterId);

    case "made_choice":
      return state.choices[condition.choiceId] === condition.optionId;

    case "read_perspective":
      return (state.perspectivesViewed[condition.baseChapterId] ?? []).includes(
        condition.characterId
      );

    case "found_item":
      return (state.discoveredItems[condition.sceneId] ?? []).includes(
        condition.itemId
      );

    case "read_all_perspectives": {
      if (!meta?.perspectives) return false;
      const def = meta.perspectives.find(
        (p) => p.baseChapterId === condition.baseChapterId
      );
      if (!def) return false;
      const viewed = state.perspectivesViewed[condition.baseChapterId] ?? [];
      return def.variants.every((v) => viewed.includes(v.characterId));
    }

    default:
      return false;
  }
}

/** Check if all conditions for an unlock definition are met */
export function checkUnlock(
  definition: UnlockDefinition,
  state: StoryReadingState,
  meta?: StoryMeta
): boolean {
  return definition.conditions.every((c) => checkCondition(c, state, meta));
}

/** Check if a specific target is unlocked */
export function isUnlocked(
  targetId: string,
  meta: StoryMeta,
  state: StoryReadingState
): boolean {
  if (!meta.unlocks) return true;
  const def = meta.unlocks.find((u) => u.targetId === targetId);
  if (!def) return true; // No unlock definition means it's always available
  return checkUnlock(def, state, meta);
}

/** Get all newly unlocked content IDs (content not yet in state.unlockedContent) */
export function getNewlyUnlocked(
  meta: StoryMeta,
  state: StoryReadingState
): string[] {
  if (!meta.unlocks) return [];
  return meta.unlocks
    .filter(
      (def) =>
        !state.unlockedContent.includes(def.targetId) &&
        checkUnlock(def, state, meta)
    )
    .map((def) => def.targetId);
}
