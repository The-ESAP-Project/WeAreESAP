// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
import { SITE_CONFIG } from "@/lib/constants";
import {
  loadExplorationScene,
  loadStory,
  loadStoryRegistry,
} from "@/lib/story-loader";
import { ExplorationClient } from "./ExplorationClient";

export async function generateStaticParams() {
  const registry = await loadStoryRegistry();
  const params = [];
  for (const locale of locales) {
    for (const entry of registry) {
      const story = await loadStory(entry.slug, locale);
      if (!story?.explorationScenes) continue;
      for (const sceneId of story.explorationScenes) {
        params.push({ locale, slug: entry.slug, sceneId });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; sceneId: string }>;
}): Promise<Metadata> {
  const { locale, slug, sceneId } = await params;
  setRequestLocale(locale);
  const [story, scene] = await Promise.all([
    loadStory(slug, locale),
    loadExplorationScene(slug, sceneId, locale),
  ]);

  if (!scene) {
    return { robots: { index: false, follow: true } };
  }

  const localePrefix = locale === "zh-CN" ? "" : `/${locale}`;
  const url = `${SITE_CONFIG.baseUrl}${localePrefix}/stories/${slug}/explore/${sceneId}`;
  const title = scene.title;
  const description = scene.description;
  const image = scene.backgroundImage || story?.coverImage;

  return {
    title,
    description,
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

export default async function ExplorationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; sceneId: string }>;
}) {
  const { locale, slug, sceneId } = await params;
  setRequestLocale(locale);

  const scene = await loadExplorationScene(slug, sceneId, locale);
  if (!scene) notFound();

  return <ExplorationClient scene={scene} storySlug={slug} />;
}
