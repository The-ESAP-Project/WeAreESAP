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

interface RoleTypeCardProps {
  role: {
    title: string;
    icon: string;
    description: string[];
  };
  index: number;
}

export function RoleTypeCard({ role, index }: RoleTypeCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group"
      initial={
        shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
      }
      whileInView={
        shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }
      }
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
            name={role.icon as IconName}
            size={40}
            className="text-foreground"
          />
          <h3 className="text-xl font-bold text-foreground">{role.title}</h3>
        </div>

        {/* 描述列表 */}
        <ul className="space-y-2">
          {role.description.map((item, i) => (
            <li
              key={i}
              className="text-sm text-foreground/70 flex items-start gap-2"
            >
              <span className="text-esap-yellow mt-1 opacity-70">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
