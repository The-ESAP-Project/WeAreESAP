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
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Icon } from "@/components/ui/Icon";
import { Link } from "@/i18n/navigation";
import type { StoryCharacter } from "@/types/character";
import type { Story } from "@/types/story";

interface CharacterDetailProps {
  character: StoryCharacter;
  relatedContent: {
    relatedStories: Story[];
    perspectiveChapters: Array<{
      storySlug: string;
      storyTitle: string;
      baseChapterId: string;
      chapterId: string;
    }>;
  };
}

export function CharacterDetail({
  character,
  relatedContent,
}: CharacterDetailProps) {
  const t = useTranslations("characters");
  const { color } = character;
  const { relatedStories, perspectiveChapters } = relatedContent;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* 1. Quote block */}
      <AnimatedSection>
        <div
          className="rounded-lg py-12 md:py-16 px-6 md:px-10 mb-10"
          style={{
            background: `linear-gradient(135deg, ${color.primary}10 0%, ${color.primary}05 50%, transparent 100%)`,
          }}
        >
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mb-6">
            {character.code}
          </p>
          <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed mb-6">
            &ldquo;{character.quote}&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground">
            {character.name} &middot; {character.role}
          </p>
        </div>
      </AnimatedSection>

      {/* 2. Archive info grid */}
      <AnimatedSection delay={0.1}>
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("archive")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {t("info.code")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {character.code}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {t("info.name")}
              </p>
              <p className="text-sm font-medium text-foreground">
                {character.name}
              </p>
            </div>
            {character.nickname && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {t("info.nickname")}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {character.nickname}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {t("info.role")}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: color.primary }}
              >
                {character.role}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 3. Bio */}
      {character.bio && (
        <AnimatedSection delay={0.2}>
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {t("bio")}
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {character.bio}
            </p>
          </div>
        </AnimatedSection>
      )}

      {/* 4. Related stories */}
      <AnimatedSection delay={0.3}>
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t("relatedStories")}
          </h2>
          {relatedStories.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              {t("noRelatedStories")}
            </p>
          ) : (
            <div className="space-y-3">
              {relatedStories.map((story) => {
                const storyPerspectives = perspectiveChapters.filter(
                  (pc) => pc.storySlug === story.slug
                );
                return (
                  <Link
                    key={story.slug}
                    href={`/stories/${story.slug}`}
                    className="flex items-center rounded-lg p-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {story.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {story.description}
                      </p>
                      {storyPerspectives.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {t("perspectiveChapters")}:{" "}
                          {storyPerspectives
                            .map((pc) => pc.chapterId)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 ml-4 flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <span className="hidden sm:inline">{t("readStory")}</span>
                      <Icon name="ChevronRight" size={16} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* 5. Keywords */}
      {character.keywords && character.keywords.length > 0 && (
        <AnimatedSection delay={0.4}>
          <div className="mb-10">
            <div className="flex flex-wrap gap-2">
              {character.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${color.primary}15`,
                    color: color.primary,
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* 6. Back link */}
      <AnimatedSection delay={0.5}>
        <Link
          href="/characters"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          <Icon name="ArrowLeft" size={14} />
          {t("backToList")}
        </Link>
      </AnimatedSection>
    </div>
  );
}
