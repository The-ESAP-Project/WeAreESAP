// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { useTransition } from "./TransitionContext";
import { LoadingSpinner } from "../loading/LoadingSpinner";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * 页面过渡时的 LOGO 动画遮罩
 * 在页面切换时显示旋转的三角形 LOGO
 *
 * 性能优化：始终挂载 div，只改变透明度和可见性，避免频繁挂载/卸载 DOM
 */
export function TransitionOverlay() {
  const { isTransitioning } = useTransition();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{
        opacity: isTransitioning ? 1 : 0,
      }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
      style={{
        visibility: isTransitioning ? "visible" : "hidden",
        pointerEvents: isTransitioning ? "auto" : "none",
      }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      {/* LoadingSpinner 仍条件渲染，避免在不可见时持续运行动画 */}
      {isTransitioning && <LoadingSpinner size={120} withPulse={true} />}
    </motion.div>
  );
}
