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

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

export function TimelineHero() {
  const t = useTranslations("timeline");
  const shouldReduceMotion = useReducedMotion();

  // 动画配置：克制优雅
  const animationConfig = {
    duration: shouldReduceMotion ? 0 : 0.4,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center">
        {/* 标题 - 立即显示 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animationConfig}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground"
        >
          {t("hero.title")}
        </motion.h1>

        {/* 引言 - 延迟 0.1s */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.1 }}
          className="text-lg md:text-xl text-muted-foreground italic mb-4"
        >
          "{t("hero.quote")}"
        </motion.p>

        {/* 副标题 - 延迟 0.2s */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.2 }}
          className="text-base md:text-lg text-foreground/80"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* 装饰线 - 延迟 0.3s + 宽度展开 */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 1 }}
          transition={{ ...animationConfig, delay: 0.3 }}
          className="md:w-32 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto mt-6 md:mt-8"
        />
      </div>
    </section>
  );
}
