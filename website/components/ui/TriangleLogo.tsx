// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { generateTrianglePaths, ESAP_COLOR_ARRAY } from "@/lib/svg-utils";

interface TriangleLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function TriangleLogo({
  size = 120,
  animated = true,
  className = "",
}: TriangleLogoProps) {
  const shouldReduceMotion = useReducedMotion();
  const strokeWidth = 3;

  // 使用公共工具生成三角形路径
  const { paths, height } = generateTrianglePaths(size);

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 ${size} ${height}`}
      className={className}
      fill="none"
    >
      {paths.map((path, i) => (
        <motion.path
          key={i}
          d={path}
          stroke={ESAP_COLOR_ARRAY[i]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={
            animated && !shouldReduceMotion
              ? { pathLength: 0, opacity: 0 }
              : { pathLength: 1, opacity: 1 }
          }
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            animated && !shouldReduceMotion
              ? {
                  pathLength: {
                    delay: i * 0.2,
                    duration: 0.8,
                    ease: [0.42, 0, 0.58, 1], // easeInOut 的贝塞尔曲线
                  },
                  opacity: {
                    delay: i * 0.2,
                    duration: 0.3,
                  },
                }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
