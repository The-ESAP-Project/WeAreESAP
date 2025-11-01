// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { CharacterCardData } from "@/types/character";

interface CharacterCardProps {
  character: CharacterCardData;
  onClick?: () => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {/* 卡片主体 */}
      <div
        className="relative bg-muted rounded-xl p-6 h-full overflow-hidden border-2 transition-all duration-300"
        style={{
          borderColor: "transparent",
          borderWidth: "2px",
          borderStyle: "solid",
          boxShadow: "0 0 0 0 transparent",
          transition: "border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
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
        {/* 悬停时的背景发光效果（移到 inset 内部避免溢出） */}
        <div
          className="absolute inset-[2px] rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${character.color.primary}10, ${character.color.dark}10)`,
          }}
        />

        {/* 内容 */}
        <div className="relative z-10">
          {/* 顶部色块装饰 */}
          <div
            className="w-12 h-1 rounded-full mb-4 group-hover:w-16 transition-all duration-300"
            style={{
              background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
            }}
          />

          {/* 角色代号 */}
          <div
            className="text-sm font-mono font-semibold mb-2"
            style={{ color: character.color.primary }}
          >
            {character.code}
          </div>

          {/* 角色名称 */}
          <h3 className="text-2xl font-bold mb-2 text-foreground">
            {character.name}
          </h3>

          {/* 角色定位 */}
          <div className="text-sm text-muted-foreground mb-4">
            {character.role}
          </div>

          {/* 引言 */}
          <p className="text-sm text-foreground/80 italic mb-4 line-clamp-2">
            "{character.quote}"
          </p>

          {/* 描述 */}
          <p className="text-sm text-muted-foreground mb-4">
            {character.description}
          </p>

          {/* 关键词标签 */}
          <div className="flex flex-wrap gap-2">
            {character.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-background/50 transition-colors group-hover:bg-background"
                style={{
                  color: character.color.primary,
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 底部渐变装饰 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${character.color.primary}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}
