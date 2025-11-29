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

import { Character } from "@/types/character";
import { useTranslations } from "next-intl";

interface CharacterStoryProps {
  character: Character;
}

export function CharacterStory({ character }: CharacterStoryProps) {
  const t = useTranslations("characters");
  // 从 meta 中读取背景故事
  const background = character.meta?.background as string | undefined;
  const characterTraits = character.meta?.characterTraits as
    | string[]
    | undefined;

  if (!background && !characterTraits) {
    return null; // 如果没有故事内容，不渲染此模块
  }

  return (
    <section className="scroll-mt-24" id="story">
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.story")}
      </h2>

      <div className="space-y-8">
        {/* 背景故事 */}
        {background && (
          <div className="bg-muted rounded-2xl p-8 md:p-10">
            <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: character.color.primary }}
              />
              {t("detail.story.background")}
            </h3>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {background}
              </p>
            </div>
          </div>
        )}

        {/* 性格特征 */}
        {characterTraits && characterTraits.length > 0 && (
          <div className="bg-muted rounded-2xl p-8 md:p-10">
            <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: character.color.primary }}
              />
              {t("detail.story.traits")}
            </h3>
            <ul className="space-y-4">
              {characterTraits.map((trait, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 text-foreground/90 leading-relaxed"
                >
                  <span
                    className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    style={{ backgroundColor: character.color.primary }}
                  />
                  <span>{trait}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
