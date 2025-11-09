// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "./TransitionContext";
import { LoadingSpinner } from "../loading/LoadingSpinner";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * 页面过渡时的 LOGO 动画遮罩
 * 在页面切换时显示旋转的三角形 LOGO
 */
export function TransitionOverlay() {
  const { isTransitioning } = useTransition();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none"
        >
          <LoadingSpinner size={120} withPulse={true} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
