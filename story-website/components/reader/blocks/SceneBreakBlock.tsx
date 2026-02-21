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
import type { StorySceneBreakBlock } from "@/types/chapter";

export const SceneBreakBlock = memo(function SceneBreakBlock({
  data,
}: {
  data: StorySceneBreakBlock;
}) {
  const style = data.style ?? "dots";

  return (
    <div className="my-8 flex items-center justify-center select-none">
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
