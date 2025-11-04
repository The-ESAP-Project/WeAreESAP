// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CharacterCardData } from "@/types/character";
import { getBlurDataURL } from "@/lib/blur-placeholder";
import { getContrastTextColor, getContrastTextColorDark } from "@/lib/utils";

interface CharacterCardProps {
  character: CharacterCardData;
  onClick?: () => void;
  priority?: boolean; // 是否优先加载图片（首屏图片）
}

function CharacterCardComponent({
  character,
  onClick,
  priority = false,
}: CharacterCardProps) {
  // 预计算颜色值
  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.primary);

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={
        {
          "--char-color-light": lightModeColor,
          "--char-color-dark": darkModeColor,
        } as React.CSSProperties
      }
    >
      {/* 卡片主体 */}
      <div
        className="relative bg-muted rounded-xl min-h-[400px] overflow-hidden border-2 transition-all duration-300"
        style={{
          borderColor: "transparent",
          borderWidth: "2px",
          borderStyle: "solid",
          boxShadow: "0 0 0 0 transparent",
          transition:
            "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = character.color.primary;
          e.currentTarget.style.boxShadow = `0 0 20px ${character.color.primary}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "transparent";
          e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
        }}
      >
        {/* 背景图片 */}
        {character.backgroundImage && (
          <Image
            src={character.backgroundImage}
            alt={character.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
            priority={priority}
            placeholder="blur"
            blurDataURL={getBlurDataURL(character.backgroundImage)}
          />
        )}

        {/* 遮罩层 */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${character.color.primary}85, ${character.color.dark}90)`,
          }}
        />

        {/* 悬停时的发光效果 */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${character.color.primary}, transparent 70%)`,
          }}
        />

        {/* 内容 */}
        <div className="relative z-10 h-full p-6 flex flex-col justify-end text-white">
          {/* 顶部色块装饰 */}
          <div
            className="w-12 h-1 rounded-full mb-4 group-hover:w-16 transition-all duration-300 drop-shadow-lg"
            style={{
              background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
            }}
          />

          {/* 角色代号 */}
          <div
            className="text-lg font-mono font-bold mb-2 [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
            }}
          >
            {character.code}
          </div>

          {/* 角色名称 */}
          <h3
            className="text-3xl font-bold mb-2"
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.8)",
            }}
          >
            {character.name}
          </h3>

          {/* 角色定位 */}
          <div
            className="text-base opacity-90 mb-4"
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
            }}
          >
            {character.role}
          </div>

          {/* 引言 */}
          <p
            className="text-sm italic opacity-80 mb-4 line-clamp-2"
            style={{
              textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
            }}
          >
            &quot;{character.quote}&quot;
          </p>

          {/* 描述 */}
          <p
            className="text-sm opacity-75 mb-4 line-clamp-2"
            style={{
              textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
            }}
          >
            {character.description}
          </p>

          {/* 关键词标签 */}
          <div className="flex flex-wrap gap-2">
            {character.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full backdrop-blur-sm bg-black/30 dark:bg-black/50 transition-all [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
                style={{
                  border: `1.5px solid ${character.color.primary}80`,
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// 使用 memo 优化，只在 character.id 或 priority 改变时重新渲染
export const CharacterCard = memo(
  CharacterCardComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.character.id === nextProps.character.id &&
      prevProps.priority === nextProps.priority
    );
  }
);

CharacterCard.displayName = "CharacterCard";
