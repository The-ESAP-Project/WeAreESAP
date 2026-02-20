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
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { buildAlternates } from "@/lib/metadata";
import {
  loadCollections,
  loadStory,
  loadStoryRegistry,
} from "@/lib/story-loader";
import { StoriesClient } from "./StoriesClient";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stories.metadata");
  const tc = await getTranslations("common.metadata");
  const rawKeywords = tc.raw("keywords");
  const keywords = Array.isArray(rawKeywords) ? (rawKeywords as string[]) : [];
  const alternates = buildAlternates(locale, "/stories");
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
      siteName: SITE_CONFIG.siteName,
      images: [
        {
          url: DEFAULT_IMAGES.ogDefault,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_IMAGES.ogDefault],
    },
    alternates,
  };
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const registry = await loadStoryRegistry();
  const [stories, collections] = await Promise.all([
    Promise.all(
      registry
        .sort((a, b) => a.order - b.order)
        .map((entry) => loadStory(entry.slug, locale))
    ),
    loadCollections(locale),
  ]);
  const validStories = stories.filter(
    (s): s is NonNullable<typeof s> => s !== null
  );

  return <StoriesClient stories={validStories} collections={collections} />;
}
