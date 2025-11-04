// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  startTransition: () => void;
  finishTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

const MIN_TRANSITION_TIME = 200; // 最小过渡时间，防止闪烁
const MAX_TRANSITION_TIME = 2000; // 最大过渡时间，避免卡死（兜底保护）
const INITIAL_LOAD_TIME = 400; // 首次加载动画时长

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(true); // 初始为 true，显示首次加载
  const [transitionStartTime, setTransitionStartTime] = useState<number | null>(
    Date.now()
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 处理首次加载
  useEffect(() => {
    if (isInitialLoad) {
      // 等待页面内容加载完成
      const handleLoad = () => {
        const elapsed = Date.now() - (transitionStartTime || Date.now());
        const remainingTime = Math.max(0, INITIAL_LOAD_TIME - elapsed);

        setTimeout(() => {
          setIsTransitioning(false);
          setTransitionStartTime(null);
          setIsInitialLoad(false);
        }, remainingTime);
      };

      // 如果页面已经加载完成，立即执行
      if (document.readyState === "complete") {
        handleLoad();
      } else {
        // 否则等待加载完成
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }
  }, [isInitialLoad, transitionStartTime]);

  // 最大过渡时间保护，避免卡住（仅在非首次加载时）
  useEffect(() => {
    if (!isInitialLoad && isTransitioning && transitionStartTime) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionStartTime(null);
      }, MAX_TRANSITION_TIME);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, transitionStartTime, isInitialLoad]);

  const startTransition = () => {
    setIsTransitioning(true);
    setTransitionStartTime(Date.now());
  };

  const finishTransition = () => {
    if (!transitionStartTime) return;

    const elapsed = Date.now() - transitionStartTime;
    const remainingTime = Math.max(0, MIN_TRANSITION_TIME - elapsed);

    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionStartTime(null);
    }, remainingTime);
  };

  return (
    <TransitionContext.Provider
      value={{ isTransitioning, startTransition, finishTransition }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}
