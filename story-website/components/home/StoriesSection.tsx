// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Story } from "@/types/story";

interface StoriesSectionProps {
  stories: Story[];
}

export async function StoriesSection({ stories }: StoriesSectionProps) {
  if (stories.length === 0) return null;

  const t = await getTranslations("home.moreStories");
  const tS = await getTranslations("stories");

  return (
    <section className="max-w-5xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">{t("title")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="block group"
          >
            <div className="rounded-xl border border-border overflow-hidden hover:border-esap-blue/50 transition-colors">
              {story.coverImage && (
                <div className="relative h-40 md:h-48 bg-muted">
                  <Image
                    src={story.coverImage}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-esap-blue/10 text-esap-blue">
                    {tS(`filter.${story.format}`)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-esap-pink/10 text-esap-pink">
                    {tS(`status.${story.status}`)}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground group-hover:text-esap-blue transition-colors mb-1">
                  {story.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {story.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
