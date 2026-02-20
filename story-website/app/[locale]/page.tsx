// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { setRequestLocale } from "next-intl/server";
import { FeaturedStory } from "@/components/home/FeaturedStory";
import { HomeHero } from "@/components/home/HomeHero";
import { StoriesSection } from "@/components/home/StoriesSection";
import { locales } from "@/i18n/request";
import { loadStory, loadStoryRegistry } from "@/lib/story-loader";
import type { Story } from "@/types/story";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const registry = await loadStoryRegistry();
  const sorted = registry.sort((a, b) => a.order - b.order);

  const fullStories = (
    await Promise.all(sorted.map((s) => loadStory(s.slug, locale)))
  ).filter((s): s is Story => s !== null);

  const [featured, ...rest] = fullStories;

  return (
    <div>
      <HomeHero />
      {featured && <FeaturedStory story={featured} />}
      <StoriesSection stories={rest} />
    </div>
  );
}
