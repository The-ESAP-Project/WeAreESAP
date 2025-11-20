// Copyright 2025 AptS:1547, AptS:1548
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
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="bg-muted rounded-xl p-6 border border-border hover:border-esap-blue/50 transition-all duration-300"
      initial={
        shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              delay: index * 0.1,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1] as const,
            }
      }
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
