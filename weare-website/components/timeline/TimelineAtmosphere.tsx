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

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TimelineAtmosphereProps {
  activeYear: string;
}

// 每个年份对应的氛围色调（极低透明度）
const YEAR_ATMOSPHERES: Record<string, { colors: string; opacity: number }> = {
  "2021": {
    colors: "from-esap-yellow/5 via-transparent to-transparent",
    opacity: 0.4,
  },
  "2022": {
    colors: "from-esap-pink/5 via-transparent to-transparent",
    opacity: 0.4,
  },
  "2023": {
    colors: "from-esap-blue/5 via-transparent to-transparent",
    opacity: 0.4,
  },
  "2024": {
    colors: "from-esap-pink/5 via-esap-blue/3 to-transparent",
    opacity: 0.3,
  },
  "2025": {
    colors: "from-esap-yellow/5 via-esap-pink/3 to-transparent",
    opacity: 0.3,
  },
  "2026": {
    colors: "from-esap-blue/5 via-esap-yellow/3 to-transparent",
    opacity: 0.3,
  },
};

// 默认氛围（回退用）
const DEFAULT_ATMOSPHERE = {
  colors: "from-transparent via-transparent to-transparent",
  opacity: 0,
};

export function TimelineAtmosphere({ activeYear }: TimelineAtmosphereProps) {
  const shouldReduceMotion = useReducedMotion();
  const atmosphere = YEAR_ATMOSPHERES[activeYear] ?? DEFAULT_ATMOSPHERE;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 用 portal 渲染到 body，避免被祖先 transform 破坏 fixed 定位
  return createPortal(
    <AnimatePresence mode="popLayout">
      <motion.div
        key={activeYear}
        initial={
          shouldReduceMotion ? { opacity: atmosphere.opacity } : { opacity: 0 }
        }
        animate={{ opacity: atmosphere.opacity }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.8, ease: "easeInOut" }
        }
        className={`fixed inset-0 pointer-events-none z-0 bg-linear-to-b ${atmosphere.colors}`}
        aria-hidden="true"
      />
    </AnimatePresence>,
    document.body
  );
}
