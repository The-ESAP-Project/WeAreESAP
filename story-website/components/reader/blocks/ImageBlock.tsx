// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import Image from "next/image";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { StoryImageBlock } from "@/types/chapter";

export const ImageBlock = memo(function ImageBlock({
  data,
}: {
  data: StoryImageBlock;
}) {
  return (
    <figure className={cn("my-6", data.layout === "full" && "-mx-4 md:-mx-8")}>
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <Image src={data.src} alt={data.alt} fill className="object-cover" />
      </div>
      {data.caption && (
        <figcaption className="text-center text-xs text-muted-foreground mt-2">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
});
