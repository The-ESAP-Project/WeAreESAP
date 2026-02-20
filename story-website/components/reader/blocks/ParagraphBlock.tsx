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
import type { StoryParagraphBlock } from "@/types/chapter";

export const ParagraphBlock = memo(function ParagraphBlock({
  data,
}: {
  data: StoryParagraphBlock;
}) {
  return <p className="my-4 text-foreground/90 leading-inherit">{data.text}</p>;
});
