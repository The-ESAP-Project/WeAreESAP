// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import { setRequestLocale } from "next-intl/server";
import { FeaturedStory } from "@/components/home/FeaturedStory";
import { HomeHero } from "@/components/home/HomeHero";
import { loadStoryRegistry } from "@/lib/story-loader";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const stories = await loadStoryRegistry();
  const featured = stories.sort((a, b) => a.order - b.order)[0] ?? null;

  return (
    <div>
      <HomeHero />
      {featured && <FeaturedStory story={featured} locale={locale} />}
    </div>
  );
}
