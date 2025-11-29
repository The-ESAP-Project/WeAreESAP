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

import { Character } from "@/types/character";
import { useTranslations } from "next-intl";
import { getContrastTextColor, getContrastTextColorDark } from "@/lib/utils";

interface CharacterInfoProps {
  character: Character;
}

export function CharacterInfo({ character }: CharacterInfoProps) {
  const t = useTranslations("characters");

  // 预计算颜色值
  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.primary);

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
  ].filter((item) => item.value); // 过滤掉没有值的项

  return (
    <section
      className="scroll-mt-24"
      id="info"
      style={
        {
          "--char-color-light": lightModeColor,
          "--char-color-dark": darkModeColor,
        } as React.CSSProperties
      }
    >
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.info")}
      </h2>

      <div className="bg-muted rounded-2xl p-8 md:p-10">
        {/* 网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infoItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm text-muted-foreground font-medium">
                {item.label}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 描述 */}
        <div className="mt-10 pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground font-medium mb-3">
            {t("detail.fields.description")}
          </div>
          <p className="text-base text-foreground/90 leading-relaxed">
            {character.description}
          </p>
        </div>

        {/* 关键词标签 */}
        <div className="mt-8">
          <div className="text-sm text-muted-foreground font-medium mb-4">
            {t("detail.fields.keywords")}
          </div>
          <div className="flex flex-wrap gap-3">
            {character.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-5 py-2 rounded-full text-sm font-medium bg-background transition-all hover:scale-105 [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
                style={{
                  border: `2px solid ${character.color.primary}40`,
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
