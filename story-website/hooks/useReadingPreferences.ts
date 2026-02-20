// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useCallback, useEffect, useState } from "react";
import { loadState, saveState, updatePreferences } from "@/lib/reading-state";
import type { ReadingPreferences, ReadingState } from "@/types/reading-state";
import {
  DEFAULT_READING_PREFERENCES,
  DEFAULT_READING_STATE,
} from "@/types/reading-state";

export function useReadingPreferences() {
  const [state, setState] = useState<ReadingState>(DEFAULT_READING_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const preferences: ReadingPreferences = hydrated
    ? state.preferences
    : DEFAULT_READING_PREFERENCES;

  const setPreferences = useCallback((prefs: Partial<ReadingPreferences>) => {
    setState((prev) => updatePreferences(prev, prefs));
  }, []);

  return { preferences, setPreferences, hydrated };
}
