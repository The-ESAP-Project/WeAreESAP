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
