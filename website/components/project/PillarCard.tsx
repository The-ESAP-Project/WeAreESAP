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
import { Icon, type IconName } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PillarCardProps {
  pillar: {
    id: string;
    title: string;
    character: string;
    color: {
      primary: string;
      dark: string;
    };
    icon: string;
    traits: string[];
    quote: string;
  };
  index: number;
}

export function PillarCard({ pillar, index }: PillarCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative group"
      initial={
        shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              delay: index * 0.15,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1] as const,
            }
      }
    >
      {/* 卡片主体 */}
      <div
        className="relative bg-muted rounded-2xl p-8 h-full overflow-hidden border-2 transition-all duration-300"
        style={{
          borderColor: `${pillar.color.primary}40`,
        }}
      >
        {/* 背景渐变装饰 */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${pillar.color.primary}, transparent 70%)`,
          }}
        />

        {/* 内容 */}
        <div className="relative z-10 space-y-6">
          {/* 顶部：图标和角色代号 */}
          <div className="flex items-center justify-between">
            <Icon
              name={pillar.icon as IconName}
              size={40}
              color={pillar.color.primary}
            />
            <span
              className="text-sm font-mono font-semibold px-3 py-1 rounded-full bg-background/50"
              style={{ color: pillar.color.primary }}
            >
              {pillar.character}
            </span>
          </div>

          {/* 支柱标题 */}
          <h3
            className="text-2xl font-bold"
            style={{ color: pillar.color.primary }}
          >
            {pillar.title}
          </h3>

          {/* 核心特质列表 */}
          <ul className="space-y-3">
            {pillar.traits.map((trait, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/80"
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -10 }
                }
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        delay: index * 0.15 + i * 0.1,
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1] as const,
                      }
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: pillar.color.primary }}
                />
                <span>{trait}</span>
              </motion.li>
            ))}
          </ul>

          {/* 分隔线 */}
          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, ${pillar.color.primary}, transparent)`,
            }}
          />

          {/* 经典引言 */}
          <blockquote
            className="text-sm italic text-foreground/70 border-l-2 pl-4"
            style={{ borderColor: pillar.color.primary }}
          >
            "{pillar.quote}"
          </blockquote>
        </div>

        {/* 右下角装饰 */}
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500 blur-3xl"
          style={{ backgroundColor: pillar.color.primary }}
        />
      </div>
    </motion.div>
  );
}
