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

import { motion } from "framer-motion";
import { useRef, useEffect, useState, memo, useCallback, useMemo } from "react";
import { TechModule } from "@/types/tech";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FADE_THRESHOLD = 50; // 淡出区域阈值（像素）
const OPACITY_EPSILON = 0.01; // 透明度变化阈值，小于此值不触发更新

interface TechTabsProps {
  modules: TechModule[];
  activeId: string;
  onTabChange: (id: string) => void;
}

export const TechTabs = memo(function TechTabs({
  modules,
  activeId,
  onTabChange,
}: TechTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [leftGradientOpacity, setLeftGradientOpacity] = useState(0);
  const [rightGradientOpacity, setRightGradientOpacity] = useState(0);

  // 使用 useMemo 缓存 activeIndex 计算
  const activeIndex = useMemo(
    () => modules.findIndex((m) => m.id === activeId),
    [modules, activeId]
  );

  // 使用 useCallback 优化滚动检测函数
  const checkScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // 计算左侧渐变透明度
    let newLeftOpacity = 0;
    if (scrollLeft <= 0) {
      newLeftOpacity = 0;
    } else if (scrollLeft < FADE_THRESHOLD) {
      newLeftOpacity = scrollLeft / FADE_THRESHOLD;
    } else {
      newLeftOpacity = 1;
    }

    // 计算右侧渐变透明度
    const scrollRight = scrollWidth - clientWidth - scrollLeft;
    let newRightOpacity = 0;
    if (scrollRight <= 1) {
      newRightOpacity = 0;
    } else if (scrollRight < FADE_THRESHOLD) {
      newRightOpacity = scrollRight / FADE_THRESHOLD;
    } else {
      newRightOpacity = 1;
    }

    // 只在变化超过阈值时才更新状态
    setLeftGradientOpacity((prev) =>
      Math.abs(prev - newLeftOpacity) > OPACITY_EPSILON ? newLeftOpacity : prev
    );
    setRightGradientOpacity((prev) =>
      Math.abs(prev - newRightOpacity) > OPACITY_EPSILON
        ? newRightOpacity
        : prev
    );
  }, []);

  // 自动滚动到激活的 tab
  useEffect(() => {
    const activeTab = tabRefs.current[activeIndex];
    if (activeTab && containerRef.current) {
      activeTab.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex, shouldReduceMotion]);

  // 缓存 transition 配置
  const gradientTransition = useMemo(
    () => ({
      duration: shouldReduceMotion ? 0.01 : 0.15,
      ease: "easeInOut" as const,
    }),
    [shouldReduceMotion]
  );

  const underlineTransition = useMemo(
    () =>
      shouldReduceMotion
        ? { duration: 0.01 }
        : {
            type: "spring" as const,
            stiffness: 500,
            damping: 30,
          },
    [shouldReduceMotion]
  );

  // 检测滚动位置以显示/隐藏渐变
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  return (
    <>
      {/* 隐藏 Webkit 浏览器的滚动条 */}
      <style jsx>{`
        .tech-tabs-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="border-b border-border bg-background sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* 左侧渐变遮罩 */}
            <motion.div
              animate={{ opacity: leftGradientOpacity }}
              transition={gradientTransition}
              className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-r from-background via-background/80 to-transparent"
              style={{ display: leftGradientOpacity === 0 ? "none" : "block" }}
            />

            {/* 右侧渐变遮罩 */}
            <motion.div
              animate={{ opacity: rightGradientOpacity }}
              transition={gradientTransition}
              className="absolute right-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-l from-background via-background/80 to-transparent"
              style={{ display: rightGradientOpacity === 0 ? "none" : "block" }}
            />

            <div
              ref={containerRef}
              className="tech-tabs-container flex gap-1 overflow-x-auto"
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
              }}
            >
              {modules.map((module, index) => {
                const isActive = module.id === activeId;

                return (
                  <button
                    key={module.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    onClick={() => onTabChange(module.id)}
                    className={`relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {module.icon && (
                        <Icon
                          name={module.icon}
                          size={20}
                          color={isActive ? module.color.primary : undefined}
                          className={!isActive ? "text-current" : ""}
                        />
                      )}
                      {module.name}
                    </span>

                    {/* 活动标签的下划线 */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue"
                        transition={underlineTransition}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
