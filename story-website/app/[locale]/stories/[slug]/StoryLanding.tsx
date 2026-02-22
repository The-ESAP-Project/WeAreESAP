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
import { FormatBadge, StatusBadge } from "@/components/story/StoryBadge";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { useReadingState } from "@/hooks/useReadingState";
import { Link } from "@/i18n/navigation";
import { isUnlocked } from "@/lib/unlock-engine";
import type { Story } from "@/types/story";

interface StoryLandingProps {
  story: Story;
  chapterTitles: Record<string, string>;
}

export function StoryLanding({ story, chapterTitles }: StoryLandingProps) {
  const t = useTranslations("stories.landing");
  const tS = useTranslations("stories");
  const { storyState, hydrated } = useReadingState(story.slug);

  const firstUnreadChapter = story.chapterOrder.find(
    (id) => !storyState.chaptersRead.includes(id)
  );
  const continueChapter =
    storyState.currentChapterId ?? firstUnreadChapter ?? story.chapterOrder[0];
  const hasProgress = storyState.chaptersRead.length > 0;

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-2">
          <Link
            href="/stories"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; {t("backToStories")}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <AnimatedSection>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FormatBadge label={tS(`filter.${story.format}`)} />
              <StatusBadge label={tS(`status.${story.status}`)} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {story.title}
            </h1>
            {story.subtitle && (
              <p className="text-lg text-muted-foreground italic">
                {story.subtitle}
              </p>
            )}
          </div>

          {/* Synopsis */}
          {story.synopsis && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">
                {t("synopsis")}
              </h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {story.synopsis}
              </div>
            </div>
          )}

          {/* Warnings */}
          {story.warnings && story.warnings.length > 0 && (
            <div className="mb-8 p-4 rounded-lg border border-esap-yellow/30 bg-esap-yellow/5">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {t("warnings")}
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {story.warnings.map((w, i) => (
                  <li key={i}>· {w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="mb-10">
            <Link
              href={`/stories/${story.slug}/${continueChapter}`}
              className="inline-block px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {hasProgress ? t("continueReading") : t("startReading")}
            </Link>
            {hydrated && hasProgress && (
              <span className="ml-4 text-sm text-muted-foreground">
                {t("progress", {
                  read: storyState.chaptersRead.length,
                  total: story.chapterOrder.length,
                })}
              </span>
            )}
          </div>

          {/* Chapter list */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("chapters")}
            </h2>
            <div className="space-y-2">
              {story.chapterOrder.map((chId, index) => {
                const isRead = storyState.chaptersRead.includes(chId);
                const locked = hydrated && !isUnlocked(chId, story, storyState);

                return (
                  <div key={chId}>
                    {locked ? (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 text-muted-foreground">
                        <span className="text-sm font-mono w-8">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm flex-1">{t("locked")}</span>
                        <Icon name="Lock" size={14} />
                      </div>
                    ) : (
                      <Link
                        href={`/stories/${story.slug}/${chId}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <span className="text-sm font-mono w-8 text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-foreground group-hover:text-esap-blue transition-colors flex-1">
                          {chapterTitles[chId] ?? chId}
                        </span>
                        {isRead && (
                          <span className="text-xs text-esap-blue">
                            {t("completed")}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
