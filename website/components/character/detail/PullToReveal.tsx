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

import { useState, useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { usePullToReveal } from "@/hooks/usePullToReveal";
import { HiddenContent } from "./HiddenContent";
import { HiddenProfile } from "@/types/hidden-profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DEBUG_MODE } from "@/lib/debug";
import { Icon } from "@/components/ui";

interface PullToRevealProps {
  /** 子组件 */
  children: ReactNode;
  /** 隐藏属性数据 */
  hiddenProfile?: HiddenProfile;
  /** 角色主色 */
  characterColor: string;
  /** 角色名称 */
  characterName: string;
}

// 调试面板组件（移到外部避免在 render 期间创建）
function DebugPanel({
  mounted,
  theme,
  systemTheme,
  isDarkMode,
  isDesktop,
  enabled,
  hiddenProfile,
  isModalOpen,
  debugInfo,
  isPulling,
  startY,
  currentY,
  rawPullDistance,
  pullDistance,
  progress,
  isTriggered,
}: {
  mounted: boolean;
  theme: string | undefined;
  systemTheme: string | undefined;
  isDarkMode: boolean;
  isDesktop: boolean;
  enabled: boolean;
  hiddenProfile: HiddenProfile | undefined;
  isModalOpen: boolean;
  debugInfo: {
    scrollTop: number;
    windowHeight: number;
    documentHeight: number;
    isAtBottom: boolean;
  };
  isPulling: boolean;
  startY: number;
  currentY: number;
  rawPullDistance: number;
  pullDistance: number;
  progress: number;
  isTriggered: boolean;
}) {
  // 只在调试模式下显示
  if (!DEBUG_MODE || !mounted) return null;

  const panel = (
    <div
      className="fixed top-20 right-4 z-[10000] bg-black/90 text-white p-4 rounded-lg text-xs font-mono space-y-2 max-w-xs border-2 border-yellow-400"
      style={{ position: "fixed" }} // 强制固定定位
    >
      <div className="font-bold text-yellow-400 mb-2">🔍 调试信息</div>

      {/* 主题检测 */}
      <div
        className={`p-2 rounded ${isDarkMode ? "bg-green-900" : "bg-red-900"}`}
      >
        <div>主题: {theme || "loading"}</div>
        <div>系统主题: {systemTheme || "loading"}</div>
        <div>深色模式: {isDarkMode ? "✅ 是" : "❌ 否"}</div>
      </div>

      {/* 设备检测 */}
      <div
        className={`p-2 rounded ${isDesktop ? "bg-blue-900" : "bg-purple-900"}`}
      >
        <div className="font-bold mb-1">📱 设备检测</div>
        <div>设备类型: {isDesktop ? "✅ 桌面端" : "✅ 移动端"}</div>
        <div className="text-xs opacity-70 mt-1">
          检测: pointer: {isDesktop ? "fine" : "coarse"}
        </div>
        <div className="text-xs opacity-70">
          触发: {isDesktop ? "滚轮累计" : "触摸拖拽"}
        </div>
      </div>

      {/* 功能启用状态 */}
      <div className={`p-2 rounded ${enabled ? "bg-green-900" : "bg-red-900"}`}>
        <div>功能启用: {enabled ? "✅ 是" : "❌ 否"}</div>
        <div>有隐藏属性: {hiddenProfile ? "✅ 是" : "❌ 否"}</div>
        <div>深色模式: {isDarkMode ? "✅ 是" : "❌ 否"}</div>
        <div>模态框关闭: {!isModalOpen ? "✅ 是" : "❌ 否"}</div>
        {!enabled && (
          <div className="text-yellow-300 text-xs mt-1">
            {!hiddenProfile && "缺少隐藏属性"}
            {!isDarkMode && "需要深色模式"}
            {isModalOpen && "模态框已打开"}
          </div>
        )}
      </div>

      {/* 滚动位置 */}
      <div
        className={`p-2 rounded ${debugInfo.isAtBottom ? "bg-green-900" : "bg-gray-700"}`}
      >
        <div>滚动: {Math.round(debugInfo.scrollTop)}px</div>
        <div>窗口高: {debugInfo.windowHeight}px</div>
        <div>文档高: {debugInfo.documentHeight}px</div>
        <div>
          距底部:{" "}
          {Math.round(
            debugInfo.documentHeight -
              debugInfo.scrollTop -
              debugInfo.windowHeight
          )}
          px
        </div>
        <div>在底部: {debugInfo.isAtBottom ? "✅ 是" : "❌ 否"}</div>
      </div>

      {/* 拉动状态 */}
      <div
        className={`p-2 rounded ${isPulling ? "bg-blue-900" : "bg-gray-700"}`}
      >
        <div>正在拉动: {isPulling ? "✅ 是" : "❌ 否"}</div>
        <div className="text-cyan-300">起始Y: {Math.round(startY)}px</div>
        <div className="text-cyan-300">当前Y: {Math.round(currentY)}px</div>
        <div className="text-yellow-300 font-bold">
          原始距离: {Math.round(rawPullDistance)}px (={Math.round(startY)}-
          {Math.round(currentY)})
        </div>
        <div className="text-green-300 font-bold">
          阻尼后: {Math.round(pullDistance)}px
        </div>
        <div
          className={`font-bold ${progress >= 1 ? "text-green-400" : "text-white"}`}
        >
          进度: {Math.round(progress * 100)}%{" "}
          {progress >= 1 ? "✅ 可触发!" : ""}
        </div>
        <div>阈值: 60px</div>
        <div className="text-xs opacity-60 mt-1">
          阻尼系数: 0.5 (渐进式衰减)
        </div>
      </div>

      {/* 模态框状态 */}
      <div
        className={`p-2 rounded ${isModalOpen ? "bg-purple-900" : "bg-gray-700"}`}
      >
        <div>模态框: {isModalOpen ? "✅ 打开" : "❌ 关闭"}</div>
        <div>已触发: {isTriggered ? "✅ 是" : "❌ 否"}</div>
      </div>
    </div>
  );

  // 使用 Portal 渲染到 body
  return typeof window !== "undefined"
    ? createPortal(panel, document.body)
    : null;
}

/**
 * 底部上拉触发包装组件
 * 在深色模式下，从页面底部向上拉时显示隐藏属性
 */
export function PullToReveal({
  children,
  hiddenProfile,
  characterColor,
  characterName,
}: PullToRevealProps) {
  const { theme, systemTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("characters.detail.hiddenProfile");

  // 等待组件挂载后再检测主题（避免 hydration 错误）
  useEffect(() => {
    setMounted(true);
  }, []);

  // 判断当前是否为深色模式
  const isDarkMode =
    mounted &&
    (theme === "dark" || (theme === "system" && systemTheme === "dark"));

  // 是否启用上拉功能（模态框打开时禁用）
  const enabled = Boolean(hiddenProfile && isDarkMode && !isModalOpen);

  // 上拉触发逻辑
  const {
    pullDistance,
    rawPullDistance,
    isPulling,
    progress,
    reset,
    isTriggered,
    startY,
    currentY,
    isDesktop,
  } = usePullToReveal(enabled, () => {
    setIsModalOpen(true);
  });

  // 动画进度值（用于退出时的归零动画）
  const motionProgress = useMotionValue(0);
  const [motionProgressValue, setMotionProgressValue] = useState(0);

  // 监听 motionProgress 变化并更新 state
  useMotionValueEvent(motionProgress, "change", (latest) => {
    setMotionProgressValue(latest);
  });

  const springProgress = useSpring(motionProgress, {
    stiffness: 400,
    damping: 40,
  });

  // 计算圆环的 strokeDashoffset
  const circleCircumference = 2 * Math.PI * 24;
  const strokeDashoffset = useTransform(
    springProgress,
    [0, 1],
    [circleCircumference, 0]
  );

  // 计算底部拖拽条的 scaleX
  const barScaleX = useTransform(springProgress, (v) => Math.min(v, 1));

  // 计算提示文字的 opacity
  const textOpacity = useTransform(springProgress, (v) => v * 0.8);

  // 关闭模态框时重置状态
  const handleClose = useCallback(() => {
    // 强制触发重新布局，解决 display: none 导致的图片渲染问题
    // 延迟执行确保 display: block 已生效
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 25);

    setIsModalOpen(false);
    reset();
  }, [reset]);

  // ESC 键关闭隐藏内容
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen, handleClose]);

  // 控制背景滚动
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // 内容切换时滚动到页面顶部
  useEffect(() => {
    // 延迟 100ms，让内容动画先开始，避免与滚动动画竞争资源
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isModalOpen, shouldReduceMotion]);

  // 同步实时进度到动画值
  useEffect(() => {
    if (isPulling) {
      motionProgress.set(progress);
    }
  }, [isPulling, progress, motionProgress]);

  // 退出时归零动画
  useEffect(() => {
    if (!isPulling && motionProgress.get() > 0) {
      motionProgress.jump(0); // 立即归零，不使用 spring 过渡
    }
  }, [isPulling, motionProgress]);

  // 调试信息（计算滚动位置）
  const [debugInfo, setDebugInfo] = useState({
    scrollTop: 0,
    windowHeight: 0,
    documentHeight: 0,
    isAtBottom: false,
  });

  useEffect(() => {
    // 只在调试模式下监听滚动和窗口大小变化
    if (!DEBUG_MODE) return;

    const updateDebugInfo = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 50;

      setDebugInfo({
        scrollTop,
        windowHeight,
        documentHeight,
        isAtBottom,
      });
    };

    updateDebugInfo();
    window.addEventListener("scroll", updateDebugInfo);
    window.addEventListener("resize", updateDebugInfo);

    return () => {
      window.removeEventListener("scroll", updateDebugInfo);
      window.removeEventListener("resize", updateDebugInfo);
    };
  }, []);

  // 如果没有隐藏属性，直接返回子组件
  if (!hiddenProfile) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 🔍 调试面板 - 通过 Portal 固定在视口 */}
      <DebugPanel
        mounted={mounted}
        theme={theme}
        systemTheme={systemTheme}
        isDarkMode={isDarkMode}
        isDesktop={isDesktop}
        enabled={enabled}
        hiddenProfile={hiddenProfile}
        isModalOpen={isModalOpen}
        debugInfo={debugInfo}
        isPulling={isPulling}
        startY={startY}
        currentY={currentY}
        rawPullDistance={rawPullDistance}
        pullDistance={pullDistance}
        progress={progress}
        isTriggered={isTriggered}
      />

      {/* 拉动进度指示器 */}
      <AnimatePresence>
        {enabled && (isPulling || motionProgressValue > 0.001) && (
          <motion.div
            key="pull-indicator"
            className={`fixed bottom-0 left-0 right-0 z-[9997] pointer-events-none pb-4 ${DEBUG_MODE ? "bg-orange-500/50 border-t-4 border-orange-700" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* 🔥 调试标签（仅调试模式） */}
            {DEBUG_MODE && (
              <div className="text-center text-xs font-bold text-white bg-orange-700 py-1">
                🔥 进度指示器已显示 - 正在拉动中
              </div>
            )}
            {/* 进度环 */}
            <div className="flex justify-center mb-4">
              <svg width="60" height="60" className="transform -rotate-90">
                {/* 背景圆 */}
                <circle
                  cx="30"
                  cy="30"
                  r="24"
                  fill="none"
                  stroke={`${characterColor}20`}
                  strokeWidth="3"
                />
                {/* 进度圆 */}
                <motion.circle
                  cx="30"
                  cy="30"
                  r="24"
                  fill="none"
                  stroke={characterColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  style={{
                    strokeDashoffset,
                    filter:
                      progress >= 1
                        ? "drop-shadow(0 0 8px currentColor)"
                        : "none",
                  }}
                />
              </svg>
            </div>

            {/* 提示文字 */}
            <motion.div
              className="text-center mb-4 text-sm font-medium"
              style={{
                color: characterColor,
                opacity: textOpacity,
              }}
              initial={shouldReduceMotion ? { y: 0 } : { y: 10 }}
              animate={{ y: 0 }}
            >
              {progress >= 1
                ? t("ui.pullHint.release")
                : t("ui.pullHint.continue")}
            </motion.div>

            {/* 底部拖拽条 */}
            <div className="flex justify-center">
              <motion.div
                className="w-16 h-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    progress >= 1 ? characterColor : `${characterColor}40`,
                  scaleX: barScaleX,
                }}
                animate={
                  shouldReduceMotion
                    ? {}
                    : progress >= 1
                      ? {
                          scaleY: [1, 1.5, 1],
                        }
                      : {}
                }
                transition={{
                  scaleY: {
                    duration: 0.3,
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 底部触发区域提示 - 仅在调试模式且深色模式且在底部时显示 */}
      <AnimatePresence>
        {DEBUG_MODE &&
          enabled &&
          debugInfo.isAtBottom &&
          !isPulling &&
          !isModalOpen && (
            <motion.div
              key="debug-trigger-hint"
              className="fixed bottom-0 left-0 right-0 z-[9996] bg-green-500/80 text-white text-center py-6 border-t-4 border-green-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="text-lg font-bold">✅ 触发区域激活</div>
              <div className="text-sm mt-2">
                👆 现在可以向上拉动触发隐藏内容
              </div>
              <div className="text-xs mt-1 opacity-70">
                （这是调试提示，正式版会隐藏）
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* 内容切换区域 */}
      {/* 表面性格内容 - 始终挂载，通过 display 控制显示 */}
      <div style={{ display: isModalOpen ? "none" : "block" }}>{children}</div>

      {/* 隐藏属性内容 - 使用 Portal 渲染到 body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                key="hidden"
                initial={shouldReduceMotion ? { y: 0 } : { y: "100%" }}
                animate={{ y: 0 }}
                exit={shouldReduceMotion ? { y: 0, opacity: 0 } : { y: "100%" }}
                transition={{
                  type: "spring",
                  damping: 45,
                  stiffness: 220,
                  duration: shouldReduceMotion ? 0 : undefined,
                }}
                className="min-h-screen fixed inset-0 z-[9999] overflow-y-auto"
                style={{
                  backgroundColor:
                    hiddenProfile?.backgroundColor || "var(--background)",
                }}
              >
                {/* 顶部装饰条 */}
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${characterColor}, transparent)`,
                  }}
                />

                {/* 关闭按钮 */}
                <button
                  onClick={handleClose}
                  className="fixed top-6 right-6 p-3 rounded-full bg-black/50 dark:bg-white/10 hover:bg-black/70 dark:hover:bg-white/20 text-white transition-all z-10"
                  aria-label={t("ui.closeButton")}
                >
                  <Icon name="X" size={24} />
                </button>

                {/* 角色名称标签（左上角） */}
                <motion.div
                  className="fixed top-6 left-6 px-4 py-2 rounded-full bg-black/50 dark:bg-white/10 backdrop-blur-md text-white text-sm font-medium"
                  initial={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    borderLeft: `3px solid ${characterColor}`,
                  }}
                >
                  {characterName}
                </motion.div>

                {/* 内容区域 */}
                <div className="pt-24 pb-16">
                  <HiddenContent
                    profile={hiddenProfile!}
                    characterColor={characterColor}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
