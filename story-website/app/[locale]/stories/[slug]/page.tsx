// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { loadChapter, loadStory, loadStoryRegistry } from "@/lib/story-loader";
import { StoryLanding } from "./StoryLanding";

export async function generateStaticParams() {
  const registry = await loadStoryRegistry();
  const params = [];
  for (const locale of locales) {
    for (const story of registry) {
      params.push({ locale, slug: story.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const story = await loadStory(slug, locale);
  if (!story) return {};
  return { title: story.title, description: story.description };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const story = await loadStory(slug, locale);
  if (!story) notFound();

  const chapters = await Promise.all(
    story.chapterOrder.map((chId) => loadChapter(slug, chId, locale))
  );
  const chapterTitles: Record<string, string> = Object.fromEntries(
    chapters.filter(Boolean).map((ch) => [ch!.id, ch!.title])
  );

  return <StoryLanding story={story} chapterTitles={chapterTitles} />;
}
