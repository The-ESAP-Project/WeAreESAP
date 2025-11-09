// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { generateTrianglePaths, ESAP_COLOR_ARRAY } from "@/lib/svg-utils";

interface LoadingSpinnerProps {
  /** 大小（像素） */
  size?: number;
  /** 是否显示脉冲效果 */
  withPulse?: boolean;
  /** 类名 */
  className?: string;
}

/**
 * 加载动画组件 - 使用 ESAP 三角形 LOGO
 * 支持旋转动画和脉冲效果
 */
export function LoadingSpinner({
  size = 120,
  withPulse = true,
  className = "",
}: LoadingSpinnerProps) {
  const shouldReduceMotion = useReducedMotion();
  const strokeWidth = 3;

  // 使用公共工具生成三角形路径
  const { paths, height } = generateTrianglePaths(size);

  return (
    <motion.div
      className={className}
      animate={shouldReduceMotion ? {} : { rotate: 360 }}
      transition={
        shouldReduceMotion
          ? {}
          : {
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }
      }
    >
      <svg
        width={size}
        height={height}
        viewBox={`0 0 ${size} ${height}`}
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
            initial={{ opacity: shouldReduceMotion || !withPulse ? 1 : 0.3 }}
            animate={
              shouldReduceMotion || !withPulse
                ? undefined
                : {
                    opacity: [0.3, 1, 0.3],
                  }
            }
            transition={
              shouldReduceMotion || !withPulse
                ? undefined
                : {
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5, // 依次亮起
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </svg>
    </motion.div>
  );
}
