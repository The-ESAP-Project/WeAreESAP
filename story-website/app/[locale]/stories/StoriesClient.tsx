// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTranslations } from "next-intl";
import { StoryCard } from "@/components/story/StoryCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Story } from "@/types/story";

interface StoriesClientProps {
  stories: Story[];
}

export function StoriesClient({ stories }: StoriesClientProps) {
  const t = useTranslations("stories");

  return (
    <div>
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          {t("hero.title")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("hero.subtitle")}</p>
      </section>

      {/* Story grid */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <AnimatedSection key={story.slug} delay={i * 0.1}>
              <StoryCard story={story} />
            </AnimatedSection>
          ))}
        </div>
        {stories.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            {t("empty")}
          </p>
        )}
      </section>
    </div>
  );
}
