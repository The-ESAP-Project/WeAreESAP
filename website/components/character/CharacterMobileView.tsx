// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterCardData } from "@/types/character";
import Image from "next/image";
import { getBlurDataURL } from "@/lib/blur-placeholder";
import { useTranslations } from "next-intl";
import { getContrastTextColor } from "@/lib/utils";

interface CharacterMobileViewProps {
  characters: CharacterCardData[];
  onCharacterClick?: (characterId: string) => void;
}

export function CharacterMobileView({
  characters = [], // 设置默认值为空数组
  onCharacterClick,
}: CharacterMobileViewProps) {
  const t = useTranslations("characters");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // 如果没有角色数据，不渲染
  if (characters.length === 0) {
    return null;
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleCharacterClick = (
    character: CharacterCardData,
    index: number
  ) => {
    // 如果已展开，点击后跳转到详情页
    if (expandedIndex === index) {
      onCharacterClick?.(character.id);
    } else {
      // 否则展开卡片
      toggleExpand(index);
    }
  };

  return (
    <div className="w-full space-y-4 px-4">
      {characters.map((character, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <motion.div
            key={character.id}
            className="relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => handleCharacterClick(character, index)}
            initial={false}
            animate={{
              height: isExpanded ? "auto" : "140px",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* 背景图片 */}
            {character.backgroundImage && (
              <Image
                src={character.backgroundImage}
                alt={character.name}
                fill
                sizes="(max-width: 768px) calc(100vw - 2rem), 50vw"
                className="object-cover"
                priority={index === 0}
                placeholder="blur"
                blurDataURL={getBlurDataURL(character.backgroundImage)}
              />
            )}

            {/* 顶部斜切装饰 */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
                clipPath:
                  "polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
              }}
            />

            {/* 遮罩层 */}
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${character.color.primary}60, ${character.color.dark}70)`,
              }}
            />

            {/* 内容区域 */}
            <div
              className="relative h-full p-6 text-white"
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              {/* 基础信息（始终显示） */}
              <div className="space-y-2">
                {/* 角色代号 */}
                <div
                  className="text-lg font-mono font-bold"
                  style={{ color: getContrastTextColor(character.color.primary) }}
                >
                  {character.code}
                </div>

                {/* 角色名字和定位 */}
                <div className="flex items-baseline gap-3">
                  <h3 className="text-2xl font-bold">{character.name}</h3>
                  <span className="text-sm opacity-80">{character.role}</span>
                </div>

                {/* 简短描述 */}
                {!isExpanded && (
                  <p className="text-sm opacity-75 line-clamp-2">
                    {character.description}
                  </p>
                )}
              </div>

              {/* 展开内容 */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4"
                  >
                    {/* 装饰线 */}
                    <div
                      className="w-12 h-1 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
                      }}
                    />

                    {/* 引言 */}
                    <p className="text-base italic opacity-90 leading-relaxed">
                      &quot;{character.quote}&quot;
                    </p>

                    {/* 描述 */}
                    <p className="text-sm opacity-80">
                      {character.description}
                    </p>

                    {/* 关键词标签 */}
                    <div className="flex flex-wrap gap-2">
                      {character.keywords.map((keyword, keyIndex) => (
                        <span
                          key={keyIndex}
                          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-black/20 dark:bg-black/30"
                          style={{
                            color: getContrastTextColor(character.color.primary),
                            border: `1.5px solid ${character.color.primary}80`,
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    {/* 点击提示 */}
                    <div className="text-xs opacity-50 italic pt-2">
                      {t("ui.detailHint")}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 收起状态的提示 */}
              {!isExpanded && (
                <div className="text-xs opacity-50 italic mt-2">
                  {t("ui.expandHint")}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
