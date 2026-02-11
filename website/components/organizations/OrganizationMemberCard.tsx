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
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OrganizationMember } from "@/types/organization";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface OrganizationMemberCardProps {
  member: OrganizationMember;
  characterName?: string;
  themeColor: string;
  accentColor: string;
  index: number;
}

export const OrganizationMemberCard = memo(function OrganizationMemberCard({
  member,
  characterName,
  themeColor,
  accentColor,
  index,
}: OrganizationMemberCardProps) {
  const t = useTranslations("organizations");
  const shouldReduceMotion = useReducedMotion();
  const isClassified = member.visibility === "classified";
  const hasCharacterPage = !!characterName && !isClassified;

  const cardContent = (
    <>
      {/* Classified 标签 */}
      {isClassified && (
        <div className="absolute -top-3 right-4 px-3 py-1 bg-amber-500 text-amber-950 text-xs font-bold rounded-full flex items-center gap-1">
          <Icon name="Lock" size={12} />
          {t("members.classified")}
        </div>
      )}

      {/* 成员 ID 和角色 */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center font-mono font-bold text-lg shrink-0 ${
            isClassified
              ? "bg-amber-500/20 text-amber-500 blur-[1px]"
              : "bg-muted"
          }`}
          style={!isClassified ? { color: accentColor } : undefined}
        >
          {member.characterId}
        </div>

        <div className="flex-1 min-w-0">
          {characterName && (
            <p
              className={`text-sm font-medium ${isClassified ? "text-amber-500/70" : "text-muted-foreground"}`}
            >
              {characterName}
            </p>
          )}
          <h4
            className={`font-bold text-lg ${isClassified ? "text-amber-500" : "text-foreground"}`}
          >
            {member.role}
          </h4>
        </div>
      </div>

      {/* 职责列表 */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-muted-foreground">
          {t("members.responsibilities")}
        </h5>
        <ul className="space-y-1.5">
          {member.responsibilities.map((resp, idx) => (
            <li
              key={idx}
              className={`text-sm flex items-start gap-2 ${
                isClassified ? "text-foreground/60" : "text-foreground/80"
              }`}
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: isClassified ? "#F59E0B" : themeColor,
                }}
              />
              {resp}
            </li>
          ))}
        </ul>
      </div>

      {/* Classified 提示 */}
      {isClassified && (
        <div className="mt-4 pt-3 border-t border-amber-500/30">
          <p className="text-xs text-amber-500/80 italic flex items-center gap-1">
            <Icon name="InfoCircle" size={14} />
            {t("members.classifiedNote")}
          </p>
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={
        shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.3, delay: index * 0.1 }
      }
      className={`relative rounded-xl ${
        isClassified
          ? "border-2 border-dashed border-amber-500/50 bg-amber-500/5"
          : "border border-border bg-card"
      }`}
      style={
        isClassified
          ? {
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245, 158, 11, 0.03) 10px, rgba(245, 158, 11, 0.03) 20px)",
            }
          : undefined
      }
    >
      {hasCharacterPage ? (
        <Link
          href={`/characters/${member.characterId}`}
          className="block p-5 hover:bg-muted/50 transition-colors rounded-xl"
        >
          {cardContent}
        </Link>
      ) : (
        <div className="p-5">{cardContent}</div>
      )}
    </motion.div>
  );
});
