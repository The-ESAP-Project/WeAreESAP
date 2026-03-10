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

import { useTranslations } from "next-intl";
import { memo } from "react";
import { Icon } from "@/components/ui";
import type { SearchItem, SearchResultType } from "@/types/search";

interface SearchResultProps {
  item: SearchItem;
  onSelect: () => void;
}

const typeIcons: Record<SearchResultType, React.ReactNode> = {
  character: <Icon name="User" size={16} />,
  tech: <Icon name="Monitor" size={16} />,
  timeline: <Icon name="Clock" size={16} />,
};

export const SearchResult = memo(function SearchResult({
  item,
  onSelect,
}: SearchResultProps) {
  const t = useTranslations("search");

  return (
    <li>
      <button
        onClick={onSelect}
        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
      >
        {/* 类型图标 */}
        <div
          className="mt-0.5 p-1.5 rounded-md"
          style={{
            backgroundColor: item.color ? `${item.color}20` : undefined,
          }}
        >
          <span style={{ color: item.color }}>{typeIcons[item.type]}</span>
        </div>

        {/* 内容 */}
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
        </div>

        {/* 类型标签 */}
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
          {t(`types.${item.type}`)}
        </span>
      </button>
    </li>
  );
});
