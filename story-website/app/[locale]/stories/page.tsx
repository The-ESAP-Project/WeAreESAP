// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { loadStory, loadStoryRegistry } from "@/lib/story-loader";
import { StoriesClient } from "./StoriesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stories.metadata");
  return { title: t("title"), description: t("description") };
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const registry = await loadStoryRegistry();
  const stories = await Promise.all(
    registry
      .sort((a, b) => a.order - b.order)
      .map((entry) => loadStory(entry.slug, locale))
  );
  const validStories = stories.filter(
    (s): s is NonNullable<typeof s> => s !== null
  );

  return <StoriesClient stories={validStories} />;
}
