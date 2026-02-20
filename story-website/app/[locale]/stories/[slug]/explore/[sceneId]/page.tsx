// Copyright 2021-2026 The ESAP Project
// SPDX-License-Identifier: Apache-2.0

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/request";
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
  const scene = await loadExplorationScene(slug, sceneId, locale);
  if (!scene) return {};
  return { title: scene.title };
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
