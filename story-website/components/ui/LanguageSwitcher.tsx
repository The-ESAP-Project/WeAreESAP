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
import { useLocale } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/request";

const localeNames: Record<string, string> = {
  "zh-CN": "简体中文",
  en: "English",
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
      router.push(pathname, { locale: newLocale });
      setIsOpen(false);
    },
    [router, pathname]
  );

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

  const dropdownContent = useMemo(
    () =>
      locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleLocaleChange(loc)}
          className={`w-full px-4 py-2 text-left text-sm transition-colors ${
            locale === loc
              ? "bg-esap-blue/10 text-esap-blue font-medium"
              : "text-foreground hover:bg-muted"
          }`}
          role="menuitem"
        >
          {localeNames[loc]}
        </button>
      )),
    [locale, handleLocaleChange]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-9 h-9 rounded-md bg-muted hover:bg-border transition-colors flex items-center justify-center group"
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
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }
            }
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }
            }
            className="absolute right-0 top-11 w-32 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
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
