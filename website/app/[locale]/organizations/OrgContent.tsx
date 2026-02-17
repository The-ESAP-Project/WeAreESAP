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
import { ScrollableTabs } from "@/components/content";
import { OrganizationView } from "@/components/organizations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Organization } from "@/types/organization";

interface OrgContentProps {
  organizations: Organization[];
  characterNames: Record<string, string>;
  initialOrgId?: string;
}

function getOrgIdFromLocation(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const segments = window.location.pathname.split("/");
  const idx = segments.indexOf("organizations");
  return idx !== -1 ? segments[idx + 1] : undefined;
}

export function OrgContent({
  organizations,
  characterNames,
  initialOrgId,
}: OrgContentProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeOrgId, setActiveOrgId] = useState(
    () => initialOrgId || getOrgIdFromLocation() || organizations[0]?.id || ""
  );

  const activeOrg = useMemo(
    () => organizations.find((o) => o.id === activeOrgId),
    [organizations, activeOrgId]
  );

  // 记录每个 tab 的滚动位置
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const activeOrgIdRef = useRef(activeOrgId);
  activeOrgIdRef.current = activeOrgId;
  const tabsRef = useRef<HTMLDivElement>(null);

  // 获取 tabs 距页面顶部的偏移量（减去 sticky nav 高度 h-16 = 64px）
  const getTabsTop = useCallback(() => {
    if (!tabsRef.current) return 0;
    return tabsRef.current.getBoundingClientRect().top + window.scrollY - 64;
  }, []);

  const handleTabChange = useCallback(
    (orgId: string) => {
      // 保存当前 tab 的滚动位置
      scrollPositions.current.set(activeOrgIdRef.current, window.scrollY);
      setActiveOrgId(orgId);
      const segments = window.location.pathname.split("/");
      const idx = segments.indexOf("organizations");
      if (idx !== -1) {
        segments[idx + 1] = orgId;
        window.history.pushState(null, "", segments.join("/"));
      }
      // 恢复目标 tab 的滚动位置，最高只能到 tabs 顶部（不露出大标题）
      const saved = scrollPositions.current.get(orgId);
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
      const id = getOrgIdFromLocation();
      if (id) {
        setActiveOrgId(id);
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
        items={organizations}
        activeId={activeOrgId}
        onTabChange={handleTabChange}
        getItemName={(o) => o.info.name}
        getItemIcon={(o) => o.icon}
        getItemIconColor={(o) => o.theme.accent}
        getUnderlineStyle={(o) => ({
          background: `linear-gradient(90deg, ${o.theme.primary}, ${o.theme.accent})`,
        })}
        layoutId="activeOrgTab"
      />

      <AnimatePresence mode="wait">
        {activeOrg && (
          <motion.div
            key={activeOrg.id}
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
            <OrganizationView
              organization={activeOrg}
              characterNames={characterNames}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
