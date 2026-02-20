// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FeaturedStory } from "@/components/home/FeaturedStory";
import { HomeHero } from "@/components/home/HomeHero";
import { StoriesSection } from "@/components/home/StoriesSection";
import { locales } from "@/i18n/request";
import { DEFAULT_IMAGES, SITE_CONFIG } from "@/lib/constants";
import { loadStory, loadStoryRegistry } from "@/lib/story-loader";
import type { Story } from "@/types/story";

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
  const t = await getTranslations("home.metadata");
  const localePrefix = locale === "zh-CN" ? "" : `/${locale}`;
  const url = `${SITE_CONFIG.baseUrl}${localePrefix}`;
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
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
