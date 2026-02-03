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
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Organization } from "@/types/organization";
import { SectionView } from "@/components/content";
import { OrganizationInfoCard } from "./OrganizationInfoCard";
import { OrganizationMemberCard } from "./OrganizationMemberCard";
import { Icon } from "@/components/ui";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface OrganizationViewProps {
  organization: Organization;
}

export const OrganizationView = memo(
  ({ organization }: OrganizationViewProps) => {
    const t = useTranslations("organizations");
    const shouldReduceMotion = useReducedMotion();

    // 分离公开和非公开成员
    const publicMembers = organization.members.filter(
      (m) => m.visibility === "public"
    );
    const classifiedMembers = organization.members.filter(
      (m) => m.visibility === "classified"
    );

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={organization.id}
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
          {/* 组织头部 */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              {organization.icon && (
                <Icon
                  name={organization.icon}
                  size={48}
                  color={organization.theme.accent}
                />
              )}
              <h2 className="text-4xl font-bold text-foreground">
                {organization.info.name}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground">
              {organization.description}
            </p>
            <div
              className="w-32 h-1 rounded-full mt-6"
              style={{
                background: `linear-gradient(90deg, ${organization.theme.primary}, ${organization.theme.accent})`,
              }}
            />

            {/* 组织图片 */}
            {organization.image && (
              <div className="mt-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={organization.image}
                  alt={organization.info.name}
                  width={1200}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            )}
          </div>

          {/* 组织信息卡片 */}
          <OrganizationInfoCard organization={organization} />

          {/* 成员构成 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span
                className="w-1 h-6 rounded-full"
                style={{
                  background: `linear-gradient(180deg, ${organization.theme.primary}, ${organization.theme.accent})`,
                }}
              />
              {t("members.title")}
            </h3>

            {/* 公开成员 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {publicMembers.map((member, index) => (
                <OrganizationMemberCard
                  key={member.characterId}
                  member={member}
                  themeColor={organization.theme.primary}
                  accentColor={organization.theme.accent}
                  index={index}
                />
              ))}
            </div>

            {/* 非公开成员 */}
            {classifiedMembers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classifiedMembers.map((member, index) => (
                  <OrganizationMemberCard
                    key={member.characterId}
                    member={member}
                    themeColor={organization.theme.primary}
                    accentColor={organization.theme.accent}
                    index={publicMembers.length + index}
                  />
                ))}
              </div>
            )}

            {/* 成员缺位提示 */}
            <p className="mt-4 text-sm text-muted-foreground italic">
              {t("members.requiredNote")}
            </p>
          </div>

          {/* 章节内容 */}
          <div className="space-y-8">
            {organization.sections.map((section) => (
              <SectionView
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
    return prevProps.organization.id === nextProps.organization.id;
  }
);
OrganizationView.displayName = "OrganizationView";
