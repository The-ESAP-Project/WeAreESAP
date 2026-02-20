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
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTransition } from "./TransitionContext";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * 页面过渡动画组件
 * 提供淡入淡出 + 滑动效果
 *
 * 使用 navigationKey 作为 key，只在通过 transition 系统的真正导航时才变化。
 * organizations/tech 的 pushState 切 tab 不会触发 key 变化。
 */
export function PageTransition({ children }: PageTransitionProps) {
  const { navigationKey, finishTransition } = useTransition();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={navigationKey}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.4,
              ease: "easeInOut",
            }
      }
      onAnimationComplete={() => {
        // 页面进入动画完成后，结束全局过渡
        finishTransition();
      }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
