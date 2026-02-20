// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Story } from "@/types/story";

interface FeaturedStoryProps {
  story: Story;
}

export async function FeaturedStory({ story }: FeaturedStoryProps) {
  const t = await getTranslations("home.featured");
  const tS = await getTranslations("stories");

  return (
    <section className="max-w-5xl mx-auto px-4 pt-8 pb-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">{t("title")}</h2>
      <Link href={`/stories/${story.slug}`} className="block group">
        <div className="rounded-xl border border-border overflow-hidden hover:border-esap-blue/50 transition-colors">
          {/* 封面图 */}
          {story.coverImage && (
            <div className="relative h-52 md:h-64 bg-muted">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
          )}
          {/* 内容 */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-esap-blue/10 text-esap-blue">
                {tS(`filter.${story.format}`)}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-esap-pink/10 text-esap-pink">
                {tS(`status.${story.status}`)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-esap-blue transition-colors mb-2">
              {story.title}
            </h3>
            {story.subtitle && (
              <p className="text-sm text-muted-foreground italic mb-3">
                {story.subtitle}
              </p>
            )}
            <p className="text-sm text-muted-foreground line-clamp-3">
              {story.description}
            </p>
            <p className="text-sm text-esap-blue mt-4">{t("readMore")} →</p>
          </div>
        </div>
      </Link>
    </section>
  );
}
