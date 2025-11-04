// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "@/components/ui";
import { CharacterAccordion, CharacterMobileView } from "@/components";
import { CharacterCardData } from "@/types/character";

interface HomeCharactersProps {
  characters: CharacterCardData[];
}

export function HomeCharacters({ characters }: HomeCharactersProps) {
  const router = useRouter();
  const { startTransition, finishTransition } = useTransition();

  // 内容加载完成后结束过渡动画
  useEffect(() => {
    if (characters && characters.length > 0) {
      finishTransition();
    }
  }, [characters, finishTransition]);

  const handleCharacterClick = (characterId: string) => {
    // 先触发过渡动画
    startTransition();
    // 然后跳转路由
    router.push(`/characters/${characterId}`);
  };

  return (
    <>
      {/* 桌面端：横向手风琴 */}
      <div className="hidden md:block">
        <CharacterAccordion
          characters={characters}
          onCharacterClick={handleCharacterClick}
        />
      </div>

      {/* 移动端：垂直卡片 */}
      <div className="block md:hidden">
        <CharacterMobileView
          characters={characters}
          onCharacterClick={handleCharacterClick}
        />
      </div>
    </>
  );
}
