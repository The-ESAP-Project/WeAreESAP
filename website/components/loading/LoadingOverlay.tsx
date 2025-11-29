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

import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoadingOverlayProps {
  /** 是否显示加载遮罩 */
  isLoading: boolean;
  /** 加载文本 */
  text?: string;
  /** LOGO 大小 */
  size?: number;
}

/**
 * 全屏加载遮罩组件
 * 用于页面级的加载状态
 */
export function LoadingOverlay({
  isLoading,
  text = "加载中...",
  size = 150,
}: LoadingOverlayProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-6">
            <LoadingSpinner size={size} withPulse={true} />
            {text && (
              <motion.p
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={
                  shouldReduceMotion ? { duration: 0 } : { delay: 0.1 }
                }
                className="text-lg font-medium text-foreground"
              >
                {text}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
