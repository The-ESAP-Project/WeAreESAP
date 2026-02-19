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

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TimelineYearNavProps {
  years: Array<{ year: string; title: string }>;
  activeYear: string;
  onYearClick: (year: string) => void;
}

export function TimelineYearNav({
  years,
  activeYear,
  onYearClick,
}: TimelineYearNavProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal 需要在客户端挂载后才能使用
  useEffect(() => {
    setMounted(true);
  }, []);

  // 滚过 hero 区域后再显示导航
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(
    (year: string) => {
      const el = document.getElementById(`year-${year}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      onYearClick(year);
    },
    [onYearClick]
  );

  // 等待客户端挂载
  if (!mounted) return null;

  // 用 portal 渲染到 body，避免被祖先 transform 破坏 fixed 定位
  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 桌面端：右侧浮动竖排 */}
          <motion.nav
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 20 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.3, ease: "easeInOut" }
            }
            aria-label="时间线年份导航"
            className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-1"
          >
            <div className="bg-muted/80 backdrop-blur-sm rounded-full py-3 px-2 border border-border flex flex-col items-center gap-1">
              {years.map(({ year }) => {
                const isActive = year === activeYear;
                return (
                  <button
                    type="button"
                    key={year}
                    onClick={() => handleClick(year)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative flex items-center gap-2 px-2 py-1.5 rounded-full transition-colors duration-200 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {/* 激活指示器 */}
                    {isActive && (
                      <motion.div
                        layoutId={
                          shouldReduceMotion ? undefined : "year-nav-indicator"
                        }
                        className="absolute inset-0 rounded-full bg-linear-to-r from-esap-yellow/20 via-esap-pink/20 to-esap-blue/20 border border-esap-pink/30"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }
                        }
                      />
                    )}
                    <span className="relative text-xs font-mono font-medium">
                      {year}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.nav>

          {/* 移动端：底部固定横排 */}
          <motion.nav
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.3, ease: "easeInOut" }
            }
            aria-label="时间线年份导航"
            className="md:hidden fixed bottom-0 left-0 right-0 z-40"
          >
            <div className="bg-muted/90 backdrop-blur-md border-t border-border px-4 py-2 flex items-center justify-center gap-1 overflow-x-auto">
              {years.map(({ year }) => {
                const isActive = year === activeYear;
                return (
                  <button
                    type="button"
                    key={year}
                    onClick={() => handleClick(year)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative shrink-0 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-colors duration-200 ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId={
                          shouldReduceMotion
                            ? undefined
                            : "year-nav-indicator-mobile"
                        }
                        className="absolute inset-0 rounded-full bg-linear-to-r from-esap-yellow/20 via-esap-pink/20 to-esap-blue/20 border border-esap-pink/30"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }
                        }
                      />
                    )}
                    <span className="relative">{year}</span>
                  </button>
                );
              })}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
