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
import {
  getNextChapterId,
  getPerspectives,
  getPrevChapterId,
} from "@/lib/branch-resolver";
import { SITE_CONFIG } from "@/lib/constants";
import { buildAlternates } from "@/lib/metadata";
import { loadChapter, loadStory, loadStoryRegistry } from "@/lib/story-loader";
import { ChapterReader } from "./ChapterReader";

export async function generateStaticParams() {
  const registry = await loadStoryRegistry();
  const params = [];
  for (const locale of locales) {
    for (const entry of registry) {
      const story = await loadStory(entry.slug, locale);
      if (!story) continue;
      for (const chId of story.chapterOrder) {
        params.push({ locale, slug: entry.slug, chapterId: chId });
      }
      // Also perspective variants
      if (story.perspectives) {
        for (const p of story.perspectives) {
          for (const v of p.variants) {
            params.push({ locale, slug: entry.slug, chapterId: v.chapterId });
          }
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; chapterId: string }>;
}): Promise<Metadata> {
  const { locale, slug, chapterId } = await params;
  setRequestLocale(locale);
  const [story, chapter] = await Promise.all([
    loadStory(slug, locale),
    loadChapter(slug, chapterId, locale),
  ]);

  if (!chapter) {
    return { robots: { index: false, follow: true } };
  }

  const alternates = buildAlternates(locale, `/stories/${slug}/${chapterId}`);
  const title = chapter.title;
  const description = chapter.subtitle ?? story?.description ?? "";
  const image = story?.coverImage;

  return {
    title,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
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
      description: description || undefined,
      images: image ? [image] : undefined,
    },
    alternates,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; chapterId: string }>;
}) {
  const { locale, slug, chapterId } = await params;
  setRequestLocale(locale);

  const [story, chapter] = await Promise.all([
    loadStory(slug, locale),
    loadChapter(slug, chapterId, locale),
  ]);

  if (!story || !chapter) notFound();

  const nextChapterId = getNextChapterId(story, chapterId);
  const prevChapterId = getPrevChapterId(story, chapterId);
  const perspectives = getPerspectives(story, chapterId);

  return (
    <ChapterReader
      story={story}
      chapter={chapter}
      nextChapterId={nextChapterId}
      prevChapterId={prevChapterId}
      perspectives={perspectives}
    />
  );
}
