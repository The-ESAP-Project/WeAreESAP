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

  const alternates = buildAlternates(
    locale,
    `/stories/${slug}/explore/${sceneId}`
  );
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
