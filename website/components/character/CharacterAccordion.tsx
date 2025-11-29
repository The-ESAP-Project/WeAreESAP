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

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { CharacterCardData } from "@/types/character";
import { CharacterStrip } from "./CharacterStrip";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CharacterAccordionProps {
  characters: CharacterCardData[];
  onCharacterClick?: (characterId: string) => void;
}

// 鼠标位置记录
interface MousePosition {
  x: number;
  time: number;
}

// 斜切量常量（固定值，移到组件外部避免重复创建）
const SKEW_AMOUNT = 50;

export function CharacterAccordion({
  characters = [], // 设置默认值为空数组
  onCharacterClick,
}: CharacterAccordionProps) {
  const shouldReduceMotion = useReducedMotion();
  const tempHoveredIndexRef = useRef<number | null>(null); // 改用 ref，避免重渲染
  const [stableHoveredIndex, setStableHoveredIndex] = useState<number | null>(
    null
  );
  const [isQuickSwitching, setIsQuickSwitching] = useState(false);

  // Refs - 使用 ref 存储鼠标追踪数据，避免频繁重渲染
  const mouseVelocityRef = useRef(0);
  const lastSwitchTimeRef = useRef<number>(0);
  const consecutiveSwitchCountRef = useRef<number>(0); // 连续切换计数
  const mousePositionHistory = useRef<MousePosition[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 统一管理所有定时器
  const timeoutsRef = useRef<{
    expand: NodeJS.Timeout | null;
    stable: NodeJS.Timeout | null;
    leave: NodeJS.Timeout | null;
    resetCount: NodeJS.Timeout | null;
  }>({
    expand: null,
    stable: null,
    leave: null,
    resetCount: null,
  });

  // 统一清理定时器函数
  const clearTimeouts = useCallback(
    (...keys: Array<keyof typeof timeoutsRef.current>) => {
      keys.forEach((key) => {
        if (timeoutsRef.current[key]) {
          clearTimeout(timeoutsRef.current[key]!);
          timeoutsRef.current[key] = null;
        }
      });
    },
    []
  );

  // 清理所有定时器
  const clearAllTimeouts = useCallback(() => {
    clearTimeouts("expand", "stable", "leave", "resetCount");
  }, [clearTimeouts]);

  // 更新快速切换状态（单一职责函数）
  const updateQuickSwitchState = useCallback(() => {
    const now = Date.now();
    const timeSinceLastSwitch = now - lastSwitchTimeRef.current;
    const isWithinThreshold = timeSinceLastSwitch < 300;

    if (isWithinThreshold && tempHoveredIndexRef.current !== null) {
      consecutiveSwitchCountRef.current++;
    } else {
      consecutiveSwitchCountRef.current = 1;
    }

    lastSwitchTimeRef.current = now;
    return consecutiveSwitchCountRef.current >= 2;
  }, []);

  // 计算延迟时间（单一职责函数）
  const calculateDelays = useCallback(
    (index: number, isQuickSwitch: boolean) => {
      const isAdjacentSwitch =
        tempHoveredIndexRef.current !== null &&
        Math.abs(index - tempHoveredIndexRef.current) === 1;

      // 计算展开延迟
      let expandDelay: number;
      if (isAdjacentSwitch) {
        expandDelay = 0;
      } else if (tempHoveredIndexRef.current === null) {
        expandDelay = mouseVelocityRef.current > 0.5 ? 300 : 50;
      } else {
        expandDelay = 100;
      }

      // 计算稳定延迟
      let stableDelay: number;
      if (isQuickSwitch) {
        stableDelay = 180;
      } else if (isAdjacentSwitch) {
        stableDelay = 140;
      } else {
        stableDelay = expandDelay;
      }

      return { expandDelay, stableDelay };
    },
    []
  );

  // 鼠标移动追踪 - 使用 throttle 优化性能
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const x = e.clientX;

    // 记录最近 5 个位置
    mousePositionHistory.current.push({ x, time: now });
    if (mousePositionHistory.current.length > 5) {
      mousePositionHistory.current.shift();
    }

    // 计算速度（至少需要 2 个点）
    if (mousePositionHistory.current.length >= 2) {
      const oldest = mousePositionHistory.current[0];
      const newest =
        mousePositionHistory.current[mousePositionHistory.current.length - 1];

      const distance = Math.abs(newest.x - oldest.x);
      const time = newest.time - oldest.time;
      const velocity = time > 0 ? distance / time : 0;

      // 直接更新 ref，不触发重渲染（性能优化）
      mouseVelocityRef.current = velocity;
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
      // 清理所有定时器
      clearAllTimeouts();
    };
  }, [handleMouseMove, clearAllTimeouts]);

  // 智能延迟展开 - 根据鼠标速度和位置决定延迟
  const handleMouseEnter = useCallback(
    (index: number) => {
      // 清除相关定时器
      clearTimeouts("resetCount", "leave", "expand", "stable");

      // 更新快速切换状态
      const isQuickSwitch = updateQuickSwitchState();
      setIsQuickSwitching(isQuickSwitch);

      // 计算延迟时间
      const { expandDelay, stableDelay } = calculateDelays(
        index,
        isQuickSwitch
      );

      // 设置 tempHoveredIndex
      if (expandDelay === 0) {
        tempHoveredIndexRef.current = index;
      } else {
        timeoutsRef.current.expand = setTimeout(() => {
          tempHoveredIndexRef.current = index;
        }, expandDelay);
      }

      // 延迟更新稳定索引
      timeoutsRef.current.stable = setTimeout(() => {
        setStableHoveredIndex(index);
      }, stableDelay);

      // 延迟重置快速切换状态
      timeoutsRef.current.resetCount = setTimeout(() => {
        consecutiveSwitchCountRef.current = 0;
        setIsQuickSwitching(false);
      }, 300);
    },
    [clearTimeouts, updateQuickSwitchState, calculateDelays]
  );

  // 鼠标离开事件
  const handleMouseLeave = useCallback(() => {
    // 清除所有定时器（除了 leave）
    clearTimeouts("expand", "stable", "resetCount");

    // 延迟清空状态，避免相邻切换时的瞬间空白
    // 如果 50ms 内进入了新元素，这个定时器会被取消
    timeoutsRef.current.leave = setTimeout(() => {
      tempHoveredIndexRef.current = null;
      setStableHoveredIndex(null);
      setIsQuickSwitching(false);
      consecutiveSwitchCountRef.current = 0;
    }, 50);
  }, [clearTimeouts]);

  // 优化角色点击回调，使用 useCallback 避免子组件重渲染
  const handleCharacterClick = useCallback(
    (characterId: string) => {
      onCharacterClick?.(characterId);
    },
    [onCharacterClick]
  );

  // 缓存样式计算结果，避免每次渲染都重新计算
  const widths = useMemo(() => {
    return characters.map((_, index) => {
      const total = characters.length;

      if (stableHoveredIndex === null) {
        const baseWidthPercent = 100 / total;
        if (index === 0) {
          return `${baseWidthPercent}%`;
        }
        return `calc(${baseWidthPercent}% + ${SKEW_AMOUNT}px)`;
      }

      if (index === stableHoveredIndex) {
        if (index === 0) {
          return "60%";
        }
        return `calc(60% + ${SKEW_AMOUNT}px)`;
      }

      const otherWidthPercent = 40 / (total - 1);
      if (index === 0) {
        return `${otherWidthPercent}%`;
      }
      return `calc(${otherWidthPercent}% + ${SKEW_AMOUNT}px)`;
    });
  }, [characters, stableHoveredIndex]);

  const marginLefts = useMemo(() => {
    return characters.map((_, index) => {
      if (index === 0) return 0;
      return -SKEW_AMOUNT;
    });
  }, [characters]);

  const clipPaths = useMemo(() => {
    return characters.map((_, index) => {
      const total = characters.length;

      if (total === 1) {
        return `polygon(0 0, 100% 0, calc(100% - ${SKEW_AMOUNT}px) 100%, 0 100%)`;
      }

      if (index === 0) {
        return `polygon(0 0, 100% 0, calc(100% - ${SKEW_AMOUNT}px) 100%, 0 100%)`;
      }

      if (index === total - 1) {
        return `polygon(${SKEW_AMOUNT}px 0, 100% 0, 100% 100%, 0 100%)`;
      }

      return `polygon(${SKEW_AMOUNT}px 0, 100% 0, calc(100% - ${SKEW_AMOUNT}px) 100%, 0 100%)`;
    });
  }, [characters]);

  // 如果没有角色数据，不渲染
  if (characters.length === 0) {
    return null;
  }

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
          className="relative shrink-0"
          data-testid="character-card"
          initial={{
            width: widths[index],
            marginLeft: marginLefts[index],
            clipPath: clipPaths[index],
          }}
          animate={{
            width: widths[index],
            marginLeft: marginLefts[index],
            clipPath: clipPaths[index],
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: isQuickSwitching ? 0.3 : 0.5,
                  ease: "easeInOut",
                }
          }
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <CharacterStrip
            character={character}
            isExpanded={stableHoveredIndex === index}
            onClick={() => handleCharacterClick(character.id)}
            index={index}
          />
        </motion.div>
      ))}
    </div>
  );
}
