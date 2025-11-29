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

import { memo } from "react";
import { motion } from "framer-motion";
import { CharacterCardData } from "@/types/character";
import Image from "next/image";
import { getBlurDataURL } from "@/lib/blur-placeholder";
import { useTranslations } from "next-intl";
import { getContrastTextColor, getContrastTextColorDark } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CharacterStripProps {
  character: CharacterCardData;
  isExpanded: boolean;
  onClick?: () => void;
  index?: number;
}

function CharacterStripComponent({
  character,
  isExpanded,
  onClick,
  index = 0,
}: CharacterStripProps) {
  const t = useTranslations("characters");
  const shouldReduceMotion = useReducedMotion();

  // 预计算颜色值
  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.dark);

  return (
    <motion.div
      className="relative h-[600px] overflow-hidden cursor-pointer group"
      onClick={onClick}
      layout
      style={
        {
          "--char-color-light": lightModeColor,
          "--char-color-dark": darkModeColor,
        } as React.CSSProperties
      }
    >
      {/* 背景图片 */}
      {character.backgroundImage && (
        <Image
          src={character.backgroundImage}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority={index === 0}
          placeholder="blur"
          blurDataURL={getBlurDataURL(character.backgroundImage)}
        />
      )}

      {/* 遮罩层 - 使用两层实现平滑过渡 */}
      {/* 收起状态的遮罩 */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom, ${character.color.primary}80, ${character.color.dark}80)`,
          opacity: isExpanded ? 0 : 1,
        }}
      />
      {/* 展开状态的遮罩 */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${character.color.primary}40, ${character.color.dark}50)`,
          opacity: isExpanded ? 1 : 0,
        }}
      />

      {/* 内容区域 */}
      <div
        className={`relative h-full flex p-6 text-white ${isExpanded ? "items-start justify-start" : "items-center justify-center"}`}
      >
        {isExpanded ? (
          // 扩展模式：显示完整信息
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { delay: 0.05, duration: 0.45 }
            }
            className="w-full max-w-md space-y-6 p-8"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
          >
            {/* 顶部装饰线 */}
            <div
              className="w-16 h-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
              }}
            />

            {/* 角色代号 */}
            <div
              className="text-2xl font-mono font-bold [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
              data-testid="character-code"
            >
              {character.code}
            </div>

            {/* 角色名字 */}
            <h3 className="text-4xl font-bold" data-testid="character-name">
              {character.name}
            </h3>

            {/* 角色定位 */}
            <div className="text-xl opacity-90">{character.role}</div>

            {/* 引言 */}
            <p className="text-lg italic opacity-80 leading-relaxed">
              &quot;{character.quote}&quot;
            </p>

            {/* 关键词标签 */}
            <div className="flex flex-wrap gap-3">
              {character.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm bg-black/30 dark:bg-black/50 [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
                  style={{
                    border: `2px solid ${character.color.primary}80`,
                    textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* 描述 */}
            <p className="text-base opacity-75 leading-relaxed">
              {character.description}
            </p>

            {/* 点击提示 */}
            <div className="text-sm opacity-50 italic pt-4">
              {t("ui.detailHint")}
            </div>
          </motion.div>
        ) : (
          // 竖条模式：竖排显示代号
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : undefined}
            className="flex flex-col items-center justify-center"
          >
            {/* 竖排文字 */}
            <div
              className="text-3xl font-mono font-bold tracking-wider"
              data-testid="character-code"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                letterSpacing: "0.5em",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              {character.code}
            </div>
            {/* 隐藏的角色名称（用于测试识别） */}
            <span className="sr-only" data-testid="character-name">
              {character.name}
            </span>
          </motion.div>
        )}
      </div>

      {/* 悬停时的边框发光 */}
      {isExpanded && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : undefined}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 60px ${character.color.primary}40`,
          }}
        />
      )}
    </motion.div>
  );
}

// 使用 memo 优化，只在 character.id 或 isExpanded 改变时重新渲染
export const CharacterStrip = memo(
  CharacterStripComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.character.id === nextProps.character.id &&
      prevProps.isExpanded === nextProps.isExpanded
    );
  }
);

CharacterStrip.displayName = "CharacterStrip";
