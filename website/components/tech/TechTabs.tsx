// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { TechModule } from "@/types/tech";

interface TechTabsProps {
  modules: TechModule[];
  activeId: string;
  onTabChange: (id: string) => void;
}

export function TechTabs({ modules, activeId, onTabChange }: TechTabsProps) {
  const activeIndex = modules.findIndex((m) => m.id === activeId);

  return (
    <div className="border-b border-border bg-background sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {modules.map((module, index) => {
            const isActive = module.id === activeId;

            return (
              <button
                key={module.id}
                onClick={() => onTabChange(module.id)}
                className={`relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  {module.icon && <span>{module.icon}</span>}
                  {module.name}
                </span>

                {/* 活动标签的下划线 */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
