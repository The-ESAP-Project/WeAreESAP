// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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

const MIN_TRANSITION_TIME = 500; // 最小过渡时间，防止闪烁
const MAX_TRANSITION_TIME = 1000; // 最大过渡时间，避免等太久
const INITIAL_LOAD_TIME = 400; // 首次加载动画时长

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(true); // 初始为 true，显示首次加载
  // 使用 lazy initializer 避免在每次渲染时调用 Date.now()
  const [transitionStartTime, setTransitionStartTime] = useState<number | null>(
    () => Date.now()
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 跟踪所有的 timeout，确保在组件卸载或新过渡开始时清理
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // 清理所有 timers
  const clearAllTimers = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  };

  // 组件卸载时清理所有 timers
  useEffect(() => {
    return clearAllTimers;
  }, []);

  // 处理首次加载
  useEffect(() => {
    if (isInitialLoad) {
      // 等待页面内容加载完成
      const handleLoad = () => {
        const elapsed = Date.now() - (transitionStartTime || Date.now());
        const remainingTime = Math.max(0, INITIAL_LOAD_TIME - elapsed);

        const timer = setTimeout(() => {
          setIsTransitioning(false);
          setTransitionStartTime(null);
          setIsInitialLoad(false);
          timersRef.current.delete(timer);
        }, remainingTime);
        timersRef.current.add(timer);
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

  // 注意：不再监听 pathname 自动结束过渡
  // 改为由 PageTransition 组件在页面渲染完成后主动调用 finishTransition()

  // 最大过渡时间保护，避免卡住（仅在非首次加载时）
  useEffect(() => {
    if (!isInitialLoad && isTransitioning && transitionStartTime) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setTransitionStartTime(null);
        timersRef.current.delete(timer);
      }, MAX_TRANSITION_TIME);
      timersRef.current.add(timer);

      // 复制到局部变量，避免 cleanup 时引用变化
      const timers = timersRef.current;
      return () => {
        clearTimeout(timer);
        timers.delete(timer);
      };
    }
  }, [isTransitioning, transitionStartTime, isInitialLoad]);

  const startTransition = () => {
    // 防止快速连续点击：如果已经在过渡中，忽略新的请求
    if (isTransitioning) {
      return;
    }
    // 清理之前的所有 timers，防止堆积
    clearAllTimers();
    setIsTransitioning(true);
    setTransitionStartTime(Date.now());
  };

  const finishTransition = () => {
    if (!transitionStartTime) return;

    const elapsed = Date.now() - transitionStartTime;
    const remainingTime = Math.max(0, MIN_TRANSITION_TIME - elapsed);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setTransitionStartTime(null);
      timersRef.current.delete(timer);
    }, remainingTime);
    timersRef.current.add(timer);
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
