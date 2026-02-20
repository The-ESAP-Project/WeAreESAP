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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadState, saveState, updatePreferences } from "@/lib/reading-state";
import type { ReadingPreferences, ReadingState } from "@/types/reading-state";
import {
  DEFAULT_READING_PREFERENCES,
  DEFAULT_READING_STATE,
} from "@/types/reading-state";

interface ReadingPreferencesContextValue {
  preferences: ReadingPreferences;
  setPreferences: (prefs: Partial<ReadingPreferences>) => void;
  hydrated: boolean;
}

const ReadingPreferencesContext =
  createContext<ReadingPreferencesContextValue | null>(null);

export function ReadingPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <ReadingPreferencesContext.Provider
      value={{ preferences, setPreferences, hydrated }}
    >
      {children}
    </ReadingPreferencesContext.Provider>
  );
}

export function useReadingPreferences() {
  const context = useContext(ReadingPreferencesContext);
  if (!context) {
    throw new Error(
      "useReadingPreferences must be used within ReadingPreferencesProvider"
    );
  }
  return context;
}
