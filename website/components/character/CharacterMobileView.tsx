// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterCardData } from "@/types/character";
import Image from "next/image";

interface CharacterMobileViewProps {
  characters: CharacterCardData[];
}

export function CharacterMobileView({ characters }: CharacterMobileViewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-4 px-4">
      {characters.map((character, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <motion.div
            key={character.id}
            className="relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => toggleExpand(index)}
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
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            )}

            {/* 顶部斜切装饰 */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
                clipPath: "polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0 100%)",
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
            <div className="relative h-full p-6 text-white">
              <div
                className="backdrop-blur-md bg-black/50 dark:bg-black/70 p-4 rounded-lg"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                }}
              >
                {/* 基础信息（始终显示） */}
                <div className="space-y-2">
                  {/* 角色代号 */}
                  <div
                    className="text-lg font-mono font-bold"
                    style={{ color: character.color.primary }}
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
                            className="px-3 py-1 rounded-full text-xs font-medium bg-black/40 dark:bg-black/60"
                            style={{
                              color: character.color.primary,
                              border: `1.5px solid ${character.color.primary}80`,
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>

                      {/* 点击提示 */}
                      <div className="text-xs opacity-50 italic pt-2">
                        点击收起
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 收起状态的提示 */}
                {!isExpanded && (
                  <div className="text-xs opacity-50 italic mt-2">
                    点击查看更多 ↓
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
