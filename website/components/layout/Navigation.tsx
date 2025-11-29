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

import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import {
  ThemeToggle,
  TransitionLink,
  Icon,
  LanguageSwitcher,
} from "@/components/ui";
import { useTranslations } from "next-intl";
import { DEFAULT_IMAGES } from "@/lib/constants";

const navLinks = [
  { href: "/project", key: "project" },
  { href: "/characters", key: "characters" },
  { href: "/tech", key: "tech" },
  { href: "/timeline", key: "timeline" },
  { href: "/join", key: "join" },
] as const;

export const Navigation = memo(function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const tNavigation = useTranslations("common.navigation");
  const tHeader = useTranslations("common.header");

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // 判断链接是否激活
  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname]
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo 和站点名称 */}
            <TransitionLink
              href="/"
              className="relative flex items-center gap-3 group"
              onClick={closeMobileMenu}
              prefetch={true}
            >
              <Image
                src={DEFAULT_IMAGES.favicon}
                alt="ESAP Logo"
                width={40}
                height={40}
                priority
                className="opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground group-hover:text-esap-yellow transition-colors">
                  {tHeader("siteName")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tHeader("tagline")}
                </span>
              </div>
            </TransitionLink>

            {/* 桌面端导航链接 */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <div key={link.href} className="relative">
                    <TransitionLink
                      href={link.href}
                      prefetch={true}
                      className={`text-sm transition-colors ${
                        active
                          ? "text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tNavigation(link.key)}
                    </TransitionLink>
                    {/* 激活指示器 - ESAP 三色渐变 */}
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

            {/* 右侧按钮组 */}
            <div className="flex items-center gap-3">
              {/* 语言切换器 */}
              <LanguageSwitcher />

              {/* 主题切换按钮 */}
              <ThemeToggle />

              {/* 移动端汉堡菜单按钮 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-lg bg-muted hover:bg-border transition-colors flex items-center justify-center group"
                aria-label="切换菜单"
                aria-expanded={isMobileMenuOpen}
                data-testid="mobile-menu-button"
              >
                <AnimatePresence mode="wait">
                  <motion.div
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
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端菜单面板 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed top-16 left-0 right-0 bottom-0 bg-black/3 backdrop-blur-sm z-[60] md:hidden"
              data-testid="mobile-menu-overlay"
            />

            {/* 菜单面板 */}
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
                    <TransitionLink
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      prefetch={true}
                      className={`text-lg py-2 border-b border-border/50 transition-colors ${
                        active
                          ? "text-esap-pink font-medium"
                          : "text-foreground hover:text-esap-pink"
                      }`}
                    >
                      {tNavigation(link.key)}
                    </TransitionLink>
                  );
                })}
              </div>

              {/* 底部装饰 */}
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
