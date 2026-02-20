// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
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
  const continueChapter = firstUnreadChapter ?? story.chapterOrder[0];
  const hasProgress = storyState.chaptersRead.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <AnimatedSection>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-esap-blue/10 text-esap-blue font-medium">
              {tS(`filter.${story.format}`)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {tS(`status.${story.status}`)}
            </span>
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
  );
}
