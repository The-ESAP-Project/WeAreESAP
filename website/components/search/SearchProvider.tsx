// Copyright 2025 The ESAP Project
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
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import Fuse from "fuse.js";
import type { SearchItem } from "@/types/search";

interface SearchContextValue {
  isOpen: boolean;
  query: string;
  results: SearchItem[];
  openSearch: () => void;
  closeSearch: () => void;
  search: (query: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
  children: ReactNode;
  searchIndex: SearchItem[];
}

export function SearchProvider({ children, searchIndex }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);

  // 初始化 Fuse 实例
  useEffect(() => {
    const fuseInstance = new Fuse(searchIndex, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "subtitle", weight: 0.2 },
        { name: "description", weight: 0.3 },
        { name: "keywords", weight: 0.1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      includeScore: true,
    });
    setFuse(fuseInstance);
  }, [searchIndex]);

  // 全局快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (!fuse || !q.trim()) {
        setResults([]);
        return;
      }
      const searchResults = fuse
        .search(q)
        .slice(0, 10)
        .map((r) => r.item);
      setResults(searchResults);
    },
    [fuse]
  );

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        query,
        results,
        openSearch,
        closeSearch,
        search,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
