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

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface LanguageSwitcherProps {
  /** 支持的 locale 列表，如 ["zh-CN", "en", "ja"] */
  locales: readonly string[];
  /** locale code 到显示名的映射，如 { "zh-CN": "简体中文", en: "English" } */
  localeNames: Record<string, string>;
  /** 当前激活的 locale（由父组件 useLocale() 提供） */
  currentLocale: string;
  /**
   * 切换语言的回调。父组件负责调用 router.push(pathname, { locale })。
   * 建议父组件用 useCallback 包装以避免不必要的 useMemo 失效。
   */
  onLocaleChange: (locale: string) => void;
}

export function LanguageSwitcher({
  locales,
  localeNames,
  currentLocale,
  onLocaleChange,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      onLocaleChange(newLocale);
      setIsOpen(false);
    },
    [onLocaleChange]
  );

  // 点击外部关闭下拉菜单
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // 缓存下拉菜单内容，只在相关依赖变化时重新渲染
  const dropdownContent = useMemo(
    () =>
      locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleLocaleChange(loc)}
          className={`w-full px-4 py-2 text-left text-sm transition-colors ${
            currentLocale === loc
              ? "bg-esap-blue/10 text-esap-blue font-medium"
              : "text-foreground hover:bg-muted"
          }`}
          role="menuitem"
        >
          {localeNames[loc] ?? loc}
        </button>
      )),
    [locales, localeNames, currentLocale, handleLocaleChange]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-10 h-10 rounded-lg bg-muted hover:bg-border transition-colors flex items-center justify-center group"
        aria-label="切换语言"
      >
        {/* Lucide Globe icon (inline SVG) */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground group-hover:text-esap-blue transition-colors"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <line x1="2" x2="22" y1="12" y2="12" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }
            }
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }
            }
            className="absolute right-0 top-12 w-32 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
            role="menu"
            aria-label="语言选择菜单"
          >
            {dropdownContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
