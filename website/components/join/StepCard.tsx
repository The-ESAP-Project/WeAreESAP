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

interface StepCardProps {
  step: {
    number: number;
    title: string;
    items: string[];
  };
  index: number;
}

export function StepCard({ step, index }: StepCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // 根据步骤数字选择颜色
  const colors = ["#ffd93d", "#ff69b4", "#4da6ff"]; // 黄、粉、蓝
  const color = colors[step.number - 1] || colors[0];

  return (
    <motion.div
      className="relative"
      initial={
        shouldReduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.95 }
      }
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { delay: index * 0.15, duration: 0.4 }
      }
    >
      <div className="bg-muted rounded-xl p-6 border border-border hover:border-opacity-50 transition-all duration-300 h-full">
        {/* 大数字标记 */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            }}
          >
            {step.number}
          </div>
          <h3 className="text-xl font-bold text-foreground mt-2">
            {step.title}
          </h3>
        </div>

        {/* 步骤列表 */}
        <ul className="space-y-2 pl-16">
          {step.items.map((item, i) => (
            <li
              key={i}
              className="text-sm text-foreground/70 flex items-start gap-2"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
