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

import { LanguageSwitcher, ThemeToggle } from "@esap/shared-ui";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { memo, useCallback, useState } from "react";
import { useSearch } from "@/components/search";
import { Icon } from "@/components/ui/Icon";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/request";
import { cn } from "@/lib/utils";

// 桌面端下拉菜单完整名称
const localeNames: Record<string, string> = {
  "zh-CN": "简体中文",
  en: "English",
  ja: "日本語",
};

// 移动端 pill 按钮短名称
const mobileLocaleNames: Record<string, string> = {
  "zh-CN": "中",
  en: "EN",
  ja: "日",
};

const navLinks = [{ href: "/stories", key: "stories" }] as const;

export const Navigation = memo(function Navigation() {
  const t = useTranslations("common.navigation");
  const tMobileMenu = useTranslations("common.mobileMenu");
  const tSearch = useTranslations("search");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openSearch } = useSearch();
  const { resolvedTheme, setTheme } = useTheme();

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo — home link */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2 group shrink-0"
          >
            <Image
              src="/favicon.ico"
              alt="ESAP Stories"
              width={40}
              height={40}
              priority
              className="opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <span className="font-bold text-foreground group-hover:text-esap-yellow transition-colors">
              ESAP Stories
            </span>
          </Link>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Desktop: search + language + theme */}
            <div className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={openSearch}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-border transition-colors text-sm text-muted-foreground"
                aria-label={tSearch("button")}
              >
                <Icon name="Search" size={16} />
                <span className="hidden lg:inline">{tSearch("button")}</span>
                <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-xs bg-background rounded border border-border">
                  {tSearch("shortcut")}
                </kbd>
              </button>
              <LanguageSwitcher
                locales={locales}
                localeNames={localeNames}
                currentLocale={locale}
                onLocaleChange={(loc) => router.push(pathname, { locale: loc })}
              />
              <ThemeToggle />
            </div>

            {/* Mobile: search icon + hamburger */}
            <div className="md:hidden flex items-center gap-1">
              <button
                type="button"
                onClick={openSearch}
                className="w-9 h-9 rounded-md bg-muted hover:bg-border transition-colors flex items-center justify-center"
                aria-label={tSearch("button")}
              >
                <Icon name="Search" size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="w-9 h-9 rounded-md bg-muted hover:bg-border transition-colors flex items-center justify-center group"
                aria-label="切换菜单"
                aria-expanded={isMobileMenuOpen}
                data-testid="mobile-menu-button"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isMobileMenuOpen ? "close" : "open"}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <Icon
                      name={isMobileMenuOpen ? "X" : "Menu"}
                      size={20}
                      className="text-foreground group-hover:text-esap-pink transition-colors"
                    />
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed top-16 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm z-[60] md:hidden"
              data-testid="mobile-menu-overlay"
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-64 bg-background border-l border-border shadow-xl z-[70] md:hidden"
              role="dialog"
              aria-modal="true"
              data-testid="mobile-menu"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "text-lg py-2 border-b border-border/50 transition-colors",
                        active
                          ? "text-esap-pink font-medium"
                          : "text-foreground hover:text-esap-pink"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  );
                })}

                {/* Settings */}
                <div className="pt-4 mt-2 space-y-4">
                  {/* 主题切换 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {tMobileMenu("theme")}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                      }
                      className="w-10 h-10 rounded-lg bg-muted hover:bg-border transition-colors flex items-center justify-center"
                      aria-label="切换主题"
                    >
                      {resolvedTheme === "dark" ? (
                        <Icon
                          name="Sun"
                          size={18}
                          className="text-esap-yellow"
                        />
                      ) : (
                        <Icon
                          name="Moon"
                          size={18}
                          className="text-esap-blue"
                        />
                      )}
                    </button>
                  </div>

                  {/* 语言切换 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {tMobileMenu("language")}
                    </span>
                    <div className="flex gap-1">
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            router.push(pathname, { locale: loc });
                            closeMobileMenu();
                          }}
                          className={`px-2.5 py-1.5 text-sm rounded-md transition-colors ${
                            locale === loc
                              ? "bg-esap-blue text-white dark:bg-esap-blue/30 font-medium"
                              : "bg-muted text-muted-foreground hover:bg-border"
                          }`}
                        >
                          {mobileLocaleNames[loc]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ESAP gradient decoration */}
              <div className="absolute bottom-8 left-0 right-0 px-6">
                <div className="w-full h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
