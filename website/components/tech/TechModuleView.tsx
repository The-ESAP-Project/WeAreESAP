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

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TechModule } from "@/types/tech";
import { TechSectionView } from "./TechContent";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TechModuleViewProps {
  module: TechModule;
}

export const TechModuleView = memo(
  ({ module }: TechModuleViewProps) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={module.id}
          initial={
            shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {/* 模块头部 */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              {module.icon && (
                <Icon
                  name={module.icon}
                  size={48}
                  color={module.color.primary}
                />
              )}
              <h2 className="text-4xl font-bold text-foreground">
                {module.name}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground">
              {module.description}
            </p>
            <div
              className="w-32 h-1 rounded-full mt-6"
              style={{
                background: `linear-gradient(90deg, ${module.color.primary}, ${module.color.dark})`,
              }}
            />
          </div>

          {/* 章节内容 */}
          <div className="space-y-8">
            {module.sections.map((section) => (
              <TechSectionView
                key={section.id}
                sectionId={section.id}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  },
  (prevProps, nextProps) => {
    // 只在 module.id 变化时才重新渲染
    return prevProps.module.id === nextProps.module.id;
  }
);
TechModuleView.displayName = "TechModuleView";
