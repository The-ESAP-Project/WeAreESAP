// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Story } from "@/types/story";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const t = useTranslations("stories");

  return (
    <Link href={`/stories/${story.slug}`} className="block group h-full">
      <article className="rounded-xl border border-border overflow-hidden hover:border-esap-blue/50 transition-colors h-full flex flex-col">
        {story.coverImage && (
          <div className="relative h-40 md:h-48 bg-muted flex-shrink-0">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-esap-blue/10 text-esap-blue font-medium">
              {t(`filter.${story.format}`)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {t(`status.${story.status}`)}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {story.chapterOrder.length} {t("card.chapters")}
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-esap-blue transition-colors mb-1">
            {story.title}
          </h3>
          {story.subtitle && (
            <p className="text-sm text-muted-foreground italic mb-2 line-clamp-1">
              {story.subtitle}
            </p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {story.description}
          </p>
          <p className="text-sm text-esap-blue mt-3">{t("card.start")} →</p>
        </div>
      </article>
    </Link>
  );
}
