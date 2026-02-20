// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { memo } from "react";
import { BranchChoice } from "@/components/interactive/BranchChoice";
import { ExplorationLink } from "@/components/interactive/ExplorationLink";
import { UnlockGate } from "@/components/interactive/UnlockGate";
import type { StoryContentBlock } from "@/types/chapter";
import { AtmosphereBlock } from "./blocks/AtmosphereBlock";
import { DialogueBlock } from "./blocks/DialogueBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { InternalMonologueBlock } from "./blocks/InternalMonologueBlock";
import { ParagraphBlock } from "./blocks/ParagraphBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { SceneBreakBlock } from "./blocks/SceneBreakBlock";

interface BlockRendererProps {
  block: StoryContentBlock;
  storySlug: string;
}

export const BlockRenderer = memo(function BlockRenderer({
  block,
  storySlug,
}: BlockRendererProps) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock data={block} />;
    case "dialogue":
      return <DialogueBlock data={block} />;
    case "internal_monologue":
      return <InternalMonologueBlock data={block} />;
    case "quote":
      return <QuoteBlock data={block} />;
    case "scene_break":
      return <SceneBreakBlock data={block} />;
    case "image":
      return <ImageBlock data={block} />;
    case "atmosphere":
      return (
        <AtmosphereBlock visual={block.visual}>
          {block.children.map((child, i) => (
            <BlockRenderer
              key={`${child.type}-${i}`}
              block={child}
              storySlug={storySlug}
            />
          ))}
        </AtmosphereBlock>
      );
    case "branch":
      return <BranchChoice data={block} storySlug={storySlug} />;
    case "unlock_gate":
      return <UnlockGate data={block} storySlug={storySlug} />;
    case "exploration_link":
      return <ExplorationLink data={block} storySlug={storySlug} />;
    default:
      return null;
  }
});
