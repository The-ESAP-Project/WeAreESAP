// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Character } from "@/types/character";
import { useTranslations } from "next-intl";
import { getContrastTextColor } from "@/lib/utils";

interface CharacterPhilosophyProps {
  character: Character;
}

export function CharacterPhilosophy({ character }: CharacterPhilosophyProps) {
  const t = useTranslations("characters");
  const philosophy = character.meta?.philosophy as
    | Record<string, string>
    | undefined;

  if (!philosophy || Object.keys(philosophy).length === 0) {
    return null;
  }

  return (
    <section className="scroll-mt-24" id="philosophy">
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.philosophy")}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(philosophy).map(([key, value], index) => (
          <div
            key={index}
            className="bg-muted rounded-2xl p-8 hover:scale-[1.02] transition-transform"
          >
            {/* 标题 */}
            <h3
              className="text-xl font-bold mb-6 flex items-center gap-3"
              style={{ color: getContrastTextColor(character.color.primary) }}
            >
              <span
                className="w-1.5 h-6 rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
                }}
              />
              {t(`detail.philosophy.${key}`)}
            </h3>

            {/* 内容 */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-foreground/90 leading-relaxed italic">
                &quot;{value}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
