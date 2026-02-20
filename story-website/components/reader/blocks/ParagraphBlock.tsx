// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { memo } from "react";
import type { StoryParagraphBlock } from "@/types/chapter";

export const ParagraphBlock = memo(function ParagraphBlock({
  data,
}: {
  data: StoryParagraphBlock;
}) {
  return <p className="my-4 text-foreground/90 leading-inherit">{data.text}</p>;
});
