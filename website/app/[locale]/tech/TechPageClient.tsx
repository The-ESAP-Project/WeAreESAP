// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { TechModule } from "@/types/tech";
import { TechTabs, TechModuleView } from "@/components";

interface TechPageClientProps {
  modules: TechModule[];
}

export function TechPageClient({ modules }: TechPageClientProps) {
  const searchParams = useSearchParams();

  // 从 URL 读取初始 module，如果没有或无效则使用第一个模块
  const moduleFromUrl = searchParams.get("module");
  const initialModule =
    moduleFromUrl && modules.some((m) => m.id === moduleFromUrl)
      ? moduleFromUrl
      : modules[0]?.id || "";

  const [activeModuleId, setActiveModuleId] = useState(initialModule);

  const activeModule = useMemo(
    () => modules.find((m) => m.id === activeModuleId),
    [modules, activeModuleId]
  );

  // 处理 Tab 切换，更新 URL
  const handleTabChange = useCallback((moduleId: string) => {
    setActiveModuleId(moduleId);
    // 使用原生 History API 避免触发 Next.js RSC 请求
    const newUrl = `${window.location.pathname}?module=${moduleId}`;
    window.history.replaceState(null, "", newUrl);
  }, []);

  // 处理页面加载时的 hash 滚动
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // 使用双重 RAF 确保 DOM 完全渲染后再滚动
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    }
  }, [activeModuleId]);

  return (
    <div className="min-h-screen">
      {/* Tab 导航 */}
      <TechTabs
        modules={modules}
        activeId={activeModuleId}
        onTabChange={handleTabChange}
      />

      {/* 模块内容 */}
      {activeModule && <TechModuleView module={activeModule} />}
    </div>
  );
}
