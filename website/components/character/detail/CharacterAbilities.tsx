// Copyright 2025 AptS:1547, AptS:1548
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Character } from "@/types/character";
import { useTranslations } from "next-intl";
import { getContrastTextColor } from "@/lib/utils";

interface CharacterAbilitiesProps {
  character: Character;
}

export function CharacterAbilities({ character }: CharacterAbilitiesProps) {
  const t = useTranslations("characters");
  const abilities = character.meta?.abilities as string[] | undefined;
  const weapons = character.meta?.weapons as string[] | undefined;

  if (!abilities && !weapons) {
    return null;
  }

  return (
    <section className="scroll-mt-24" id="abilities">
      <h2 className="text-3xl font-bold mb-8 text-foreground flex items-center gap-3">
        <span
          className="w-2 h-8 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${character.color.primary}, ${character.color.dark})`,
          }}
        />
        {t("detail.sections.abilities")}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 特殊能力 */}
        {abilities && abilities.length > 0 && (
          <div className="bg-muted rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: character.color.primary }}
              />
              {t("detail.abilities.special")}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {abilities.map((ability, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${character.color.primary}, ${character.color.dark})`,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 text-foreground/90">{ability}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 武器装备 */}
        {weapons && weapons.length > 0 && (
          <div className="bg-muted rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
              <span
                className="w-1.5 h-6 rounded-full"
                style={{ backgroundColor: character.color.primary }}
              />
              {t("detail.abilities.weapons")}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {weapons.map((weapon, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors group"
                >
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-background/80 group-hover:scale-110 transition-transform"
                    style={{
                      color: getContrastTextColor(character.color.primary),
                    }}
                  >
                    ⚔️
                  </div>
                  <div className="flex-1 text-lg font-semibold text-foreground">
                    {weapon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
