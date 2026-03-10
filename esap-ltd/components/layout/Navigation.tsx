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
import { useLocale, useTranslations } from "next-intl";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { LanguageSwitcher, ThemeToggle } from "@/components/ui";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants";

const LOCALE_NAMES: Record<string, string> = {
  "zh-CN": "简体中文",
  en: "English",
};

const MOBILE_LOCALE_NAMES: Record<string, string> = {
  "zh-CN": "中",
  en: "EN",
};

const LOCALES = ["zh-CN", "en"] as const;

const NAV_ITEMS = [
  { key: "home", href: ROUTES.home },
  { key: "about", href: ROUTES.about },
  { key: "products", href: ROUTES.products },
  { key: "contact", href: ROUTES.contact },
] as const;

export const Navigation = memo(function Navigation() {
  const t = useTranslations("common.navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
    },
    [router, pathname]
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileMenuOpen]);

  // Close on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: setMobileMenuOpen is stable and doesn't need to be in deps
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground hover:opacity-80"
        >
          ESAP
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-foreground/5 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher
            locales={LOCALES}
            localeNames={LOCALE_NAMES}
            currentLocale={locale}
            onLocaleChange={handleLocaleChange}
          />
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={t("menu")}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed left-0 right-0 top-16 bottom-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-x-4 top-20 bg-background border border-border rounded-2xl shadow-2xl z-50 max-h-[calc(100vh-6rem)] overflow-hidden"
            >
              <div className="px-2 py-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-foreground/5 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {t(item.key)}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.16, duration: 0.2 }}
                  className="pt-2 px-2 border-t border-border mt-2 space-y-3"
                >
                  {/* 语言切换 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("language")}
                    </span>
                    <div className="flex gap-1">
                      {LOCALES.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            handleLocaleChange(loc);
                            setMobileMenuOpen(false);
                          }}
                          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                            locale === loc
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground hover:bg-foreground/10"
                          }`}
                        >
                          {MOBILE_LOCALE_NAMES[loc]}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* 主题切换 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("theme")}
                    </span>
                    <ThemeToggle />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
});
