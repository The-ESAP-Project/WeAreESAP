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

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TechModuleView } from "@/components";
import { ScrollableTabs } from "@/components/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { TechModule } from "@/types/tech";

interface TechContentProps {
  modules: TechModule[];
  initialModuleId?: string;
}

function getTechIdFromLocation(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const segments = window.location.pathname.split("/");
  const idx = segments.indexOf("tech");
  return idx !== -1 ? segments[idx + 1] : undefined;
}

export function TechContent({ modules, initialModuleId }: TechContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeModuleId, setActiveModuleId] = useState(
    () => initialModuleId || getTechIdFromLocation() || modules[0]?.id || ""
  );

  const activeModule = useMemo(
    () => modules.find((m) => m.id === activeModuleId),
    [modules, activeModuleId]
  );

  // 记录每个 tab 的滚动位置
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const activeModuleIdRef = useRef(activeModuleId);
  activeModuleIdRef.current = activeModuleId;
  const tabsRef = useRef<HTMLDivElement>(null);

  // 获取 tabs 距页面顶部的偏移量（减去 sticky nav 高度 h-16 = 64px）
  const getTabsTop = useCallback(() => {
    if (!tabsRef.current) return 0;
    return tabsRef.current.getBoundingClientRect().top + window.scrollY - 64;
  }, []);

  const handleTabChange = useCallback(
    (moduleId: string) => {
      // 保存当前 tab 的滚动位置
      scrollPositions.current.set(activeModuleIdRef.current, window.scrollY);
      setActiveModuleId(moduleId);
      const segments = window.location.pathname.split("/");
      const idx = segments.indexOf("tech");
      if (idx !== -1) {
        segments[idx + 1] = moduleId;
        window.history.pushState(null, "", segments.join("/"));
      }
      // 恢复目标 tab 的滚动位置，最高只能到 tabs 顶部（不露出大标题）
      const saved = scrollPositions.current.get(moduleId);
      const tabsTop = getTabsTop();
      requestAnimationFrame(() => {
        window.scrollTo({ top: Math.max(saved ?? tabsTop, tabsTop) });
      });
    },
    [getTabsTop]
  );

  // 浏览器前进/后退时同步状态
  useEffect(() => {
    const handlePopState = () => {
      const id = getTechIdFromLocation();
      if (id) {
        setActiveModuleId(id);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 页面加载时的 hash 滚动
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen">
      <div ref={tabsRef} />
      <ScrollableTabs
        items={modules}
        activeId={activeModuleId}
        onTabChange={handleTabChange}
        getItemName={(m) => m.name}
        getItemIcon={(m) => m.icon}
        getItemIconColor={(m) => m.color.primary}
        getUnderlineStyle={() =>
          "bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue"
        }
        layoutId="activeTechTab"
      />

      <AnimatePresence mode="wait">
        {activeModule && (
          <motion.div
            key={activeModule.id}
            initial={
              shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
            }
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }
            }
          >
            <TechModuleView module={activeModule} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
