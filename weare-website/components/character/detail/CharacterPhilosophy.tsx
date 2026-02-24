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

interface CharacterPhilosophyProps {
  character: Character;
}

export function CharacterPhilosophy({ character }: CharacterPhilosophyProps) {
  const t = useTranslations("characters");
  const philosophy = character.meta?.philosophy as
    | Record<string, string>
    | undefined;

  const lightModeColor = getContrastTextColor(character.color.primary);
  const darkModeColor = getContrastTextColorDark(character.color.primary);

  const gradientV = useMemo(
    () => ({
      background: `linear-gradient(180deg, ${character.color.primary}, ${character.color.dark})`,
    }),
    [character.color.primary, character.color.dark]
  );

  if (!philosophy || Object.keys(philosophy).length === 0) {
    return null;
  }

  return (
    <AnimatedSection delay={0.7}>
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
          {t("detail.sections.philosophy")}
        </h3>

        <div className="space-y-3">
          {Object.entries(philosophy).map(([key, value], index) => (
            <div key={index} className="p-3 rounded-lg bg-background/50">
              <h4 className="text-base font-medium mb-2 [color:var(--char-color-light)] dark:[color:var(--char-color-dark)]">
                {t(`detail.philosophy.${key}`)}
              </h4>
              <p className="text-foreground/90 leading-relaxed italic">
                &quot;{value}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
