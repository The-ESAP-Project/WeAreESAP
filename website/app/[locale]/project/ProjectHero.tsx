// Copyright 2025 AptS:1547, AptS:1548
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

import { motion, useReducedMotion } from "framer-motion";

interface ProjectHeroProps {
  title: string;
  subtitle: string;
  quote: string;
  description: string;
}

export function ProjectHero({
  title,
  subtitle,
  quote,
  description,
}: ProjectHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  // 动画配置：克制优雅
  const animationConfig = {
    duration: shouldReduceMotion ? 0 : 0.4,
    ease: [0.16, 1, 0.3, 1] as const, // 自然减速曲线
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-muted/30 to-transparent">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* 标题 - 立即显示 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animationConfig}
          className="text-4xl sm:text-5xl font-bold text-foreground"
        >
          {title}
        </motion.h1>

        {/* 副标题 - 延迟 0.1s */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.1 }}
          className="text-xl text-esap-blue font-semibold"
        >
          {subtitle}
        </motion.p>

        {/* 引言 - 延迟 0.2s */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.2 }}
          className="text-lg italic text-muted-foreground max-w-3xl mx-auto border-l-4 border-esap-yellow pl-6 py-2"
        >
          "{quote}"
        </motion.blockquote>

        {/* 描述 - 延迟 0.3s */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.3 }}
          className="text-foreground/80 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>

        {/* 分隔线 - 延迟 0.4s + 宽度展开 */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 1 }}
          transition={{ ...animationConfig, delay: 0.4 }}
          className="h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-8"
        />
      </div>
    </section>
  );
}
