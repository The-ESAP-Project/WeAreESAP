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

interface CharacterDailyLifeProps {
  character: Character;
}

export function CharacterDailyLife({ character }: CharacterDailyLifeProps) {
  const t = useTranslations("characters");
  const dailyLife = character.meta?.dailyLife as string[] | undefined;

  if (!dailyLife || dailyLife.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24" id="daily-life">
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.dailyLife")}
      </h2>

      <div className="bg-muted rounded-2xl p-8 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyLife.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-xl bg-background/50 hover:bg-background transition-all group"
            >
              {/* 圆点装饰 */}
              <div
                className="flex-shrink-0 w-3 h-3 rounded-full mt-1.5 group-hover:scale-125 transition-transform"
                style={{
                  backgroundColor: character.color.primary,
                  boxShadow: `0 0 12px ${character.color.primary}60`,
                }}
              />
              {/* 内容 */}
              <div className="flex-1">
                <p className="text-foreground/90 leading-relaxed">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
