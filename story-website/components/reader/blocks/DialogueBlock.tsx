// Copyright 2021-2026 The ESAP Project
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
