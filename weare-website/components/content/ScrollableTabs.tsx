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

import { motion } from "framer-motion";
import {
  type CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon, type IconName } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Link } from "@/i18n/navigation";

const FADE_THRESHOLD = 50; // 淡出区域阈值（像素）
const OPACITY_EPSILON = 0.01; // 透明度变化阈值，小于此值不触发更新

// 泛型 Tab 项目接口
export interface TabItem {
  id: string;
}

export interface ScrollableTabsProps<T extends TabItem> {
  items: T[];
  activeId: string;
  onTabChange?: (id: string) => void;
  /** 获取显示名称 */
  getItemName: (item: T) => string;
  /** 获取图标名称（可选） */
  getItemIcon?: (item: T) => IconName | undefined;
  /** 获取激活时图标颜色 */
  getItemIconColor?: (item: T) => string | undefined;
  /** 获取下划线样式，可以是 CSS 类名（字符串）或 CSSProperties */
  getUnderlineStyle?: (item: T) => string | CSSProperties;
  /** Framer Motion layoutId，用于区分不同的 Tabs 实例 */
  layoutId: string;
  /** 获取链接地址（提供时 tab 渲染为 Link 而非 button） */
  getItemHref?: (item: T) => string;
}

function ScrollableTabsInner<T extends TabItem>({
  items,
  activeId,
  onTabChange,
  getItemName,
  getItemIcon,
  getItemIconColor,
  getUnderlineStyle,
  layoutId,
  getItemHref,
}: ScrollableTabsProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);
  const [leftGradientOpacity, setLeftGradientOpacity] = useState(0);
  const [rightGradientOpacity, setRightGradientOpacity] = useState(0);

  // 使用 useMemo 缓存 activeIndex 计算
  const activeIndex = useMemo(
    () => items.findIndex((item) => item.id === activeId),
    [items, activeId]
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
        .scrollable-tabs-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* 左侧渐变遮罩 */}
            <motion.div
              animate={{ opacity: leftGradientOpacity }}
              transition={gradientTransition}
              className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-r from-background/80 via-background/60 to-transparent"
              style={{ display: leftGradientOpacity === 0 ? "none" : "block" }}
            />

            {/* 右侧渐变遮罩 */}
            <motion.div
              animate={{ opacity: rightGradientOpacity }}
              transition={gradientTransition}
              className="absolute right-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-l from-background/80 via-background/60 to-transparent"
              style={{ display: rightGradientOpacity === 0 ? "none" : "block" }}
            />

            <div
              ref={containerRef}
              className="scrollable-tabs-container flex gap-1 overflow-x-auto"
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
              }}
            >
              {items.map((item, index) => {
                const isActive = item.id === activeId;
                const icon = getItemIcon?.(item);
                const iconColor = isActive
                  ? getItemIconColor?.(item)
                  : undefined;
                const underlineStyleValue = getUnderlineStyle?.(item);

                // 解析下划线样式
                const isStyleObject =
                  underlineStyleValue &&
                  typeof underlineStyleValue === "object";
                const underlineClassName =
                  typeof underlineStyleValue === "string"
                    ? underlineStyleValue
                    : "";
                const underlineStyle = isStyleObject
                  ? (underlineStyleValue as CSSProperties)
                  : undefined;

                const tabClassName = `relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`;

                const tabContent = (
                  <>
                    <span className="flex items-center gap-2">
                      {icon && (
                        <Icon
                          name={icon}
                          size={20}
                          color={iconColor}
                          className={!isActive ? "text-current" : ""}
                        />
                      )}
                      {getItemName(item)}
                    </span>

                    {/* 活动标签的下划线 */}
                    {isActive && (
                      <motion.div
                        layoutId={layoutId}
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${underlineClassName}`}
                        style={underlineStyle}
                        transition={underlineTransition}
                      />
                    )}
                  </>
                );

                const href = getItemHref?.(item);

                if (href) {
                  return (
                    <Link
                      key={item.id}
                      ref={(el) => {
                        tabRefs.current[index] = el;
                      }}
                      href={href}
                      className={tabClassName}
                    >
                      {tabContent}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    onClick={() => onTabChange?.(item.id)}
                    className={tabClassName}
                  >
                    {tabContent}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 使用 memo 包装，但需要类型断言来保持泛型
export const ScrollableTabs = memo(
  ScrollableTabsInner
) as typeof ScrollableTabsInner;
