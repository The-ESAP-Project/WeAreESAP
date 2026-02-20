// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { memo } from "react";
import type { StorySceneBreakBlock } from "@/types/chapter";

export const SceneBreakBlock = memo(function SceneBreakBlock({
  data,
}: {
  data: StorySceneBreakBlock;
}) {
  const style = data.style ?? "dots";

  return (
    <div className="my-8 flex items-center justify-center">
      {style === "dots" && (
        <span className="text-muted-foreground tracking-[1em]">
          &middot;&middot;&middot;
        </span>
      )}
      {style === "line" && <div className="w-24 h-px bg-border" />}
      {style === "symbol" && (
        <span className="text-muted-foreground text-lg">&sect;</span>
      )}
      {style === "fade" && (
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}
      {data.label && (
        <span className="mx-4 text-xs text-muted-foreground">{data.label}</span>
      )}
    </div>
  );
});
