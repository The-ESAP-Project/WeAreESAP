// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { useReadingState } from "@/hooks/useReadingState";
import { Link } from "@/i18n/navigation";
import { getBaseChapterId } from "@/lib/branch-resolver";
import { CHARACTER_COLORS } from "@/lib/constants";
import { isUnlocked } from "@/lib/unlock-engine";
import { cn } from "@/lib/utils";
import type { StoryMeta } from "@/types/story";

interface PerspectiveSwitchProps {
  storySlug: string;
  currentChapterId: string;
  perspectives: { characterId: string; chapterId: string }[];
  storyMeta: StoryMeta;
}

export function PerspectiveSwitch({
  storySlug,
  currentChapterId,
  perspectives,
  storyMeta,
}: PerspectiveSwitchProps) {
  const t = useTranslations("reader.perspective");
  const { storyState, hydrated } = useReadingState(storySlug);

  const baseChapterId = getBaseChapterId(storyMeta, currentChapterId);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground text-xs">{t("switchPov")}:</span>

      {/* Base chapter (default POV) */}
      {baseChapterId && (
        <Link
          href={`/stories/${storySlug}/${baseChapterId}`}
          className={cn(
            "px-3 py-1 rounded-full text-xs transition-colors",
            currentChapterId === baseChapterId
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {t("currentPov")}
        </Link>
      )}

      {/* Variant POVs */}
      {perspectives.map((pov) => {
        const isCurrent = currentChapterId === pov.chapterId;
        const locked =
          hydrated && !isUnlocked(pov.chapterId, storyMeta, storyState);
        const color = CHARACTER_COLORS[pov.characterId];

        if (locked) {
          return (
            <span
              key={pov.chapterId}
              className="px-3 py-1 rounded-full text-xs bg-muted/50 text-muted-foreground cursor-not-allowed"
            >
              {t("locked")} {pov.characterId}
            </span>
          );
        }

        return (
          <Link
            key={pov.chapterId}
            href={`/stories/${storySlug}/${pov.chapterId}`}
            className={cn(
              "px-3 py-1 rounded-full text-xs transition-colors",
              isCurrent
                ? "text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            style={
              isCurrent && color
                ? { backgroundColor: color.primary }
                : undefined
            }
          >
            {pov.characterId}
          </Link>
        );
      })}
    </div>
  );
}
