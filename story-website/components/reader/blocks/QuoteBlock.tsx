// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { memo } from "react";
import type { StoryQuoteBlock } from "@/types/chapter";

export const QuoteBlock = memo(function QuoteBlock({
  data,
}: {
  data: StoryQuoteBlock;
}) {
  return (
    <blockquote className="my-8 px-6 py-4 border-l-4 border-esap-blue/50 bg-muted/30 rounded-r-lg">
      <p className="text-foreground/80 italic">&ldquo;{data.text}&rdquo;</p>
      {data.attribution && (
        <footer className="mt-2 text-sm text-muted-foreground">
          &mdash; {data.attribution}
        </footer>
      )}
    </blockquote>
  );
});
