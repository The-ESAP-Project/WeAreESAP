// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CharacterCardData } from "@/types/character";
import { CharacterStrip } from "./CharacterStrip";

interface CharacterAccordionProps {
  characters: CharacterCardData[];
}

// 鼠标位置记录
interface MousePosition {
  x: number;
  time: number;
}

export function CharacterAccordion({ characters }: CharacterAccordionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [stableHoveredIndex, setStableHoveredIndex] = useState<number | null>(null);
  const [isQuickSwitching, setIsQuickSwitching] = useState(false);
  const [mouseVelocity, setMouseVelocity] = useState(0);
  const [mouseDirection, setMouseDirection] = useState<"left" | "right" | null>(null);

  // Refs
  const lastSwitchTimeRef = useRef<number>(0);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 延迟清空定时器
  const consecutiveSwitchCountRef = useRef<number>(0); // 连续切换计数
  const consecutiveResetTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 重置计数定时器
  const mousePositionHistory = useRef<MousePosition[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const skewAmount = 50;

  // 鼠标移动追踪 - 使用 throttle 优化性能
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const x = e.clientX;

    // 记录最近 5 个位置
    mousePositionHistory.current.push({ x, time: now });
    if (mousePositionHistory.current.length > 5) {
      mousePositionHistory.current.shift();
    }

    // 计算速度和方向（至少需要 2 个点）
    if (mousePositionHistory.current.length >= 2) {
      const oldest = mousePositionHistory.current[0];
      const newest =
        mousePositionHistory.current[mousePositionHistory.current.length - 1];

      const distance = Math.abs(newest.x - oldest.x);
      const time = newest.time - oldest.time;
      const velocity = time > 0 ? distance / time : 0;

      setMouseVelocity(velocity);

      // 判断方向（需要明显的移动才算）
      const deltaX = newest.x - oldest.x;
      if (Math.abs(deltaX) > 10) {
        setMouseDirection(deltaX > 0 ? "right" : "left");
      }
    }
  }, []);

  // 挂载鼠标移动监听器
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // throttle 优化：每 16ms 执行一次（约 60fps）
    let lastTime = 0;
    const throttledHandler = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime >= 16) {
        handleMouseMove(e);
        lastTime = now;
      }
    };

    container.addEventListener("mousemove", throttledHandler);

    return () => {
      container.removeEventListener("mousemove", throttledHandler);
      // 清理定时器
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
      if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
      if (consecutiveResetTimeoutRef.current) clearTimeout(consecutiveResetTimeoutRef.current);
    };
  }, [handleMouseMove]);

  // 智能延迟展开 - 根据鼠标速度和位置决定延迟
  const handleMouseEnter = (index: number) => {
    const now = Date.now();
    const timeSinceLastSwitch = now - lastSwitchTimeRef.current;

    // 清除重置定时器
    if (consecutiveResetTimeoutRef.current) {
      clearTimeout(consecutiveResetTimeoutRef.current);
    }

    // 连续切换检测：300ms 内切换且有 hoveredIndex，计数+1；否则重置为1
    if (timeSinceLastSwitch < 300 && hoveredIndex !== null) {
      consecutiveSwitchCountRef.current++;
    } else {
      consecutiveSwitchCountRef.current = 1;
    }

    // 2次或以上切换 = 快速切换
    const isCurrentlyQuickSwitching = consecutiveSwitchCountRef.current >= 2;
    setIsQuickSwitching(isCurrentlyQuickSwitching);

    // 取消之前的离开定时器（相邻切换时避免清空状态）
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    lastSwitchTimeRef.current = now;

    // 清除之前的展开定时器
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }

    // 清除稳定状态定时器
    if (stableTimeoutRef.current) {
      clearTimeout(stableTimeoutRef.current);
    }

    // 检测是否是相邻切换
    const isAdjacentSwitch =
      hoveredIndex !== null && Math.abs(index - hoveredIndex) === 1;

    // 决定延迟时间
    let delay = 0;

    if (isAdjacentSwitch) {
      // 相邻切换：立即设置 hoveredIndex，但延迟更新 stableHoveredIndex
      delay = 0;
    } else if (hoveredIndex === null) {
      // 从外部进入：根据速度决定延迟
      delay = mouseVelocity > 0.5 ? 300 : 50;
    } else {
      // 跳跃切换：使用短延迟
      delay = 100;
    }

    // 立即设置 hoveredIndex（用于其他逻辑）
    if (delay === 0) {
      setHoveredIndex(index);
    } else {
      expandTimeoutRef.current = setTimeout(() => {
        setHoveredIndex(index);
      }, delay);
    }

    // 稳定索引更新策略：基于连续切换计数决定延迟
    let stableDelay;

    if (consecutiveSwitchCountRef.current >= 2) {
      // 真正的连续切换（2次及以上）：统一延迟 180ms，避免中间元素展开
      stableDelay = 180;
    } else if (isAdjacentSwitch) {
      // 单独的相邻切换：延迟 140ms（响应快）
      stableDelay = 140;
    } else {
      // 其他情况：使用基础延迟
      stableDelay = delay;
    }

    stableTimeoutRef.current = setTimeout(() => {
      setStableHoveredIndex(index);
    }, stableDelay);

    // 300ms 后重置连续切换计数和快速切换状态
    consecutiveResetTimeoutRef.current = setTimeout(() => {
      consecutiveSwitchCountRef.current = 0;
      setIsQuickSwitching(false);
    }, 300);
  };

  // 鼠标离开事件
  const handleMouseLeave = () => {
    // 清除所有定时器（除了 leaveTimeout）
    if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
    if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);
    if (consecutiveResetTimeoutRef.current) clearTimeout(consecutiveResetTimeoutRef.current);

    // 延迟清空状态，避免相邻切换时的瞬间空白
    // 如果 50ms 内进入了新元素，这个定时器会被取消
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      setStableHoveredIndex(null);
      setIsQuickSwitching(false);
      consecutiveSwitchCountRef.current = 0;
    }, 50);
  };

  // 计算每个角色的宽度百分比
  // 容器宽度 = 100%，元素通过加宽补偿负 margin
  const getWidth = (index: number) => {
    const total = characters.length;

    // 使用稳定的 hoveredIndex 计算宽度
    // 这样快速切换时，宽度会保持在上一个稳定状态，通过动画平滑过渡
    if (stableHoveredIndex === null) {
      // 默认状态：平均分配，使用精确的除法
      const baseWidthPercent = 100 / total;

      if (index === 0) {
        // 第一个元素：不需要补偿
        return `${baseWidthPercent}%`;
      }
      // 其他元素：加宽 50px 补偿负 margin
      return `calc(${baseWidthPercent}% + ${skewAmount}px)`;
    }

    // 悬停状态
    if (index === stableHoveredIndex) {
      // 被悬停的角色：60%
      if (index === 0) {
        return "60%";
      }
      return `calc(60% + ${skewAmount}px)`;
    }

    // 其他角色：平分剩余的 40%
    const otherWidthPercent = 40 / (total - 1);

    if (index === 0) {
      return `${otherWidthPercent}%`;
    }
    return `calc(${otherWidthPercent}% + ${skewAmount}px)`;
  };

  // 重叠量：与斜切量相同，确保完美对齐
  const getMarginLeft = (index: number) => {
    if (index === 0) return 0;
    return -skewAmount;
  };

  // 计算斜切路径 - 使用固定像素值，所有斜线一致
  const getClipPath = (index: number) => {
    const total = characters.length;

    if (total === 1) {
      // 只有一个角色：左边垂直，右边斜切
      return `polygon(0 0, 100% 0, calc(100% - ${skewAmount}px) 100%, 0 100%)`;
    }

    if (index === 0) {
      // 第一个角色：左边垂直，右边斜切 (/)
      return `polygon(0 0, 100% 0, calc(100% - ${skewAmount}px) 100%, 0 100%)`;
    }

    if (index === total - 1) {
      // 最后一个角色：左边斜切 (/)，右边垂直
      return `polygon(${skewAmount}px 0, 100% 0, 100% 100%, 0 100%)`;
    }

    // 中间角色：左右都斜切 (/)，斜切量一致
    return `polygon(${skewAmount}px 0, 100% 0, calc(100% - ${skewAmount}px) 100%, 0 100%)`;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[600px] flex overflow-hidden bg-muted"
      style={{
        // 容器宽度固定为 100%，元素通过加宽补偿负 margin
        width: "100%",
      }}
    >
      {characters.map((character, index) => (
        <motion.div
          key={character.id}
          className="relative flex-shrink-0"
          initial={{
            width: getWidth(index),
            marginLeft: getMarginLeft(index),
            clipPath: getClipPath(index),
          }}
          animate={{
            width: getWidth(index),
            marginLeft: getMarginLeft(index),
            clipPath: getClipPath(index),
          }}
          transition={{
            duration: isQuickSwitching ? 0.3 : 0.5,
            ease: "easeInOut",
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <CharacterStrip
            character={character}
            isExpanded={stableHoveredIndex === index}
            onClick={() => {
              console.log(`点击了角色: ${character.code}`);
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
