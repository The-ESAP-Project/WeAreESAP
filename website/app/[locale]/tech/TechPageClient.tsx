// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { TechModule } from "@/types/tech";
import { TechTabs, TechModuleView } from "@/components";

interface TechPageClientProps {
  modules: TechModule[];
}

export function TechPageClient({ modules }: TechPageClientProps) {
  const [activeModuleId, setActiveModuleId] = useState(modules[0]?.id || "");

  const activeModule = modules.find((m) => m.id === activeModuleId);

  return (
    <div className="min-h-screen">
      {/* Tab 导航 */}
      <TechTabs
        modules={modules}
        activeId={activeModuleId}
        onTabChange={setActiveModuleId}
      />

      {/* 模块内容 */}
      {activeModule && <TechModuleView module={activeModule} />}
    </div>
  );
}
