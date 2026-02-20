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
