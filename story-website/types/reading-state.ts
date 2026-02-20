// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

export interface ReadingState {
  version: number;
  stories: Record<string, StoryReadingState>;
  preferences: ReadingPreferences;
}

export interface StoryReadingState {
  chaptersRead: string[];
  currentChapterId?: string;
  scrollPosition?: number;
  choices: Record<string, string>;
  perspectivesViewed: Record<string, string[]>;
  discoveredItems: Record<string, string[]>;
  unlockedContent: string[];
  lastReadAt: string;
}

export interface ReadingPreferences {
  fontSize: "sm" | "base" | "lg" | "xl";
  lineHeight: "normal" | "relaxed" | "loose";
  fontFamily: "sans" | "serif";
  atmosphereEffects: boolean;
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  fontSize: "base",
  lineHeight: "relaxed",
  fontFamily: "serif",
  atmosphereEffects: true,
};

export const DEFAULT_READING_STATE: ReadingState = {
  version: 1,
  stories: {},
  preferences: DEFAULT_READING_PREFERENCES,
};

export function createEmptyStoryState(): StoryReadingState {
  return {
    chaptersRead: [],
    choices: {},
    perspectivesViewed: {},
    discoveredItems: {},
    unlockedContent: [],
    lastReadAt: new Date().toISOString(),
  };
}
