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
import { getContrastTextColor, getContrastTextColorDark } from "@/lib/utils";
import type { Character } from "@/types/character";

interface CharacterAbilitiesProps {
  character: Character;
}

export function CharacterAbilities({ character }: CharacterAbilitiesProps) {
  const t = useTranslations("characters");
  const abilities = character.meta?.abilities as string[] | undefined;
  const weapons = character.meta?.weapons as string[] | undefined;

  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.primary);

  const gradientV = useMemo(
    () => ({
      background: `linear-gradient(180deg, ${character.color.primary}, ${character.color.dark})`,
    }),
    [character.color.primary, character.color.dark]
  );

  if (!abilities && !weapons) {
    return null;
  }

  return (
    <AnimatedSection delay={0.4}>
      <div
        className="p-5 rounded-xl border border-border bg-muted/30"
        style={
          {
            "--char-color-light": lightModeColor,
            "--char-color-dark": darkModeColor,
          } as React.CSSProperties
        }
      >
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
          <span className="w-1 h-6 rounded-full" style={gradientV} />
          {t("detail.sections.abilities")}
        </h3>

        <div className="space-y-4">
          {/* 特殊能力 */}
          {abilities && abilities.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
                <span
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: character.color.primary }}
                />
                {t("detail.abilities.special")}
              </h4>
              <div className="space-y-2">
                {abilities.map((ability, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${character.color.primary}, ${character.color.dark})`,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 text-foreground/90">{ability}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 武器装备 */}
          {weapons && weapons.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-foreground mb-3 flex items-center gap-2">
                <span
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: character.color.primary }}
                />
                {t("detail.abilities.weapons")}
              </h4>
              <div className="space-y-2">
                {weapons.map((weapon, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-background/80 group-hover:scale-110 transition-transform [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]">
                      ⚔️
                    </div>
                    <div className="flex-1 text-base font-semibold text-foreground">
                      {weapon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
