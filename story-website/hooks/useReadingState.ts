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

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  discoverItem as discItem,
  loadState,
  markChapterRead as markRead,
  markUnlocked,
  recordChoice as recChoice,
  recordPerspective as recPerspective,
  saveScrollPosition as saveScrollPos,
  saveState,
  updateStoryState,
} from "@/lib/reading-state";
import type { ReadingState, StoryReadingState } from "@/types/reading-state";
import {
  createEmptyStoryState,
  DEFAULT_READING_STATE,
} from "@/types/reading-state";

export function useReadingState(storySlug: string) {
  // 初始值始终用默认空状态，避免 SSR/client hydration mismatch
  const [state, setState] = useState<ReadingState>(DEFAULT_READING_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const storyState: StoryReadingState =
    state.stories[storySlug] ?? createEmptyStoryState();

  const markChapterRead = useCallback(
    (chapterId: string) => {
      setState((prev) =>
        updateStoryState(prev, storySlug, (s) => markRead(s, chapterId))
      );
    },
    [storySlug]
  );

  const recordChoice = useCallback(
    (choiceId: string, optionId: string) => {
      setState((prev) =>
        updateStoryState(prev, storySlug, (s) =>
          recChoice(s, choiceId, optionId)
        )
      );
    },
    [storySlug]
  );

  const recordPerspective = useCallback(
    (baseChapterId: string, characterId: string) => {
      setState((prev) =>
        updateStoryState(prev, storySlug, (s) =>
          recPerspective(s, baseChapterId, characterId)
        )
      );
    },
    [storySlug]
  );

  const discoverItem = useCallback(
    (sceneId: string, itemId: string) => {
      setState((prev) =>
        updateStoryState(prev, storySlug, (s) => discItem(s, sceneId, itemId))
      );
    },
    [storySlug]
  );

  const unlockContent = useCallback(
    (contentId: string) => {
      setState((prev) =>
        updateStoryState(prev, storySlug, (s) => markUnlocked(s, contentId))
      );
    },
    [storySlug]
  );

  const saveScrollPosition = useCallback(
    (chapterId: string, position: number) => {
      setState((prev) =>
        updateStoryState(prev, storySlug, (s) =>
          saveScrollPos(s, chapterId, position)
        )
      );
    },
    [storySlug]
  );

  return {
    storyState,
    preferences: state.preferences,
    hydrated,
    markChapterRead,
    recordChoice,
    recordPerspective,
    discoverItem,
    unlockContent,
    saveScrollPosition,
  };
}
