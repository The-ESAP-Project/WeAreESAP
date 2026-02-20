// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { memo } from "react";
import type { StoryContentBlock } from "@/types/chapter";
import { BlockRenderer } from "./BlockRenderer";

interface ReaderContentProps {
  blocks: StoryContentBlock[];
  storySlug: string;
}

export const ReaderContent = memo(function ReaderContent({
  blocks,
  storySlug,
}: ReaderContentProps) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <BlockRenderer
          key={`${block.type}-${index}`}
          block={block}
          storySlug={storySlug}
        />
      ))}
    </div>
  );
});
