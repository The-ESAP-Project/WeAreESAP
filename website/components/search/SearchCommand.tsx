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

import { memo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { useSearch } from "./SearchProvider";
import { SearchResult } from "./SearchResult";
import { useTranslations } from "next-intl";

export const SearchCommand = memo(function SearchCommand() {
  const t = useTranslations("search");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, query, results, closeSearch, search } = useSearch();

  // 自动聚焦
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    closeSearch();
    router.push(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* 搜索对话框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* 搜索输入框 */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => search(e.target.value)}
                  placeholder={t("placeholder")}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex px-2 py-1 text-xs bg-muted rounded border border-border">
                  ESC
                </kbd>
              </div>

              {/* 搜索结果 */}
              <div className="max-h-[400px] overflow-y-auto">
                {results.length > 0 ? (
                  <ul className="py-2">
                    {results.map((item) => (
                      <SearchResult
                        key={`${item.type}-${item.id}`}
                        item={item}
                        onSelect={() => handleSelect(item.url)}
                      />
                    ))}
                  </ul>
                ) : query ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    {t("noResults")}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    {t("hint")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
