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
import { TriangleLogo } from "@/components";

export function HomeHero() {
  const t = useTranslations("home");
  const shouldReduceMotion = useReducedMotion();

  // 动画配置：克制优雅
  const animationConfig = {
    duration: shouldReduceMotion ? 0 : 0.4,
    ease: [0.16, 1, 0.3, 1] as const, // 自然减速曲线
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* 大 LOGO - 已有动画 */}
        <div className="relative flex justify-center mb-8">
          <TriangleLogo size={200} animated={true} />
        </div>

        {/* 站点标题 - 延迟 0.1s */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.1 }}
          className="text-5xl sm:text-6xl font-bold mb-4 text-foreground"
        >
          {t("hero.title")}
        </motion.h1>

        {/* 标语 - 延迟 0.2s */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...animationConfig, delay: 0.2 }}
          className="text-xl sm:text-2xl text-muted-foreground mb-4 italic"
        >
          {t("hero.tagline")}
        </motion.p>

        {/* 分隔线 - 延迟 0.3s + 宽度展开 */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 1 }}
          transition={{ ...animationConfig, delay: 0.3 }}
          className="h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto my-8"
        />

        {/* 简介 */}
        <div className="max-w-2xl mx-auto space-y-4 text-foreground/80">
          {/* 第一段 - 延迟 0.4s */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animationConfig, delay: 0.4 }}
            className="text-lg"
          >
            {t.rich("hero.intro.main", {
              strong: (chunks) => (
                <strong className="font-bold">{chunks}</strong>
              ),
            })}
          </motion.p>

          {/* 第二段 - 延迟 0.5s */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...animationConfig, delay: 0.5 }}
          >
            {t("hero.intro.world")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
