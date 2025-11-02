// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/ui";

interface RoleTypeCardProps {
  role: {
    title: string;
    icon: string;
    description: string[];
  };
  index: number;
}

export function RoleTypeCard({ role, index }: RoleTypeCardProps) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div className="bg-muted rounded-xl p-6 h-full border border-border hover:border-esap-yellow/50 transition-all duration-300">
        {/* 图标和标题 */}
        <div className="flex items-center gap-3 mb-4">
          <Icon name={role.icon as IconName} size={40} className="text-foreground" />
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
