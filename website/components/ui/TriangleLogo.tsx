// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";

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
  const strokeWidth = 3;
  const gap = 8; // 边之间的间隙

  // 计算三角形的点（等边三角形）
  const height = (size * Math.sqrt(3)) / 2;
  const centerX = size / 2;
  const centerY = height / 2;

  // 三个顶点
  const top = { x: centerX, y: 10 };
  const bottomLeft = { x: 10, y: height - 10 };
  const bottomRight = { x: size - 10, y: height - 10 };

  // 计算缩短的路径（留出间隙）
  const shortenPath = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    gapStart: number,
    gapEnd: number
  ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    const startX = x1 + (dx * gapStart) / length;
    const startY = y1 + (dy * gapStart) / length;
    const endX = x1 + (dx * (length - gapEnd)) / length;
    const endY = y1 + (dy * (length - gapEnd)) / length;

    return `M ${startX} ${startY} L ${endX} ${endY}`;
  };

  // 三条边的路径（每条边留出间隙）
  const paths = [
    // 黄色 - 左边（从左下到顶部）
    shortenPath(bottomLeft.x, bottomLeft.y, top.x, top.y, gap, gap),
    // 粉色 - 右边（从顶部到右下）
    shortenPath(top.x, top.y, bottomRight.x, bottomRight.y, gap, gap),
    // 蓝色 - 底边（从右下到左下）
    shortenPath(bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y, gap, gap),
  ];

  const colors = ["#ffd93d", "#ff69b4", "#4da6ff"]; // 黄、粉、蓝

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
          stroke={colors[i]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            animated
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
