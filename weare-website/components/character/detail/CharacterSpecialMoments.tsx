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

interface CharacterSpecialMomentsProps {
  character: Character;
}

export function CharacterSpecialMoments({
  character,
}: CharacterSpecialMomentsProps) {
  const t = useTranslations("characters");
  const specialMoments = character.meta?.specialMoments as string[] | undefined;

  const gradientV = useMemo(
    () => ({
      background: `linear-gradient(180deg, ${character.color.primary}, ${character.color.dark})`,
    }),
    [character.color.primary, character.color.dark]
  );

  if (!specialMoments || specialMoments.length === 0) {
    return null;
  }

  return (
    <AnimatedSection delay={0.6}>
      <div className="p-5 rounded-xl border border-border bg-muted/30">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-3">
          <span className="w-1 h-6 rounded-full" style={gradientV} />
          {t("detail.sections.specialMoments")}
        </h3>

        {/* 时间轴 */}
        <div className="relative">
          <div
            className="absolute left-4 top-0 bottom-0 w-0.5 opacity-30"
            style={{ backgroundColor: character.color.primary }}
          />

          <div className="space-y-4">
            {specialMoments.map((moment, index) => (
              <div key={index} className="relative pl-10">
                <div
                  className="absolute left-2 top-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: character.color.primary,
                    boxShadow: `0 0 12px ${character.color.primary}60`,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div className="p-3 rounded-lg bg-background/50 hover:bg-background transition-all">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {moment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
