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
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ContactPlaceholder() {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("join");

  // Icon 映射（技术细节，不需要翻译）
  const iconMap: Record<string, IconName> = {
    官方网站: "Globe",
    "Official Website": "Globe",
    公式サイト: "Globe",
    GitHub: "Github",
    Discord: "Discord",
    "QQ 群": "Users",
    "QQ Group": "Users",
    "QQ グループ": "Users",
  };

  const platforms = t.raw("contactPlatforms") as Array<{
    name: string;
    status: string;
  }>;

  const comingSoonText = t("contactComingSoon");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map((platform, index) => (
        <motion.div
          key={platform.name}
          className="bg-muted rounded-lg p-4 border border-border"
          initial={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { delay: index * 0.05 }
          }
        >
          <div className="flex items-center gap-3">
            <Icon
              name={iconMap[platform.name] || "Globe"}
              size={28}
              className="text-foreground"
            />
            <div className="flex-1">
              <div className="font-semibold text-foreground">
                {platform.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {platform.status === comingSoonText ||
                platform.status === "即将开放" ||
                platform.status === "Coming Soon" ||
                platform.status === "近日公開" ? (
                  <span className="text-esap-yellow">{platform.status}</span>
                ) : (
                  <a
                    href={`https://${platform.status}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-esap-blue hover:underline"
                  >
                    {platform.status}
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
