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

export function JoinHero() {
  const t = useTranslations("join");
  const shouldReduceMotion = useReducedMotion();
  const heroSeekingRaw = t.raw("hero.seeking");
  const heroSeeking = Array.isArray(heroSeekingRaw)
    ? (heroSeekingRaw as string[])
    : [];

  // 动画配置：克制优雅
  const animationConfig = {
    duration: shouldReduceMotion ? 0 : 0.4,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-muted/30 to-transparent">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* 标题 - 立即显示 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={animationConfig}
          className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
        >
          {t("sections.hero")}
        </motion.h1>

        {/* 引言 - 延迟 0.1s */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.1 }}
          className="text-2xl text-esap-yellow font-semibold italic"
        >
          "{t("hero.quote")}"
        </motion.blockquote>

        {/* 装饰线 - 延迟 0.2s + 宽度展开 */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 1 }}
          transition={{ ...animationConfig, delay: 0.2 }}
          className="h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto my-8"
        />

        {/* 欢迎文字 - 延迟 0.3s */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.3 }}
          className="text-lg text-foreground/80"
        >
          {t("hero.welcome")}
        </motion.p>

        {/* 寻找列表 - 延迟 0.4s 开始 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-foreground/70 mb-4">{t("sections.seeking")}</p>
          <ul className="space-y-2">
            {heroSeeking.map((item: string, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...animationConfig,
                  delay: 0.5 + i * 0.1,
                }}
                className="text-foreground/70 flex items-center justify-center gap-2"
              >
                <span className="text-esap-pink">•</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* 行动号召 - 延迟取决于列表长度 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...animationConfig,
            delay: 0.5 + heroSeeking.length * 0.1,
          }}
          className="text-xl font-semibold text-foreground mt-8"
        >
          {t("hero.callToAction")}
        </motion.p>
      </div>
    </section>
  );
}
