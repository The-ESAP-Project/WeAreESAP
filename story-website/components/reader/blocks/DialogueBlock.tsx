// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { memo } from "react";
import { CHARACTER_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { StoryDialogueBlock } from "@/types/chapter";

export const DialogueBlock = memo(function DialogueBlock({
  data,
}: {
  data: StoryDialogueBlock;
}) {
  const speakerColor = CHARACTER_COLORS[data.speaker];
  const displayName = data.speakerName ?? data.speaker;

  return (
    <div className="my-3 pl-4 border-l-2 border-muted">
      <span
        className={cn("text-sm font-medium")}
        style={speakerColor ? { color: speakerColor.primary } : undefined}
      >
        {displayName}
      </span>
      <p className="text-foreground/90 mt-0.5">{data.text}</p>
    </div>
  );
});
