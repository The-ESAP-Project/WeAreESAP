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

import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ValueCardProps {
  value: {
    title: string;
    quote: string;
    description: string;
    icon: string;
  };
  index: number;
}

export function ValueCard({ value, index }: ValueCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative group"
      initial={
        shouldReduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.95 }
      }
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { delay: index * 0.1, duration: 0.4 }
      }
    >
      <div className="bg-muted rounded-xl p-6 h-full border border-border hover:border-esap-yellow/50 transition-all duration-300">
        {/* 图标和标题 */}
        <div className="flex items-center gap-3 mb-4">
          <Icon
            name={value.icon as IconName}
            size={32}
            className="text-foreground"
          />
          <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
        </div>

        {/* 引言 */}
        <blockquote className="text-sm italic text-muted-foreground mb-3 border-l-2 border-esap-yellow/30 pl-3">
          "{value.quote}"
        </blockquote>

        {/* 描述 */}
        <p className="text-sm text-foreground/70">{value.description}</p>

        {/* 底部光效 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-b-xl" />
      </div>
    </motion.div>
  );
}
