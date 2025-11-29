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

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Icon } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export interface CharacterNodeData {
  characterId: string;
  characterName?: string;
  color: string; // 角色主题色
  isCenter: boolean; // 是否为中心节点
}

const CharacterNode = memo(({ data }: NodeProps<CharacterNodeData>) => {
  const router = useRouter();
  const locale = useLocale();
  const { characterId, characterName, color, isCenter } = data;

  const handleClick = useCallback(() => {
    if (!isCenter) {
      router.push(`/${locale}/characters/${characterId}`);
    }
  }, [isCenter, router, locale, characterId]);

  // 使用固定的像素尺寸而不是 Tailwind 类名
  const nodeSize = isCenter ? 96 : 80; // w-24=96px, w-20=80px
  const iconSize = isCenter ? 32 : 24;
  const fontSize = isCenter ? 18 : 16; // text-lg, text-base
  const fontWeight = isCenter ? 700 : 400; // font-bold

  return (
    <div
      style={{
        width: nodeSize,
        height: nodeSize,
        position: "relative",
      }}
      className={`
        rounded-full
        transition-all duration-300
        ${!isCenter ? "cursor-pointer hover:scale-110" : ""}
        group
      `}
      onClick={handleClick}
      role={!isCenter ? "button" : undefined}
      tabIndex={!isCenter ? 0 : -1}
      onKeyDown={(e) => {
        if (!isCenter && (e.key === "Enter" || e.key === " ")) {
          handleClick();
        }
      }}
    >
      {/* 连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-0"
      />

      {/* 外层光晕 - 使用负 inset 让它超出边界，z-index 确保在背后 */}
      <div
        className="absolute rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-300 blur-md pointer-events-none"
        style={{
          inset: "-12px",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          zIndex: -1,
        }}
      />

      {/* 主节点 - 使用 w-full h-full 自然填充父容器 */}
      <div
        className="w-full h-full rounded-full flex flex-col items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg"
        style={{
          backgroundImage: `linear-gradient(135deg, ${color}dd 0%, ${color}aa 100%)`,
        }}
      >
        {/* 图标 */}
        <Icon
          name="Users"
          size={iconSize}
          className="text-white dark:text-gray-100 mb-1"
        />

        {/* 角色编号 */}
        <span
          className="text-white dark:text-gray-100 font-mono"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: fontWeight,
          }}
        >
          {characterId}
        </span>
      </div>

      {/* 悬停提示 */}
      {characterName && !isCenter && (
        <div
          className="
            absolute -bottom-8 left-1/2 -translate-x-1/2
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
            whitespace-nowrap
            bg-background/90 backdrop-blur-sm
            border border-border rounded-lg
            px-3 py-1.5
            text-sm font-medium
            shadow-lg
            z-50
          "
        >
          {characterName}
        </div>
      )}
    </div>
  );
});

CharacterNode.displayName = "CharacterNode";

export default CharacterNode;
