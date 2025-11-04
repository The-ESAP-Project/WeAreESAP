// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Character } from "@/types/character";
import { useTranslations } from "next-intl";
import { getContrastTextColor } from "@/lib/utils";

interface CharacterInfoProps {
  character: Character;
}

export function CharacterInfo({ character }: CharacterInfoProps) {
  const t = useTranslations("characters");
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
    <section className="scroll-mt-24" id="info">
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
                className="px-5 py-2 rounded-full text-sm font-medium bg-background transition-all hover:scale-105"
                style={{
                  color: getContrastTextColor(character.color.primary),
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
