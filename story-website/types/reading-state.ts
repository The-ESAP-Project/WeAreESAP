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

export interface ReadingState {
  version: number;
  stories: Record<string, StoryReadingState>;
  preferences: ReadingPreferences;
}

export interface StoryReadingState {
  chaptersRead: string[];
  currentChapterId?: string;
  chapterScrollPositions?: Record<string, number>;
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
