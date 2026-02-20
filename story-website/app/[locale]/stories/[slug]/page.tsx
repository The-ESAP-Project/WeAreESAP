// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { SITE_CONFIG } from "@/lib/constants";
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

  if (!story) {
    return { robots: { index: false, follow: true } };
  }

  const localePrefix = locale === "zh-CN" ? "" : `/${locale}`;
  const url = `${SITE_CONFIG.baseUrl}${localePrefix}/stories/${slug}`;
  const title = story.title;
  const description = story.synopsis ?? story.description;
  const image = story.coverImage;
  const keywords = [...story.tags, ...story.relatedCharacters];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: SITE_CONFIG.siteName,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
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
