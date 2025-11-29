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

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { HiddenProfile } from "@/types/hidden-profile";
import { HiddenContent } from "./HiddenContent";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HiddenProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HiddenProfile;
  characterColor: string;
  characterName: string;
}

/**
 * 隐藏属性全屏模态框组件
 * 从顶部滑下显示隐藏内容
 */
export function HiddenProfileModal({
  isOpen,
  onClose,
  profile,
  characterColor,
  characterName,
}: HiddenProfileModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("characters.detail.hiddenProfile");

  // ESC 键关闭
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-9998"
            initial={shouldReduceMotion ? { opacity: 0.8 } : { opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* 模态框内容容器 - 负责滚动 */}
          <div
            className="fixed inset-0 z-9999 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hidden-profile-title"
          >
            {/* 内容区域 - 负责动画 */}
            <motion.div
              className="min-h-screen relative"
              initial={shouldReduceMotion ? { y: 0 } : { y: "100%" }}
              animate={{ y: 0 }}
              exit={shouldReduceMotion ? { y: 0, opacity: 0 } : { y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                duration: shouldReduceMotion ? 0 : undefined,
              }}
              style={{
                backgroundColor: profile.backgroundColor || "var(--background)",
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
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-black/50 dark:bg-white/10 hover:bg-black/70 dark:hover:bg-white/20 text-white transition-all z-10"
                aria-label={t("ui.closeButton")}
              >
                <Icon name="X" size={24} />
              </button>

              {/* 角色名称标签（左上角） */}
              <motion.div
                className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/50 dark:bg-white/10 backdrop-blur-md text-white text-sm font-medium"
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
                  profile={profile}
                  characterColor={characterColor}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
