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
