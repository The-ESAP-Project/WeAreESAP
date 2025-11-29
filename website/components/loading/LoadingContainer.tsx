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

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoadingContainerProps {
  /** 是否正在加载 */
  isLoading: boolean;
  /** 加载完成后显示的内容 */
  children: ReactNode;
  /** 加载文本 */
  text?: string;
  /** LOGO 大小 */
  size?: number;
  /** 最小高度 */
  minHeight?: string;
  /** 类名 */
  className?: string;
}

/**
 * 区块加载容器组件（包装器模式）
 *
 * 功能：
 * - 加载时：显示 LoadingSpinner + 文本
 * - 加载完成：spinner 淡出，内容淡入
 * - 支持平滑的状态切换动画
 *
 * 使用场景：页面某个区域的加载状态（如时间线、技术设定）
 *
 * @example
 * ```tsx
 * <LoadingContainer isLoading={isLoadingTimeline} text="加载时间线...">
 *   <Timeline events={events} />
 * </LoadingContainer>
 * ```
 */
export function LoadingContainer({
  isLoading,
  children,
  text = "加载中...",
  size = 120,
  minHeight = "400px",
  className = "",
}: LoadingContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative ${className}`} style={{ minHeight }}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }
            }
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
          >
            <LoadingSpinner size={size} withPulse={true} />
            {text && (
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  shouldReduceMotion ? { duration: 0 } : { delay: 0.1 }
                }
                className="text-lg font-medium text-muted-foreground"
              >
                {text}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.3, delay: 0.1 }
            }
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
