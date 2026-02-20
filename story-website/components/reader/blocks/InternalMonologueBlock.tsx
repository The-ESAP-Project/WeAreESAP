// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { memo } from "react";
import type { StoryInternalMonologueBlock } from "@/types/chapter";

export const InternalMonologueBlock = memo(function InternalMonologueBlock({
  data,
}: {
  data: StoryInternalMonologueBlock;
}) {
  return (
    <div className="my-4 pl-6 italic text-muted-foreground whitespace-pre-line">
      {data.text}
    </div>
  );
});
