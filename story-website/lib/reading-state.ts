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

import {
  createEmptyStoryState,
  DEFAULT_READING_STATE,
  type ReadingPreferences,
  type ReadingState,
  type StoryReadingState,
} from "@/types/reading-state";

const STORAGE_KEY = "esap-story-state";

/** Load reading state from localStorage */
export function loadState(): ReadingState {
  if (typeof window === "undefined") return DEFAULT_READING_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_READING_STATE;
    return JSON.parse(stored) as ReadingState;
  } catch {
    return DEFAULT_READING_STATE;
  }
}

/** Save reading state to localStorage */
export function saveState(state: ReadingState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

/** Get or create story state */
export function getStoryState(
  state: ReadingState,
  slug: string
): StoryReadingState {
  return state.stories[slug] ?? createEmptyStoryState();
}

/** Update story state immutably */
export function updateStoryState(
  state: ReadingState,
  slug: string,
  updater: (story: StoryReadingState) => StoryReadingState
): ReadingState {
  const current = getStoryState(state, slug);
  return {
    ...state,
    stories: {
      ...state.stories,
      [slug]: updater(current),
    },
  };
}

/** Mark a chapter as read */
export function markChapterRead(
  story: StoryReadingState,
  chapterId: string
): StoryReadingState {
  if (story.chaptersRead.includes(chapterId)) return story;
  return {
    ...story,
    chaptersRead: [...story.chaptersRead, chapterId],
    currentChapterId: chapterId,
    lastReadAt: new Date().toISOString(),
  };
}

/** Record a branch choice */
export function recordChoice(
  story: StoryReadingState,
  choiceId: string,
  optionId: string
): StoryReadingState {
  return {
    ...story,
    choices: { ...story.choices, [choiceId]: optionId },
    lastReadAt: new Date().toISOString(),
  };
}

/** Record a perspective viewed */
export function recordPerspective(
  story: StoryReadingState,
  baseChapterId: string,
  characterId: string
): StoryReadingState {
  const existing = story.perspectivesViewed[baseChapterId] ?? [];
  if (existing.includes(characterId)) return story;
  return {
    ...story,
    perspectivesViewed: {
      ...story.perspectivesViewed,
      [baseChapterId]: [...existing, characterId],
    },
    lastReadAt: new Date().toISOString(),
  };
}

/** Record a discovered item */
export function discoverItem(
  story: StoryReadingState,
  sceneId: string,
  itemId: string
): StoryReadingState {
  const existing = story.discoveredItems[sceneId] ?? [];
  if (existing.includes(itemId)) return story;
  return {
    ...story,
    discoveredItems: {
      ...story.discoveredItems,
      [sceneId]: [...existing, itemId],
    },
    lastReadAt: new Date().toISOString(),
  };
}

/** Mark content as unlocked */
export function markUnlocked(
  story: StoryReadingState,
  contentId: string
): StoryReadingState {
  if (story.unlockedContent.includes(contentId)) return story;
  return {
    ...story,
    unlockedContent: [...story.unlockedContent, contentId],
    lastReadAt: new Date().toISOString(),
  };
}

/** Save scroll position for a chapter */
export function saveScrollPosition(
  story: StoryReadingState,
  chapterId: string,
  position: number
): StoryReadingState {
  return {
    ...story,
    chapterScrollPositions: {
      ...story.chapterScrollPositions,
      [chapterId]: Math.round(position),
    },
  };
}

/** Update reading preferences */
export function updatePreferences(
  state: ReadingState,
  prefs: Partial<ReadingPreferences>
): ReadingState {
  return {
    ...state,
    preferences: { ...state.preferences, ...prefs },
  };
}
