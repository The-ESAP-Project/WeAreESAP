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

interface CharacterDailyLifeProps {
  character: Character;
}

export function CharacterDailyLife({ character }: CharacterDailyLifeProps) {
  const t = useTranslations("characters");
  const dailyLife = character.meta?.dailyLife as string[] | undefined;

  const gradientV = useMemo(
    () => ({
      background: `linear-gradient(180deg, ${character.color.primary}, ${character.color.dark})`,
    }),
    [character.color.primary, character.color.dark]
  );

  if (!dailyLife || dailyLife.length === 0) {
    return null;
  }

  return (
    <AnimatedSection delay={0.5}>
      <div className="p-5 rounded-xl border border-border bg-muted/30">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
          <span className="w-1 h-6 rounded-full" style={gradientV} />
          {t("detail.sections.dailyLife")}
        </h3>

        <div className="space-y-2">
          {dailyLife.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-all"
            >
              <div
                className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                style={{
                  backgroundColor: character.color.primary,
                  boxShadow: `0 0 8px ${character.color.primary}60`,
                }}
              />
              <p className="flex-1 text-foreground/90 leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
