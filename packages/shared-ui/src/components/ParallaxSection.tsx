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

import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number; // 视差速度倍数，0.5 = 慢一半，1.5 = 快 50%
  offset?: number; // 初始偏移量
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  offset = 0,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [offset, offset - (speed - 1) * 200]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
