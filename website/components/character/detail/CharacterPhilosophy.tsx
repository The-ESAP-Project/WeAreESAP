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

interface CharacterPhilosophyProps {
  character: Character;
}

export function CharacterPhilosophy({ character }: CharacterPhilosophyProps) {
  const t = useTranslations("characters");
  const philosophy = character.meta?.philosophy as
    | Record<string, string>
    | undefined;

  // 预计算颜色值
  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.primary);

  if (!philosophy || Object.keys(philosophy).length === 0) {
    return null;
  }

  return (
    <section
      className="scroll-mt-24"
      id="philosophy"
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
        {t("detail.sections.philosophy")}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(philosophy).map(([key, value], index) => (
          <div
            key={index}
            className="bg-muted rounded-2xl p-8 hover:scale-[1.02] transition-transform"
          >
            {/* 标题 */}
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]">
              <span
                className="w-1.5 h-6 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
                }}
              />
              {t(`detail.philosophy.${key}`)}
            </h3>

            {/* 内容 */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/90 leading-relaxed italic">
                &quot;{value}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
