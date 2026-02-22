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

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PerspectiveSwitch } from "@/components/interactive/PerspectiveSwitch";
import { ReaderContent } from "@/components/reader/ReaderContent";
import { ReaderToolbar } from "@/components/reader/ReaderToolbar";
import { Icon } from "@/components/ui/Icon";
import {
  ReadingPreferencesProvider,
  useReadingPreferences,
} from "@/hooks/useReadingPreferences";
import { useReadingState } from "@/hooks/useReadingState";
import { Link } from "@/i18n/navigation";
import { getBaseChapterId } from "@/lib/branch-resolver";
import { getNewlyUnlocked, isUnlocked } from "@/lib/unlock-engine";
import { cn, debounce } from "@/lib/utils";
import type { Chapter } from "@/types/chapter";
import type { Story } from "@/types/story";

interface ChapterReaderProps {
  story: Story;
  chapter: Chapter;
  nextChapterId: string | null;
  prevChapterId: string | null;
  perspectives: { characterId: string; chapterId: string }[] | null;
}

export function ChapterReader(props: ChapterReaderProps) {
  return (
    <ReadingPreferencesProvider>
      <ChapterReaderInner {...props} />
    </ReadingPreferencesProvider>
  );
}

function ChapterReaderInner({
  story,
  chapter,
  nextChapterId,
  prevChapterId,
  perspectives,
}: ChapterReaderProps) {
  const t = useTranslations("reader");
  const {
    storyState,
    hydrated,
    markChapterRead,
    recordPerspective,
    unlockContent,
    saveScrollPosition,
  } = useReadingState(story.slug);
  const { preferences } = useReadingPreferences();

  const [showResumeBanner, setShowResumeBanner] = useState(false);

  const currentLocked = hydrated && !isUnlocked(chapter.id, story, storyState);
  const nextLocked =
    nextChapterId != null &&
    hydrated &&
    !isUnlocked(nextChapterId, story, storyState);

  // Mark chapter as read after hydration (only if unlocked)
  useEffect(() => {
    if (!hydrated) return;
    if (currentLocked) return;
    markChapterRead(chapter.id);
    if (chapter.perspectiveCharacter) {
      const baseId = getBaseChapterId(story, chapter.id) ?? chapter.id;
      recordPerspective(baseId, chapter.perspectiveCharacter);
    }
  }, [
    hydrated,
    chapter.id,
    chapter.perspectiveCharacter,
    currentLocked,
    markChapterRead,
    recordPerspective,
    story,
  ]);

  // Scroll to top on chapter change; auto-scroll to saved position if exists
  // biome-ignore lint/correctness/useExhaustiveDependencies: chapter.id and hydrated are intentional triggers; chapterScrollPositions read once after hydration
  useEffect(() => {
    setShowResumeBanner(false);
    window.scrollTo(0, 0);
    if (!hydrated) return;
    const savedY = storyState.chapterScrollPositions?.[chapter.id] ?? 0;
    if (savedY > 0) {
      const scrollTimer = setTimeout(() => {
        window.scrollTo({ top: savedY, behavior: "smooth" });
        setShowResumeBanner(true);
        const hideTimer = setTimeout(() => setShowResumeBanner(false), 4000);
        return () => clearTimeout(hideTimer);
      }, 300);
      return () => clearTimeout(scrollTimer);
    }
  }, [chapter.id, hydrated]);

  // Debounced scroll position saver
  useEffect(() => {
    const debouncedSave = debounce((pos: number) => {
      saveScrollPosition(chapter.id, pos);
    }, 500);
    const handleScroll = () => debouncedSave(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapter.id, saveScrollPosition]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowResumeBanner(false);
  };

  // Auto-unlock inline content gates when conditions are met
  useEffect(() => {
    if (!hydrated) return;
    const newlyUnlocked = getNewlyUnlocked(story, storyState);
    for (const contentId of newlyUnlocked) {
      unlockContent(contentId);
    }
  }, [hydrated, storyState, story, unlockContent]);

  const fontClass =
    preferences.fontFamily === "serif"
      ? "reader-font-serif"
      : "reader-font-sans";
  const sizeClass = `reader-size-${preferences.fontSize}`;
  const leadingClass = `reader-leading-${preferences.lineHeight}`;

  // hydration 前不渲染内容，避免锁定章节闪烁
  if (!hydrated) {
    return <div className="min-h-screen" />;
  }

  // 锁定状态：显示提示，不显示内容
  if (currentLocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <Icon name="Lock" size={48} className="text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            {t("unlock.locked")}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {t("unlock.hint")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {prevChapterId && (
              <Link
                href={`/stories/${story.slug}/${prevChapterId}`}
                className="inline-block px-5 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                &larr; {t("unlock.backToPrev")}
              </Link>
            )}
            <Link
              href={`/stories/${story.slug}`}
              className="inline-block px-5 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              {t("navigation.backToStory")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Top bar */}
      <div className="sticky top-14 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link
            href={`/stories/${story.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; {t("navigation.backToStory")}
          </Link>
          <span className="text-sm text-muted-foreground">{chapter.title}</span>
        </div>
      </div>

      {/* Perspective switch */}
      {perspectives && perspectives.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <PerspectiveSwitch
            storySlug={story.slug}
            currentChapterId={chapter.id}
            perspectives={perspectives}
            storyMeta={story}
            storyState={storyState}
            hydrated={hydrated}
          />
        </div>
      )}

      {/* Chapter header */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {chapter.title}
        </h1>
        {chapter.subtitle && (
          <p className="text-sm text-muted-foreground">{chapter.subtitle}</p>
        )}
        {chapter.readingTime && (
          <p className="text-xs text-muted-foreground mt-2">
            ~{chapter.readingTime} min
          </p>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "reader-content px-4",
          fontClass,
          sizeClass,
          leadingClass
        )}
      >
        <ReaderContent blocks={chapter.content} storySlug={story.slug} />
      </div>

      {/* Perspective switch (bottom) */}
      {perspectives && perspectives.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <PerspectiveSwitch
            storySlug={story.slug}
            currentChapterId={chapter.id}
            perspectives={perspectives}
            storyMeta={story}
            storyState={storyState}
            hydrated={hydrated}
          />
        </div>
      )}

      {/* Bottom navigation */}
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-8">
        <div className="flex justify-between items-center border-t border-border pt-6">
          {prevChapterId ? (
            <Link
              href={`/stories/${story.slug}/${prevChapterId}`}
              className="text-sm text-muted-foreground hover:text-esap-blue transition-colors"
            >
              &larr; {t("navigation.prev")}
            </Link>
          ) : (
            <span />
          )}
          {nextChapterId &&
            (nextLocked ? (
              <span className="text-sm text-muted-foreground flex items-center gap-2 shrink-0 whitespace-nowrap">
                <Icon name="Lock" size={14} />
                {t("navigation.next")}
              </span>
            ) : (
              <Link
                href={`/stories/${story.slug}/${nextChapterId}`}
                className="text-sm text-muted-foreground hover:text-esap-blue transition-colors"
              >
                {t("navigation.next")} &rarr;
              </Link>
            ))}
        </div>
      </div>

      {/* Reader toolbar */}
      <ReaderToolbar />

      {/* Resume reading banner */}
      <AnimatePresence>
        {showResumeBanner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-20 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-background border border-border rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-xs w-full">
              <span className="text-sm text-foreground flex-1">
                {t("resumeBanner.prompt")}
              </span>
              <button
                type="button"
                onClick={handleBackToTop}
                className="text-sm font-medium text-esap-blue hover:opacity-75 transition-opacity shrink-0"
              >
                {t("resumeBanner.backToTop")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
