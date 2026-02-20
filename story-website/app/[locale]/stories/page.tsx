// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { loadStory, loadStoryRegistry } from "@/lib/story-loader";
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
  const localePrefix = locale === "zh-CN" ? "" : `/${locale}`;
  const url = `${SITE_CONFIG.baseUrl}${localePrefix}/stories`;
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
      url,
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
    alternates: {
      canonical: url,
    },
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
