// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TriangleLogo, ThemeToggle, TransitionLink } from "@/components/ui";

const navLinks = [
  { href: "/project", label: "项目企划" },
  { href: "/characters", label: "角色档案" },
  { href: "/tech", label: "技术设定" },
  { href: "/timeline", label: "时间线" },
  { href: "/join", label: "加入我们" },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
            >
              <TriangleLogo
                size={40}
                animated={false}
                className="opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground group-hover:text-esap-yellow transition-colors">
                  We Are ESAP
                </span>
                <span className="text-xs text-muted-foreground">
                  向那卫星许愿
                </span>
              </div>
            </TransitionLink>

            {/* 桌面端导航链接 */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </TransitionLink>
              ))}
            </div>

            {/* 右侧按钮组 */}
            <div className="flex items-center gap-3">
              {/* 主题切换按钮 */}
              <ThemeToggle />

              {/* 移动端汉堡菜单按钮 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-lg bg-muted hover:bg-border transition-colors flex items-center justify-center"
                aria-label="切换菜单"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <motion.span
                    animate={
                      isMobileMenuOpen
                        ? { rotate: 45, y: 6 }
                        : { rotate: 0, y: 0 }
                    }
                    className="w-full h-0.5 bg-foreground rounded-full"
                  />
                  <motion.span
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-full h-0.5 bg-foreground rounded-full"
                  />
                  <motion.span
                    animate={
                      isMobileMenuOpen
                        ? { rotate: -45, y: -6 }
                        : { rotate: 0, y: 0 }
                    }
                    className="w-full h-0.5 bg-foreground rounded-full"
                  />
                </div>
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
            />

            {/* 菜单面板 */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-64 bg-background border-l border-border shadow-xl z-[70] md:hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <TransitionLink
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="text-lg text-foreground hover:text-esap-pink transition-colors py-2 border-b border-border/50"
                  >
                    {link.label}
                  </TransitionLink>
                ))}
              </div>

              {/* 底部装饰 */}
              <div className="absolute bottom-8 left-0 right-0 px-6">
                <div className="w-full h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
