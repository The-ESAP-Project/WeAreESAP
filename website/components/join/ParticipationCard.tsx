// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";

interface ParticipationCardProps {
  participation: {
    role: string;
    activities: string[];
  };
  index: number;
}

export function ParticipationCard({
  participation,
  index,
}: ParticipationCardProps) {
  return (
    <motion.div
      className="bg-muted rounded-xl p-6 border border-border hover:border-esap-blue/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* 角色标题 */}
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-esap-blue" />
        {participation.role}
      </h3>

      {/* 活动列表 */}
      <ul className="space-y-2">
        {participation.activities.map((activity, i) => (
          <li
            key={i}
            className="text-sm text-foreground/70 flex items-start gap-2"
          >
            <span className="text-esap-blue mt-1">•</span>
            <span>{activity}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
