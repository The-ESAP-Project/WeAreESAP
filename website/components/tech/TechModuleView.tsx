// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TechModule } from "@/types/tech";
import { TechSectionView } from "./TechContent";

interface TechModuleViewProps {
  module: TechModule;
}

export function TechModuleView({ module }: TechModuleViewProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={module.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* 模块头部 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            {module.icon && (
              <span className="text-5xl">{module.icon}</span>
            )}
            <h2 className="text-4xl font-bold text-foreground">{module.name}</h2>
          </div>
          <p className="text-lg text-muted-foreground">{module.description}</p>
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
              title={section.title}
              content={section.content}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
