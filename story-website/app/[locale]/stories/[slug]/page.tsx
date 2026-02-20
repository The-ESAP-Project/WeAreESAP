// Copyright 2021-2026 The ESAP Project
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { SITE_CONFIG } from "@/lib/constants";
import { buildAlternates } from "@/lib/metadata";
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

  const alternates = buildAlternates(locale, `/stories/${slug}`);
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
      url: alternates.canonical,
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
    alternates,
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
