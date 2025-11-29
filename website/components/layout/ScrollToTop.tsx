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

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollToTopProps {
  /** 显示按钮的滚动阈值（默认 400px） */
  threshold?: number;
}

// SVG 进度条常量（不依赖 props 或 state，只计算一次）
const SVG_SIZE = 48;
const STROKE_WIDTH = 3;
const RADIUS = (SVG_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// 颜色常量：ESAP 品牌色
// esap-yellow: #ffd93d (255, 217, 61)
// esap-pink: #ff69b4 (255, 105, 180)
// esap-blue: #4da6ff (77, 166, 255)
const YELLOW = [255, 217, 61] as const;
const PINK = [255, 105, 180] as const;
const BLUE = [77, 166, 255] as const;

// 线性插值函数：在两个 RGB 颜色之间进行插值
const lerpColor = (
  c1: readonly [number, number, number],
  c2: readonly [number, number, number],
  t: number
): string =>
  `rgb(${Math.floor(c1[0] * (1 - t) + c2[0] * t)}, ${Math.floor(c1[1] * (1 - t) + c2[1] * t)}, ${Math.floor(c1[2] * (1 - t) + c2[2] * t)})`;

// 颜色查找表：预计算 21 个关键帧（0%, 5%, 10%, ... 100%）
// 这样滚动时只需要查表，避免每帧都进行浮点运算
const COLOR_LOOKUP_TABLE = Array.from({ length: 21 }, (_, i) => {
  const progress = i / 20; // 0, 0.05, 0.1, ... 1.0
  if (progress < 0.5) {
    return lerpColor(YELLOW, PINK, progress * 2);
  }
  return lerpColor(PINK, BLUE, (progress - 0.5) * 2);
});

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

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // 根据滚动进度查找颜色（使用预计算的查找表，避免实时插值计算）
  const progressColor = useMemo(() => {
    const index = Math.round(scrollProgress * 20);
    return COLOR_LOOKUP_TABLE[index];
  }, [scrollProgress]);

  // 计算当前滚动进度对应的圆环偏移量
  const progressOffset = CIRCUMFERENCE - scrollProgress * CIRCUMFERENCE;

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
              width={SVG_SIZE}
              height={SVG_SIZE}
            >
              {/* 背景圆环 */}
              <circle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                className="text-muted/20"
              />
              {/* 进度圆环 */}
              <circle
                cx={SVG_SIZE / 2}
                cy={SVG_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={progressColor}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={CIRCUMFERENCE}
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
