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

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "@/components/ui";
import {
  CharacterAccordion,
  CharacterMobileView,
  CharacterCard,
} from "@/components/character";
import { CharacterCardData } from "@/types/character";
import { useTranslations, useLocale } from "next-intl";

interface CharactersClientProps {
  accordionCharacters: CharacterCardData[];
  otherCharacters: CharacterCardData[];
}

export function CharactersClient({
  accordionCharacters,
  otherCharacters,
}: CharactersClientProps) {
  const router = useRouter();
  const { startTransition } = useTransition();
  const t = useTranslations("characters");
  const locale = useLocale();

  const handleCharacterClick = useCallback(
    (characterId: string) => {
      // 先触发过渡动画
      startTransition();
      // 然后跳转路由
      // PageTransition 组件会在新页面动画完成后自动结束过渡
      router.push(`/${locale}/characters/${characterId}`);
    },
    [locale, router, startTransition]
  );

  return (
    <>
      {/* 桌面端：手风琴展示 */}
      <section className="hidden md:block">
        <CharacterAccordion
          characters={accordionCharacters}
          onCharacterClick={handleCharacterClick}
        />
      </section>

      {/* 移动端：可折叠列表 */}
      <section className="md:hidden py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CharacterMobileView
            characters={accordionCharacters}
            onCharacterClick={handleCharacterClick}
          />
        </div>
      </section>

      {/* 其他角色 */}
      {otherCharacters.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* 分组标题 */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                {t("sections.otherMembers")}
              </h2>
              <div className="w-16 h-1 bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto" />
            </div>

            {/* 桌面端：卡片网格 */}
            <div
              className="max-md:hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="character-grid"
            >
              {otherCharacters.map((character, index) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onClick={() => handleCharacterClick(character.id)}
                  priority={index === 0}
                />
              ))}
            </div>

            {/* 移动端：折叠列表 */}
            <div className="md:hidden">
              <CharacterMobileView
                characters={otherCharacters}
                onCharacterClick={handleCharacterClick}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
