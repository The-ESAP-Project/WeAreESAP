// Copyright 2021-2026 The ESAP Project
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

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { AnimatedSection } from "@/components/ui";
import type { Character } from "@/types/character";

interface CharacterInfoProps {
  character: Character;
}

export function CharacterInfo({ character }: CharacterInfoProps) {
  const t = useTranslations("characters");

  const gradientH = useMemo(
    () => ({
      background: `linear-gradient(90deg, ${character.color.primary}, ${character.color.dark})`,
    }),
    [character.color.primary, character.color.dark]
  );

  const infoItems = [
    { label: t("detail.fields.code"), value: character.code },
    { label: t("detail.fields.name"), value: character.name },
    { label: t("detail.fields.nickname"), value: character.nickname },
    { label: t("detail.fields.role"), value: character.role },
    { label: t("detail.fields.species"), value: character.species },
    {
      label: t("detail.fields.bodyType"),
      value: character.meta?.bodyType as string,
    },
    {
      label: t("detail.fields.location"),
      value: character.meta?.location as string,
    },
    {
      label: t("detail.fields.occupation"),
      value: character.meta?.occupation as string,
    },
    {
      label: t("detail.fields.mission"),
      value: character.meta?.mission as string,
    },
    {
      label: t("detail.fields.threeBodySystem"),
      value: character.meta?.threeBodySystem as string,
    },
  ].filter((item) => item.value);

  return (
    <AnimatedSection delay={0.1}>
      <div className="relative p-5 rounded-xl border border-border bg-muted/30 overflow-hidden space-y-4">
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={gradientH}
        />

        {/* 角色定位 + 引言 */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {character.role}
          </div>
          <p className="text-muted-foreground leading-relaxed italic">
            &quot;{character.quote}&quot;
          </p>
        </div>

        {/* 描述 */}
        <p className="text-foreground/90 leading-relaxed">
          {character.description}
        </p>

        {/* 信息网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {infoItems.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm text-muted-foreground font-medium">
                {item.label}
              </div>
              <div className="text-base font-semibold text-foreground">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 分割线 + 关键词 */}
        <div className="flex items-center gap-4 pt-2">
          <div className="w-24 h-1 rounded-full" style={gradientH} />
        </div>

        <div className="flex flex-wrap gap-2">
          {character.keywords.map((keyword, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${character.color.primary}15`,
                color: character.color.primary,
              }}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
