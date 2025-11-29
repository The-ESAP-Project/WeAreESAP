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

interface CharacterSpeechStyleProps {
  character: Character;
}

export function CharacterSpeechStyle({ character }: CharacterSpeechStyleProps) {
  const t = useTranslations("characters");
  const speechStyle = character.meta?.speechStyle as string[] | undefined;

  // 预计算颜色值
  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.primary);

  if (!speechStyle || speechStyle.length === 0) {
    return null;
  }

  return (
    <section
      className="scroll-mt-24"
      id="speech-style"
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
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]"
                style={{
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
