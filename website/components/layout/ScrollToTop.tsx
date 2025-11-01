// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollToTopProps {
  /** 显示按钮的滚动阈值（默认 400px） */
  threshold?: number;
}

export function ScrollToTop({ threshold = 400 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 监听滚动事件
    window.addEventListener("scroll", toggleVisibility);

    // 清理事件监听器
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-esap-yellow via-esap-pink to-esap-blue shadow-lg hover:shadow-xl transition-shadow group"
          aria-label="返回顶部"
        >
          {/* 内层白色圆圈 */}
          <div className="absolute inset-[2px] rounded-full bg-background flex items-center justify-center">
            <svg
              className="w-6 h-6 text-foreground group-hover:-translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
