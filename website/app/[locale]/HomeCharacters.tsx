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

import { useRouter } from "@/i18n/navigation";
import { useTransition } from "@/components/ui";
import { CharacterAccordion, CharacterMobileView } from "@/components";
import { CharacterCardData } from "@/types/character";

interface HomeCharactersProps {
  characters: CharacterCardData[];
}

export function HomeCharacters({ characters }: HomeCharactersProps) {
  const router = useRouter();
  const { startTransition } = useTransition();

  const handleCharacterClick = (characterId: string) => {
    // 先触发过渡动画
    startTransition();
    // 然后跳转路由（next-intl 的 router 会自动处理 locale）
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
