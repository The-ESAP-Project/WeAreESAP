// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { locales } from "@/i18n/request";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const localeNames: Record<string, string> = {
  "zh-CN": "简中",
  en: "EN",
  ja: "日本語",
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      // 使用 next-intl 的 router，自动处理 locale 切换
      router.push(pathname, { locale: newLocale });
      setIsOpen(false);
    },
    [router, pathname]
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
          onClick={() => handleLocaleChange(loc)}
          className={`w-full px-4 py-2 text-left text-sm transition-colors ${
            locale === loc
              ? "bg-esap-blue/10 text-esap-blue font-medium"
              : "text-foreground hover:bg-muted"
          }`}
        >
          {localeNames[loc]}
        </button>
      )),
    [locale, handleLocaleChange]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg bg-muted hover:bg-border transition-colors flex items-center justify-center group"
        aria-label="切换语言"
      >
        <Icon
          name="Globe"
          size={18}
          className="text-foreground group-hover:text-esap-blue transition-colors"
        />
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
          >
            {dropdownContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
