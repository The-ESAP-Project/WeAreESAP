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

interface CharacterSpecialMomentsProps {
  character: Character;
}

export function CharacterSpecialMoments({
  character,
}: CharacterSpecialMomentsProps) {
  const t = useTranslations("characters");
  const specialMoments = character.meta?.specialMoments as string[] | undefined;

  if (!specialMoments || specialMoments.length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24" id="special-moments">
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.specialMoments")}
      </h2>

      <div className="bg-muted rounded-2xl p-8 md:p-10">
        {/* 时间轴样式 */}
        <div className="relative">
          {/* 垂直线 */}
          <div
            className="absolute left-6 top-0 bottom-0 w-0.5 opacity-30"
            style={{ backgroundColor: character.color.primary }}
          />

          {/* 时刻列表 */}
          <div className="space-y-8">
            {specialMoments.map((moment, index) => (
              <div key={index} className="relative pl-16">
                {/* 时间点圆圈 */}
                <div
                  className="absolute left-3 top-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: character.color.primary,
                    boxShadow: `0 0 20px ${character.color.primary}60`,
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>

                {/* 内容卡片 */}
                <div className="p-6 rounded-xl bg-background/50 hover:bg-background transition-all group">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {moment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
