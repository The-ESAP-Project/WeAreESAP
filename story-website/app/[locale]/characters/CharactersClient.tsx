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
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import type { StoryCharacter } from "@/types/character";

interface CharactersClientProps {
  characters: StoryCharacter[];
}

export function CharactersClient({ characters }: CharactersClientProps) {
  const t = useTranslations("characters");

  return (
    <div>
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          {t("hero.title")}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          {t("hero.subtitle")}
        </p>
        <div className="w-24 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto" />
      </section>

      {/* Character card list */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="space-y-4">
          {characters.map((character, i) => (
            <AnimatedSection key={character.id} delay={i * 0.08}>
              <Link
                href={`/characters/${character.id}`}
                className="flex items-center rounded-lg border border-border overflow-hidden hover:bg-muted/50 transition-colors group"
              >
                {/* Color accent bar */}
                <div
                  className="w-1 self-stretch shrink-0"
                  style={{ backgroundColor: character.color.primary }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0 px-4 py-3">
                  <p className="text-xs font-mono text-muted-foreground">
                    {character.code}
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-semibold text-foreground">
                      {character.name}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: character.color.primary }}
                    >
                      {character.role}
                    </span>
                  </div>
                  {character.quote && (
                    <p className="text-sm text-muted-foreground italic mt-1 truncate">
                      {character.quote}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="pr-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
                  <Icon name="ChevronRight" size={16} />
                </div>
              </Link>
            </AnimatedSection>
          ))}

          {characters.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              {t("noRelatedStories")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
