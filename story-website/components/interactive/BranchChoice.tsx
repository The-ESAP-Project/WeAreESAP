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

import { useTranslations } from "next-intl";
import { useReadingState } from "@/hooks/useReadingState";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { StoryBranchBlock } from "@/types/chapter";

interface BranchChoiceProps {
  data: StoryBranchBlock;
  storySlug: string;
}

export function BranchChoice({ data, storySlug }: BranchChoiceProps) {
  const t = useTranslations("reader.branch");
  const router = useRouter();
  const { storyState, recordChoice } = useReadingState(storySlug);

  const previousChoice = storyState.choices[data.choiceId];

  const handleChoice = (optionId: string, targetChapterId: string) => {
    recordChoice(data.choiceId, optionId);
    router.push(`/stories/${storySlug}/${targetChapterId}`);
  };

  return (
    <div className="my-8 py-6">
      <p className="text-center text-muted-foreground mb-4 italic">
        {data.prompt}
      </p>
      <div className="space-y-3 max-w-md mx-auto">
        {data.options.map((option) => {
          const isChosen = previousChoice === option.id;

          return (
            <button
              type="button"
              key={option.id}
              onClick={() => handleChoice(option.id, option.targetChapterId)}
              className={cn(
                "w-full p-4 rounded-lg border text-left transition-all",
                isChosen
                  ? "border-esap-blue bg-esap-blue/10 text-foreground"
                  : "border-border hover:border-esap-blue/50 text-foreground/80 hover:text-foreground"
              )}
            >
              <span className="text-sm">{option.text}</span>
              {isChosen && (
                <span className="text-xs text-esap-blue ml-2">
                  {t("chosen")}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
