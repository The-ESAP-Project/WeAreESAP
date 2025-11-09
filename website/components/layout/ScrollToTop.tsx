// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollToTopProps {
  /** 显示按钮的滚动阈值（默认 400px） */
  threshold?: number;
}

export function ScrollToTop({ threshold = 400 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let rafId: number | null = null;

    const updateScroll = () => {
      // 如果已经有待处理的 requestAnimationFrame，跳过
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const progress = scrollHeight > 0 ? currentScroll / scrollHeight : 0;

        setScrollProgress(Math.min(progress, 1));
        setIsVisible(currentScroll > threshold);

        rafId = null;
      });
    };

    // 监听滚动事件，使用 passive 优化性能
    window.addEventListener("scroll", updateScroll, { passive: true });

    // 清理事件监听器和待处理的动画帧
    return () => {
      window.removeEventListener("scroll", updateScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 计算进度条颜色：根据进度从 ESAP 黄色→粉色→蓝色渐变
  // esap-yellow: #ffd93d (255, 217, 61)
  // esap-pink: #ff69b4 (255, 105, 180)
  // esap-blue: #4da6ff (77, 166, 255)
  const getProgressColor = () => {
    const lerp = (c1: number[], c2: number[], t: number) =>
      `rgb(${Math.floor(c1[0] * (1 - t) + c2[0] * t)}, ${Math.floor(c1[1] * (1 - t) + c2[1] * t)}, ${Math.floor(c1[2] * (1 - t) + c2[2] * t)})`;

    const YELLOW = [255, 217, 61];
    const PINK = [255, 105, 180];
    const BLUE = [77, 166, 255];

    if (scrollProgress < 0.5) {
      return lerp(YELLOW, PINK, scrollProgress * 2);
    }
    return lerp(PINK, BLUE, (scrollProgress - 0.5) * 2);
  };

  // 圆形进度条的参数
  const size = 48; // 按钮大小
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={
            shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, y: 20 }
          }
          animate={
            shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }
          }
          exit={
            shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, y: 20 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button
            onClick={scrollToTop}
            className="relative w-12 h-12 rounded-full bg-background shadow-lg hover:shadow-xl transition-shadow group"
            aria-label="返回顶部"
          >
            {/* SVG 圆形进度条 */}
            <svg
              className="absolute inset-0 -rotate-90"
              width={size}
              height={size}
            >
              {/* 背景圆环 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-muted/20"
              />
              {/* 进度圆环 */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={getProgressColor()}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
              />
            </svg>

            {/* 箭头图标 */}
            <svg
              className="absolute inset-0 m-auto w-6 h-6 text-foreground group-hover:-translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
