// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { locales } from "@/i18n/request";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui";

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

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    // 移除当前 locale 前缀，构造新路径
    const segments = pathname.split("/");
    const currentLocaleIndex = segments.findIndex((seg) =>
      locales.includes(seg as any)
    );

    let newPath: string;
    if (currentLocaleIndex !== -1) {
      // 替换 locale
      segments[currentLocaleIndex] = newLocale;
      newPath = segments.join("/");
    } else {
      // 添加 locale
      newPath = `/${newLocale}${pathname}`;
    }

    router.push(newPath);
    setIsOpen(false);
  };

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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-32 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
          >
            {locales.map((loc) => (
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
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
