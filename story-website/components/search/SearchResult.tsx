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

import { memo } from "react";
import { Icon } from "@/components/ui";
import type { SearchItem } from "@/types/search";

interface SearchResultProps {
  item: SearchItem;
  onSelect: () => void;
}

export const SearchResult = memo(function SearchResult({
  item,
  onSelect,
}: SearchResultProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="mt-0.5 p-1.5 rounded-md bg-esap-blue/10 text-esap-blue shrink-0">
          <Icon name="BookOpen" size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground truncate">
              {item.title}
            </span>
            {item.subtitle && (
              <span className="text-sm text-muted-foreground truncate">
                {item.subtitle}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">
            {item.description}
          </p>
          {item.keywords && item.keywords.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {item.keywords.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>
    </li>
  );
});
