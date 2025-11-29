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

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TimelineLineProps {
  totalEvents: number;
}

export function TimelineLine({ totalEvents }: TimelineLineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // 监听滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // 平滑过渡
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 将滚动进度映射到 path 绘制进度（0 到 1）
  const transformedProgress = useTransform(smoothProgress, [0, 1], [0, 1]);

  // 如果启用了减少动画，直接显示完整状态
  const pathLength = shouldReduceMotion ? 1 : transformedProgress;

  return (
    <div
      ref={containerRef}
      className="absolute left-6 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-1 pointer-events-none"
    >
      <svg
        className="w-full h-full"
        style={{ overflow: "visible" }}
        preserveAspectRatio="none"
      >
        <defs>
          {/* 三色渐变 */}
          <linearGradient
            id="timeline-gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffd93d" />
            <stop offset="50%" stopColor="#ff69b4" />
            <stop offset="100%" stopColor="#4da6ff" />
          </linearGradient>

          {/* 发光效果 */}
          <filter id="timeline-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 时间线路径 */}
        <motion.line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="url(#timeline-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#timeline-glow)"
          style={{
            pathLength,
          }}
          initial={{ pathLength: 0 }}
        />
      </svg>
    </div>
  );
}
