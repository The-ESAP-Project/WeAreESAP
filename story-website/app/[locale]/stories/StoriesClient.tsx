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
import { useMemo } from "react";
import { StoryCard } from "@/components/story/StoryCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Collection, Story } from "@/types/story";

interface StoriesClientProps {
  stories: Story[];
  collections: Collection[];
}

export function StoriesClient({ stories, collections }: StoriesClientProps) {
  const t = useTranslations("stories");

  const { collectionGroups, standaloneStories } = useMemo(() => {
    const storiesBySlug = new Map(stories.map((s) => [s.slug, s]));
    const assignedSlugs = new Set<string>();

    const groups = collections.map((collection) => {
      const collectionStories = collection.stories
        .map((slug) => {
          assignedSlugs.add(slug);
          return storiesBySlug.get(slug);
        })
        .filter((s): s is Story => s != null);
      return { collection, stories: collectionStories };
    });

    const standalone = stories.filter((s) => !assignedSlugs.has(s.slug));

    return { collectionGroups: groups, standaloneStories: standalone };
  }, [stories, collections]);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          {t("hero.title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-12">
        {/* Collection groups */}
        {collectionGroups.map(
          ({ collection, stories: groupStories }) =>
            groupStories.length > 0 && (
              <section key={collection.slug}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-muted-foreground mt-1">
                      {collection.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupStories.map((story, i) => (
                    <AnimatedSection key={story.slug} delay={i * 0.1}>
                      <StoryCard story={story} />
                    </AnimatedSection>
                  ))}
                </div>
              </section>
            )
        )}

        {/* Standalone stories */}
        {standaloneStories.length > 0 && (
          <section className={collectionGroups.length > 0 ? "pt-8" : undefined}>
            {collectionGroups.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {t("collections.standalone")}
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {standaloneStories.map((story, i) => (
                <AnimatedSection key={story.slug} delay={i * 0.1}>
                  <StoryCard story={story} />
                </AnimatedSection>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {stories.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            {t("empty")}
          </p>
        )}
      </div>
    </div>
  );
}
