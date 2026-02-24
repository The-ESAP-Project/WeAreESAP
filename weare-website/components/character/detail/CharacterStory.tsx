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

interface CharacterStoryProps {
  character: Character;
}

export function CharacterStory({ character }: CharacterStoryProps) {
  const t = useTranslations("characters");
  const background = character.meta?.background as string | undefined;
  const characterTraits = character.meta?.characterTraits as
    | string[]
    | undefined;

  const gradientV = useMemo(
    () => ({
      background: `linear-gradient(180deg, ${character.color.primary}, ${character.color.dark})`,
    }),
    [character.color.primary, character.color.dark]
  );

  if (!background && !characterTraits) {
    return null;
  }

  return (
    <AnimatedSection delay={0.2}>
      <div className="p-5 rounded-xl border border-border bg-muted/30">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
          <span className="w-1 h-6 rounded-full" style={gradientV} />
          {t("detail.sections.story")}
        </h3>

        <div className="space-y-4">
          {/* 背景故事 */}
          {background && (
            <div>
              <h4 className="text-base font-medium text-foreground mb-2">
                {t("detail.story.background")}
              </h4>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {background}
              </p>
            </div>
          )}

          {/* 性格特征 */}
          {characterTraits && characterTraits.length > 0 && (
            <div>
              <h4 className="text-base font-medium text-foreground mb-2">
                {t("detail.story.traits")}
              </h4>
              <ul className="space-y-2">
                {characterTraits.map((trait, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-foreground/90 leading-relaxed"
                  >
                    <span
                      className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                      style={{ backgroundColor: character.color.primary }}
                    />
                    <span>{trait}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
