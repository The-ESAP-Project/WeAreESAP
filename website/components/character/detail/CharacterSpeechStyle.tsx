// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Character } from "@/types/character";
import { useTranslations } from "next-intl";
import { getContrastTextColor } from "@/lib/utils";

interface CharacterSpeechStyleProps {
  character: Character;
}

export function CharacterSpeechStyle({ character }: CharacterSpeechStyleProps) {
  const t = useTranslations("characters");
  const speechStyle = character.meta?.speechStyle as string[] | undefined;

  if (!speechStyle || speechStyle.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24" id="speech-style">
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.speechStyle")}
      </h2>

      <div className="bg-muted rounded-2xl p-8 md:p-10">
        <div className="grid grid-cols-1 gap-6">
          {speechStyle.map((style, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-xl bg-background/50 hover:bg-background transition-all group"
            >
              {/* 引号装饰 */}
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform"
                style={{
                  color: getContrastTextColor(character.color.primary),
                  backgroundColor: `${character.color.primary}15`,
                }}
              >
                &quot;
              </div>
              {/* 内容 */}
              <div className="flex-1 pt-1.5">
                <p className="text-foreground/90 leading-relaxed">{style}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
