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
import { Icon, type IconName } from "@/components/ui/Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Link } from "@/i18n/navigation";

const FADE_THRESHOLD = 50;
const OPACITY_EPSILON = 0.01;

export interface TabItem {
  id: string;
}

export interface ScrollableTabsProps<T extends TabItem> {
  items: T[];
  activeId: string;
  onTabChange?: (id: string) => void;
  getItemName: (item: T) => string;
  getItemIcon?: (item: T) => IconName | undefined;
  getItemIconColor?: (item: T) => string | undefined;
  getUnderlineStyle?: (item: T) => string | CSSProperties;
  layoutId: string;
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

  const activeIndex = useMemo(
    () => items.findIndex((item) => item.id === activeId),
    [items, activeId]
  );

  const checkScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    let newLeftOpacity = 0;
    if (scrollLeft <= 0) {
      newLeftOpacity = 0;
    } else if (scrollLeft < FADE_THRESHOLD) {
      newLeftOpacity = scrollLeft / FADE_THRESHOLD;
    } else {
      newLeftOpacity = 1;
    }

    const scrollRight = scrollWidth - clientWidth - scrollLeft;
    let newRightOpacity = 0;
    if (scrollRight <= 1) {
      newRightOpacity = 0;
    } else if (scrollRight < FADE_THRESHOLD) {
      newRightOpacity = scrollRight / FADE_THRESHOLD;
    } else {
      newRightOpacity = 1;
    }

    setLeftGradientOpacity((prev) =>
      Math.abs(prev - newLeftOpacity) > OPACITY_EPSILON ? newLeftOpacity : prev
    );
    setRightGradientOpacity((prev) =>
      Math.abs(prev - newRightOpacity) > OPACITY_EPSILON
        ? newRightOpacity
        : prev
    );
  }, []);

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
      <style jsx>{`
        .scrollable-tabs-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <motion.div
              animate={{ opacity: leftGradientOpacity }}
              transition={gradientTransition}
              className="absolute left-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-r from-background/80 via-background/60 to-transparent"
              style={{ display: leftGradientOpacity === 0 ? "none" : "block" }}
            />

            <motion.div
              animate={{ opacity: rightGradientOpacity }}
              transition={gradientTransition}
              className="absolute right-0 top-0 h-full w-20 pointer-events-none z-10 bg-linear-to-l from-background/80 via-background/60 to-transparent"
              style={{
                display: rightGradientOpacity === 0 ? "none" : "block",
              }}
            />

            <div
              ref={containerRef}
              className="scrollable-tabs-container flex gap-1 overflow-x-auto"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {items.map((item, index) => {
                const isActive = item.id === activeId;
                const icon = getItemIcon?.(item);
                const iconColor = isActive
                  ? getItemIconColor?.(item)
                  : undefined;
                const underlineStyleValue = getUnderlineStyle?.(item);

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

                const tabClassName = `relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
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

export const ScrollableTabs = memo(
  ScrollableTabsInner
) as typeof ScrollableTabsInner;
