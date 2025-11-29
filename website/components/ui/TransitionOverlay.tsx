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
          className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <LoadingSpinner size={120} withPulse={true} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
