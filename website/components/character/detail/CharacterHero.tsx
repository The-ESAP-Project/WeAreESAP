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

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Character } from "@/types/character";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getContrastTextColor, getContrastTextColorDark } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CharacterHeroProps {
  character: Character;
}

export function CharacterHero({ character }: CharacterHeroProps) {
  const t = useTranslations("characters");
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // 预计算颜色值
  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.primary);

  // 监听滚动进度
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // 背景图视差效果（慢速向下移动，0.5倍速度）
  const backgroundYTransform = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "50%"]
  );
  // 如果启用了减少动画，禁用视差效果
  const backgroundY = shouldReduceMotion ? "0%" : backgroundYTransform;

  // 内容区域视差效果（稍快向上移动，1.2倍速度）
  const contentYTransform = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-20%"]
  );
  // 如果启用了减少动画，禁用视差效果
  const contentY = shouldReduceMotion ? "0%" : contentYTransform;

  // 内容淡出效果
  const contentOpacityTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 0.8, 0]
  );
  // 如果启用了减少动画，保持完全不透明
  const contentOpacity = shouldReduceMotion ? 1 : contentOpacityTransform;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[700px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* 背景图片层 - z-0，添加视差效果 */}
      {character.backgroundImage && (
        <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
          <Image
            src={character.backgroundImage}
            alt={character.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>
      )}

      {/* 渐变遮罩层 - z-1，加强不透明度 */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: character.backgroundImage
            ? `linear-gradient(135deg, ${character.color.primary}40, ${character.color.dark}60)`
            : `linear-gradient(135deg, ${character.color.primary}50, ${character.color.dark}70)`,
        }}
      />

      {/* 返回按钮 - z-20，固定不动 */}
      <Link
        href="/characters"
        className="absolute top-8 left-8 z-20 px-4 py-2 rounded-lg bg-black/50 dark:bg-black/70 backdrop-blur-md text-white hover:bg-black/70 dark:hover:bg-black/90 transition-all"
      >
        {t("ui.backToList")}
      </Link>

      {/* 内容区域 - z-10，添加视差和淡出效果 */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          y: contentY,
          opacity: contentOpacity,
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
          // @ts-expect-error - CSS 自定义属性在 CSSProperties 中的类型限制
          "--char-color-light": lightModeColor,
          "--char-color-dark": darkModeColor,
        }}
      >
        {/* 装饰线 */}
        <motion.div
          className="w-24 h-1 rounded-full mx-auto mb-8"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
          }}
        />

        {/* 角色代号 */}
        <motion.div
          className="text-3xl md:text-4xl font-mono font-bold mb-6 [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {character.code}
        </motion.div>

        {/* 角色名称 */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {character.name}
        </motion.h1>

        {/* 角色定位 */}
        <motion.div
          className="text-2xl md:text-3xl mb-8 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {character.role}
        </motion.div>

        {/* 角色引言 */}
        <motion.p
          className="text-xl md:text-2xl italic opacity-80 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          &quot;{character.quote}&quot;
        </motion.p>

        {/* 关键词标签 */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {character.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-5 py-2 rounded-full text-sm md:text-base font-medium backdrop-blur-md bg-black/30 dark:bg-black/50 [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
              style={{
                border: `2px solid ${character.color.primary}90`,
              }}
            >
              {keyword}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* 底部渐变 - z-2，平滑过渡到下方内容 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[2] pointer-events-none"
        style={{
          background: `linear-gradient(to top, var(--background), transparent)`,
        }}
      />
    </section>
  );
}
