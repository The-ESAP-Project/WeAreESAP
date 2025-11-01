// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { CharacterCardData } from "@/types/character";
import Image from "next/image";

interface CharacterStripProps {
  character: CharacterCardData;
  isExpanded: boolean;
  onClick?: () => void;
}

export function CharacterStrip({
  character,
  isExpanded,
  onClick,
}: CharacterStripProps) {
  return (
    <motion.div
      className="relative h-[600px] overflow-hidden cursor-pointer group"
      onClick={onClick}
      layout
    >
      {/* 背景图片 */}
      {character.backgroundImage && (
        <Image
          src={character.backgroundImage}
          alt={character.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      )}

      {/* 遮罩层 */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: isExpanded
            ? `linear-gradient(135deg, ${character.color.primary}40, ${character.color.dark}50)`
            : `linear-gradient(to bottom, ${character.color.primary}80, ${character.color.dark}80)`,
        }}
      />

      {/* 内容区域 */}
      <div className="relative h-full flex items-center justify-center p-6 text-white">
        {isExpanded ? (
          // 扩展模式：显示完整信息
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.45 }}
            className="w-full max-w-md space-y-6 backdrop-blur-md bg-black/40 dark:bg-black/60 p-8 rounded-2xl"
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
              className="text-2xl font-mono font-bold"
              style={{ color: character.color.primary }}
            >
              {character.code}
            </div>

            {/* 角色名字 */}
            <h3 className="text-4xl font-bold">{character.name}</h3>

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
                  className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm bg-black/30 dark:bg-black/50"
                  style={{
                    color: character.color.primary,
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
              点击查看完整档案 →
            </div>
          </motion.div>
        ) : (
          // 竖条模式：竖排显示代号
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center"
          >
            {/* 竖排文字 */}
            <div
              className="text-3xl font-mono font-bold tracking-wider"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "upright",
                letterSpacing: "0.5em",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              {character.code}
            </div>
          </motion.div>
        )}
      </div>

      {/* 悬停时的边框发光 */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 60px ${character.color.primary}40`,
          }}
        />
      )}
    </motion.div>
  );
}
