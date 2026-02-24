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

import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatedSection, TransitionLink } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import type { Character } from "@/types/character";

interface CharacterHeroProps {
  character: Character;
}

export function CharacterHero({ character }: CharacterHeroProps) {
  const t = useTranslations("characters");

  return (
    <AnimatedSection>
      <TransitionLink
        href="/characters"
        className="inline-flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      >
        <Icon name="ArrowLeft" size={14} />
        {t("ui.backToList")}
      </TransitionLink>

      <div className="relative rounded-xl overflow-hidden border border-border">
        <div className="relative aspect-[5/2]">
          {character.backgroundImage ? (
            <Image
              src={character.backgroundImage}
              alt={character.name}
              fill
              className="object-cover select-none pointer-events-none [-webkit-touch-callout:none]"
              style={
                character.backgroundPosition
                  ? { objectPosition: character.backgroundPosition }
                  : undefined
              }
              sizes="(max-width: 640px) 100vw, 1024px"
              priority
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${character.color.primary}, ${character.color.dark})`,
              }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${character.color.dark}ee 0%, ${character.color.dark}80 30%, transparent 70%)`,
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-4">
            {character.avatar && (
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/20 bg-black/30 backdrop-blur-sm shrink-0">
                <Image
                  src={character.avatar}
                  alt={character.name}
                  fill
                  className="object-contain p-1.5 select-none pointer-events-none [-webkit-touch-callout:none]"
                  sizes="56px"
                  draggable={false}
                />
              </div>
            )}
            <div>
              <div className="text-sm font-mono text-white/70 mb-1">
                {character.code}
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                {character.name}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
