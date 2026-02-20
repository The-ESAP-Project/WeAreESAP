// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { loadStory } from "@/lib/story-loader";
import type { StoryRegistryEntry } from "@/types/story";

interface FeaturedStoryProps {
  story: StoryRegistryEntry;
  locale: string;
}

export async function FeaturedStory({ story, locale }: FeaturedStoryProps) {
  const t = await getTranslations("home.featured");
  const tS = await getTranslations("stories");
  const fullStory = await loadStory(story.slug, locale);

  if (!fullStory) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">{t("title")}</h2>
      <Link href={`/stories/${story.slug}`} className="block group">
        <div className="rounded-xl border border-border p-6 hover:border-esap-blue/50 transition-colors">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-esap-blue/10 text-esap-blue">
                  {tS(`filter.${fullStory.format}`)}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-esap-pink/10 text-esap-pink">
                  {tS(`status.${fullStory.status}`)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-esap-blue transition-colors mb-2">
                {fullStory.title}
              </h3>
              {fullStory.subtitle && (
                <p className="text-sm text-muted-foreground italic mb-3">
                  {fullStory.subtitle}
                </p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {fullStory.description}
              </p>
              <p className="text-sm text-esap-blue mt-4">{t("readMore")} →</p>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
