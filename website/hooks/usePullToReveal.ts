// Copyright 2025 AptS:1547, AptS:1548
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

import { useState, useEffect, useCallback, useRef } from "react";
import {
  PullToRevealConfig,
  DEFAULT_PULL_CONFIG,
} from "@/types/hidden-profile";

interface UsePullToRevealReturn {
  /** 当前拉动距离（经过阻尼计算的视觉距离） */
  pullDistance: number;
  /** 原始拉动距离（未经阻尼处理） */
  rawPullDistance: number;
  /** 是否正在拉动 */
  isPulling: boolean;
  /** 是否已触发 */
  isTriggered: boolean;
  /** 触发进度（0-1） */
  progress: number;
  /** 起始 Y 坐标 */
  startY: number;
  /** 当前 Y 坐标 */
  currentY: number;
  /** 是否为桌面端 */
  isDesktop: boolean;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 底部上拉触发 Hook
 * 监听用户在页面底部的向上拉动手势，计算阻尼效果并触发回调
 */
export function usePullToReveal(
  enabled: boolean,
  onTrigger: () => void,
  config: Partial<PullToRevealConfig> = {}
): UsePullToRevealReturn {
  const finalConfig = { ...DEFAULT_PULL_CONFIG, ...config };
  const { threshold, damping, maxPullDistance } = finalConfig;

  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [rawPullDistance, setRawPullDistance] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const wheelDeltaRef = useRef(0);
  const lastWheelTime = useRef<number>(0);

  // 计算进度（0-1）
  const progress = Math.min(pullDistance / threshold, 1);

  // 检测设备类型（桌面端 vs 移动端）
  useEffect(() => {
    const checkDevice = () => {
      // 使用 pointer 媒体查询检测设备类型
      // pointer: fine = 精确指针（鼠标、触控板）→ 桌面端
      // pointer: coarse = 粗糙指针（触摸）→ 移动端
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      setIsDesktop(hasFinePointer);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 应用阻尼效果
  const applyDamping = useCallback(
    (distance: number): number => {
      if (distance <= 0) return 0;

      // 修正的阻尼公式：让拉动距离随着距离增加而逐渐变慢
      // damping = 0.5 表示最终只保留 50% 的移动距离（当达到 maxPullDistance 时）
      // 公式：distance * (1 - (distance / maxPullDistance) * (1 - damping))
      const ratio = Math.min(distance / maxPullDistance, 1);
      const dampingFactor = 1 - ratio * (1 - damping);
      const dampedDistance = distance * dampingFactor;

      // 限制最大拉动距离
      return Math.min(dampedDistance, maxPullDistance);
    },
    [damping, maxPullDistance]
  );

  // 触摸开始
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      // 只在页面底部时生效
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 检查是否接近底部（距离底部小于 50px）
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 50;
      if (!isAtBottom) return;

      const touchY = e.touches[0].clientY;
      startYRef.current = touchY;
      currentYRef.current = touchY;
      setStartY(touchY);
      setCurrentY(touchY);
      setIsPulling(true);
    },
    [enabled]
  );

  // 触摸移动
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !isPulling) return;

      // 检查是否仍在页面底部
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 50;

      if (!isAtBottom) {
        setIsPulling(false);
        setPullDistance(0);
        return;
      }

      const touchY = e.touches[0].clientY;
      currentYRef.current = touchY;
      setCurrentY(touchY);
      const rawDistance = startYRef.current - touchY; // 向上拉为正

      // 只处理向上拉（正方向移动）
      // 在页面底部时，用户向上拉动以触发隐藏内容
      if (rawDistance > 0) {
        const dampedDistance = applyDamping(rawDistance);
        setRawPullDistance(rawDistance); // 保存原始距离
        setPullDistance(dampedDistance);

        // 如果拉动距离足够，阻止页面滚动
        if (dampedDistance > 20) {
          e.preventDefault();
        }
      } else {
        setRawPullDistance(0);
        setPullDistance(0);
      }
    },
    [enabled, isPulling, applyDamping]
  );

  // 触摸结束
  const handleTouchEnd = useCallback(() => {
    if (!enabled || !isPulling) return;

    // 判断是否触发
    const shouldTrigger = pullDistance >= threshold;

    // 立即重置所有状态（在触发回调之前）
    setIsPulling(false);
    setRawPullDistance(0);
    setPullDistance(0);

    // 如果达到阈值，执行触发
    if (shouldTrigger) {
      setIsTriggered(true);

      // 添加震动反馈（如果支持）
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // 触发回调
      onTrigger();
    }
  }, [enabled, isPulling, pullDistance, threshold, onTrigger]);

  // 自动重置：停止滚动1秒后重置状态
  useEffect(() => {
    if (!enabled || !isDesktop || !isPulling) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTime.current;

      // 如果超过1秒未滚动，重置状态
      if (timeSinceLastWheel >= 1000) {
        wheelDeltaRef.current = 0;
        setPullDistance(0);
        setRawPullDistance(0);
        setIsPulling(false);
      }
    }, 100); // 每100ms检查一次

    return () => clearInterval(checkInterval);
  }, [enabled, isDesktop, isPulling]);

  // 滚轮事件（桌面端）
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!enabled || !isDesktop) return;

      // 检查是否在页面底部
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 50;

      // 如果不在底部，重置累计
      if (!isAtBottom) {
        wheelDeltaRef.current = 0;
        setPullDistance(0);
        setRawPullDistance(0);
        setIsPulling(false);
        return;
      }

      // 只处理向下滚动（deltaY > 0，表示向下滚动）
      if (e.deltaY > 0) {
        // 更新最后滚动时间
        lastWheelTime.current = Date.now();

        // 累计滚轮距离
        wheelDeltaRef.current += e.deltaY;

        // 应用阻尼效果
        const dampedDistance = applyDamping(wheelDeltaRef.current);
        setRawPullDistance(wheelDeltaRef.current);
        setPullDistance(dampedDistance);

        // 只有累计距离 > 80px 时才显示进度指示器（避免第一次撞击就显示）
        if (dampedDistance > 80) {
          setIsPulling(true);
        }

        // 达到阈值时触发
        if (dampedDistance >= threshold) {
          setIsTriggered(true);

          // 震动反馈（如果支持）
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }

          // 触发回调
          onTrigger();

          // 重置状态
          wheelDeltaRef.current = 0;
          setPullDistance(0);
          setRawPullDistance(0);
          setIsPulling(false);
        } else {
          // 未达到阈值，阻止默认滚动行为（防止 overscroll bounce）
          e.preventDefault();
        }
      } else {
        // 向上滚动时重置
        wheelDeltaRef.current = 0;
        setPullDistance(0);
        setRawPullDistance(0);
        setIsPulling(false);
      }
    },
    [enabled, isDesktop, applyDamping, threshold, onTrigger]
  );

  // 重置状态
  const reset = useCallback(() => {
    setIsTriggered(false);
    setRawPullDistance(0);
    setPullDistance(0);
    setIsPulling(false);
    setStartY(0);
    setCurrentY(0);
    // 清理所有 ref 变量
    wheelDeltaRef.current = 0;
    lastWheelTime.current = 0;
    startYRef.current = 0;
    currentYRef.current = 0;
  }, []);

  // 当功能被禁用时，强制重置所有状态
  useEffect(() => {
    if (!enabled) {
      setIsPulling(false);
      setRawPullDistance(0);
      setPullDistance(0);
    }
  }, [enabled]);

  // 绑定事件监听器
  useEffect(() => {
    if (!enabled) return;

    // 移动端：触摸事件
    if (!isDesktop) {
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    // 桌面端：滚轮事件（不再使用鼠标拖拽）
    if (isDesktop) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      // 清理移动端事件
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      // 清理桌面端事件
      window.removeEventListener("wheel", handleWheel);
    };
  }, [
    enabled,
    isDesktop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  ]);

  return {
    pullDistance,
    rawPullDistance,
    isPulling,
    isTriggered,
    progress,
    startY,
    currentY,
    isDesktop,
    reset,
  };
}
